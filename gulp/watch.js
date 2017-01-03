'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

module.exports = function(options) {
	gulp.task('fullReload',gulp.series('inject','template', function watch(done){
		browserSync.reload();
		done();
	}));

	gulp.task('watch', gulp.series('inject','template',gulp.parallel('scripts:watch'), function watch(done) {

		gulp.watch([
			'src/index.tpl',
			'src/partials/**/*.{md,tpl}',

			'docs/**/*.md',
		], gulp.series('fullReload'));

		// gulp.watch([
		// 	'docs/**/*.md',
		// ], gulp.series('docs', function watch(done){
		// 	browserSync.reload();
		// 	done();
		// }));

		gulp.watch([
			'src/styles/**/*.less',
		]
		// ,gulp.series('styles',function watch(done){
		// 	browserSync.reload();
		// 	done();
		// })
		)
		.on('change',function(){
			return gulp.series('styles',function(done){
				browserSync.reload();
				done();
			})();
		})
		.on('add',gulp.series('fullReload'))
		.on('addDir',gulp.series('fullReload'))
		.on('unlink',gulp.series('fullReload'))
		.on('unlinkDir',gulp.series('fullReload'))

		done();
	}));
};
