'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'del']
});

module.exports = function(options) {
	gulp.task('html', gulp.series('template',function () {
		return gulp.src(options.tmp + '/index.html')
			.pipe($.htmlmin({collapseWhitespace: true, removeComments: true}))
			.pipe(gulp.dest(options.dist))
			.pipe($.size({ title: options.dist, showFiles: true }));
	}));

	gulp.task('fonts', function () {
		return gulp.src([
				'./node_modules/font-awesome/fonts/**/*'
			])
			.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
			.pipe($.flatten())
			.pipe(gulp.dest('./fonts'));
	});

	gulp.task('clean:siteDist', function (done) {
		return $.del([
			'index.html',
			'styles',
			'scripts',
		],{force:true});
	});

	gulp.task('script:dist',function(){
		return gulp.src(options.tmp + '/scripts/*.js')
		.pipe($.uglify())
		.pipe(gulp.dest(options.dist+'scripts'))
		.pipe($.size({ title: options.dist+'scripts', showFiles: true }));
	});

	gulp.task('styles:dist',function(){
		return gulp.src(options.tmp + '/styles/*.css')
		.pipe($.csso())
		.pipe(gulp.dest(options.dist+'styles'))
		.pipe($.size({ title: options.dist+'styles', showFiles: true }));
	});

	gulp.task('build', gulp.series(
		'clean:siteDist',
		'html',
		'script:dist',
		'styles:dist'
	));
};
