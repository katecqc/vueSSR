const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const merge = require('webpack-merge')
const UglifyJs = require('uglify-js')
const webpack = require('webpack')
const baseConfig = require('./webpack.base.conf')
const UploadPlugin = require('@q/hj-webpack-upload') // 将首次加载和按需加载的资源上传到cdn（在开源基础上二次开发）
const path = require('path') // 将首次加载和按需加载的资源上传到cdn（在开源基础上二次开发）
const resolve = (src = '') => path.resolve(__dirname, './', src)

const config = merge(baseConfig, {
  ...baseConfig,
  entry: {
    app: ['./src/entry-client.js'],
  },
  target: 'web',
  output: {
    filename: '[name].js',
    path: resolve('./dist'),
    publicPath: '',
    libraryTarget: 'var',
  },
  plugins: [
    new VueSSRClientPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new UploadPlugin(cdn, {
      enableCache: true, // 缓存文件
      logLocal: false,
      src: path.resolve(__dirname, '..', Source.output),
      dist: path.resolve(__dirname, '..', Source.output),
      beforeUpload: (context, location) => {
        if (path.extname(location) === '.js') {
          return UglifyJs.minify(content, {
            compress: true,
            toplevel: true,
          }).code
        }
        return content
      },
      compilerHooks: 'done',
      onError(e) {
        console.log(e)
      }
    })
  ]
})

module.exports = config
