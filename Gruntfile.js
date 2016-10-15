module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! canal <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/canal.js',
        dest: 'build/canal.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);

};