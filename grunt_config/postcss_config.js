'use strict';

module.exports = {
	options: {
		map: true,
		processors: [
			// Add vendor prefixed styles
			require('autoprefixer')({
				browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
			})
		]
	},
	dist: {
		files: [{
			expand: true,
			cwd: '.tmp/styles/',
			src: '{,*/}*.css',
			dest: '.tmp/styles/'
		}]
	}
}