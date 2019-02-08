'use strict';

var gulp = require('gulp'),
    csso = require('gulp-csso'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync').create(),
    svgo = require('gulp-svgo'),
    tinypng = require('gulp-tinypng-unlimited');

gulp.task('serve', function() {
  browserSync.init({
      server: {
          baseDir: "./build"
      }
  });
});

gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build'))
    .on('end' ,browserSync.reload);
});

gulp.task('sass', function () {
  return gulp.src('src/sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({}))
    .pipe(autoprefixer({
      browsers: ['last 10 versions'],
      cascade: false
    }))
    .on("error", notify.onError({
      title: "Style"
    }))
    .pipe(csso())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('img:dev', () => {
  return gulp.src('src/img/**/*.{jpg,jpeg,png}')
    .pipe(gulp.dest('build/img'));
});

gulp.task('img:build', () => {
  return gulp.src('src/img/**/*.{jpg,jpeg,png}')
    .pipe(tinypng())
    .pipe(gulp.dest('build/img'));
});

gulp.task('favicon', () => {
  return gulp.src('src/img/favicon/*')
    .pipe(gulp.dest('build/img/favicon'));
});

gulp.task('svg', () => {
  return gulp.src('src/img/**/*.svg')
      .pipe(svgo())
      .pipe(gulp.dest('build/img'));
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.html' ,gulp.series('html'));
  gulp.watch('src/sass/**/*.scss' ,gulp.series('sass'));
  gulp.watch('src/img/**/*.svg' ,gulp.series('svg'));
  gulp.watch('src/img/**/*.{jpg,jpeg,png}' ,gulp.series('img:dev'));
});

gulp.task('default' ,gulp.series(
  gulp.parallel('html', 'sass', 'img:dev', 'svg', 'favicon'),
  gulp.parallel('watch', 'serve')
));

gulp.task('build' ,gulp.series(
  gulp.parallel('html', 'sass', 'img:build', 'svg', 'favicon'),
  gulp.parallel('watch', 'serve')
));