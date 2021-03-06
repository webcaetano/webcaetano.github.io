'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var gutil = require('gulp-util');
var fs = require('fs');
var $ = require('gulp-load-plugins')();;


module.exports = function(options) {
	function webpack(watch=false, callback=null, reload=null) {
		var webpackOptions = {
			watch: watch,
			cache: watch,
			module: {
				loaders: [
					{ test: /\.js$/, exclude: /node_modules/, loader: 'babel'},
					{ test: /\.json$/, exclude: /node_modules/, loader: 'json'},
					{ test: /\.json\.js/, exclude: /node_modules/, loader: 'tojson'}
				]
			},
			plugins:[function(){
				this.plugin("done", function(stats){
					if (stats.compilation.errors && stats.compilation.errors.length)gutil.beep();
				});
			}],
			output: { filename: 'index.js' }
		};

		if(watch) webpackOptions.devtool = 'inline-source-map';

		var webpackChangeHandler = function(err, stats) {
			if(err) {
				options.errorHandler('WEBPACK')(err);
			}
			$.util.log(stats.toString({
				colors: $.util.colors.supportsColor,
				chunks: false,
				hash: false,
				version: false
			}));
			if(reload) browserSync.reload();
			if(watch) {
				watch = false;
				callback();
			}
		};

		return gulp.src('src/js/index.js')
			.pipe($.webpack(webpackOptions, null, webpackChangeHandler))
			.pipe(gulp.dest(options.tmp + '/scripts'))
	}

	gulp.task('scripts', function () {
		return webpack(false);
	});

	gulp.task('scripts:watch', function (callback) {
		return webpack(true, callback, true);
	});
};
