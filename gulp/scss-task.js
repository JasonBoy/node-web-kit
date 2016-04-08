var gulp = require('gulp')
  , gutil = require('gulp-util')
  , sass = require('gulp-sass')
  , minifycss = require('gulp-minify-css')
  , gulpif = require('gulp-if')
  , sourcemaps = require('gulp-sourcemaps')
  ;

var myConfig = require('../config');
var DEV_MODE = myConfig.isDevMode();

gulp.task('scss', ['preTask'], function () {
  var cp = 'public/build/css';
  return gulp.src(['public/scss/**/*.scss'])
    .pipe(gulpif(DEV_MODE, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(DEV_MODE, sourcemaps.write('./maps')))
    .on('error', gutil.log)
    .pipe(gulpif(!DEV_MODE, minifycss()))
    .pipe(gulp.dest(cp))
    ;
});
gulp.task('scss.watch', ['scss'], function () {
  gulp.watch('./public/scss/**/*.scss', ['scss'])
    .on('change', function(event) {
      gutil.log(event.path + ' changed, running scss task...');
    });
  gutil.log('Starting watching scss files...');
});

