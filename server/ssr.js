// 将bundle渲染为字符串

import {createBundleRenderer} from 'vue-server-renderer';

class vuessr {
  constructor (base) {
    this.base = base
  }
  async render(context) {
    const renderer = await this.getRenderer()
    return new Promise((resolve, reject) => {
      // 获取到首次渲染的字符串
      renderer.renderToString(context, (err, html) => {
        if (err) {
          reject(err)
        } else {
          resolve(html)
        }
      })
    })
  }
  getRenderer () {
    return new Promise((resolve, reject) => {
      // 读取模板文件和之前通过构建生成的服务器端和客户端json文件
      const htmlPath = `${this.base}/index.html`
      const bundlePath = `${this.base}/vue-ssr-server-bundle.json`;
      const clientPath = `${this.base}/vue-ssr-client-manifest.json`;

      fs.stat(htmlPath, (statErr) => {
        if (!statErr) {
          fs.readFile(htmlPath, 'utf-8', (err, template) => {
            const bundle = require(bundlePath)
            const clientManifest = require(clientPath)
            // 生成renderer对象
            const renderer = createBundleRenderer(bundle, {
              template,
              clientManifest,
              runInNewContext: false,
              shouldPrefetch: () => {
                return false
              },
              shouldPreload: (file, type) => {
                return false
              },
            })
            resolve(renderer)
          })
        } else {
          reject(statErr)
        }
      })
    })
  }
}

let ssr = new vuessr(base)
export default ssr


