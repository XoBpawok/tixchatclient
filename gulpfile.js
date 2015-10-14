var gulp = require('gulp');
var electron = require('gulp-atom-electron');

gulp.task('default', function () {
    return gulp.src('src/**')
        .pipe(electron({ version: '0.33.7', platform: 'linux', arch: 'x64' }))
        .pipe(gulp.dest('release'));
});