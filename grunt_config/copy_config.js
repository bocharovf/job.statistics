'use strict';

module.exports = {
	dist: {
		files: [{
			expand: true,
			dot: true,
			cwd: '<%= config.app %>',
			dest: '<%= config.dist %>',
			src: [
				'*.{ico,png,txt}',
				'images/{,*/}*.webp',
				'{,*/}*.html',
				'styles/fonts/{,*/}*.*'
			]
		}, {
			expand: true,
			dot: true,
			cwd: '.',
			src: 'bower_components/bootstrap-sass/assets/fonts/bootstrap/*',
			dest: '<%= config.dist %>'
		}, {
			expand: true,
			dot: true,
			cwd: '<%= config.server %>',
			src: ['**.js', '**.json'],
			dest: '<%= config.dist %>/server'
		}]
	}
}