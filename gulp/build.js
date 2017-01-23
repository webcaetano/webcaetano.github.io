'use strict';

var gulp = require('gulp');
var exec = require('sync-exec');

var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'del', 'main-bower-files']
});

module.exports = function(options) {
	var dist = '';
	gulp.task('html', gulp.series('inject',function () {
		return gulp.src(options.tmp + '/site/injected.tpl')
			.pipe($.useref())
			// .pipe($.if('*.html', $.replace('bower_components', '../bower_components')))
			.pipe($.if('*.js', $.preprocess({context: {dist: true}})))
			.pipe($.if('*.js', $.uglify()))
			// .pipe($.replace('../../bower_components/font-awesome/fonts/', '../fonts/'))
			.pipe($.if('*.css', $.cssmin()))
			.pipe($.if('*.js',gulp.dest(dist+'/')))
			.pipe(gulp.dest('./'))
			.pipe($.size({ title: dist+'/', showFiles: true }));
	// }));
	},'template:dist'));

	gulp.task('fonts', function () {
		return gulp.src('./bower_components/font-awesome/fonts/**/*')
			.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
			.pipe($.flatten())
			.pipe(gulp.dest('./fonts'));
	});

	// gulp.task('copy:docs', function () {
	// 	return gulp.src([
	// 		// options.src + '/favicon.ico',
	// 		options.tmp + '/site/docs/**/*.html',
	// 	])
	// 	.pipe(gulp.dest('siteDist/docs'));
	// });

	gulp.task('clean:siteDist', function (done) {
		return $.del([
			// dist+'/',
			'index.html',
			'styles',
			'scripts',
			'posts',
			'portfolio-posts',
		],{force:true});
	});

	gulp.task('clean:tpl:dist', function (done) {
		return $.del([
			'./injected.tpl',
		],{force:true});
	});

	gulp.task('build', gulp.series(
		'clean:siteDist',
		gulp.parallel(
			'html',
			'fonts'
			// 'other'
		),
		'clean:tpl:dist'
		// 'copy:docs'
	));

	gulp.task('deploy:site',gulp.series('build',function(done){
		var c = [
			'cd '+dist,
			'git init',
			'git add .',
			'git commit -m "Deploy to Github Pages"',
			'git push --force git@github.com:webcaetano/craft.git master:gh-pages' // change adress to you repo
		].join(" && ")
		console.log(exec(c));
		done();
	}));

	// gulp.task('deploy:site:build',gulp.series('build:site','deploy:site'))
};
