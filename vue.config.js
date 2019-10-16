const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const APP_NAME = process.env.VUE_APP_NAME

module.exports = {
  publicPath: IS_PROD ? `/${APP_NAME}/` : '/',
  devServer: {
    open: false,
    host: '192.168.1.27',
    port: 80,
    https: false,
    hotOnly: false,
    proxy: {
      [`/${APP_NAME}`]: {
        target: 'http://192.168.1.117',
        pathRewrite: { [`^/${APP_NAME}`]: `/${APP_NAME}` }
      }
    }
  }
}
