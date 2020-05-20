/*
 * @Descripttion:全局配置
 * @version:
 * @Author: Hevin
 * @Date: 2020-05-20 15:41:15
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-20 16:36:50
 */

(function(window) {
  var global = {
    /**
     * 全局配置类
     */
    globalConfig: {},
    /**
     * 日志配置
     */
    logConfig() {
      if (this.globalConfig.console) {
        console.log(
          "%cNow You Can Console Log...",
          "color:red;font-size:18px;font-style:oblique;"
        );
      } else {
        console.log = function() {
          return false;
        };
        console.error = function() {
          return false;
        };
      }
    },
    /**
     * 初始化配置
     */
    initConfig() {
      this.globalConfig[
        process.env.NODE_ENV === "development" ? "debug" : process.env.NODE_ENV
      ] = true;

      const console =
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "sit";
      console && (this.globalConfig.console = console);
      this.logConfig();
    }
  };
  global.initConfig();
  window.$globalConfig = global.globalConfig;
})(window);
