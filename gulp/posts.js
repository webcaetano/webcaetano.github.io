'use strict';

var gulp = require('gulp');
var through = require('through2');
var path = require('path');
var glob = require('glob');
var _ = require('lodash');
var fs = require('fs');
var getFileHeader = require('./getFileHeader');
var urlEncode = require('./urlEncode');

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

var getPosts = function(folder){
	return _.map(glob.sync(folder),function(file){
		var content = String(fs.readFileSync(file));
		var data = getFileHeader(content);

		return data;
	});
}

module.exports = function(options) {
	function posts(files){
		return function posts(){

			return gulp.src(files)
			.pipe(through.obj(function (file, enc, callback) {
				var postHeader = '';
				var content = String(file.contents);

				var data = getFileHeader(content);

				var templateData = {
					data,
					urlEncode,
					postHeader,
				}

				content =
				(data.title ? `<div class="post-header"><h1>${data.title}</h1></div>` : '')+`
				`+(data.header ? '<%= postHeader %>' : '')+`
				`+content;

				if(data.header){
					templateData.postHeader = _.template(String(fs.readFileSync('src/partials/post-header.tpl')))({
						data,
					});
				}

				console.log(data.title)

				if(data.main){
					templateData.posts =  _.reverse(_.sortBy(getPosts('src/portfolio-posts/**/*.md'),function(val){
						if(!val.date) return 0;

						var date = val.date.split('/')
						return ((new Date([date[2],date[0],date[1]].join('.'))).getTime() / 1000)
					}));
				}

				content = escapeMarkdown(content);

				content = _.template(content)(templateData)
				// .replace(/<!-- header\n(.|\n)*?\nheader -->/g,'');

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
