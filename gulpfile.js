'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync('./package.json'));

var folder = path.basename(path.resolve(__dirname,'./'));
var options = {
	src: 'src',
	dist: './',
	tmp: '.tmp',
	errorHandler: function(title) {
		return function(err) {
			gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
			this.emit('end');
		};
	},
};

_.each([
	'github.js',
	'scripts.js',
	'styles.js',
	'inject.js',
	// 'watch.js',
	// 'server.js',
	// 'build.js',
	'markdown.js',
	'template.js',
],function(file){
	require('./gulp/' + file)(options);
});

gulp.task('default',function(done){
	done();
})
