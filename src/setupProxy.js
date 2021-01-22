const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    proxy('/dev', {
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: { '^/dev': '' },
    })
  )
}
