'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var path = require('path');
var runSequence = require('run-sequence');
var $ = require('gulp-load-plugins')();

function isOnlyChange(event) {
	return event.type === 'changed';
}

function markdown(options,dest,file){
	return gulp.src(file ? file : options.src + '/posts/**/*.md')
	.pipe($.markdown())
	.pipe($.cheerio(function ($$, file) {
		var firstTitle = $$('h1').eq(0).text();
		if(!firstTitle) return;
		file.path = path.dirname(file.path)+'\\'+(firstTitle.replace(/\s+/g,'-').toLowerCase())+'\\index'+path.extname(file.path);
	}))
	.pipe(gulp.dest(dest));
}


module.exports = function(options) {
	gulp.task('markdown', function () {
		return markdown(options,options.tmp+'/serve')
	});

	gulp.task('watch', function (done) {
		runSequence('inject',['scripts:watch'],function(){
			gulp.watch([options.src + '/*.html', options.src + '/*.html', 'bower.json'], function(event) {
				gulp.start('inject',function(){
					browserSync.reload();
				});
			});

			gulp.watch([
				options.src + '/{styles,components}/**/*.less'
			], function(event) {
				if(isOnlyChange(event)) {
					gulp.start('styles',function(){
						browserSync.reload();
					});
				} else {
					gulp.start('inject');
				}
			});

			gulp.watch(options.src + '/posts/**/*.md', function(event) {
				markdown(options,options.tmp+'/serve',event.path).on('end',function(){
					browserSync.reload();
				});
			});

			gulp.watch(options.src + '/{app,views,components}/**/*.html', function(event) {
				browserSync.reload(event.path);
			});
			done();
		});
	});

};
