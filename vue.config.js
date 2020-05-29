/*
 * @Descripttion:
 * @version:
 * @Author: 389194069@qq.com
 * @Date: 2019-08-19 10:32:25
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-20 17:16:30
 */
// vue.config.js 是一个可选的配置，也可以在package.json中使用vue来配置，那样就需要遵守更严格的json语法
const path = require("path");
// gzip压缩插件
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// const Timestamp = new Date().getTime()

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 baseUrl 为 /my-app/。
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",

  // outputDir: 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）
  outputDir: "dist",

  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: "assets",

  // 指定生成的 index.html 的输出路径  (打包之后，改变系统默认的index.html的文件名)
  // indexPath: "myIndex.html",

  // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变)
  filenameHashing: false,

  // lintOnSave：{ type:Boolean default:true } 问你是否使用eslint，这个值会在 @vue/cli-plugin-eslint 被安装之后生效
  lintOnSave: false,

  // 如果你想要在生产构建时禁用 eslint-loader，你可以用如下配置
  // lintOnSave: process.env.NODE_ENV !== 'production',

  // 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。(默认false)
  // runtimeCompiler: false,
  configureWebpack: config => {
    config.entry.app = ["./src/js/globalConfig.js", "./src/main.js"];
    // 插件引用
    let plugins = [
      // gZip压缩
      new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
        threshold: 10240,
        minRatio: 0.8
      })
      // 去除项目重的console
      // "transform-remove-console",
    ];
    // 根据NODE_ENV修改配置
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置
      // 生产环境输出文件名使用chunkhash
      config["output"]["filename"] = "[name].[chunkhash].js";
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = [
        "console.log"
      ];
      // 利用 splitChunks 单独打包第三方模块
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            common: {
              name: "chunk-common",
              chunks: "initial",
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 1,
              reuseExistingChunk: true,
              enforce: true
            },
            vendors: {
              name: "chunk-vendors",
              test: /[\\/]node_modules[\\/]/,
              chunks: "initial",
              priority: 2,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        }
      };
      // 插件安装
      config.plugins = [...config.plugins, ...plugins];
    } else if (process.env.NODE_ENV === "development") {
      // 为开发环境修改配置
      // 开发环境中热更新与chunkhash模式冲突，可以使用hash模式
      config["output"]["filename"] = "[name].[hash].js";
      config.devtool = "source-map";
    }

    // config['output']['chunkFilename'] = `[name].[hash].js`

    config.resolve.alias = {
      vue$: "vue/dist/vue.esm.js",
      "@": resolve("src"),
      "@c": path.resolve(__dirname, "./src/components"),
      "@p": path.resolve(__dirname, "./src/pages")
    };

    config.externals = {
      vue: "Vue",
      "element-ui": "ELEMENT",
      xlsx: "XLSX",
      "v-charts": "VeIndex",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios"
    };

    // 根据特定值来修改配置
    if (process.env.VUE_APP_ANALYZER === "true") {
      // 为分析环境修改配置
    }
  },

  // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例
  // 允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: config => {
    const cdn = {
      // 访问https://unpkg.com/element-ui/lib/theme-chalk/index.css获取最新版本
      css: [
        "//unpkg.com/element-ui@2.10.1/lib/theme-chalk/index.css",
        "https://cdn.jsdelivr.net/npm/v-charts/lib/style.min.css",
        "//at.alicdn.com/t/font_1850657_6w2uncj4fu9.css"
      ],
      js: [
        "https://cdn.jsdelivr.net/npm/@babel/polyfill@7.0.0-beta.49/dist/polyfill.min.js", //ie浏览器兼容
        "//unpkg.com/vue@2.6.10/dist/vue.min.js", // 访问https://unpkg.com/vue/dist/vue.min.js获取最新版本
        "//unpkg.com/vue-router@3.0.6/dist/vue-router.min.js",
        "//unpkg.com/vuex@3.1.1/dist/vuex.min.js",
        "//unpkg.com/axios@0.19.0/dist/axios.min.js",
        "//unpkg.com/element-ui@2.10.1/lib/index.js",
        "https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js",
        "https://cdn.jsdelivr.net/npm/v-charts/lib/index.min.js",
        "https://cdn.jsdelivr.net/npm/xlsx/jszip.min.js",
        "https://cdn.jsdelivr.net/npm/xlsx/xlsx.min.js"
      ]
    };
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin("html").tap(args => {
      // 修复 Lazy loading routes Error： Cyclic dependency
      args[0].chunksSortMode = "none";
      // html中添加cdn
      args[0].cdn = cdn;
      return args;
    });

    // 修复HMR
    config.resolve.symlinks(true);
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        // 修改它的选项...
        return options;
      });

    if (process.env.VUE_APP_ANALYZER === "true") {
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin).end;
    }
    // // 图片压缩处理
    // // 在某些版本的 OSX 上安装可能会因缺少 libpng 依赖项而引发错误。可以通过安装最新版本的 libpng 来解决，执行：brew install libpng
    // // 若需要安装brew，执行：/usr/bin/ruby -e "$(curl -fsSL https://cdn.jsdelivr.net/gh/ineo6/homebrew-install/install)"
    // if (process.env.NODE_ENV === "production") {
    //   config.module
    //     .rule("/.(gif|png|jpe?g|svg)$/i")
    //     .use("file-loader")
    //     .loader("image-webpack-loader")
    //     .options({
    //       mozjpeg: { progressive: true, quality: 65 },
    //       optipng: { enabled: false },
    //       pngquant: { quality: [0.65, 0.9], speed: 4 },
    //       gifsicle: { interlaced: false }
    //       // webp: { quality: 75 }
    //     });
    // }
  },
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  // 打包之后发现map文件过大，项目文件体积很大，设置为false就可以不输出map文件
  // map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
  // 有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
  productionSourceMap: false,

  // 它支持webPack-dev-server的所有选项
  devServer: {
    host: "localhost",
    port: 8000, // 端口号
    https: false, // https:{type:Boolean}
    open: false, // 配置自动启动浏览器

    proxy: {
      "/auth": {
        target: "http://192.168.1.208:9999",
        ws: false
        // changeOrigin: true,
        // pathRewrite: {
        //   '^/auth': '/auth'
        // }
        // // 后台返回的cookie设置了path，重写让代理也之后的路径也生效
        // cookiePathRewrite: {
        //   "/workplatform": "/api"
        // }
      }
    }
  }
};
