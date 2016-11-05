'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var open = require('gulp-open');
// var util = require('util');

module.exports = function(options) {

	function browserSyncInit(baseDir, browser='default', done) {
		// var routes = null;
		// if(baseDir === options.src || (util.isArray(baseDir) && baseDir.indexOf(options.src) !== -1)) {
		// 	routes = {
		// 		'/bower_components': 'bower_components'
		// 	};
		// }

		browserSync.instance = browserSync.init({
			startPath: options.folder,
			server: {
				baseDir: baseDir,
				routes: {
					'/bower_components': 'bower_components',
					'/images': options.src+'/images',
				}
			},
			browser: browser,
			notify: false,
			open: false
		});

		done();
	}

	gulp.task('open',function(){
		return gulp.src('../')
		.pipe(open({
			uri: 'http://localhost:3000/'+options.folder+'/?dev_nomraid=1',
			app: 'google chrome'
		}));
	});

	gulp.task('open:tps',function(){
		return gulp.src('../')
		.pipe(open({
			uri: 'texture_sheets/atlas.tps',
		}));
	});

	gulp.task('serve', gulp.series('watch', browserSyncInit.bind(null,[
		options.tmp + '/serve',
		'../',
	],null)));

	// gulp.task('serve:dist', gulp.series('build', browserSyncInit.bind(null,[
	// 	'./'
	// ],null)));

	// gulp.task('serve:build', gulp.series(browserSyncInit.bind(null,[
	// 	'./'
	// ],null)));
};

