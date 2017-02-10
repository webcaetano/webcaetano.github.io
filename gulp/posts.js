'use strict';

var gulp = require('gulp');
var through = require('through2');
var path = require('path');
var glob = require('glob');
var _ = require('lodash');
var fs = require('fs');
var getFileHeader = require('./getFileHeader');

var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'del']
});

var escapeMarkdown = function(content){
	return content.replace(/<!--esc(.|\n)*?-->/g,function(val){
		return val
		.replace(/<!--esc/,'<%')
		.replace(/-->/,'%>')
	})
}

module.exports = function(options) {
	function posts(files){
		return function posts(){

			return gulp.src(files)
			.pipe(through.obj(function (file, enc, callback) {
				var postHeader = ''
				var content = String(file.contents);

				var data = getFileHeader(content);

				content =
				(data.title ? `<div class="post-header"><h1>${data.title}</h1></div>` : '')+`
				`+(data.header ? '<%= postHeader %>' : '')+`
				`+content;

				if(data.header){
					postHeader = _.template(String(fs.readFileSync('src/partials/post-header.tpl')))({
						data,
					});
				}

				content = escapeMarkdown(content);

				content = _.template(content)({
					data,
					postHeader,
				})
				.replace(/<!-- header\n(.|\n)*?\nheader -->/g,'');

				file.contents = new Buffer(content);

				callback(null,file);

				return file;
			}))
			.pipe(gulp.dest(options.tmp+'/site'));
		}
	}

	gulp.task('posts', gulp.series(
		'markdown',
		posts(
			options.tmp+'/site/**/*.html'
		)
	));
};
