const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyTarget = process.env.npm_config_api_url || 'http://localhost:9000';

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: proxyTarget,
      changeOrigin: true,
      secure: false
    })
  );
};