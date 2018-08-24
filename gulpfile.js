'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var tempy = require('tempy');

var folder = path.basename(path.resolve(__dirname,'./'));
var options = {
	src: 'src',
	dist: './',
	tmp: tempy.directory(),
	errorHandler: function(title) {
		return function(err) {
			gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
			this.emit('end');
		};
	},
};

_.each([
	'scripts.js',
	'styles.js',
	'template.js',
	'watch.js',
	'build.js',
	'server.js',
],function(file){
	require('./gulp/' + file)(options);
});

gulp.task('default',function(done){
	done();
})
