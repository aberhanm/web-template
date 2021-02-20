const Config = require('./config')
const path = require('path')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const WebPath = Config.publicPath
process.env.PORT = Config.port

const proxy = {}

proxy[Config.apiPath] = {
  target: Config.proxyTarget,
  ws: true,
  changeOrigin: true,
}

const VueConfig = {
  pages: {
    index: 'src/main.ts'
  },
  publicPath: WebPath,
  devServer: {
    proxy: proxy
  },
  chainWebpack: config => {
    /** @description 将 $types 假如快捷路径 */
    config.resolve.alias.set('$types',  path.resolve(__dirname, './types'))

    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('extract-css')
        .tap(args => {
          args[0].ignoreOrder = true
          return args
        })
      config
        .plugin('hard-source')
        .use(HardSourceWebpackPlugin)
    }
  }
}

module.exports = VueConfig
