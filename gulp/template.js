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
	var templating = function(val){
		var template = String(fs.readFileSync(options.tmp + '/site/injected.tpl'));

		var footer = _.template(String(fs.readFileSync('src/partials/footer.tpl')))({
			version:pkg.version,
		});

		var header = _.template(String(fs.readFileSync('src/partials/header.tpl')))({
			version:pkg.version,
			home:val.main,
		});

		return gulp.src(val.files)
		.pipe(through.obj(function (file, enc, callback) {
			var content = String(file.contents);

			var newContent = _.template(template)({
				content,
				header,
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
		.pipe(gulp.dest(val.folder));

	}

	gulp.task('clean:siteTmp', function (done) {
		return $.del([
			// dist+'/',
			options.tmp + '/site/portfolio-posts',
			options.tmp + '/site/posts',
		],{force:true});
	});

	_.each([
		{
			dest:'.',
			name:':dist',
		},
		{
			dest:options.tmp + '/site',
			name:'',
		},
	],function(val,i){
		gulp.task('template'+val.name,gulp.series(
			'clean:siteTmp',
			'posts',
			'inject',
			gulp.parallel(_.map([
				{
					files:options.tmp + '/site/partials/main.html',
					folder:val.dest+'/',
					main:true
				},
				{
					files:options.tmp + '/site/posts/**/*.html',
					folder:val.dest+'/posts/',
				},
				{
					files:options.tmp + '/site/portfolio-posts/**/*.html',
					folder:val.dest+'/portfolio-posts/',
				}
			],function(val){
				return _.bind(templating,null,val)
			}))
		));
	})
};
