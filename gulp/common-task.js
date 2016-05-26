var gulp = require('gulp')
  , gutil = require('gulp-util')
  , uglify = require('gulp-uglify')
  , fs = require('fs')
  , vp = require('vinyl-paths')
  , del = require('del')
  , Promise = require("bluebird")
  , rev = require('gulp-rev')
  , revReplace = require('gulp-rev-replace')
  ;
var BUILD_PATH = './build/content';

gulp.task('clean', function () {
  return gulp.src(['build/*'], {
      read: false
    })
    .pipe(vp(del));
});

gulp.task('preTask', function () {
  return new Promise(function (resole) {
    try {
      fs.statSync('build');
    } catch (e) {
      gutil.log('Missing build dir, creating one...');
      fs.mkdirSync('build');
      gutil.log('"build" dir created.');
    }
    resole(true);
  });
});

gulp.task('revision', function () {
  return gulp.src([
      BUILD_PATH + '/**/*.css',
      BUILD_PATH + '/**/*.js',
      BUILD_PATH + '/**/*.json',
      BUILD_PATH + '/**/*.@(png|jpg|jpeg|gif|ico|webp)',
      '!' + BUILD_PATH + '/lib/**/*'
    ])
    // .pipe(gulp.dest('./public/build'))
    .pipe(rev())
    .pipe(gulp.dest(BUILD_PATH))
    .pipe(rev.manifest())
    .pipe(gulp.dest(BUILD_PATH));
});

gulp.task('cssRevReplace', function () {
  var manifest = gulp.src(BUILD_PATH + "/rev-manifest.json");
  return gulp.src(BUILD_PATH + "/css/**/*.css")
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest(BUILD_PATH+'/css'));
});

gulp.task('htmlRevReplace', function () {
  var manifest = gulp.src(BUILD_PATH + "/rev-manifest.json");
  return gulp.src("./build/views/**/*.html")
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('./build/views'));
});

gulp.task('rev', ['revision'], function () {
  gulp.start('cssRevReplace', 'htmlRevReplace');
});