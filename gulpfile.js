var gulp = require('gulp')
  , gutil = require('gulp-util')
  , Promise = require("bluebird")
  ;

//require gulp tasks
require('./gulp');

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
//init the static assets without watch tasks
gulp.task('init', ['css', 'js', 'js.lib'], function () {
  return new Promise(function (resole) {
    gutil.log('Initializing static assets finished.');
    resole(true);
  });
});
//should for prod
gulp.task('assets', ['css', 'js', 'js.lib', 'img', 'html'], function () {
  gulp.start('rev');
});
// Default task
gulp.task('default', ['clean'], function () {
  gulp.start('assets');
});
