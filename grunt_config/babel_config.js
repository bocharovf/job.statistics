'use strict';

module.exports = {
	options: {
		sourceMap: true
	},
	dist: {
		files: [{
			expand: true,
			cwd: '<%= config.app %>/scripts',
			src: '{,*/}*.js',
			dest: '.tmp/scripts',
			ext: '.js'
		}]
	},
	test: {
		files: [{
			expand: true,
			cwd: 'test/spec',
			src: '{,*/}*.js',
			dest: '.tmp/spec',
			ext: '.js'
		}]
	}
}