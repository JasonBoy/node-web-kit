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
var buildPath = 'public/build/';

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
      './public/build/**/*.css',
      './public/build/**/*.js',
      './public/build/**/*.json',
      './public/build/**/*.@(png|jpg|jpeg|gif|ico|webp)',
      '!./public/build/lib/**/*'
    ])
    // .pipe(gulp.dest('./public/build'))
    .pipe(rev())
    .pipe(gulp.dest('./public/build'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./public/build'));
});

gulp.task('cssRevReplace', function () {
  var manifest = gulp.src("./public/build/rev-manifest.json");
  return gulp.src("./public/build/css/**/*.css")
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest(buildPath+'/css'));
});

gulp.task('htmlRevReplace', function () {
  var manifest = gulp.src("./public/build/rev-manifest.json");
  return gulp.src("./build/**/*.html")
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('./build'));
});

gulp.task('rev', ['revision'], function () {
  gulp.start('cssRevReplace', 'htmlRevReplace');
});