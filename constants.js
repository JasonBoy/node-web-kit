
exports.corsConfig = {
  origin: {
    key: 'Access-Control-Allow-Origin',
    value: '*'
  },
  method: {
    req: 'Access-Control-Request-Method',
    res: 'Access-Control-Allow-Methods',
    value: 'GET,POST,PUT,DELETE'
  },
  header: {
    req: 'Access-Control-Request-Headers',
    res: 'Access-Control-Allow-Headers',
    value: 'Accept, X-Auth-Token, Content-Type'
  },
  credentials: {
    key: 'Access-Control-Allow-Credentials',
    value: true
  },
  cache: {
    key: 'Access-Control-Max-Age',
    value: 604800 //seconds
  }
};
