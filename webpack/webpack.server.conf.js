const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const path = require('path')
const baseConfig = require('./webpack.base.conf')
const resolve = (src = '') => path.resolve(__dirname, './', src)

const config = merge(baseConfig, {
  entry: {
    app: ['./src/entry-server.js'],
  },
  target: 'node',
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    publicPath: '',
    path: resolve('./dist'),
    libraryTarget: 'commonjs2',
  },
  externals: nodeExternals({
    // 告诉webpack不要捆绑这些模块或其任何子模块
  }),
  plugins: [
    new VueSSRServerPlugin(),
  ]
})

module.exports = config
