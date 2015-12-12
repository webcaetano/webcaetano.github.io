'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var $ = require('gulp-load-plugins')();

function isOnlyChange(event) {
	return event.type === 'changed';
}

// function markdown(options,dest,file){
// 	return gulp.src(file ? file : options.src + '/posts/**/*.md')
// 	.pipe($.markdown())
// 	.pipe($.cheerio(function ($$, file) {
// 		var firstTitle = $$('h1').eq(0).text();
// 		if(!firstTitle) firstTitle=path.basename(file.path,path.extname(file.path));
// 		file.path = path.join(path.dirname(file.path),
// 			"/posts/",
// 			firstTitle.replace(/\s+/g,'-').toLowerCase(),
// 			'/index'+path.extname(file.path)
// 		);
// 	}))
// 	.pipe(gulp.dest(dest));
// }


module.exports = function(options) {
	gulp.task('watch', function (done) {
		runSequence('posts',['scripts:watch'],function(){
			// gulp.watch([options.src + '/*.html', options.src + '/*.html', 'bower.json'], function(event) {
			// 	gulp.start('inject',function(){
			// 		browserSync.reload();
			// 	});
			// });

			gulp.watch([
				options.src + '/{styles,components}/**/*.less'
			], function(event) {
				if(isOnlyChange(event)) {
					gulp.start('styles',function(){
						browserSync.reload();
					});
				} else {
					gulp.start('posts');
				}
			});

			gulp.watch([
				options.src + '/posts/**/*.md',
				options.src + '/portfolio-posts/**/*.md',
				options.src + '/views/**/*.hbs'
				,'bower.json',options.src + '/index.hbs'
			], function(event) {
				// markdown(options,options.tmp+'/serve',event.path).on('end',function(){

				// markdown(options,options.tmp+'/serve').on('end',function(){
				// 	browserSync.reload();
				// });
				gulp.start('posts',function(){
					browserSync.reload();
				});
			});

			done();
		});
	});

};
