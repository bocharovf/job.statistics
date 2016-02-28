'use strict';

module.exports = {
	options: {
		notify: false,
		background: true,
		watchOptions: {
			ignored: ''
		}
	},
	livereload: {
		options: {
			files: [
				'<%= config.app %>/{,*/}*.html',
				'.tmp/styles/{,*/}*.css',
				'<%= config.app %>/images/{,*/}*',
				'.tmp/scripts/{,*/}*.js'
			],
			port: 9000,
			server: {
				baseDir: ['.tmp', '<%= config.app %>'],
				routes: {
					'/bower_components': './bower_components'
				}
			}
		}
	},
	test: {
		options: {
			files: [
				'.tmp/scripts/{,*/}*.js',
				'.tmp/spec/{,*/}*.js'
			],
			port: 9001,
			open: true,
			logLevel: 'silent',
			host: 'localhost',
			server: {
				baseDir: ['.tmp', './test', '.tmp/scripts'],
				routes: {
					'/bower_components': './bower_components',
					'/node_modules': './node_modules'
				}
			}
		}
	},
	dist: {
		options: {
			background: false,
			server: '<%= config.dist %>'
		}
	}
}