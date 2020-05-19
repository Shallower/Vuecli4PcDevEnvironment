# vuecli4

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### 项目构建环境

vue2.6.11
vue-cli4.3.1

### 架构依赖第三方库及优化

axios ——> 处理 ajax 请求，实现请求拦截，二次封装
mockjs ——> 数据拦截
clipboard ——> 实现粘贴复制功能，纯原声开发，不依赖其他库
countup ——> 让数字动起来，主要解决数字动画效果
dayjs ——> 日期生成及处理
file-saver ——> 在客户端保存文件的解决方案，非常适合需要生成文件，或者保存不应该发送到外部服务器的敏感信息的 web App
js-cookie ——> 提供 cookie 操作方法：set(),get(),remove()
nprogress ——> 进度条
image-webpack-loader ——> 生产环境构建时对图片压缩优化，依赖 libpng 库，不太容易安装
cssnano ——> 是 PostCSS 的 CSS 优化和分解插件。cssnano 采用格式很好的 CSS，并通过许多优化，以确保最终的生产环境尽可能小。
autoprefixer ——> 处理多浏览器样式兼容问题
compression-webpack-plugin ——> gzip 压缩
v-charts ——> 图表处理插件，依赖 echarts
xlsx ——> xlsx 文件读取
