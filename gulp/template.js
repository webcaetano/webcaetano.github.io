'use strict';

var gulp = require('gulp');
var through = require('through2');
var path = require('path');
var _ = require('lodash');
var glob = require('glob');
var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync(path.join(__dirname,'../package.json')));

var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'del']
});

module.exports = function(options) {
	function templating(files,folder,templateDir,init='',main=false){
		return function tpl(){
			var template = String(fs.readFileSync(templateDir));
			var footer = _.template(String(fs.readFileSync('src/partials/footer.tpl')))({
				version:pkg.version,
				init,
			});

			return gulp.src(files)
			.pipe(through.obj(function (file, enc, callback) {
				// var pathData = path.parse(file.path);
				// var folders = pathData.dir.split('/');
				// var lastFolder = _.last(folders);

				var menu = _.template(String(fs.readFileSync('src/partials/menu.tpl')))({
					init,
					version:pkg.version,
					home:main,
					// name:lastFolder,
				});

				// var content = _.template(String(file.contents)
				// .replace(/<!-- protosTpl -->/g,"<%=protosTpl%>"))({
				// 	protosTpl:protosTpl
				// });

				var content = _.template(String(file.contents))();

				var newContent = _.template(template)({
					content,
					menu,
					init,
					footer,
					version:pkg.version,
				});
				file.contents = new Buffer(newContent);

				callback(null,file);
			}))
			.pipe($.if(main, $.replace('<base href="../../../">', '')))
			.pipe($.rename(function (path) {
				path.extname = ".html"
				if(main) path.basename = "index"
			}))
			.pipe(gulp.dest(folder));
		}
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
			dest:'',
			name:':dist',
			init:'',
			template:'injected.tpl'
		},
		{
			dest:options.tmp + '/site',
			init:'',
			name:'',
			template:options.tmp + '/site/injected.tpl'
		},
	],function(val,i){
		gulp.task('template:portfolio'+val.name,gulp.series(templating(
			options.tmp + '/site/portfolio-posts/**/*.html',
			val.dest+'/portfolio-posts/',
			val.template,
			val.init
		)));

		gulp.task('template:posts'+val.name,gulp.series(templating(
			options.tmp + '/site/posts/**/*.html',
			val.dest+'/posts/',
			val.template,
			val.init
		)));

		gulp.task('template:mainPage'+val.name,gulp.series(templating(
			options.tmp + '/site/partials/main.html',
			val.dest+'/',
			val.template,
			val.init,
			true
		)));

		gulp.task('template'+val.name,gulp.series(
			'clean:siteTmp',
			'markdown',
			'template:mainPage'+val.name,
			'template:portfolio'+val.name,
			'template:posts'+val.name
		));
	})

};
