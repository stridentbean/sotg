module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      // This is the list of files on which grunt will run JSHint
      all: ['Gruntfile.js', 'package.json', 'tests/**/*.js', 'server/**/*.js', 'streaming/**/*.js', 'tweetHandler/**/*.js', 'client/app/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
      }
    },

    watch: {
      // These are the files that grunt will watch for changes.
      files: ['Gruntfile.js', 'package.json', 'tests/**/*.js', 'server/**/*.js', 'streaming/**/*.js', 'tweetHandler/**/*.js', 'client/app/**/*.js'],
      // These are the tasks that are run on each of the above files every time there is a change.
      tasks: ['jshint', 'auto_install', 'mochaTest'],
      options: {
        atBegin: true
      }
    },

    mochaTest: {
      src: ['tests/**/*.js']
    },

    jsdoc: {
      dist: {
        src: ['server/**/*.js', 'streaming/**/*.js', 'tweetHandler/**/*.js', 'tests/**/*.js'],
        options: {
          destination: 'docs'
        }
      }
    },

    auto_install: {
      local: {},
      subdir: {
        options: {
          cwd: 'subdir',
          stdout: true,
          stderr: true,
          failOnError: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-auto-install');

  grunt.registerTask('default', ['jshint', 'mochaTest', 'jsdoc']);
  grunt.registerTask('test', 'mochaTest');
};
