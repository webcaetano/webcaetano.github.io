'use strict';

var gulp = require('gulp');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');

var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'del']
});

module.exports = function(options) {
	function markdown(files,dest,folder,main=false){
		return function markdown(){
			var stream = gulp.src(files)
			.pipe($.markdown({
				highlight: function(code) {
					return require('highlight.js').highlightAuto(code).value;
				},
				header: true
			}));

			if(!main){
				stream.pipe($.cheerio(function ($$, file) {
					// var firstTitle = $$('h1').eq(0).text();
					// if(!firstTitle) firstTitle=path.basename(file.path,path.extname(file.path));
					var firstTitle=path.basename(file.path,path.extname(file.path));

					file.path = path.join(path.dirname(file.path),
						folder,
						firstTitle.replace(/[\$|\.]/g,''),
						'/index'+path.extname(file.path)
					);
				}));
			}

			stream.pipe(gulp.dest(dest));

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
		options.tmp+'/site/partials',
		"/partials/",
		true
	)));

	gulp.task('markdown', gulp.series(
		'clean:docs',
		gulp.series(
			'markdown:portfolio',
			'markdown:mainPage',
			'markdown:posts'
		)
	));

};
