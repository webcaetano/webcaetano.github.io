
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var through = require('through2');
var path = require('path');
var emoji = require('node-emoji');
var _ = require('lodash');
var fs = require('fs');
var emojize = require('emojize').emojize


var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'del']
});

var homePage = 'about';

module.exports = function(options) {
	function posts(dest,template){
		return gulp.src(options.tmp + '/serve/posts/**/*.html')
		.pipe(through.obj(function (file, enc, callback) {
			var newContent = String(file.contents);

			// emoji compile
			newContent = emojize(emoji.emojify(newContent));
			var emojis = newContent.match(/<span class="emoji _.*?<\/span>/g);
			if(emojis){
				_.each(emojis,function(emoji,i){
					newContent = newContent.replace(new RegExp(emoji,'g'),'<img class="emoji" src="https://assets-cdn.github.com/images/icons/emoji/unicode/'+emoji.replace(/<span class="emoji _/g,'').replace(/"><\/span>/g,'')+'.png">')
				})
			}

			newContent = template.replace(/\[\[POSTS\]\]/g,newContent);
			file.contents = new Buffer(newContent);
			callback(null,file);
		}))
		.pipe(gulp.dest(dest));
	}

	gulp.task('homepage',function(){
		return gulp.src(options.tmp + '/serve/posts/'+homePage+'/index.html')
		.pipe($.replace('<base href="../../">',''))
		.pipe(gulp.dest(options.tmp+'/serve'));
	});

	gulp.task('homepage:dist',function(){
		return gulp.src(options.dist + '/posts/'+homePage+'/index.html')
		.pipe($.replace('<base href="../../">',''))
		.pipe(gulp.dest(options.dist+'/'));
	});

	gulp.task('markdown',['clean:posts'], function () {
		// return markdown(options,options.tmp+'/serve')
		return gulp.src([
			options.src + '/posts/**/*.md',
			options.src + '/portfolio-posts/**/*.md',
		])
		.pipe($.markdown({
			highlight: function(code) {
				return require('highlight.js').highlightAuto(code).value;
			},
			header: true
		}))
		.pipe($.cheerio(function ($$, file) {
			var firstTitle = $$('h1').eq(0).text();
			if(!firstTitle) firstTitle=path.basename(file.path,path.extname(file.path));
			file.path = path.join(path.dirname(file.path),
				"/posts/",
				firstTitle.replace(/\s+/g,'-').toLowerCase(),
				'/index'+path.extname(file.path)
			);
		}))
		.pipe(gulp.dest(options.tmp+'/serve'));
	});

	gulp.task('clean:posts', function (done) {
		$.del([
			options.tmp + '/serve/posts'
		], done);
	});


	gulp.task('posts:make:dist',function(done){
		return posts(options.dist + '/posts',String(fs.readFileSync('index.html')))
	});

	gulp.task('posts:make',function(done){
		return posts(options.tmp + '/serve/posts',String(fs.readFileSync(options.tmp+'/serve/index.html')))
	});

	gulp.task('posts',function(done){
		runSequence(['markdown','inject'],'posts:make','homepage',done)
	});

	gulp.task('posts:dist',function(done){
		runSequence('posts:make:dist','homepage:dist',done)
	});
};
