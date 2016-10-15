module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      files: ['test/index.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', ['qunit']);

  grunt.registerTask('default', ['uglify']);

};