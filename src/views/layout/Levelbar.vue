<!--
 * @Descripttion: 快捷导航
 * @version: 
 * @Author: Hevin
 * @Date: 2020-05-20 18:04:54
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-20 18:19:58
--> 

<template>
  <el-breadcrumb class="app-levelbar"
    separator="/">
    <el-breadcrumb-item v-for="(item,index)  in levelList"
      :key="item.fullPath">
      <span v-if="noRedirect(item,index)"
        class="none-redirect">{{ item.meta.title }}</span>
      <router-link v-else
        :to="item | redirect">{{ item.meta.title }}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "levelbar",
  created() {
    this.getBreadcrumb();
  },
  data() {
    return {
      levelList: null
    };
  },
  filters: {
    redirect(item) {
      return item.redirect || item.fullPath || item.path;
    }
  },
  methods: {
    noRedirect(item, index) {
      return (
        index === this.levelList.length - 1 ||
        (item.meta || {}).noredirect === true
      );
    },
    formatParams(path) {
      this.$utils.forEach(this.$route.params || {}, (value, key) => {
        path = this.$utils.replaceAll(path, `:${key}`, value);
        path = this.$utils.replaceAll(path, `:${key}?`, value);
      });
      return path;
    },
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.meta.title);
      const first = matched[0];
      if (first && (first.name !== "homePage" || first.path !== "")) {
        matched = [{ meta: { title: "首页" }, path: "/" }].concat(matched);
      }
      let matchRouters = [];
      matched.forEach(match => {
        matchRouters.push({
          redirect: match.redirect,
          path: this.formatParams(match.path),
          fullPath: match.fullPath,
          meta: match.meta
        });
      });
      this.levelList = matchRouters;
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-levelbar.el-breadcrumb {
  display: inline-block;
  line-height: 50px;
  margin-left: 10px;
  .none-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
