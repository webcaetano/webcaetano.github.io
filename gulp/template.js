'use strict';

var gulp = require('gulp');
var through = require('through2');
var path = require('path');
var _ = require('lodash');
var glob = require('glob');
var fs = require('fs');

var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'del']
});


module.exports = function(options) {
	function wrapper(dest,dist=false,done){
		var template = String(fs.readFileSync('src/index.tpl'));

		var footer = _.template(String(fs.readFileSync('src/partials/footer.tpl')))({
		});

		var menu = _.template(String(fs.readFileSync('src/partials/menu.tpl')))({
		});

		var header = _.template(String(fs.readFileSync('src/partials/header.tpl')))({
		});

		var content = _.template(template)({
			header,
			menu,
			footer,
		});

		return fs.writeFile(path.join(dest,'index.html'),content,done)
	}

	gulp.task('pre-template',gulp.series(
		gulp.parallel('scripts','styles')
	));

	gulp.task('template',gulp.series(
		'pre-template',
		wrapper.bind(null,options.tmp,null)
	));
};
