module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/canal.js',
        dest: 'canal.min.js'
      }
    },
    qunit: {
      files: ['test/index.html']
    }
  });

  grunt.registerTask('test', ['qunit']);

  grunt.registerTask('default', ['qunit', 'uglify']);

};