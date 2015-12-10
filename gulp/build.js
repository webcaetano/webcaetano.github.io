'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var through = require('through2');
var fs = require('fs');

var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

module.exports = function(options) {
	gulp.task('html', ['inject','markdown'], function () {
		var assets;
		return gulp.src(options.tmp + '/serve/index.html')
			.pipe(assets = $.useref.assets())
			.pipe($.rev())
			.pipe($.if('*.js', $.uglify()))
			// .pipe($.replace('../../bower_components/font-awesome-less/fonts/', '../fonts/'))
			// .pipe($.replace('../../bower_components/font-awesome-less/fonts/', '../fonts/'))
			.pipe($.if('*.css', $.csso()))
			.pipe($.if('*.css', $.replace('../images/', '../src/images/')))
			.pipe(assets.restore())
			.pipe($.useref())
			.pipe($.revReplace())
			.pipe($.if('*.html', $.minifyHtml({empty: true,	spare: true, quotes: true, conditionals: true})))
			.pipe(gulp.dest(options.dist + '/'))
			.pipe($.size({ title: options.dist + '/', showFiles: true }));
	});

	// Only applies for fonts from bower dependencies
	// Custom fonts are handled by the "other" task
	gulp.task('fonts', function () {
		return gulp.src($.mainBowerFiles())
			.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
			.pipe($.flatten())
			.pipe(gulp.dest(options.dist + '/fonts/'));
	});

	gulp.task('other', function () {
		return gulp.src([
			options.src + '/favicon.ico',
			options.src + '/404.html',
			// '!' + options.src + '/**/*.{css,js,less}'
		])
		.pipe(gulp.dest(options.dist + '/'));
	});

	gulp.task('clean', function (done) {
		$.del([
			options.dist + '/scripts',
			options.dist + '/styles',
			options.dist + '/posts',
			options.tmp + '/'
		], done);
	});


	gulp.task('build',function(done){
		// runSequence('clean',['html', 'fonts', 'other'],'rest',done);
		runSequence('clean',['html', 'other'],'posts:dist',done);
	});

	gulp.task('deploy',function(done){
		runSequence('build','p',done);
	})
};
