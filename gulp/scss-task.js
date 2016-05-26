var gulp = require('gulp')
  , gutil = require('gulp-util')
  , sass = require('gulp-sass')
  , minifycss = require('gulp-clean-css')
  , gulpif = require('gulp-if')
  , sourcemaps = require('gulp-sourcemaps')
  ;

var BUILD_PATH = './build/content';
var myConfig = require('../config');
var DEV_MODE = myConfig.isDevMode();

gulp.task('css', ['preTask'], function () {
  return gulp.src(['public/scss/**/*.scss'])
    .pipe(gulpif(DEV_MODE, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(DEV_MODE, sourcemaps.write('./maps')))
    .on('error', gutil.log)
    .pipe(gulpif(!DEV_MODE, minifycss({
      keepSpecialComments: 1
    })))
    .pipe(gulp.dest(BUILD_PATH + '/css'))
    ;
});
gulp.task('css.watch', ['css'], function () {
  gulp.watch('./public/scss/**/*.scss', ['css'])
    .on('change', function(event) {
      gutil.log(event.path + ' changed, running css task...');
    });
  gutil.log('Starting watching scss files...');
});

