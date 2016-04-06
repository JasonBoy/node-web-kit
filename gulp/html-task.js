var gulp = require('gulp')
    , htmlmin = require('gulp-htmlmin')
    ;

gulp.task('html', ['preTask'], function () {
  return gulp.src('./views/**/*.html')
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        removeCommentsFromCDATA: true,
        minifyJS: true
      }))
      .pipe(gulp.dest('./build/views'));
});