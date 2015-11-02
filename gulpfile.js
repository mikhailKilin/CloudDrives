var gulp = require('gulp');
var browserSync = require('browser-sync');
var del	= require('del');
var vinylPaths = require('vinyl-paths');
var typescript = require('gulp-typescript');
var gulpConcat = require('gulp-concat');
var sass = require('gulp-ruby-sass');
var notify = require("gulp-notify");
var bower = require('gulp-bower');
var config = {
    sassPath: './resources/sass',
    bowerDir: './bower_components'
}

gulp.task('copyIndex', function()
{
	return gulp.src('src/index.html')
	.pipe(gulp.dest('./build'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browserSync', function()
{
	browserSync({
		server: {
			baseDir: './build'
		}
	});
});

gulp.task('bower', function() {
    return bower()
     	   .pipe(gulp.dest(config.bowerDir))
});

gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
        .pipe(gulp.dest('./public/fonts'));
});


gulp.task('css', function() {
    return gulp.src(config.sassPath + '/style.scss')
        .pipe(sass({
            style: 'compressed',
            loadPath: [
                './resources/sass',
                config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
                config.bowerDir + '/fontawesome/scss',
          ]
     })
            .on("error", notify.onError(function (error) {
              return "Error: " + error.message;
          })))
      .pipe(gulp.dest('./public/css'));
});

gulp.task('watchFiles', function(){
	gulp.watch('src/index.html', ['copyIndex']);
	gulp.watch('src/**/*.ts', ['typescriptIt']);
	gulp.watch(config.sassPath + '/**/*.scss', ['css']);
});

gulp.task('typescriptIt', function () {
	return gulp.src('src/**/*.ts')
			.pipe(typescript())
			.pipe(gulpConcat('main.js'))
			.pipe(gulp.dest('./build'))
			.pipe(browserSync.reload({stream: true}));
});


gulp.task('clean', function()
{
	return gulp.src('./build', {read: false})
			.pipe(vinylPaths(del));
});


gulp.task('default', ['bower','icons','css','clean', 'copyIndex', 'typescriptIt', 'browserSync', 'watchFiles']);
