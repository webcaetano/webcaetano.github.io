'use strict';

var gulp = require('gulp');
var through = require('through2');
var path = require('path');
var _ = require('lodash');
var glob = require('glob');
var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync(path.join(__dirname,'../package.json')));
var getFileHeader = require('./getFileHeader');
var urlEncode = require('./urlEncode');

var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'del']
});

var getPosts = function(folder){
	return _.map(glob.sync(folder),function(file){
		var content = String(fs.readFileSync(file));
		var data = getFileHeader(content);

		return data;
	});
}

module.exports = function(options) {
	function postsGridTemplating(data){
		var posts = _.reverse(_.sortBy(getPosts(data.files),function(val){
			if(!val.date) return 0;

			var date = val.date.split('/')
			return ((new Date([date[2],date[0],date[1]].join('.'))).getTime() / 1000)
		}));

		return gulp.src('src/partials/posts.tpl')
		.pipe(through.obj(function (file, enc, callback) {
			var content = String(file.contents);

			content =
			(data.title ? `<h1>${data.title}</h1>` : '')+`
			`+content;

			content = _.template(content)({
				posts,
				urlEncode
			});

			file.contents = new Buffer(content);

			callback(null,file);
		}))
		// .pipe($.if(val.main, $.replace('<base href="../../../">', '')))
		.pipe($.rename(function (path) {
			path.extname = ".html"
			path.basename = "index"
		}))
		.pipe(gulp.dest(data.dest));
	}


	function postsGrid(dest){
		var data = [{
			title:'Portofolio',
			files:'src/portfolio-posts/**/*.md',
			dest:dest+'/portfolio-posts/'
		},
		{
			title:'Posts',
			files:'src/posts/**/*.md',
			dest:dest+'/posts/'
		}];

		return gulp.parallel(_.map(data,function(val){
			return _.bind(postsGridTemplating,null,val)
		}));
	}


	gulp.task('postsGrid', gulp.series(
		postsGrid(options.tmp+'/site')
	));

	// gulp.task('postsGrid:dist', gulp.series(
	// 	postsGrid('.')
	// ));

	// console.log(wrapper('src/portfolio-posts/**/*.md','portfolio-posts/'));
	// console.log(getPosts('src/posts/**/*.md'));
};
