'use strict';

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required grunt tasks
  require('jit-grunt')(grunt);

  // Configurable paths
  var config = {
    src: 'src',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      babel: {
        files: ['<%= config.src %>/scripts/{,*/}*.js'],
        tasks: ['babel:dist']
      },
      babelTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['babel:test', 'test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['<%= config.src %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass']
      },
      styles: {
        files: ['<%= config.src %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles']
      }
    },

		bower: {
		  dist: {
		    dest: 'dist/',
		    js_dest: 'dist/scripts/vendor',
				scss_dest: 'dist/styles/vendor',
				options: {
		      expand: true
		    }
		  }
		},

		wiredep: {
			serve: {
				src: [
					'<%= config.src %>/*.html', // point to your HTML file.
					'<%= config.src %>/styles/main.scss'
				]
			},
			build: {
        src: [
					'<%= config.src %>/*.html', // point to your HTML file.
					'<%= config.src %>/styles/main.scss'
				],
				ignorePath: '../bower_components/',
				fileTypes: {
					html: {
						replace: {
							js: '<script src="scripts/vendor/{{filePath}}"></script>'
	          }
			    },
					scss: {
			      replace: {
			        scss: '@import "{{filePath}}";'
			      }
			    },
				}
      }
    },

    browserSync: {
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
            '<%= config.src %>/{,*/}*.html',
            '.tmp/styles/{,*/}*.css',
            '<%= config.src %>/images/{,*/}*',
            '.tmp/scripts/{,*/}*.js'
          ],
          port: 9000,
          server: {
            baseDir: ['.tmp', config.src],
            routes: {
              '/bower_components': './bower_components'
            }
          }
        }
      },
      test: {
        options: {
          port: 9001,
          open: false,
          logLevel: 'silent',
          host: 'localhost',
          server: {
            baseDir: ['.tmp', './test', config.src],
            routes: {
              '/bower_components': './bower_components'
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
    },

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
        '<%= config.src %>/scripts/{,*/}*.js',
        '!<%= config.src %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    // Compiles ES6 with Babel
    babel: {
      options: {
        sourceMap: true,
				ignore: '<%= config.src %>/scripts/vendor/*'
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.src %>/scripts',
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
      },
			build: {
				files: [{
	          expand: true,
	          cwd: '<%= config.src %>/scripts',
	          src: '{,*/}*.js',
	          dest: 'dist/scripts'
	      }]
			}
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        sourceMap: true,
        sourceMapEmbed: true,
        sourceMapContents: true,
        includePaths: ['.']
      },
			// Compiles main.scss and makes it available on the temporary server
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.src %>/styles',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      },
			// Compiles main.scss into css and moves it to dist
			build: {
				files: [{
            expand: true,
            cwd: '<%= config.src %>/styles',
            src: '{,*/}*.scss',
            dest: 'dist/styles',
						ext: '.css'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.src %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
						'images/*.{jpg,png,svg,mp4}',
						'images/**/*.{jpg,png,svg,mp4}',
            'images/{,*/}*.webp',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*',
						'fonts/{,*/}*.*'
          ]
        }]
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'babel:dist',
        'sass:dist'
      ],
      test: [
        'babel'
      ],
      dist: [
        'babel:build',
        'sass:build'
      ]
    }
  });


  grunt.registerTask('serve', 'start the server and preview your src', function (target) {

    if (target === 'dist') {
      return grunt.task.run(['build', 'browserSync:dist']);
    }

    grunt.task.run([
      'clean:server',
			'wiredep:serve',
      'concurrent:server',
      'browserSync:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
		// 'eslint',
    'clean:dist',
		'bower:dist',
		'wiredep:build',
    'concurrent:dist',
    'copy:dist'
  ]);

  grunt.registerTask('default', [
    'newer:eslint',
    'test',
    'build'
  ]);
};
