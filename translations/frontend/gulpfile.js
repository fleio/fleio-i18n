var gulp = require('gulp'),
    gettext = require('gulp-angular-gettext');

gulp.task('translations', function () {
    return gulp.src('po/**/*.po')
        .pipe(gettext.compile({
            format: 'javascript'
        }))
        .pipe(gulp.dest('translations/'));
});
