const proxy = require('http-proxy-middleware')

//开发环境NODE代理服务器设置
module.exports = function (app) {
  app.use(
    proxy('/dev', {
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: { '^/dev': '' },
    })
  )
}
