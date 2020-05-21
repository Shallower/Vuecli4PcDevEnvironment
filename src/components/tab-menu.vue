<!--
 * @Descripttion: TabMenu
 * @version: 1.0
 * @Author: Hevin
 * @Date: 2020-05-12 11:54:17
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-21 18:22:32
-->
<script>
import { mapGetters } from "vuex";
export default {
  name: "tab-menu",
  props: {
    parent: {
      type: Object,
      default: () => {
        return {
          path: "",
          fullPath: ""
        };
      }
    }
  },
  data() {
    return {
      openIndex: ""
    };
  },
  created() {
    window.addEventListener("click", this.closeMenu);
  },
  beforeDestroy() {
    window.removeEventListener("click", this.closeMenu);
  },
  computed: {
    ...mapGetters(["routes"]),
    menuRouters() {
      return this.filterRouters(this.routes);
    }
  },
  methods: {
    filterRouters(routes, path) {
      path = path ? `${path}${path.slice(-1) !== "/" ? "/" : ""}` : "";
      let children;
      for (let router of routes) {
        //遍历出 routes 中的路由
        if (!children) {
          if (`${path}${router.path}` === this.parent.path) {
            children = router.children;
          } else if (router.children) {
            children = this.filterRouters(
              router.children,
              `${path}${router.path}`
            );
          }
        }
      }
      return children; //当遍历出和 props 传入的 path fullpath 一样，返回。
    },
    isMenuItem(item) {
      return (
        item &&
        (item.meta.menu ||
          !item.children ||
          (item.children && item.children.length === 0))
      );
    },
    isMenu(item) {
      return item.children && !item.meta.menu && item.children.length > 0;
    },
    isHasMenuItem(item) {
      return item.children && item.children.length > 0;
    },
    renderSubMenuItem(parentPath, item, child) {
      return (
        <el-menu-item
          index={`${parentPath}${this.flatPath(item.path)}${this.flatPath(
            child.path
          )}`}
          key={child.path}
        >
          {child.meta.icon ? <i class={child.meta.icon} /> : ""}
          <span slot="title">{child.meta.title}</span>
        </el-menu-item>
      );
    },
    flatPath(path) {
      return path ? `${path.slice(0, 1) !== "/" ? "/" : ""}${path}` : "";
    },
    renderMenu(routes, parentPath) {
      parentPath = parentPath || this.parent.fullPath || "";
      return (
        routes &&
        routes.map(item =>
          this.isMenuItem(item) ? (
            <el-menu-item
              index={`${parentPath}${this.flatPath(item.path)}`}
              key={item.path}
            >
              {item.meta.icon ? <i class={item.meta.icon} /> : ""}
              <span slot="title">{item.meta.title}</span>
            </el-menu-item>
          ) : this.isMenu(item) ? (
            <el-submenu index={item.path} key={item.meta.title}>
              <template slot="title">
                {item.meta.icon ? <i class={item.meta.icon} /> : ""}
                <span slot="title">{item.meta.title}</span>
              </template>
              {item.children.map(child =>
                this.isHasMenuItem(child)
                  ? this.renderMenu(
                      [child],
                      `${parentPath}${this.flatPath(item.path)}`
                    )
                  : this.renderSubMenuItem(parentPath, item, child)
              )}
            </el-submenu>
          ) : (
            ""
          )
        )
      );
    },
    handleSelect(key, keyPath) {
      this.$router.replace(key);
    },
    handleOpen(key, keyPath) {
      this.openIndex = key;
    },
    closeMenu(e) {
      let targetClassName =
        e.target.className !== ""
          ? e.target.className
          : (e.target.offsetParent || {}).className;
      if (
        targetClassName &&
        !targetClassName.startWith("el-menu") &&
        !targetClassName.startWith("el-submenu")
      ) {
        this.$refs.tabMenu.close(this.openIndex);
      }
    }
  },
  render(h) {
    return (
      <el-menu
        ref="tabMenu"
        mode="horizontal"
        menu-trigger="click"
        unique-opened
        default-active={this.$route.path}
        onSelect={this.handleSelect}
        onOpen={this.handleOpen}
      >
        {this.renderMenu(this.menuRouters, this.parent.fullPath)}
      </el-menu>
    );
  }
};
</script>
