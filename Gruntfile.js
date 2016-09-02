module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp'
          ]
        }]
      },
      css: {
        files: [{
          dot: true,
          src: [
            'css'
          ]
        }]
      },
      js: {
        files: [{
          dot: true,
          src: [
            'js/<%= pkg.name %>.min.js'
          ]
        }]
      }
    },

    exec: {
      deploy: {
        cmd: 'sh scripts/publish'
      }
    },

    concat: {
      html: {
        files: [
          { expand: true, src: ['*.html'], dest: 'dist/' }
        ]
      },
      css: {
        src: [
          '.tmp/css/*.css'
        ],
        dest: 'public/css/<%= pkg.name %>.css'
      },
      js: {
        src: [
          'js/jquery.easing.min.js',
          'js/<%= pkg.name %>.js'
        ],
        dest: 'public/js/<%= pkg.name %>.js'
      }
    },

    browserify: {
      app: {
        options: {
          watch: true,
          browserifyOptions: {
            debug: true
          }
        },
        src: 'js/**/**.js',
        dest: 'public/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        report: 'min',
        mangle: true,
        compress: true
      },
      build: {
        src: 'public/js/<%= pkg.name %>.js',
        dest: 'public/js/<%= pkg.name %>.min.js'
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'js/*.js']
    },

    scsslint: {
      allFiles: [
        'scss/*.scss'
      ],
      options: {
        config: '.scss-lint.yml'
      }
    },

    sass: {
      options: {
        compass: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'scss',
          src: '*.scss',
          dest: '.tmp/css',
          ext: '.css'
        }]
      }
    },

    cssmin: {
      options: {
        sourceMap: false
      },
      target: {
        files: [{
          expand: true,
          cwd: '.tmp/css',
          src: ['*.css', '!*.min.css'],
          dest: 'public/css',
          ext: '.min.css'
        }]
      }
    },

    compass: {
      options: {
        config: 'config.rb'
      }
    },

    watch: {
      scripts: {
        files: ['index.html', 'scss/*', 'js/**/*.*'],
        tasks: ['js'],
        options: {
          livereload: true,
          spawn: false
        }
      },

      css: {
        files: ['scss/**/*.*'],
        tasks: ['css'],
        options: {
          livereload: true,
          spawn: false
        }
      }
    },

    push: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        add: true,
        addFiles: ['.'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'captures/*', 'downloads/*', 'dist/*'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        releaseBranch: ['master'],
        npm: false,
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
      }
    }
  });

  grunt.registerTask('js', [
    'clean:js',
    'browserify',
    'uglify'
  ]);

  grunt.registerTask('css', [
    'clean:css',
    'sass',
    'concat:css',
    'cssmin'
  ]);

  grunt.registerTask('build', [
    'clean',
    'css',
    'js'
  ]);

  grunt.registerTask('release', [
    'build',
    'exec:deploy',
    'push'
  ]);

  grunt.registerTask('default', 'build');
};

