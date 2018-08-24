'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

module.exports = function(options) {
	var siteFolder = 'src';
	gulp.task('styles', function () {
		var lessOptions = {
			options: [
				'bower_components',
				siteFolder + '/less',
			]
		};

		var injectFiles = gulp.src([
			siteFolder+'/less/**/*.less',
			'!' + siteFolder + '/less/index.less',
			'!' + siteFolder + '/less/vendor.less'
		], { read: false });

		var injectOptions = {
			transform: function(filePath) {
				filePath = filePath.replace(siteFolder + '/less/', '');
				return '@import \'' + filePath + '\';';
			},
			starttag: '// injector',
			endtag: '// endinjector',
			addRootSlash: false
		};

		var indexFilter = $.filter('index.less', {restore: true});

		return gulp.src([
			siteFolder + '/less/index.less',
			// siteFolder + '/less/vendor.less'
		])
		// .pipe(indexFilter)
		.pipe($.if('index.less',$.inject(injectFiles, injectOptions)))
		// .pipe(indexFilter.restore)
		.pipe($.sourcemaps.init())
		.pipe($.less(lessOptions)).on('error', options.errorHandler('Less'))
		.pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(options.tmp + '/styles/'))
	});
};
