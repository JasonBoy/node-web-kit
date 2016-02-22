var gulp = require('gulp')
  , gutil = require('gulp-util')
  , uglify = require('gulp-uglify')
  , gulpif = require('gulp-if')
  , fs = require('fs')
  , del = require('del')
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')
  , buffer = require('vinyl-buffer')
  , watchify = require('watchify')
  , glob = require('glob')
  , _ = require('lodash')
  , rev = require('gulp-rev')
  ;
var myConfig = require('../config');
var libs = require('../browserify-config');
var DEV_MODE = myConfig.isDevMode();

var baseScriptPath = 'public/js/';

var buildPath = 'public/build/js/';
var compileSrc = [
  baseScriptPath + '**/*.js',
  '!' + baseScriptPath + 'lib/**/*'
];
gulp.task("js.simple", function () {
  //save minified js separately, for excluded js
  return gulp.src(compileSrc)
    .pipe(uglify())
    .pipe(gulp.dest(buildPath))
    ;
});

//=====BROWSERIFY TASKS=======
var baseDir = '';
var libNames = [];
for (var key in libs) {
  if (libs.hasOwnProperty(key)) {
    libs[key].exclude || libNames.push(libs[key].url ? libs[key].url : key);
  }
}
//console.log(simpleLibs, libNames);
//task for bundling app related js
var browserifyAppDefaultConfig = {
  cache: {},
  packageCache: {},
  debug: DEV_MODE,
  basedir: baseDir,
  fullPaths: false
};
var browserifyObj = {};
function bundleAppJs(customObj, customLibConfig, destFile) {
  var b = customObj ? customObj : browserifyObj;
  var libs = customLibConfig ? customLibConfig : libNames;
  b = b.external(libs);
  if (!DEV_MODE) {
    b = b.plugin('bundle-collapser/plugin');
  }
  return b.bundle()
    .pipe(source(destFile ? destFile : 'bundle.js'))
    .pipe(buffer())
    .pipe(gulpif(!DEV_MODE, uglify({
      compress:{
        drop_console: true,
        dead_code: true,
        drop_debugger: true
      }
    })))
    //.pipe(rev())
    //.pipe(gulp.dest('./public/build/js'))
    //.pipe(rev.manifest({merge: true}))
    .pipe(gulp.dest('./public/build/js'));
}
var jsEntry = './public/js/**/*.js';
//add multiple entries at once
gulp.task('js', ['preTask'], function () {
  //test paths
  glob(jsEntry, function (err, files) {
    //console.log(files);
    browserifyObj = browserify(_.extend(browserifyAppDefaultConfig, {entries: files}));
    bundleAppJs();
  });
});

function runWatchTask(entry, bootstrapFile, customLibs, destFile) {
  glob(entry, function (err, files) {
    files.push(bootstrapFile);
    var obj = browserify(_.extend(browserifyAppDefaultConfig, {entries: files}));
    obj = obj.plugin(watchify, {
      ignoreWatch: ['**/node_modules/**', 'bin/**', 'mw/**']
    }).on('update', function () {
      bundleAppJs(obj, customLibs, destFile);
    }).on('log', function (msg) {
      gutil.log(bootstrapFile + " rebundled...");
      gutil.log(msg);
    });
    bundleAppJs(obj, customLibs, destFile);
  });
}
gulp.task('js.watch', function () {
  runWatchTask(jsEntry, './public/js/bootstrap.js', libNames, 'bundle.js');
});
//task for bundling vender js
function bundleLibJs(customLibs, destFile) {
  return browserify({
    debug: DEV_MODE
  })
    .require(customLibs ? customLibs : libNames)
    .bundle()
    //Pass desired output filename to vinyl-source-stream
    .pipe(source(destFile ? destFile : 'bundle.lib.js'))
    .pipe(gulpif(!DEV_MODE, buffer()))
    .pipe(gulpif(!DEV_MODE, uglify()))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./public/build/js'));
}
gulp.task('js.lib', ['preTask'], function () {
  return bundleLibJs();
});

