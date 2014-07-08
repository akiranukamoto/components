module.exports = function (grunt) {

   grunt.initConfig({
      clean: {
        dist: ['build/']
      },
      jshint: {
        dist : ['src/**/*.js']
      },
      concat: {
        dist: {
          src: ['src/**/*.js'],
          dest: 'build/components.js'
         }
       },
       uglify: {
         dist: {
          src: ['build/components.js'],
          dest: 'build/components.min.js'
         }
       }
   });
    grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.registerTask('default', ['clean','jshint', 'concat', 'uglify']);
};
