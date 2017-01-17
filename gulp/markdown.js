'use strict';

var gulp = require('gulp');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');

var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'del']
});

module.exports = function(options) {
	function markdown(files,dest,folder,env){
		return function markdown(){
			var stream = gulp.src(files)
			.pipe($.markdown({
				highlight: function(code) {
					return require('highlight.js').highlightAuto(code).value;
				},
				header: true
			}));

			_.each([
				'String',
				'Number',
				'Boolean',
				'Object',
				'Array',
				'Phaser.Group',
			],function(val,i){
				stream.pipe($.replace(new RegExp("<"+val+">",'g'), "<span class='paramter-type'>&lt;"+val+"&gt;</span>"))
			})

			stream.pipe($.cheerio(function ($$, file) {
				// var firstTitle = $$('h1').eq(0).text();
				// if(!firstTitle) firstTitle=path.basename(file.path,path.extname(file.path));
				var firstTitle=path.basename(file.path,path.extname(file.path));

				file.path = path.join(path.dirname(file.path),
					folder,
					firstTitle.replace(/[\$|\.]/g,''),
					'/index'+path.extname(file.path)
				);
			}))
			// .pipe($.if(function(){
			// 	return env=='dist'
			// }, $.replace('src="images/', 'src="../src/images/')))
			.pipe(gulp.dest(dest));

			return stream;
		}
	}


	gulp.task('clean:docs', function (done) {
		return $.del([
			options.tmp + '/site/posts',
			options.tmp + '/site/portfolio-posts',
			options.tmp + '/site/partials',
		],{force:true});
	});

	gulp.task('markdown:portfolio', gulp.series(markdown([
			'src/portfolio-posts/*.md',
		],
		options.tmp+'/site',
		"/portfolio-posts/"
	)));

	gulp.task('markdown:posts', gulp.series(markdown([
			'src/posts/*.md',
		],
		options.tmp+'/site',
		"/posts/"
	)));

	gulp.task('markdown:mainPage', gulp.series(markdown([
			'src/partials/main.md',
		],
		options.tmp+'/site',
		"/partials/"
	)));

	// gulp.task('markdown:mainPage', function(){
	// 	return gulp.src(['src/partials/main.md'])
	// 	.pipe($.markdown({
	// 		highlight: function(code) {
	// 			return require('highlight.js').highlightAuto(code).value;
	// 		},
	// 		header: true
	// 	}))
	// 	.pipe(gulp.dest(options.tmp+'/site/partials'));
	// });

	gulp.task('markdown', gulp.series(
		'clean:docs',
		gulp.parallel(
			'markdown:portfolio',
			'markdown:mainPage',
			'markdown:posts'
		)
	));

};
