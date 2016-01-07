var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , gutil = require('gulp-util')
  ;

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
      gutil.log('nodemon restarted!');
    });
});