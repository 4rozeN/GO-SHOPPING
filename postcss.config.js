// postcss.config.js
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      // vw适配的标准屏的宽度，iPhoneX的宽度
      viewportWidth: 375
    }
  }
}
