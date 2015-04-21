module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // 1. All configuration goes here
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
            '.tmp/css',
            'public/css'
          ]
        }]
      },
      js: {
        files: [{
          dot: true,
          src: [
            'public/js',
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
          'js/app.js'
        ],
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
        'scss/*.scss',
      ]
    },

    cssmin: {
      dist: {
        files: {
          'public/css/<%= pkg.name %>.min.css': ['public/css/<%= pkg.name %>.css']
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'img',
          src: '**/*.{gif,jpeg,jpg,png,ico}',
          dest: 'public/img'
        }]
      }
    },

    compass: {
      dist: {
        options: {
          sassDir: 'scss',
          cssDir: '.tmp/css',
          config: 'config.rb'
        }
      }
    },

    watch: {
      scripts: {
        files: ['scss/*.*', 'js/**/*.*'],
        tasks: ['html', 'css', 'js'],
        options: {
          livereload: false,
          spawn: false
        },
      },

      css: {
        files: ['scss/*.scss'],
        tasks: ['css'],
        options: {
          livereload: true,
          spawn: false
        }
      }
    },

    targethtml: {
      dist: {
        files: {
          'dist/index.html': 'index.html',
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

  grunt.registerTask('html', [
    //'concat:html'
  ]);

  grunt.registerTask('css', [
    'compass',
    'concat:css',
    'cssmin'
  ]);

  grunt.registerTask('js', [
    'concat:js',
    'uglify'
  ]);

  grunt.registerTask('build', [
    'clean',
    'html',
    'css',
    'js',
    //'imagemin',
    //'targethtml'
  ]);

  grunt.registerTask('release', [
    'build',
    'exec:deploy',
    'push'
  ]);

  grunt.registerTask('default', [
    'newer:scsslint',
    'build'
  ]);

};

