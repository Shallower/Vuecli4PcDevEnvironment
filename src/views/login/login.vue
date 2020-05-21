<template>
  <div class="login-page">
    <div class="login-page-container">
      <div class="top">
        <div class="welcome">
          Welcome!
        </div>
        <div class="title">
          管理系统
        </div>
      </div>
      <template v-if="!tollLogin">
        <div class="bottom">
          <div class="line-button">
            <div
              @click="!loading ? login() : null"
              :class="{ loginActive: loginActive }"
              class="login"
            >
              <i v-if="loading" class="el-icon-loading" /> 立即登录
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      tollLogin: false, //收费员登录面板
      merCodeLogin: true, // 默认商户登录
      loginActive: false,
      userNameInputBox: {
        placeholder: "请输入用户名",
        errorText: "用户名不能为空",
        iconfont: "icon-yonghu",
        pattern: /^[a-zA-z][a-zA-Z0-9_-]{3,15}$/,
        errorText2: "请正确填写用户名"
      },
      passwordInputBox: {
        placeholder: "请输入密码",
        errorText: "密码不能为空",
        type: "password",
        iconfont: "icon-icon-mima",
        pattern: /^\w{4,15}$/,
        errorText2: "请正确输入密码"
      },
      merCodeInputBox: {
        placeholder: "请输入商户名",
        iconfont: "icon-icon-home",
        errorText: "请正确选择商户名"
      }
    };
  },
  created() {
    if (localStorage.getItem("phton_merCodeLogin")) {
      this.merCodeLogin = JSON.parse(
        localStorage.getItem("phton_merCodeLogin")
      );
    }
    this.tollLogin = this.$route.params.type === "toll";
  },
  methods: {
    /**
     * 登录
     */
    login() {
      if (this.$refs.inputGroup.validate()) {
        this.loading = true;
      }
    }
  },
  watch: {}
};
</script>

<style lang="scss">
.login-page {
  height: 100%;
  color: #5cdbff;
  background: url("~@/assets/loginBackground.png");
  padding-top: 28vh;
  .login-page-container {
    width: 350px;
    height: 500px;
    margin: 0 auto;
    .top {
      font-family: MicrosoftYaHeiLight;
      line-height: 1.5;
      text-align: center;
      .welcome {
        font-size: 26px;
      }
      .title {
        font-size: 34px;
        letter-spacing: 9px;
      }
    }
    .bottom {
      margin-top: 3vh;
      // border: 1px solid #5cdbff;
      border-radius: 10px;
      padding: 28px 38px 38px 38px;
      background: url("~@/assets/loginBottom.png");
      background-repeat: no-repeat;
      background-size: 96% 100%;
      &.bottom--large {
        background-size: 96% 103%;
      }
      .line-button {
        .login {
          color: rgba(92, 219, 255, 0.5);
          background-color: rgba(92, 219, 255, 0.1);
          border: 1px solid rgba(92, 219, 255, 0.5);
          padding: 10px;
          width: 260px;
          border-radius: 20px;
          text-align: center;
          user-select: none;
          cursor: pointer;
        }
        .loginActive {
          color: rgba(92, 219, 255, 1);
          border: 1px solid rgba(92, 219, 255, 1);
        }
      }
    }
  }
}
</style>
