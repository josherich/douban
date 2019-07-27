const gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  babel = require('gulp-babel'),
  Cache = require('gulp-file-cache'),
  livereload = require('gulp-livereload');
const cache = new Cache();

gulp.task('compile', function () {
  const stream = gulp.src('./lib/**/*.js')
   .pipe(cache.filter())
   .pipe(babel({presets: ['@babel/preset-env']}))
   .pipe(cache.cache())
   .pipe(gulp.dest('./dist'))
  return stream
})

gulp.task('copy_frontend_release', function () {
  return gulp.src('../dist/**/*')
   .pipe(gulp.dest('../tmp/frontend'))
})
gulp.task('copy_backend_release', function () {
  return gulp.src('../backend/dist/**/*')
   .pipe(gulp.dest('../tmp/backend'))
})

gulp.task('develop', ['compile'], function (done) {
  livereload.listen();
  nodemon({
    script: 'dist/app.js',
    watch: 'lib',
    tasks: ['compile'],
    done: done
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('production:views', function () {
  return gulp.src(['lib/app/views/*.{jade,html}'])
    .pipe(gulp.dest('dist/app/views'))
})

gulp.task('default', [
  'develop'
]);

gulp.task('release', [
  'compile',
  'production:views',
  'copy_frontend_release',
  'copy_backend_release'
]);
