<!--
 * @Descripttion: 
 * @version: 
 * @Author: Hevin
 * @Date: 2020-05-18 14:14:20
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-21 18:12:14
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  created() {},
  beforeDestroy() {}
};
</script>

<style lang="scss">
@import "./styles/index.scss"; // 全局自定义的css样式
</style>
