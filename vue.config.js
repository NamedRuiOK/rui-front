const { defineConfig } = require('@vue/cli-service')

const apiTarget = process.env.VUE_APP_DEV_API_TARGET || 'http://localhost:6000'

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
