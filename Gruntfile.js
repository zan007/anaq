var fs = require('fs'),
  path = require('path'),
  _ = require('lodash-node');

module.exports = function (grunt) {

  var getScriptsFiles = function(paths) {
    var files = grunt.file.expand({cwd: 'src'}, paths),
          filesStrArr = [];
    
    for (var i = 0; i < files.length; i++)
      filesStrArr[i] = "'/"+files[i]+"'"
    
    return filesStrArr.join(',\n');
  }

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-htmlrender');
  grunt.loadNpmTasks('grunt-fontello');


  grunt.registerTask('build', ['clean:all', 'copy:app', 'less:build', 'copy:assets', 'htmlrender:build']);
  grunt.registerTask('release', ['clean:all', 'less:release', 'uglify:app', 'copy:assets', 'htmlrender:release']);
  grunt.registerTask('watch-build', ['build', 'watch:build']);
  grunt.registerTask('watch-release', ['release', 'watch:release']);
  grunt.registerTask('fonts', ['fontello:build']);

  grunt.initConfig({
    timestamp: new Date().getTime(),
    watch: {
      options: {
        interval: 200,
        spawn: false
      },
      build: {
        files: ['src/*.*', 'src/app/**', 'src/css/**/*.css', 'src/css/*.less', 'src/meta/**'],
        tasks: ['clean:app', 'copy:app', 'less:build', 'htmlrender:build']
      },
      release: {
        files: ['src/*.*', 'src/app/**', 'src/css/*.css', 'src/css/*.less', 'src/meta/**'],
        tasks: ['clean:app', 'uglify:app', 'less:release', 'htmlrender:release']
      }
    },
    htmlrender: {
      build: {
        options: {
          src: ['src/**/*.html'],
          vars: {
            scriptsPath: 'scripts.html',
            scriptsFiles: function() { return getScriptsFiles(['app/**/*.js']) },
            stylesPath: '/css/index.css'
          }
        },
        files: [{
            expand: true,
            cwd: 'src',
            src: ['*.html'],
            dest: 'dist',
            ext: '.html'
        }]
      },
      release: {
        options: {
          src: ['src/**/*.html'],
          vars: {
            scriptsPath: 'scripts.min.html',
            stylesPath: '/app/app.<%=timestamp%>.css',
            timestamp: '<%=timestamp%>'
          }
        },
        files: [{
            expand: true,
            cwd: 'src',
            src: ['*.html'],
            dest: 'dist',
            ext: '.html'
        }]
      }
    },
    copy: {
      app: {
        files: [{ dest: 'dist', src : ['app/**/*.js'], expand: true, cwd: 'src' }]
      },
      assets: {
        //files: [{ dest: 'dist', src : ['img/**', 'vendor/**', 'font/**', 'favicon.ico'], expand: true, cwd: 'src' }]
        files: [{ dest: 'dist', src : ['vendor/**', 'font/**'], expand: true, cwd: 'src' }]
      }
    },    
    clean: {
      all: ['dist/**'],
      app: ['dist/app/**', 'dist/css/**']
    },
    uglify: {
      app:{
        src:['src/app/**/*.js'],
        dest:'dist/app/app.<%=timestamp%>.js'
      }
    },
    less: {
      build: {
        options: {
          sourceMap: true,
          sourceMapFilename: 'dist/css/index.css.map',
          sourceMapURL: '/css/index.css.map',
          sourceMapBasepath: 'src',
          sourceMapRootpath: '/'
        },
        files: {
          'dist/css/index.css': 'src/css/index.css'
        }
      },
      release: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          'dist/app/app.<%=timestamp%>.css': 'src/css/index.css'
        }
      }
    },
    fontello: {
              build: {
                options: {
                  config  : 'fontello.json',
                  fonts   : 'src/font',
                  styles  : 'src/css/font',
                  scss    : false,
                  force   : true
                }
              }
            }
  });

};
