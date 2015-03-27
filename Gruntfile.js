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
			deploy: {
				options: {
					optimizationLevel: 7,
					use: [
							mozjpeg({quality: '65-80'}),
							pngquant({ quality: '65-80', speed: 1 })
						],
					progressive: true
				},
				files: [{
					// Set to true to enable the following options…
					expand: true,
					// cwd is 'current working directory'
					cwd: 'assets/images/src/',
					src: ['**/*.{png,jpg}'],
					// Could also match cwd line above. i.e. project-directory/img/
					dest: 'assets/images/'
				}]
			},
			develop: {
				options: {
					optimizationLevel: 0,
					progressive: false,
				},
				files: [{
					// Set to true to enable the following options…
					expand: true,
					// cwd is 'current working directory'
					cwd: 'assets/images/src/',
					src: ['**/*.{png,jpg}'],
					// Could also match cwd line above. i.e. project-directory/img/
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
			styl_sprite : {
				// Target-specific file lists and/or options go here.
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
						'assets/libs/**/*'
					],
					import: ['normalize', 'nib', 'rupture'],
					compress: false
				},
				files: {
					'assets/css/main.css': 'assets/styl/main.styl'
				}
			}
		},
		// Bower Copy
		bowercopy: {
			options: {
				// Bower components folder will be removed afterwards
				clean: false
			},
			// Entire folders
			folders: {
				options: {
					destPrefix: 'assets/libs/'
				},
				files: {
					'normalize/': 'normalize.styl/', 
					'rupture/': '../node_modules/rupture/',
					'loadcss/': 'loadcss/'
				}
			},
			// Javascript
			js: {
				options: {
					destPrefix: 'assets/js/plugins'
				},
				files: {
					'jquery.js': 'jquery/dist/jquery.js',
					'modernizr.js': 'modernizr/modernizr.js'
				},
			},
		},
		// Post CSS
		postcss: {
			options: {
				map: {
					inline: false
				},
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
	                filename: "assets/css/main.min.css", // Using path.resolve( path.join( ... ) ) is a good idea here
	                buffer: 800*1024,
	                ignoreConsole: false
	            }
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
			js: {
				src : ['assets/js/plugins/jquery.js', 'assets/js/plugins/*.js', 'assets/js/modules/*.js'],
				dest : 'assets/js/main.js'
			}
		},
		// Uglify Javascript
		uglify: {
			options: {
				sourceMap: 'main.min.js.map',
				mangle: false,
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
			libs: ['assets/libs'],
			css: ['assets/css'],
			js: ['assets/js/plugins', 'assets/js/*.js', 'assets/js/*.map'],
			images: ['assets/images/*', '!assets/images/src']
		},
		// Watch for Changes
		watch: {
			// Recompile Stylus
			stylus: {
				files: ['assets/styl/**/*.styl'],
				tasks: ['stylus', 'postcss'],
			},
			// Live reload CSS
			css: {
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
				tasks: ['imagemin:develop'],
			},
			// Live generate new svgs
			sprites: {
				files: ['assets/images/src/svg/**/*.svg'],
				tasks: ['svgmin', 'copy', 'svg_sprite', 'stylus', 'postcss'],
				options: {
					livereload: true,
				},
			},
			// Live lint new scripts
			scripts: {
				files: ['assets/js/modules/*.js', 'assets/js/plugins/*.js'],
				tasks: ['jshint', 'concat', 'uglify'],
				options: {
					spawn: false,
					livereload: true,
				},
			},
			// Live lint Grunt file
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['bowercopy', 'svgmin', 'copy','svg_sprite', 'stylus', 'postcss', 'htmlhint', 'jshint', 'concat', 'uglify', 'imagemin:develop'],
				
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

	// Bower Copy
	grunt.loadNpmTasks('grunt-bowercopy');

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
	
	// Grunt Clean
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	// Run Grunt Tasks //
	// Default
	grunt.registerTask('default', ['bowercopy', 'svgmin', 'copy', 'svg_sprite', 'stylus', 'postcss', 'htmllint', 'jshint', 'concat', 'uglify', 'imagemin:develop', 'watch']); 
	// Develop
	grunt.registerTask('develop', ['clean', 'bowercopy', 'svgmin', 'copy', 'svg_sprite', 'stylus', 'postcss', 'htmllint', 'jshint', 'concat', 'uglify', 'imagemin:develop', 'criticalcss']); 
	// Deploy
	grunt.registerTask('deploy', ['clean', 'bowercopy', 'svgmin', 'copy', 'svg_sprite', 'stylus', 'postcss', 'concat', 'uglify', 'imagemin:deploy']); 
};