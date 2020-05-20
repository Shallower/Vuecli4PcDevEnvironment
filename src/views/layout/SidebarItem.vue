<!--
 * @Descripttion: 内层侧边栏（具体菜单）
 * @version: 
 * @Author: Hevin
 * @Date: 2020-05-20 18:04:54
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-20 18:24:13
--> 

<template>
  <div class="menu-wrapper">
    <template v-for="item in routes">
      <el-menu-item v-if="isMenuItem(item)"
        :index="`${parentPath}/${item.path}`"
        :key="item.path">
        <i v-if="item.meta.icon"
          :class="item.meta.icon" />
        <span slot="title">{{ item.meta.title }}</span>
      </el-menu-item>
      <el-submenu :index="item.meta.title"
        v-if="isMenu(item)"
        :key="item.meta.title">
        <template slot="title">
          <i v-if="item.meta.icon"
            :class="item.meta.icon" />
          <span slot="title">{{ item.meta.title }}</span>
        </template>
        <template v-for="child in item.children">
          <template v-if="child.meta.menu">
            <sidebar-item v-if="isHasMenuItem(child)"
              style="padding-left: 13px;"
              :routes="[child]"
              :key="child.path"
              :parent-path="`${parentPath}/${item.path}`"
              :render-all="renderAll" />
            <el-menu-item v-else
              :index="`${parentPath}/${item.path}/${child.path}`"
              :key="child.path"
              style="padding-left: 53px;">
              <i v-if="child.meta.icon"
                :class="child.meta.icon" />
              <span slot="title">{{ child.meta.title }}</span>
            </el-menu-item>
          </template>

        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: "sidebar-item",
  props: {
    routes: {
      type: Array
    },
    parentPath: {
      type: String,
      default: ""
    },
    /**
     * 渲染全部
     */
    renderAll: Boolean
  },
  computed: {
    roles() {
      return this.$store.getters.roles;
    }
  },
  methods: {
    roleAllow(roles) {
      return !roles ? true : roles.some(role => this.roles.includes(role));
    },
    isMenuItem(item) {
      return item.meta.noDropDown
        ? true
        : this.renderAll
        ? !item.children || (item.children && item.children.length === 0)
        : item.meta.menu &&
          (!item.children || (item.children && item.children.length === 0)) &&
          this.roleAllow(item.meta.roles);
    },
    isMenu(item) {
      return this.renderAll
        ? !item.meta.noDropDown && item.children && item.children.length > 0
        : !item.meta.noDropDown &&
            item.meta.menu &&
            item.children &&
            item.children.length > 0 &&
            this.roleAllow(item.meta.roles);
    },
    isHasMenuItem(item) {
      return this.renderAll
        ? item.children && item.children.length > 0
        : item.children &&
            item.children.length > 0 &&
            item.children.some(child => child.meta.menu);
    }
  }
};
</script>
<style lang="scss">
// .el-submenu__title:focus,
// .el-submenu__title:hover {
//   background-color: rgba(218, 230, 255, 1);
// }
// .el-menu-item:focus,
// .el-menu-item:hover {
//   background-color: rgba(218, 230, 255, 1);
// }
// .el-submenu.is-active.is-opened {
//   .el-menu-item.is-active {
//     background-color: rgba(218, 230, 255, 0.5);
//   }
//   .el-menu-item:focus,
//   .el-menu-item:hover {
//     // background-color: rgba(218, 230, 255, 0.5);
//     background-color: red !important;
//   }
// }
</style>


