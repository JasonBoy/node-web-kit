var gulp = require('gulp')
  , gutil = require('gulp-util')
  , uglify = require('gulp-uglify')
  , fs = require('fs')
  , vp = require('vinyl-paths')
  , del = require('del')
  , Promise = require("bluebird")
  , rev = require('gulp-rev')
  ;


gulp.task('clean', function () {
  return gulp.src(['public/build/*'], {
      read: false
    })
    .pipe(vp(del));
});

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