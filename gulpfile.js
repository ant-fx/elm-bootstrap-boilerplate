const babel = require('gulp-babel')
const concat = require('gulp-concat')
const del = require('del')
const elm = require('gulp-elm')
const gulp = require('gulp')
const gutil = require('gulp-util')
const less = require('gulp-less')
const livereload = require('gulp-livereload')
const runSequence = require('run-sequence')
const sourcemaps = require('gulp-sourcemaps')
const webserver = require('gulp-webserver')

gulp.task('elm-init', elm.init)

gulp.task('clean', function () {
  return del(['dist/*']).then((paths) => {
    paths.forEach((path) => {
      gutil.log('Deleted: ', path)
    })
  })
})

gulp.task('less', function () {
  gulp.src('src/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload())
})

gulp.task('js', () => {
  return gulp.src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
    .pipe(livereload())
})

gulp.task('css', () => {
  return gulp.src('src/css/*.css')
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload())
})

gulp.task('html', () => {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(livereload())
})

gulp.task('elm', ['elm-init'], function () {
  return gulp.src(['src/elm/*.elm', 'src/elm/!Test*'])
    .pipe(elm.bundle('app.js'))
    .on('error', () => {}) // errors are already printed by the elm compiler
    .pipe(gulp.dest('dist/js/'))
    .pipe(livereload())
})

gulp.task('webserver', function () {
  gulp.src('dist')
    .pipe(
      webserver({
        fallback: 'index.html',
        directoryListing: false,
        open: true
      })
    )
})

gulp.task('develop', function (done) {
  runSequence(
    'clean',
    ['html', 'elm', 'js', 'css', 'less'],
    'webserver',
    () => {
      livereload.listen({
        basePath: 'dist'
      })
      gulp.watch('src/less/*.less', ['less'])
      gulp.watch('src/js/*.js', ['js'])
      gulp.watch('src/elm/*.elm', ['elm'])
      gulp.watch('src/css/*.css', ['css'])
      gulp.watch('src/*.html', ['html'])
      done()
    }
  )
})

gulp.task('build', function (done) {
  runSequence(
    'clean',
    ['html', 'elm', 'js', 'css', 'less'],
    done
  )
})
