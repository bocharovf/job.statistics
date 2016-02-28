'use strict';

module.exports = {
	options: {
		sourceMap: true,
		sourceMapEmbed: true,
		sourceMapContents: true,
		includePaths: ['.']
	},
	dist: {
		files: [{
			expand: true,
			cwd: '<%= config.app %>/styles',
			src: ['*.{scss,sass}'],
			dest: '.tmp/styles',
			ext: '.css'
		}]
	}
}