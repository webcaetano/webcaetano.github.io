'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();
var handlebars = require('gulp-compile-handlebars');
// var glob = require('glob');
var wiredep = require('wiredep').stream;
// var path = require('path');

var wiredep = require('wiredep').stream;

module.exports = function(options) {
	gulp.task('inject', ['scripts', 'styles'], function () {
		var injectStyles = gulp.src([
			options.tmp + '/serve/{styles,components}/**/*.css',
			'!' + options.tmp + '/serve/styles/vendor.css'
		], { read: false });


		var injectScripts = gulp.src([
			options.tmp + '/serve/{app,components}/**/*.js',
			// '!' + options.src + '/{app,components}/**/*.spec.js',
			// '!' + options.src + '/{app,components}/**/*.mock.js'
		], { read: false });

		var injectOptions = {
			ignorePath: [options.src, options.tmp + '/serve'],
			addRootSlash: false
		};

		var wiredepOptions = {
			//ignorePath: /^(\.\.\/)*\.\./
			directory: 'bower_components'
		};

		return gulp.src(options.src + '/index.hbs')
			.pipe(handlebars({
				date:{
					day:(new Date()).getYear(),
					year:(new Date()).getFullYear(),
					month:(new Date()).getMonth(),
				}
			},{
				ignorePartials: true,
				batch : [options.src+'/views']
			}))
			.pipe($.extname())
			.pipe($.inject(injectStyles, injectOptions))
			.pipe($.inject(injectScripts, injectOptions))
			.pipe(wiredep(wiredepOptions))
			.pipe(gulp.dest(options.tmp + '/serve'));
	});
};
