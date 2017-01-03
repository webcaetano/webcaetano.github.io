'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');


module.exports = function(options) {
	gulp.task('fullReload',gulp.series('posts',function(done){
		browserSync.reload();
		done();
	}));

	gulp.task('watch', gulp.series('posts',gulp.parallel('scripts:watch'), function watch(done) {
		gulp.watch([
			options.src + '/posts/**/*.md',
			options.src + '/portfolio-posts/**/*.md',
			options.src + '/views/**/*.hbs',
			'bower.json',
			options.src + '/index.hbs'
		], gulp.series('fullReload'));

		gulp.watch([
			options.src + '/{styles,components}/**/*.less'
		], function(event) {
			browserSync.reload();
		});

		done();
	}));

};
