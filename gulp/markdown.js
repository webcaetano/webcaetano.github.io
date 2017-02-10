'use strict';

var gulp = require('gulp');
var path = require('path');
var through = require('through2');
var _ = require('lodash');
var fs = require('fs');
var emoji = require('node-emoji');
var emojize = require('emojize').emojize;
var getFileHeader = require('./getFileHeader');
var urlEncode = require('./urlEncode');


var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'del']
});

module.exports = function(options) {
	function markdown(files,dest,folder,main=false){
		return function markdown(){
			return gulp.src(files)
			.pipe($.markdown({
				highlight: function(code) {
					return require('highlight.js').highlightAuto(code).value;
				},
				header: true
			}))
			.pipe(through.obj(function (file, enc, callback) {
				var newContent = String(file.contents);

				if(!main){
					var data = getFileHeader(newContent);
					file.path = path.join(path.dirname(file.path),
						folder,
						// firstTitle.replace(/[\$|\.]/g,''),
						urlEncode(data.title),
						'/index'+path.extname(file.path)
					);
				}

				// emoji compile
				newContent = emojize(emoji.emojify(newContent));
				var emojis = newContent.match(/<span class="emoji _.*?<\/span>/g);
				if(emojis){
					_.each(emojis,function(emoji,i){
						newContent = newContent.replace(new RegExp(emoji,'g'),'<img class="emoji" src="https://assets-cdn.github.com/images/icons/emoji/unicode/'+emoji.replace(/<span class="emoji _/g,'').replace(/"><\/span>/g,'')+'.png">')
					})
				}



				file.contents = new Buffer(newContent);
				callback(null,file);
			}))
			.pipe(gulp.dest(dest));
		}
	}


	gulp.task('clean:docs', function (done) {
		return $.del([
			// options.tmp + '/site/posts',
			options.tmp + '/site/portfolio-posts',
			options.tmp + '/site/partials',
		],{force:true});
	});

	gulp.task('markdown:portfolio', gulp.series(markdown(
		'src/portfolio-posts/*.md',
		options.tmp+'/site',
		"/portfolio-posts/"
	)));

	// gulp.task('markdown:posts', gulp.series(markdown([
	// 		'src/posts/*.md',
	// 	],
	// 	options.tmp+'/site',
	// 	"/posts/"
	// )));

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
			// 'markdown:posts',
			'markdown:mainPage',
			'markdown:portfolio'
		)
	));

};
