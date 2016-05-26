var gulp = require('gulp')
  , imagemin = require('gulp-imagemin')
  ;

gulp.task('img', ['preTask'], function () {
  return gulp.src('./public/img/**/*')
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./build/content/img'));
});

