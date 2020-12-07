const Koa = require('koa')
const server = new Koa()

const Vue = require('vue')
const renderer = require('vue-server-renderer').createRenderer()

const router = require('koa-router')()
const ssr = require('./ssr')

const app = new Vue({
  data: {
    msg: 'vue ssr',
  },
  template: '<div>{{msg}}</div>'
})

router.get('*', (ctx) => {
  // 将 Vue 渲染为 HTML 后返回
  renderer.renderToString(app, (err, html) => {
    if (err) throw err
    ctx.body = html
  })
})
server.use(router.routes()).use(router.allowedMethods())
server.use(ssr(server))
// 错误处理
app.on('error', (err, ctx) => {
  console.log('server error', err, ctx)
})
moudle.exports = server
