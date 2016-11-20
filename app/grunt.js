var grunt = require('grunt');
var config = require('./config');

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		test : {
			files : [ 'test/**/*.js' ]
		},
		lint : {
			files : [ 'grunt.js', 'app.js', 'routes/**/*.js', 'models/**/*.js', 'test/**/*.js']
		},
		watch : {
			files : '<config:lint.files>',
			tasks : 'default'
		},
		jshint : {
			options : {
				curly : true,
				eqeqeq : true,
				immed : true,
				latedef : true,
				newcap : true,
				noarg : true,
				sub : true,
				undef : true,
				boss : true,
				eqnull : true,
				node : true
			},
			globals : {
				exports : true
			}
		},
		server : {
			port : config.http.port,
			base : './public'
		}
	});

	// Default task.
	grunt.registerTask('default', 'lint test');

};
