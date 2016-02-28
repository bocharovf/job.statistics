'use strict';

module.exports = {
	bower: {
		files: ['bower.json'],
		tasks: ['wiredep']
	},
	babel: {
		files: ['<%= config.app %>/scripts/{,*/}*.js'],
		tasks: ['babel:dist']
	},
	babelTest: {
		files: ['test/spec/{,*/}*.js'],
		tasks: ['babel:test']
	},
	gruntfile: {
		files: ['Gruntfile.js']
	},
	sass: {
		files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
		tasks: ['sass', 'postcss']
	},
	styles: {
		files: ['<%= config.app %>/styles/{,*/}*.css'],
		tasks: ['newer:copy:styles', 'postcss']
	},
	express: {
		files: ['server/*.js'],
		tasks: ['express:dev'],
		options: {
			spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
		}
	}
}