module.exports = function (grunt) {

	grunt.initConfig({
		bootlint: {
			options: {
				stoponerror: false,
				relaxerror: []
			},
			files: ['html/*.html']
		}
	});
	grunt.loadNpmTasks('grunt-bootlint');

	grunt.registerTask('default', ['bootlint']);
};