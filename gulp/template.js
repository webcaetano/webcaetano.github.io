'use strict';

var gulp = require('gulp');
var through = require('through2');
var path = require('path');
var _ = require('lodash');
var glob = require('glob');
var YAML = require('yamljs');
var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync(path.join(__dirname,'../package.json')));

var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'del']
});

var getFileHeader = function(content){
	var header = content.match(/<!-- header\n(.|\n)*?\nheader -->/g);
	if(!header) return {};

	return YAML.parse(header[0]
	.replace(/<!-- header\n/g,'')
	.replace(/\nheader -->/g,'')
	.replace(/\t/g,'  ')
	)
}

module.exports = function(options) {
	function templating(files,folder,templateDir,init='',data={},main=false){
		return function tpl(){
			var template = String(fs.readFileSync(templateDir));

			var footer = _.template(String(fs.readFileSync('src/partials/footer.tpl')))({
				version:pkg.version,
				init,
			});

			var header = _.template(String(fs.readFileSync('src/partials/header.tpl')))({
				init,
				version:pkg.version,
				home:main,
			});

			return gulp.src(files)
			.pipe(through.obj(function (file, enc, callback) {
				var postHeader = ''
				var content = String(file.contents);

				var data = getFileHeader(content);

				content =
				(data.title ? `<h1>${data.title}</h1>` : '')+`
				`+(data.header ? '<%= postHeader %>' : '')+`
				`+content;

				if(data.header){
					postHeader = _.template(String(fs.readFileSync('src/partials/post-header.tpl')))({
						data,
					});
				}

				content = _.template(content)({
					data,
					postHeader,
				})
				.replace(/<!-- header\n(.|\n)*?\nheader -->/g,'')

				var newContent = _.template(template)({
					content,
					header,
					init,
					data,
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

	var getPosts = function(dir=''){
		return _.map(glob.sync(dir),function(file){
			// var p = path.parse(file)
			// String(fs.readFileSync())


			// return p.name;
		});
	}

	// console.log(getPosts('src/portfolio-posts/*.md'))

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
			init:'',
			template:options.tmp + '/site/injected.tpl'
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
			{

			},
			val.init
		)));

		gulp.task('template:posts'+val.name,gulp.series(templating(
			options.tmp + '/site/posts/**/*.html',
			val.dest+'/posts/',
			val.template,
			{
				// posts:
			},
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
