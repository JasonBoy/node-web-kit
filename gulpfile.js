/**
 * Created by jason on 11/17/15.
 */

var gulp = require('gulp')
  , gutil = require('gulp-util')
  , less = require('gulp-less')
  , minifycss = require('gulp-minify-css')
  , uglify = require('gulp-uglify')
  , gulpif = require('gulp-if')
  , nodemon = require('gulp-nodemon')
  , fs = require('fs')
  , vp = require('vinyl-paths')
  , del = require('del')
  , sourcemaps = require('gulp-sourcemaps')
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')
  , buffer = require('vinyl-buffer')
  , watchify = require('watchify')
  , glob = require('glob')
  , _ = require('underscore')
  , imagemin = require('gulp-imagemin')
  , Promise = require("bluebird")
  , rev = require('gulp-rev')
  ;

var myConfig = require('./config');
var libs = require('./browserify-config');
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
//PROD MODE ONLY
// Compile all .less files into separate css sheets
gulp.task('css', ['preTask'], function () {
  var cp = 'public/build/css';
  return gulp.src(['public/less/**/*.less'])
    .pipe(gulpif(DEV_MODE, sourcemaps.init()))
    .pipe(less())
    .pipe(gulpif(DEV_MODE, sourcemaps.write('./maps')))
    .on('error', gutil.log)
    .pipe(gulpif(!DEV_MODE, minifycss()))
    .pipe(gulp.dest(cp))
    ;
});

gulp.task('css.watch', ['css'], function () {
  gulp.watch('./public/less/**/*.less', ['css'])
    .on('change', function(event) {
      gutil.log(event.path + ' changed, running css task...');
    });
  gutil.log('Starting watching less files...');
});

// Clean
gulp.task('clean', function () {
  return gulp.src(['public/build/*'], {
      read: false
    })
    .pipe(vp(del));
});

//start nodejs server with nodemon, should use this only in dev mode
gulp.task('app', function () {
  nodemon({
    restartable: 'rs',
    script: './bin/www',
    ext: 'js properties json',
    verbose: true,
    watch: ["/"],
    ignore: ["public", ".idea/", ".git", "logs", "web", "node_modules", "views"]
  })
    .on('restart', function () {
      console.log('nodemon restarted!');
    });
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
//task to minify images
gulp.task('img', ['preTask'], function () {
  return gulp.src('./public/img/**/*')
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./public/build/img'));
});

gulp.task('revision', function () {
  return gulp.src([
    './public/build/css/**/*.css',
    './public/build/js/**/*.js'], {base: './public/build'})
    .pipe(gulp.dest('./public/build'))
    .pipe(rev())
    .pipe(gulp.dest('./public/build'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./public/build'));
});

//============================
//task to init the dev env for static assets
gulp.task('dev', ['init'], function () {
  return new Promise(function (resole) {
    gutil.log('Starting watch css/js tasks...');
    gulp.start('css.watch', 'js.watch');
    resole(true);
  }).then(function() {
    gutil.log('Gulp development initialization finished.');
  });
});
//dev task to watch less/js files to automatically recompile files
gulp.task('watch', function () {
  gulp.start('css.watch', 'js.watch');
});
//check/create build dir
gulp.task('preTask', function () {
  return new Promise(function (resole) {
    var buildPath = './public/build';
    try {
      fs.statSync(buildPath);
    } catch (e) {
      gutil.log('Missing build dir, creating one...');
      fs.mkdirSync(buildPath);
      gutil.log('"build" dir created.');
    }
    resole(true);
  });
});
//init the static assets without watch tasks
gulp.task('init', ['css', 'js', 'js.lib'], function () {
  return new Promise(function (resole) {
    gutil.log('Initializing static assets finished.');
    resole(true);
  });
});
//should for prod
gulp.task('assets', ['css', 'js', 'js.lib', 'img'], function () {
  gulp.start('revision');
});
// Default task
gulp.task('default', ['clean'], function () {
  gulp.start('assets');
});

