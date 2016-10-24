### 2.2.2

- update nunjucks to prevent XSS
- update express-winston to v2
- add node v5, v6 to travis.yml

### 2.2.1

- express version update

### 2.2.0

- logger updates
- add logger level config in config.json
- add multi api/proxy endpoints

### 2.1.3

- remove unused html attributes

### 2.1.2

- add tests
- add travis-ci
- bug fixes

### 2.1.1

- move all dist assets to `build` dir instead of putting the static assets in `public/build`

### 2.1.0

- gulp less/scss task typo fix, causing the gulp task to fail :(
- add consolidate.js to support multiple template engines

### 2.0.0

- replace gulp-minify-css with gulp-clean-css
- replace swig with nunjucks
- using sass by default

### 0.0.12

- [#4](https://github.com/JasonBoy/node-web-kit/issues/4) hotfix for swig tag error in layout.html

### 0.0.11

- #3 using minified html in prod mode

### 0.0.10

- add img url revision in css and html
- add html minification
- remove nodemon package
- other minor update

### 0.0.5

- add CORS support for api proxy, you can now simulate cors env while send cors requests
- bug fixes and improvements

### 0.0.2

- add node-web-kit framework
- using gulp and browserify as build tool
- using less as css preprocessor
- using express as MVC
- add proxy for api request
- _find out other features in code_
