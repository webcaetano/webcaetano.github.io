'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var util = require('util');

module.exports = function(options) {
	function browserSyncInit(baseDir, browser='default', done) {
		var routes = null;

		browserSync.instance = browserSync.init({
			startPath: '/',
			server: {
				baseDir,
				routes: {
					'/bower_components': 'bower_components'
				}
			},
			browser: browser,
			notify: false,
			open: false
		});

		done();
	}

	gulp.task('serve', gulp.series('watch', browserSyncInit.bind(null,[
		options.tmp,
		'.',
	],null)));
};
