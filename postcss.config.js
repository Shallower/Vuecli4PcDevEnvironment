/*
 * @Descripttion: 
 * @version: 
 * @Author: 389194069@qq.com
 * @Date: 2019-09-13 15:14:12
 * @LastEditors: 389194069@qq.com
 * @LastEditTime: 2019-11-04 10:42:52
 */
// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = {
  // syntax: 'postcss-scss',
  parser: 'postcss-scss',
  // plugins: {
  //   // to edit target browsers: use "browserlist" field in package.json
  //   autoprefixer: {},
  //   'postcss-flexibility': {},
  //   'postcss-purgecss': {
  //     content: [
  //       "./**/*.vue"
  //     ]
  //   }
  // },
  plugins: [
    require('cssnano')({
      preset: 'default'
    }),
    require('postcss-purgecss')({
      content: [
        './src/**/*.vue',
        './layouts/**/*.vue',
        './components/**/*.vue',
        './views/**/*.vue'
      ],
      extractors: [
        {
          extractor: class Extractor {
            static extract(content) {
              const validSection = content.replace(
                /<style([\s\S]*?)<\/style>+/gim,
                ''
              );
              return (
                validSection.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
              );
            }
          },
          extensions: ['html', 'vue']
        }
      ],
      whitelist: ['html', 'body'],
      whitelistPatterns: [
        /el-.*/,
        /-(leave|enter|appear)(|-(to|from|active))$/,
        /^(?!cursor-move).+-move$/,
        /^router-link(|-exact)-active$/
      ],
      whitelistPatternsChildren: [/^token/, /^pre/, /^code/]
    }),
    require('autoprefixer')(),
    require('postcss-flexibility')()
    // require('postcss-px-to-viewport')({
    //     viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750 
    //     viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置 
    //     unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除） 
    //     viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw 
    //     selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名 
    //     minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值 
    //     mediaQuery: false // 允许在媒体查询中转换`px`
    // })
  ]
}
