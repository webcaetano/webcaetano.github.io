'use strict';

var gulp = require('gulp');
var through = require('through2');
var path = require('path');
var _ = require('lodash');
var glob = require('glob');
var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync(path.join(__dirname,'../package.json')));
var getFileHeader = require('./getFileHeader');

var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'del']
});


module.exports = function(options) {
	function wrapper(val,dist=false){
		var template = String(fs.readFileSync((dist ? '' : options.tmp + '/site/')+'injected.tpl'));

		var footer = _.template(String(fs.readFileSync('src/partials/footer.tpl')))({
			version:pkg.version,
		});

		var menu = _.template(String(fs.readFileSync('src/partials/menu.tpl')))({
			version:pkg.version,
			home:val.main,
		});

		var header = _.template(String(fs.readFileSync('src/partials/header.tpl')))({
			version:pkg.version,
			// menu,
			home:val.main,
		});

		return gulp.src(val.files)
		.pipe(through.obj(function (file, enc, callback) {
			var content = String(file.contents);

			var newContent = _.template(template)({
				content,
				header,
				menu,
				footer,
				version:pkg.version,
			});
			file.contents = new Buffer(newContent);

			callback(null,file);
		}))
		.pipe($.if(val.main, $.replace('<base href="../../../">', '')))
		.pipe($.rename(function (path) {
			path.extname = ".html"
			if(val.main) path.basename = "index"
		}))
		// .pipe($.if(function(file){
		// 	// return dist && path.extname(file.path)=='.html';
		// 	return path.extname(file.path)=='.html';
		// }, $.minifyHtml({empty: true, spare: true, quotes: true, conditionals: true})))
		.pipe(gulp.dest(val.folder));
	}

	gulp.task('clean:siteTmp', function (done) {
		return $.del([
			// dist+'/',
			options.tmp + '/site/portfolio-posts',
			options.tmp + '/site/posts',
		],{force:true});
	});

	function templating(dest,dist=false){
		var data = [{
			files:options.tmp + '/site/posts/about/index.html',
			folder:dest+'/',
			main:true
		},
		{
			files:options.tmp + '/site/posts/**/*.html',
			folder:dest+'/posts/',
		},
		{
			files:options.tmp + '/site/portfolio-posts/**/*.html',
			folder:dest+'/portfolio-posts/',
		}];

		return gulp.parallel(_.map(data,function(val){
			return _.bind(wrapper,null,val,dist)
		}));
	}

	gulp.task('pre-template',gulp.series(
		'clean:siteTmp',
		gulp.parallel(
			'posts',
			'postsGrid',
			'inject'
		)
	));

	gulp.task('template:dist',gulp.series(
		'pre-template',
		templating('.')
	));

	gulp.task('template',gulp.series(
		'pre-template',
		templating(options.tmp + '/site',true)
	));
};
