# node-web-kit

[![Building Status](https://travis-ci.org/JasonBoy/node-web-kit.svg?branch=master)](https://travis-ci.org/JasonBoy/node-web-kit) [![Dependency Status](https://david-dm.org/JasonBoy/node-web-kit.svg)](https://david-dm.org/JasonBoy/node-web-kit)

Node web starter kit for quick development,
which uses express as MVC,   
and gulp as streaming build tool,  
and less/sass for css, `css` task by default, which uses `scss`, change it to `less` for less files in related gulp files,  
browserify to building js,
also supports proxy for your app's restful api    

### Usage
```
npm install node-web-kit //or clone the project
cd ${path}/node-web-kit //go to the project root
npm install  
gulp dev //using gulp directly, you may need to install gulp globally

```

other tasks: `gulp watch`, `gulp css`, `gulp js`, `gulp js.lib`, more in the `gulpfile.js` and `./gulp`

`npm start` to start the server

### Logs  
The logs will be put in `logs` folder

### config.json.sample
__[NOTICE]Add Multi API Endpoints support, `API_ENDPOINT` has changed to `API_ENDPOINTS`, and other related properties removed__  
This config file has couple configuration samples for your app,
it will create create a `config.json` file while you using gulp or `npm start` automatically,
or you can just copy that by yourself.  
All the config can also be set in your environment variable, which has higher priority.

```javascript
{
  //server port  
  "NODE_PORT": 3000,   
  //Node env, also could be development/dev, production/prod, add more as you wish  
  "NODE_ENV": "development",
  //if you need to enable the api proxy  
  "NODE_PROXY": true, 
  //`request` debug level,
  //1: only use `request.debug = true`, 2: also add `request-debug`, default: no debug info.
  "PROXY_DEBUG_LEVEL": 1, 
  "STATIC_ENDPOINT": "", //host for static assets, need other coding
  "API_ENDPOINTS": {
    "/prefix": "http://localhost:3001", //: /prefix/api1/login --> http://localhost:3001/api1/login
    "/prefix2": "http://localhost:3002"
  }
}

```


### Template Engines
__Default template engine is [nunjucks](https://github.com/mozilla/nunjucks)__,   
Since we are using the [consolidate.js](https://github.com/tj/consolidate.js), you can use any template engine you want.

### Production Mode

__Make sure you set the `NODE_ENV=production` or set `NODE_ENV` to `prod` or `production` in `config.json`__  
And just run the `npm run prod ...` to simply start/reload the node server with PM2,  
`npm run prod -- moduleName instanceNumber skipInstall`
default moduleName is "app"  
`npm run prod`, which will start/reload app in maximum instances(cpu cores), default instance name is `app`   
`npm run prod -- app 2`, which will start/reload app with 2 instances enabled    
`npm run prod -- app 0 1`, which will start app with maximum(0 == maximum) instances, but skip 'npm install'
or
create your own script if needed

### License

The MIT License (MIT)

Copyright (c) 2016 jason

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
