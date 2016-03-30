# node-web-kit
Node web starter kit for quick development,   
which uses express as router,   
and gulp as streaming build tool,  
and less for css,  
browserify to building js,
also supports proxy for your app's restful api  with the help of `request` module,  
and more will be added...

###Usage
```
npm install node-web-kit
cd node-web-kit
npm install  
gulp dev //for the first time 

```

other tasks: `gulp watch`, `gulp css`, `gulp js`, `gulp js.lib`, more in the `gulpfile.js` and `./gulp`

`npm start` to start the server

###Logs  
The logs will be put in `logs` folder

###config.json.sample 
This config file has couple configuration samples for your app, 
it will create create a `config.json` file while you using gulp or `npm start` automatically,
or you can just copy that by yourself.  
All the config can also be set in your environment variable, which has higher priority.

```
{
  "NODE_PORT": 3000, //server port
  "NODE_ENV": "development", //Node env, also could be development/dev, production/prod, add more as you wish
  "API_ENDPOINT": "127.0.0.1", //your proxy api endpoint
  "NODE_PROXY": true, //if you need to enable the api proxy
  "PROXY_PATH": "/api-proxy", //api proxy prefix, '/api/login' --> '/api-proxy/api/login' in your browser
  "PROXY_PROTOCOL": "http:",  //http/https
  "STATIC_ENDPOINT": "", //host for static assets, need other coding
}

```
   
###Production mode

Just run the `npm run prod ...` to simply start/reload the node server with PM2,  
`npm run prod -- moduleName instanceNumber start` ('start' needed only when moduleName is "all")  
default moduleName is "app"  
start/reload is only used when moduleName is "all", which will start all apps  
`npm run prod`, which will start/reload jifen app in maximum instances(cpu cores)   
`npm run prod -- app 2`, which will start/reload admin app with 2 instances enabled    
`npm run prod -- all 0 start`, which will start all apps with maximum(0 == maximum) instances,  
 "start" is only for the first time
`npm run prod -- all`, which will reload all apps,  
actually it just executes the `app.sh` file
or
create your own script if needed, but should follow the steps inside the app.sh