const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/replay_info',
    createProxyMiddleware({
      //target: 'http://localhost:8080/replay_info',
      //target: 'https://learns2.joepringle.dev/replay_info',
      target: 'https://us-central1-learns2.cloudfunctions.net/replay_info',
      changeOrigin: true
    })
  );
};