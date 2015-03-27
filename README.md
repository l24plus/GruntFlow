# GruntFlow
## Grunt basic flow we use at Graffino ##
*This site uses stylus and it's precompiled with node / grunt.*

### DISCLAIMER ###
We know it's not complete, not well documented. We're working on it :)

### Development Deployment ###

Run in this order:
```
npm install 
bower install 
grunt 
```

to generate all assets for a development deployment.


### These files & folders are dynamically generated: ###

```
bower_components
node_modules

assets/js/plugins/ 
assets/js/main.js
assets/js/main.min.js.map

assets/css/main.css
assets/css/main.min.css.map

assets/images/ -> Except src folder

```

### Source files (Javascript, Stylus, Images), config files needed by node, grunt and bower: ###

```
assets/js/modules/ -> All source Javascript Files are stored here
assets/images/src -> All source images are stored here 
assets/styl/ -> All source CSS (Stylus files are stored here)

bower.json -> Bower configuration
package.json -> Node configuration
Gruntfile.js -> Grunt configuration
readme.md -> This file


```

### Compilation flow when running: ###

```
grunt 
```

1. Node components are fetched and installed in node_components
2. Grunt, Bower are installed
3. Javascript, CSS, Less  Libraries are fetched into bower_components
4. Javascript, CSS, Less files are copied from bower_components into /libs, /js/plugins/, /less/base/
5. SVG Sprites are generated, sprite.less file copied into /less/base/sprites.less, sprite.svg is copied into images/src/svg
6. PNG/JPG Images in assets/images/src are optimized and copied into images/ under the same structure
7. Stylus is compiled from /assets/styl/ & CSS is minified into main.min.css
8. JS is linted from /js/modules and /js/plugins with JSHint, concatenated and minified into main.min.js
9. HTML files are linted for errors (some errors are fine, they need to be ignored)
10. A watch for changes function is launched

```
grunt deploy
```

1-5. - Same as above
6. JPG and PNG images are heavily optimized (this takes time)
7-9. - Same as above
10. - Watch doesn't run on deploy

```
grunt develop
```
1-9. - Same as ```grunt``` 

```
grunt clean
```
1. Deletes all dynamically generated files

```
grunt criticalcss
```
1. Generates the critical CSS to be included in the head in /css/critical.css from path specified in package.json

