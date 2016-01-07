var gulp = require('gulp')
  , gutil = require('gulp-util')
  , less = require('gulp-less')
  , minifycss = require('gulp-minify-css')
  , gulpif = require('gulp-if')
  , sourcemaps = require('gulp-sourcemaps')
  ;

var myConfig = require('../config');
var DEV_MODE = myConfig.isDevMode();

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

