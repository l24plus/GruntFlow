# GruntFlow
## Grunt basic flow we use at Graffino ##
*This site uses stylus and it's precompiled with node / grunt.*

### DISCLAIMER ###
We know it's not complete, not well documented. We're working on it :). You'll need knowledge of node, grunt, bower and stylus to master this.

### Development Deployment ###

Run in this order:
```
npm install 
grunt 
```

to generate all assets for a development deployment.


### These files & folders are dynamically generated: ###

```
bower_components
node_modules

assets/js/plugins/ 
assets/js/main.js
assets/js/main.js.map
assets/js/main.min.js
assets/js/main.min.js.map

assets/css/
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

docs -> Documentation on technologies used

```

### These files & folders are not needed for live deployment:

```
bower_components
node_modules

assets/images/src

assets/js/plugins/
assets/js/modules/
assets/js/main.js
assets/js/main.js.map
assets/js/main.min.js.map

assets/css/main.css
assets/css/main.css.map
assets/css/main.min.css.map
assets/styl/

bower.json
package.json
Gruntfile.js
readme.md

docs

```

### Compilation flow when running: ###

```
grunt 
```

1. Node components are fetched and installed in node_components
2. Grunt, Bower are installed
3. Javascript, CSS, Stylus libraries are fetched into bower_components via bower install
4. SVGs are optimized, compressed and copied into /images/svg. 
5. SVG sprite is generated (sprite.styl, sprite.svg), sprite.styl file copied into /styl/base/, sprite.svg is copied into images/svg
6. Stylus is compiled from /assets/styl/ & CSS to /css/modules/app.css
7. /css/modules/app.css and /css/plugins/bower.css are concatenated into /css/main.css
8. String replace is run on /css/main.css to eliminate CSS that may cause issues
9. Autoprefixer is run on /css/main.css for automatically adding needed CSS browser prefixes and minifying the css to /css/main.min.css
10. HTML and Javascript files (/js/main.js) are linted for errors via JSHint and HTMLLint
11. /js/modules/app.js and /js/plugins/bower.js are concatenated into /js/main.js
12. /js/main.js is being minified into /js/main.min.js
13. PNG/JPG Images in /assets/images/src are compressed (lightest compression) and copied into /images/ under the same structure
14. Base logo, favicon, iOS icons are copied to /images
15. A watch for changes function is launched

```
grunt staging
```

1. - Same as above
2. - Same as above
3. - Same as above
4. - Same as above
5. - Same as above
6. - Same as above
7. - Same as above
8. - Same as above
9. - Same as above
10. - Linting doesn't run on staging
11. - Same as above
12. - Same as above
13. - Same as above
14. - Same as above
15. - Watch doesn't run on staging

```
grunt production
```
Additional step: grunt clean is being run, deleting all dynamically generated files & paths including /bower_components

1. - Same as above
2. - Same as above
3. - Same as above
4. - Same as above
5. - Same as above
6. - Same as above
7. - Same as above
8. - Same as above
9. - Same as above
10. Linting doesn't run on production
11. - Same as above
12. - Same as above
13. Images are being compressed using the highest setting (this takes some time)
14. - Same as above
15. Watch doesn't run on production
16. Generates the critical CSS to be included in the head in /css/critical.css using devpage path specified in package.json


```
grunt clean
```
* Deletes all dynamically generated files & paths including /bower_components

```
grunt criticalcss
```
* Generates the critical CSS to be included in the head in /css/critical.css using devpage path specified in package.json

```
grunt test
```
* HTML and Javascript files (/js/main.js) are linted for errors via JSHint and HTMLLint

```
grunt bower
```
* Javascript, CSS, Stylus libraries are fetched into bower_components via bower install