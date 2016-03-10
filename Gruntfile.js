// Generated on 2015-10-27 using
// generator-webapp 1.1.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    express: 'grunt-express-server'
  });

  // Configurable paths
  var config = {
    app: 'app',
    server: 'server',
    dist: 'dist',
    test: 'test',
    docs: 'docs'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: '<%= config.server %>/server.js'
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: require('./grunt_config/watch_config'),

    browserSync: require('./grunt_config/browserSync_config'),

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    eslint: {
      target: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        '<%= config.server %>/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ],
      options: {
        configFile: 'eslint.json'
      }
    },

    // Mocha testing framework - client side
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%= browserSync.test.options.host %>:<%= browserSync.test.options.port %>/index.html']
        }
      }
    },

    // Mocha testing framework - server side
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/spec/server/*.js']
      }
    },

    // Compiles ES6 with Babel
    babel: require('./grunt_config/babel_config'),

    // Compiles Sass to CSS and generates necessary files if requested
    sass: require('./grunt_config/sass_config'),

    postcss: require('./grunt_config/postcss_config'),

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        src: ['<%= config.app %>/index.html', '<%= config.test %>/index.html'],
        exclude: ['bootstrap.js'],
        ignorePath: /^(\.\.\/)*\.\./
      },
      sass: {
        src: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /^(\.\.\/)+/
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= config.dist %>/scripts/{,*/}*.js',
          '<%= config.dist %>/styles/{,*/}*.css',
          '<%= config.dist %>/images/{,*/}*.*',
          '<%= config.dist %>/styles/fonts/{,*/}*.*',
          '<%= config.dist %>/*.{ico,png}'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: '.tmp/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/images',
          '<%= config.dist %>/styles'
        ]
      },
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/styles/{,*/}*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    targethtml: {
      dist: {
        files: {
          '.tmp/index.html': '<%= config.app %>/index.html'
        }
      }
    },

    htmlmin: require('./grunt_config/htmlmin_config'),

    // Copies remaining files to places other tasks can use
    copy: require('./grunt_config/copy_config'),

    // Generates a custom Modernizr build that includes only the tests you
    // reference in your app
    modernizr: {
      dist: {
        devFile: 'bower_components/modernizr/modernizr.js',
        outputFile: '<%= config.dist %>/scripts/vendor/modernizr.js',
        files: {
          src: [
            '<%= config.dist %>/scripts/{,*/}*.js',
            '<%= config.dist %>/styles/{,*/}*.css',
            '!<%= config.dist %>/scripts/vendor/*'
          ]
        },
        uglify: true
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'babel:dist',
        'sass'
      ],
      test: [
        'babel'
      ],
      dist: [
        'babel',
        'sass',
        'imagemin',
        'svgmin'
      ]
    },

    jsdoc: {
      dist: {
        src: ['<%= config.app %>/scripts/{,*/}*.js', '<%= config.test %>/spec/{,*/}*.js', '<%= config.docs %>/README.md'],
        options: {
          destination: 'docs'
        }
      }
    }
  });


  grunt.registerTask('serve', 'start the server and preview your app', function(target) {

    if (target === 'dist') {
      return grunt.task.run(['build', 'browserSync:dist']);
    }

    grunt.task.run([
      'express:dev',
      'clean:server',
      'wiredep',
      'concurrent:server',
      'postcss',
      'browserSync:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('test', function(target) {

    grunt.task.run([
      'clean:server',
      'concurrent:test',
      //'postcss',
      'wiredep',
      'browserSync:test',
      'mocha',
      'mochaTest'
    ]);

    if (target === 'watch') {
      grunt.task.run([
        'watch'
      ]);
    }

  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',

    'targethtml:dist',

    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'concat',
    'cssmin',

    'uglify',
    'copy:dist',
    'modernizr',
    'filerev',
    'usemin',

    'htmlmin'
  ]);

  grunt.registerTask('doc', [
    'jsdoc:dist'
  ]);

  grunt.registerTask('default', [
    'newer:eslint' //,
    //'test',
    //'build'
  ]);
};