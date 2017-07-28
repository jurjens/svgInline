module.exports = function( grunt ) {

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.config.init({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            js: {
                src: ['src/svgInline.js'],
                dest: 'dist/svgInline.min.js'
            }
        }
    });

    grunt.registerTask('dist', ['uglify']);
};