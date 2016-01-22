module.exports = function (grunt) {

	grunt.initConfig({
		bootlint: {
			options: {
				stoponerror: false,
				relaxerror: []
			},
			files: ['html/*.html']
		},
        
        concat:{
            angular: {
                files: {
                    'public/lib/angular.min.js': ['bower_components/angular/angular.js']
                }
            },
            jquery: {
                files: {
                    'public/lib/jquery.min.js': ['bower_components/jquery/dist/jquery.min.js']
                }
            },
            bootstrap: {
                files: {
                    'public/lib/bootstrap.min.js': ['bower_components/bootstrap/dist/js/bootstrap.min.js'],
                    'public/lib/bootstrap.css': ['bower_components/bootstrap/dist/css/bootstrap.css'],
                    'public/lib/bootstrap-theme.min.js': ['bower_components/bootstrap/dist/js/bootstrap-theme.min.js']
                }
            }
        }
	});
    
	grunt.loadNpmTasks('grunt-bootlint');
    grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['bootlint', 'concat']);
};