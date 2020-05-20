<!--
 * @Descripttion: 内容窗口
 * @version: 
 * @Author: Hevin
 * @Date: 2020-05-20 18:04:54
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-20 18:14:53
--> 

<template>
  <section class="app-main">
    <transition name="fade"
      mode="out-in">
      <keep-alive>
        <router-view v-bind="attrs"
          v-if="$router.currentRoute.meta.keepAlive" />
      </keep-alive>
    </transition>
    <transition name="fade"
      mode="out-in">
      <router-view v-if="!$router.currentRoute.meta.keepAlive"
        v-bind="attrs" />
    </transition>
  </section>
</template>

<script>
export default {
  name: "app-main",
  data() {
    return {
      attrs: {}
    };
  },
  created() {
    let merCode = this.$store.getters.user.merCode;
    if (!this.$utils.isEmpty(merCode)) {
      this.attrs.merCode = merCode;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-main {
  height: 100%;
  margin-top: 50px;
}
</style>

