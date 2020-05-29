<!--
 * @Descripttion: 右侧布局
 * @version: 
 * @Author: Hevin
 * @Date: 2020-05-20 18:04:54
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-20 18:19:41
--> 
<template>
  <div class="app-wrapper"
    :class="{hideSidebar:!sidebar.opened}"
    v-if="!$utils.isEmptyObject(user)">
    <div class="top-logo">
      <router-link to="/">
        <img src="@/assets/logo.png">
      </router-link>
      <div class="top-info">
        <div class="user">
          <el-dropdown class="avatar-container"
            trigger="click">
            <div class="avatar-wrapper">
              <span class="user-name">
                {{ user.userName || user.loginName }}
              </span>
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu class="user-dropdown"
              slot="dropdown">
              <!-- <router-link class="inline-block"
                to="/">
                <el-dropdown-item>
                  首页
                </el-dropdown-item>
              </router-link> -->
              <!-- <router-link class="inline-block"
                to="/user">
                <el-dropdown-item>
                  用户信息
                </el-dropdown-item>
              </router-link>
              <router-link class="inline-block"
                to="/">
                <el-dropdown-item>
                  帮助中心
                </el-dropdown-item>
              </router-link> -->
              <!-- <el-dropdown-item @click.native="$refs.roleInfo.open()">
                <span style="display:block;">用户信息</span>
              </el-dropdown-item> -->
              <el-dropdown-item @click.native="logout">
                <span style="display:block;">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div>
            <i class="iconfont icon-yonghu" />
          </div>
        </div>
        <div class="system-info">
          <div class="label">系统消息</div>
          <!-- <div>
            <i class="iconfont icon-xiaoxi" />
          </div> -->
          <el-badge :is-dot="tips !== ''">
            <i class="iconfont icon-xiaoxi" />
          </el-badge>
        </div>
        <div class="title-info">
          <div class="label">
            {{ $utils.get(user, 'parkInfo.parkName', '') }}
          </div>
        </div>
        <div class="title-info">
          <div class="label">
            {{ time }}
          </div>
        </div>
      </div>
    </div>
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <navbar v-if="!hideNavbar" />
      <app-main :style="hideNavbar ? {marginTop: 0} : {}" />
    </div>
    <x-dialog ref="roleInfo"
      title="角色信息"
      width="35%"
      hide-footer>
      <el-form class="page-form-content"
        label-width="100px">
        <el-form-item label="姓名">
          <el-input :value="user.userName"
            disabled />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input :value="user.loginName"
            disabled />
        </el-form-item>
        <el-form-item v-if="!$utils.isEmpty(user.phone)"
          label="联系方式">
          <el-input :value="user.phone"
            disabled />
        </el-form-item>
        <el-form-item label="角色">
          <el-input :value="roleContent"
            disabled />
        </el-form-item>
        <el-form-item label="登录时间">
          <el-input :value="user.loginTime"
            disabled />
        </el-form-item>
      </el-form>
    </x-dialog>
  </div>
</template>

<script>
import Navbar from "@/views/layout/Navbar";
import Sidebar from "@/views/layout/Sidebar";
import AppMain from "@/views/layout/AppMain";

export default {
  data() {
    return {
      tips: "",
      time: "",
      timeInterval: null
    };
  },
  name: "layout",
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  created() {
    this.destroyClock();
    this.timeInterval = setInterval(
      () =>
        (this.time = this.$utils.formatDateTime(
          Date.now(),
          "yyyy年MM月dd日 hh:mm:ss"
        )),
      0
    );
  },
  computed: {
    sidebar() {
      return this.$store.getters.sidebar;
    },
    user() {
      return this.$store.getters.user;
    },
    roleContent() {
      let roles = [];
      this.$store.getters.roles.forEach(item => {
        // eslint-disable-next-line no-unused-vars
        this.$utils.forEach(this.RoleType, (value, key) => {
          if (this.$utils.is("Object", value)) {
            roles = roles.concat(
              value.options.filter(opt => String(opt.code) === String(item))
            );
          }
        });
      });
      return roles.map(rl => rl.label).join();
    },
    hideNavbar() {
      return this.$route.meta.hideNavbar === true;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.replace("/login");
    //   this.axios.get("v1/login/updateLogoutTime", {
    //     params: { token: this.$store.getters.token },
    //     silence: true
    //   });
    //   window.location.reload();
    },
    destroyClock() {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
  },
  errorCaptured() {
    this.destroyClock();
  },
  beforeDestroy() {
    this.destroyClock();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.hideSidebar {
    .sidebar-container {
      width: 64px;
      overflow: hidden;
    }
    .main-container {
      margin-left: 64px;
    }
  }
  .top-logo {
    background-color: rgba(14, 24, 64, 1);
    height: 70px;
    position: fixed;
    width: 100%;
    z-index: 1000;
    img {
      margin-top: 6px;
      margin-left: 20px;
    }
    .top-info {
      position: absolute;
      right: 30px;
      top: 24px;
      color: #ffffff;
      .system-info,
      .title-info,
      .user {
        float: right;
        div {
          float: right;
          i {
            color: #4095de;
            font-size: 21px;
            margin: 5px;
          }
        }
        .label {
          font-size: 14px;
          margin: 5px;
        }
      }
      .title-info {
        padding-right: 30px;
        .title-download {
          border-color: #e9e9e9 !important;
          border: 1px solid transparent;
          display: inline-block;
          vertical-align: middle;
          width: 100px;
          height: 34px;
          text-align: center;
          line-height: 30px;
          border-radius: 30px;
          position: relative;
          bottom: 8px;
          .icon-zhucedenglushoujihao {
            color: white;
            margin: 0;
            font-size: 18px;
          }
        }
      }
    }
    .avatar-wrapper {
      .user-name {
        color: white;
        position: relative;
        top: -4px;
      }
      i {
        position: relative;
        top: -3px;
      }
    }
  }
  .sidebar-container {
    overflow-x: hidden;
    width: 200px;
    // height: 100%;
    height: calc(100% - 70px);
    min-height: calc(100% - 70px);
    position: fixed;
    top: 70px;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .main-container {
    height: calc(100% - 50px);
    padding-top: 70px;
    transition: margin-left 0.28s ease-out;
    margin-left: 200px;
  }
}
</style>
