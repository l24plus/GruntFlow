//
// Grunt config file
// Author: Graffino (http://www.graffino.com)
//
module.exports = function(grunt) {
    var imageminMozjpeg = require('imagemin-mozjpeg');
    var imageminPngquant = require('imagemin-pngquant');

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
                            imageminMozjpeg({ quality: '85' }),
                            imageminPngquant({ quality: '85', speed: 1 })
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
            stylus_sprite : {
                expand: true,
                cwd: 'assets/images/svg',
                src: ['*.svg'],
                dest: 'assets/images/',
                options: {
                    shape : {
                        spacing: {
                            box: 'content',
                            // Change this on reslicing
                            padding: 0
                        }
                    },
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
            pinicon: {
                src: 'assets/images/svg/no-sprite/pin-icon.svg',
                dest: 'assets/images/pin-icon.svg',
            },
        },
        // Lint Stylus
        stylint: {
            options: {
                configFile: '.stylintrc'
            },
            src: ['assets/styl/**/*.styl']
        },
        // Compile Stylus
        stylus: {
            compile: {
                options: {
                    paths: [
                        'assets/styl/**/*',
                        'bower_components/**/*'
                    ],
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
                dest    : 'assets/js/plugins/bower.js',
                cssDest : 'assets/css/plugins/bower.css',
                exclude : ['jeet', 'normalize.styl', 'rupture-by-jenius'],
                include : [],
                includeDev : true,
                dependencies: {
                    'h5Validate' : ['jquery'],
                    'nouislider' : ['jquery']
                },
                mainFiles: {
                    'srcset-poly'      : 'build/srcset.js',
                    'h5Validate'       : 'jquery.h5validate.js',
                    'fontfaceobserver' : 'fontfaceobserver.js',
                    'slick.js'         : ['slick/slick.js', 'slick/slick.css'],
                },
                bowerOptions: {
                    relative   : false,
                }
            }
        },
        // Post CSS
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({browsers:['last 2 versions']}),
                    require('postcss-quantity-queries'),
                    require('csswring')
                ]
            },
            dist: {
                src: 'assets/css/main.css',
                dest: 'assets/css/main.min.css'
            }
        },
        // Un CSS
        uncss: {
            dist: {
                options: {
                    ignore: [/is-.*/, /has-.*/, /ui-state.*/, /mfp-.*/, /picker.*/, /select2.*/, /map.*/, /twitter.*/, /tt-.*/, /ui-select.*/]
                },
                files: {
                    'assets/css/main.min.css': ['index.html']
                }
            }
        },
        // Find critical CSS
        criticalcss: {
            custom: {
                options: {
                    url: '<%=  pkg.devpage %>',
                    width: 1200,
                    height: 900,
                    outputfile: 'assets/css/critical.min.css',
                    filename: 'assets/css/main.min.css',
                    buffer: 800*1024,
                    ignoreConsole: false,
                    forceInclude: ['']
                }
            }
        },
        // Replace stuff
        replace: {
            example: {
                src: ['assets/css/main.css'],
                dest: ['assets/css/main.css'],
                replacements: [{
                    from: 'url("example.png")',
                    to: ''
                },{
                    from: 'url("example@2x.png")',
                    to: ''
                }]
            }
        },
        // Lint HTML
        htmlhint: {
            options: {
                htmlhintrc: '.htmlhintrc'
            },
            src: ['*.html']
        },
        // Lint Javascript
        jshint: {
            options: {
                jshintrc: '.jshintrc',
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
        // Bump version
        bump: {
          options: {
            files: ['package.json', 'bower.json'],
            updateConfigs: [],
            commit: true,
            commitMessage: 'Bump to release v%VERSION%',
            commitFiles: ['package.json', 'bower.json'],
            createTag: false,
            tagName: 'v%VERSION%',
            tagMessage: 'Version %VERSION%',
            push: false,
            pushTo: 'origin',
            gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
            globalReplace: false,
            prereleaseName: false,
            regExp: false
          }
        },
        // Run things in paralell
        concurrent: {
            stuff_to_run: ['stylus', 'concat:js'],
        },
        // Watch for Changes
        watch: {
            // Recompile Stylus
            stylus: {
                files: ['assets/styl/**/*.styl'],
                tasks: ['stylint', 'stylus', 'process-css'],
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
                tasks: ['newer:imagemin:staging', 'newer:copy'],
            },
            // Live generate new svgs
            sprites: {
                files: ['assets/images/src/svg/**/*.svg'],
                tasks: ['newer:svgmin', 'newer:copy', 'svg_sprite', 'stylus', 'process-css'],
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
                tasks: ['bower', 'newer:svgmin', 'svg_sprite', 'stylus', 'process-css', 'test', 'process-js', 'newer:imagemin:staging', 'newer:copy'],

            },
            // Live lint HTML file
            html: {
                files: ['*.html'],
                tasks: ['test'],
                options: {
                    spawn: false,
                    livereload: true,
                },
            },
        },
    });

    /**
     * Load Grunt Modules
     */

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

    // UnCSS
    grunt.loadNpmTasks('grunt-uncss');

    // Critical CSS
    grunt.loadNpmTasks('grunt-criticalcss');

    // Lint Stylus
    grunt.loadNpmTasks('grunt-stylint');

    // Lint HTML
    grunt.loadNpmTasks('grunt-htmlhint');

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

    // Grunt Bump
    grunt.loadNpmTasks('grunt-bump');

    // Grunt Concurrent
    grunt.loadNpmTasks('grunt-concurrent');

    /**
     * Run Grunt Tasks
     */

    // Default
    grunt.registerTask('default', ['bower', 'newer:svgmin', 'svg_sprite', 'stylus', 'process-css', 'test', 'process-js', 'newer:imagemin:staging', 'newer:copy', 'watch']);
    // Staging
    grunt.registerTask('staging', ['bower', 'newer:svgmin', 'svg_sprite', 'stylus', 'process-css', 'process-js', 'newer:imagemin:staging', 'newer:copy']);
    // Production
    grunt.registerTask('production', ['clean', 'bower', 'svgmin', 'svg_sprite', 'stylus', 'process-css', 'process-js', 'imagemin:production', 'copy', 'criticalcss']);
    
    /**
     * Test
     */
    grunt.registerTask('test', ['jshint', 'stylint', 'htmlhint']);

    /**
     * Process CSS
     */
    // TODO: Update when this is fixed
    grunt.registerTask('process-css', 'Process CSS', function() {
        grunt.task.run('concat:css');
        grunt.task.run('replace');
        grunt.task.run('postcss');
        grunt.task.run('uncss');
        // This is a workaround for postcss
        grunt.task.run('postcss');
    });
    
    /**
     * Process JS
     */
    grunt.registerTask('process-js', 'Process JS', function() {
        grunt.task.run('concat:js');
        grunt.task.run('uglify');
    });
    
    /**
     * NPM modules handling
     */
    // TODO: Implement bower modules update (next major release)
    // Install npm updates
    grunt.registerTask('update-npm', 'Update package.json and update npm modules', function() {
        grunt.log.writeln('If you get an error here, run "npm install -g npm-check-updates".');
        grunt.task.run('npm-write-new');
        grunt.task.run('npm-prune');
        grunt.task.run('npm-update');
    });
    // Check for npm module updates
    grunt.registerTask('npm-check', 'Check for npm modules updates', function() {
        var done = this.async();

        grunt.log.writeln('Checking for npm modules updates ...');

        grunt.util.spawn({
            cmd: 'ncu',
            args: '',
            opts: {
                stdio: 'inherit',
            }
        }, function () {
            grunt.log.writeln('No files were modified.');
            done();
        });
    });
    // Check for global npm module updates
    grunt.registerTask('npm-check-global', 'Check for global npm modules updates', function() {
        var done = this.async();

        grunt.log.writeln('Checking for global npm modules updates ...');

        grunt.util.spawn({
            cmd: 'ncu',
            args: ['-g'],
            opts: {
                stdio: 'inherit',
            }
        }, function () {
            grunt.log.writeln('No files were modified.');
            done();
        });
    });
    // Write new versions to packages.json
    grunt.registerTask('npm-write-new', 'Write new versions to package.json', function() {
        var done = this.async();

        grunt.log.writeln('Checking for npm modules updates ...');

        grunt.util.spawn({
            cmd: 'ncu',
            args: ['-u'],
            opts: {
                stdio: 'inherit',
            }
        }, function () {
            grunt.log.writeln('New versions were written to "package.json".');
            done();
        });
    });
    // Prune extraneous npm modules
    grunt.registerTask('npm-prune', 'Prune npm modules', function() {
        var done = this.async();

        grunt.log.writeln('Pruning npm modules updates ...');

        grunt.util.spawn({
            cmd: 'npm',
            args: ['prune','--loglevel','warn'],
            opts: {
                stdio: 'inherit',
            }
        }, function () {
            grunt.log.writeln('NPM modules were pruned.');
            done();
        });
    });
    // Update npm modules
    grunt.registerTask('npm-update', 'Update npm modules', function() {
        var done = this.async();

        grunt.log.writeln('Installing npm modules updates ...');

        grunt.util.spawn({
            cmd: 'npm',
            args: ['update','--loglevel','warn'],
            opts: {
                stdio: 'inherit',
            }
        }, function () {
            grunt.log.writeln('NPM modules were updated.');
            done();
        });
    });
    /**
     * Bower modules handling
     */
    // Install or update bower modules
    grunt.registerTask('bower', 'Install or update bower modules', function() {
        grunt.task.run('bower-prune');
        grunt.task.run('bower-install');
        grunt.task.run('bower_concat');
    });
    // Update bower modules
    grunt.registerTask('bower-install', 'Install bower modules', function() {
        var done = this.async();

        grunt.log.writeln('Installing bower modules ...');

        grunt.util.spawn({
            cmd: 'bower',
            args: ['install'],
            opts: {
                stdio: 'inherit',
            }
        }, function () {
            grunt.log.writeln('Bower modules were installed.');
            done();
        });
    });
    // Prune extraneous bower modules
    grunt.registerTask('bower-prune', 'Prune extraneous bower modules', function() {
        var done = this.async();

        grunt.log.writeln('Pruning extraneous bower modules ...');

        grunt.util.spawn({
            cmd: 'bower',
            args: ['prune'],
            opts: {
                stdio: 'inherit',
            }
        }, function () {
            grunt.log.writeln('Extranous bower modules were removed');
            done();
        });
    });
    /**
     *  Clean
     */
    // grunt clean

    /**
     *  Critical CSS
     */
    // grunt criticalcss

    /**
     *  Test
     */
    // grunt test

    /**
     *  Bower
     */
    // grunt bower

    /**
     *  NPM Update Packages
     */
    // grunt npm-update

    /**
     *  Bump
     */
    // grunt bump
    // grunt bump:patch
    // grunt bump:minor
    // grunt bump:major
    // grunt bump:git
    // grunt bump --setversion=2.0.1
    // grunt bump --dry-run
    //
    // grunt bump-only:minor
    // grunt changelog
    // grunt bump-commit

    /**
     * NPM modules handling
     */
    // grunt npm-check
    // grunt update-npm

    /**
     * Bower modules handling
     */
    // grunt bower
};
