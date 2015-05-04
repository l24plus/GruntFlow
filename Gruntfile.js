module.exports = function(grunt) {
	var mozjpeg = require('imagemin-mozjpeg');
	var pngquant = require('imagemin-pngquant');
	
	grunt.initConfig({
		// Read Package Information
		pkg: grunt.file.readJSON('package.json'),
		// Generate File Banner
		banner: '/*! \n' + 
				'* <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
				'*/\n',		

		// Optimize Images
		imagemin: {
			production: {
				options: {
					optimizationLevel: 7,
					use: [
							mozjpeg({quality: '65-80'}),
							pngquant({ quality: '65-80', speed: 1 })
						],
					progressive: true
				},
				files: [{
					expand: true,
					cwd: 'assets/images/src/',
					src: ['**/*.{png,jpg}'],
					dest: 'assets/images/'
				}]
			},
			staging: {
				options: {
					optimizationLevel: 0,
					progressive: false,
				},
				files: [{
					expand: true,
					cwd: 'assets/images/src/',
					src: ['**/*.{png,jpg}'],
					dest: 'assets/images/'
				}]
			}				
		},
		// Optimize SVGs
		svgmin: {
			options: {
				plugins: [{
					removeViewBox: false 
				}, {
					removeUselessStrokeAndFill: false
				}, {
					convertPathData: { 
						straightCurves: false
					}
				}]
			},
			dist: {
				files: [{
					expand: true,					
					cwd: 'assets/images/src/svg/',
					src: ['**/*.svg'],
					dest: 'assets/images/svg/',
					ext: '.svg'
				}]
			}
		},
		// SVG Sprite
		svg_sprite: {
			less_sprite : {
				expand: true,
				cwd: 'assets/images/svg',
				src: ['*.svg'],
				dest: 'assets/images/',
				options: {
					mode: {
						css: {
							bust: false,
							dest: '',
							common: '',
							prefix: 'svg-',
							sprite: 'sprite.svg',
							mixin: 'sprite',
							render: {
								styl: {
									template: 'assets/styl/base/sprite-mustache.styl',
									dest: '../styl/base/sprite.styl'
								}
							}
						}
					}
				}
			}
		},
		// Copy Files
		copy: {
			logo: {
				src: 'assets/images/svg/no-sprite/logo.svg',
				dest: 'assets/images/logo.svg',
			},
			favicon: {
				src: 'assets/images/src/favicon.ico',
				dest: 'assets/images/favicon.ico',
			},
		},
		// Compile Stylus
		stylus: {
			compile: {
				options: {
					paths: [
						'assets/styl/**/*',
						'bower_components/**/*'
					],
					import: ['jeet', 'normalize', 'nib', 'rupture'],
					compress: false,
					sourcemap: {
						inline: true
					}
				},
				files: {
					'assets/css/modules/app.css': 'assets/styl/main.styl'
				}
			}
		},
		// Bower Contact		
		bower_concat: {
			all: {
				dest: 'assets/js/plugins/bower.js',
				cssDest: 'assets/css/plugins/bower.css',
				exclude: ['jeet', 'normalize.styl', 'nib', 'rupture-by-jenius'],
				include: [],
				dependencies: {
					'h5Validate' : ['jquery'],
					'nouislider' : ['jquery']
				},
				mainFiles: {
					'srcset-poly' : ['build/srcset.js'],
					'h5Validate' : ['jquery.h5validate.js'],
					'slick.js' : ['slick/slick.js', 'slick/slick.css'],
				},
				bowerOptions: {
					relative: false
				}
			}
		},
		// Post CSS
		postcss: {
			options: {
				map: true,
				processors: [ 
					require('autoprefixer-core')({browsers: 'last 2 versions'}).postcss,
					require('csswring').postcss
				]
			},
			dist: {
				src: 'assets/css/main.css', 
				dest: 'assets/css/main.min.css'
			}
		}, 
		// Find critical CSS
	    criticalcss: {
	        custom: {
	            options: {
	                url: '<%=  pkg.devpage %>',
	                width: 1200,
	                height: 900,
	                outputfile: "assets/css/critical.min.css",
	                filename: "assets/css/main.min.css",
	                buffer: 800*1024,
	                ignoreConsole: false
	            }
	        }
	    },
		// Replace stuff
		replace: {
			example: {
				src: ['assets/css/main.css'],
				dest: ['assets/css/main.css'],
				replacements: [{
					from: "url('example.png')",
					to: ""
				},{
					from: "url('example@2x.png')",
					to: ""
				}]
			}
		},
	    // Lint HTML
		htmllint: {
			options: {
				force: true
			},
			all: ["*.html"]
		},
		// Lint Javascript
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				latedef: true,
				maxcomplexity: 6,
				unused: true,
				debug: true,
				devel: true,
				reporter: require('jshint-stylish')
			},
			all: {
				src: ['assets/js/modules/*.js', ],
			},
			gruntfile: {
				src: ['Gruntfile.js'],
			}
		},
		// Concatenate Modules
		concat: {
			options: {
				sourceMap: true
			},
			js: {
				src: ['assets/js/plugins/*.js', 'assets/js/modules/*.js'],
				dest: 'assets/js/main.js'
			},
			css: {
				src: ['assets/css/plugins/*.css', 'assets/css/modules/*.css'],
				dest: 'assets/css/main.css'
			}
		},
		// Uglify Javascript
		uglify: {
			options: {
				sourceMapIn: 'assets/js/main.js.map',
				sourceMap: 'main.min.js.map',
				mangle: false
			},
			main: {
				options: {
					banner: '<%= banner %>'
				},
				files: {
					'assets/js/main.min.js': ['assets/js/main.js']
				}
			},
		},		
		// Clean stuff
		clean: {
			bower: ['bower_components/*'],
			css: ['assets/css'],
			js: ['assets/js/plugins', 'assets/js/*.js', 'assets/js/*.map'],
			images: ['assets/images/*', '!assets/images/src']
		},
		// Watch for Changes
		watch: {
			// Recompile Stylus
			stylus: {
				files: ['assets/styl/**/*.styl'],
				tasks: ['stylus', 'concat:css', 'replace', 'postcss'],
			},
			// Live reload CSS
			livereload: {
				files: ['assets/css/main.min.css'],
				options: {
					livereload: true,
				},
			},			
			// Live reload PHP
			php: {
				files: ['*.php'],
				options: {
					livereload: true,
				},
			},
			// Live optimize new images
			images: {
				files: ['assets/images/src/**/*.png', 'assets/images/src/**/*.jpg'],
				tasks: ['newer:imagemin:staging'],
			},
			// Live generate new svgs
			sprites: {
				files: ['assets/images/src/svg/**/*.svg'],
				tasks: ['newer:svgmin', 'newer:copy', 'svg_sprite', 'stylus', 'concat:css', 'replace', 'postcss'],
				options: {
					livereload: true,
				},
			},
			// Live lint new scripts
			scripts: {
				files: ['assets/js/modules/*.js', 'assets/js/plugins/*.js'],
				tasks: ['jshint', 'concat:js', 'uglify'],
				options: {
					spawn: false,
					livereload: true,
				},
			},
			// Live lint Grunt file
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['bower', 'newer:svgmin', 'svg_sprite', 'stylus', 'concat:css', 'replace', 'postcss', 'htmllint', 'jshint', 'concat:js', 'uglify', 'newer:imagemin:staging', 'newer:copy'],
				
			},
			// Live lint HTML file
			html: {
				files: ['*.html'],
				tasks: ['htmllint'],
				options: {
					spawn: false,
					livereload: true,
				},				
			},
		},
	});

	// Load Grunt Modules //

	// Concat
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Bower Concat
	grunt.loadNpmTasks('grunt-bower-concat');

	// Copy
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Watch
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Stylus Complile
	grunt.loadNpmTasks('grunt-contrib-stylus');

	// CSS Post Processors
	grunt.loadNpmTasks('grunt-postcss');
	
	// Critical CSS
	grunt.loadNpmTasks('grunt-criticalcss');
	
	// Lint HTML
	grunt.loadNpmTasks('grunt-html');
	
	// Lint JS
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Uglify JS
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Image Optimization
	grunt.loadNpmTasks('grunt-contrib-imagemin'); 

	// SVG Optimization
	grunt.loadNpmTasks('grunt-svgmin'); 

	// SVG Sprite
	grunt.loadNpmTasks('grunt-svg-sprite');
	
	// Grunt Newer
	grunt.loadNpmTasks('grunt-newer');
	
	// Grunt Replace
	grunt.loadNpmTasks('grunt-text-replace');
	
	// Grunt Clean
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	// Run Grunt Tasks //
	// Default
	grunt.registerTask('default', ['bower', 'bower_concat', 'newer:svgmin', 'svg_sprite', 'stylus', 'concat:css', 'replace', 'postcss', 'htmllint', 'jshint', 'concat:js', 'uglify', 'newer:imagemin:staging', 'newer:copy', 'watch']); 
	// Staging
	grunt.registerTask('staging', ['bower', 'newer:svgmin', 'svg_sprite', 'stylus', 'concat:css', 'replace', 'postcss', 'concat:js', 'uglify', 'newer:imagemin:staging', 'newer:copy']); 
	// Production
	grunt.registerTask('production', ['clean', 'bower_concat', 'svgmin', 'svg_sprite', 'stylus', 'concat:css',  'replace', 'postcss', 'concat:js', 'uglify', 'imagemin:production', 'copy', 'criticalcss']); 
	// Test
	grunt.registerTask('test', ['jshint','htmllint']);

	// Automate bower install
	grunt.registerTask('bower', 'Install bower modules', function() {
		var exec = require('child_process').exec;
		var cb = this.async();
		exec('bower prune; bower install', {}, function(err, stdout) {
			console.log(stdout);
			cb();
		});
	});
	
	// Clean
	// grunt clean
	// Critical CSS
	// grunt criticalcss
	// Test
	// grunt test
	// Bower
	// grunt bower
};