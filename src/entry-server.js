import cookieUtils from 'cookie-parse'
import createApp from './index.js'
import createRouter from './router/router'
import createStore from './store/store'

export default context => {
  return new Promise((resolve, reject) => {
    const router = createRouter()
    const app = createApp({ router })
    const store = createStore({ context })
    const cookies = cookieUtils.parse(context.cookie || '')

    context.meta = app.$meta()

    // 设置服务器端 router 的位置
    router.push(context.url)
    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      if (!matchedComponents.length) {
        return reject(new Error('404'))
      }
      // 对所有匹配的路由组件调用 asyncData, 进行数据预取
      Promise.all(
        matchedComponents.map(({ asyncData }) => {
          asyncData && asyncData({
            store,
            route: router.currentRoute,
            cookies,
            context: {
              ...context,
            }
          })
        })
      ).then(() => {
        context.meta = app.$meta
        context.state = store.stack

        resolve(app)
      }).catch(reject)
    }, () => {
      reject(new Error('500 Server Error'))
    })
  })
}
