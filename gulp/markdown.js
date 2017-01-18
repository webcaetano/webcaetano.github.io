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
			var stream = gulp.src(files)
			.pipe($.markdown({
				highlight: function(code) {
					return require('highlight.js').highlightAuto(code).value;
				},
				header: true
			}));


			stream.pipe(through.obj(function (file, enc, callback) {
				var newContent = String(file.contents);

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

			if(!main){
				stream.pipe($.cheerio(function ($$, file) {
					var content = String(file.contents);
					var data = getFileHeader(content);


					// var firstTitle = $$('h1').eq(0).text();
					// if(!firstTitle) firstTitle=path.basename(file.path,path.extname(file.path));
					var firstTitle=path.basename(file.path,path.extname(file.path));

					file.path = path.join(path.dirname(file.path),
						folder,
						// firstTitle.replace(/[\$|\.]/g,''),
						urlEncode(data.title),
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
