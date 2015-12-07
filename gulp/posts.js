
'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var through = require('through2');
var fs = require('fs');

var $ = require('gulp-load-plugins')();

module.exports = function(options) {
	function posts(dest,template){
		return gulp.src(options.tmp + '/serve/posts/**/*.html')
		.pipe(through.obj(function (file, enc, callback) {
			file.contents = new Buffer(template.replace(/\[\[POSTS\]\]/g,String(file.contents)));
			callback(null,file);
		}))
		.pipe(gulp.dest(dest));
	}

	gulp.task('posts:dist',function(done){
		return posts(options.dist + '/posts',String(fs.readFileSync('index.html')))
	});

	gulp.task('posts',function(done){
		return posts(options.tmp + '/serve/posts',String(fs.readFileSync(options.tmp+'/serve/index.html')))
	});
};
