const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api/analysis',
    createProxyMiddleware({
      target: 'https://us-central1-learns2.cloudfunctions.net/user_upload_replay',
      //target: 'https://learns2.joepringle.dev/api/analysis', why can't i use this
      //target: 'http://localhost:8080/user_upload_replay',
      changeOrigin: true
    })
  );
};