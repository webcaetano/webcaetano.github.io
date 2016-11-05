'use strict';

var gulp = require('gulp');
var _ = require('lodash');
var fs = require('fs');
var $ = require('gulp-load-plugins')();
var pkg = JSON.parse(fs.readFileSync('./package.json'));
var wiredep = require('wiredep').stream;


module.exports = function(options) {

	var inject = function(dev=true){
		var wiredepOptions = {
			directory: 'bower_components',
			devDependencies: dev
		};

		return gulp.src(options.src + '/index.html')

			.pipe($.inject(
				gulp.src(
					[
						options.tmp + '/serve/scripts/**/*.js'
					],
					{read: false}
				),
				{
					starttag: '<!-- inject:scripts:{{ext}} -->',
					ignorePath: [
						options.tmp + '/serve'
					],
					addRootSlash: false
				}
			))

			.pipe($.inject(
				gulp.src(
					[
						options.tmp + '/serve/styles/**/*.css'
					],
					{read: false}
				),
				{
					starttag: '<!-- inject:styles:{{ext}} -->',
					ignorePath: [
						options.tmp + '/serve'
					],
					addRootSlash: false
				}
			))


			.pipe(wiredep(wiredepOptions))
			// .pipe($.template({
			// 	date:{
			// 		day:(new Date()).getYear(),
			// 		year:(new Date()).getFullYear(),
			// 		month:(new Date()).getMonth(),
			// 	}
			// }))
			.pipe(gulp.dest(options.tmp + '/serve'));
	}

	gulp.task('inject', gulp.series(gulp.parallel('scripts','styles'), function injectDev() {
		return inject();
	}));

	gulp.task('inject:dist', gulp.series(gulp.parallel('scripts','styles'), function injectDev() {
		return inject(false);
	}));
};


