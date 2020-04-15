const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(proxy('/platform', { target: 'http://beta.bi.scloud.gome.inc', changeOrigin: true  }));
  // add otherconfig like this
  // app.use(proxy('/other', { target: 'http://other.admin' }));
  app.use(proxy('/bi', { target: 'http://zhao-bi.com', changeOrigin: true }));
}
