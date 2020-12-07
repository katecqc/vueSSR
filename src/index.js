import Vue from 'vue'
import App from './App.vue'
const Meta = require('vue-meta')

Vue.use(Meta)

export default function createApp({ router }) {
  const app = new Vue({
    router,
    render: h => h(App),
  })
  return app
}
