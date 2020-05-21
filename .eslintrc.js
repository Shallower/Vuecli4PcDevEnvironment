/*
 * @Descripttion:
 * @version:
 * @Author: Hevin
 * @Date: 2020-05-19 18:02:17
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-21 16:34:16
 */

module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    document: true,
    localStorage: true,
    window: true,
    $globalConfig: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
