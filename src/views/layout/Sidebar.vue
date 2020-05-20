<!--
 * @Descripttion: 外层侧边栏
 * @version: 
 * @Author: Hevin
 * @Date: 2020-05-20 18:04:54
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-20 18:22:48
--> 
<template>
  <el-menu router
    unique-opened
    :default-active="$route.path"
    :collapse="isCollapse">
    <sidebar-item :routes="navRoutes" />
  </el-menu>
</template>


<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
export default {
  name: "sidebar",
  components: { SidebarItem },
  computed: {
    ...mapGetters(["routes", "sidebar"]),
    navRoutes() {
      let layoutRoute = this.routes.find(route => route.path === "/");
      return layoutRoute ? layoutRoute.children : [];
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
