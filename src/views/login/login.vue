<template>
  <div class="login-page">
    <div class="login-page-container">
      <div class="top">
        <div class="welcome">
          Welcome!
        </div>
        <div class="title">
          管理系统实例
        </div>
      </div>
        <div class="bottom">
          <input-group ref="inputGroup">
            <input-box :input-box="userNameInputBox"
              class="loginName"
              v-model="loginForm.loginName"
              :disabled="loading" />
            <input-box :input-box="passwordInputBox"
              class="password"
              @keyup.enter.native="login"
              v-model="loginForm.password"
              :disabled="loading" />
          </input-group>
          <div class="line-button">
            <div @click="!loading ? login() : null"
              :class="{'loginActive': loginActive}"
              class="login">
              <i v-if="loading"
                class="el-icon-loading" /> 立即登录
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import { InputGroup, InputBox, InputSelect, InputMercode } from "@/components";
export default {
  data() {
    return {
      loading: false,
      loginForm: {
        loginName: "",
        password: "",
        merCode: ""
      },
      loginActive: false,
      userInfo: {
        merCode: "",
        merName: "",
        token: ""
      },
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
        iconfont: "icon-mima",
        pattern: /^\w{4,15}$/,
        errorText2: "请正确输入密码"
      }
    };
  },
  created() {},
  methods: {
    /**
     * 登录
     */
    login() {
      if (this.$refs.inputGroup.validate()) {
        this.loading = true;
        let result;
          result = this.axios.post("v1/login/operatorLogin", {
            loginName: this.loginForm.loginName,
            password: this.loginForm.password
          });
        !result && (this.loading = false);
        result &&
          result
            .then(response => {
                this.loading = false;
                response.loginName = this.loginForm.loginName;
            //   let roles = (response.roleIds || "").split(",");
            //   登录赋值
                response.optorCode = response.merCode;
                response.merCode = "";
                this.userInfo = Object.assign(this.userInfo, response);
                this.$store.dispatch("updateUser", this.userInfo);
                this.$store.dispatch("initSocket");
                let path = "/";
                this.$router.replace({
                    path: this.$route.query.redirect ? this.$route.query.redirect : path,
                    query: { from: "login" }
                });
            })
            .catch(error => (this.loading = false));
      }
    },
  },
  watch: {
    $route(to, from) {
    },
    loginForm: {
      handler(newVal) {
        this.$nextTick(() => {
          this.loginActive = this.$refs.inputGroup
            ? this.$refs.inputGroup.validate(true)
            : false;
        });
      },
      deep: true
    }
  },
  components: {
    InputBox,
    InputGroup,
    InputMercode,
    InputSelect
  }
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
      .loginName,
      .password {
        .i-box {
          .iconfont {
            position: relative;
            top: 1px;
          }
        }
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
    .toggle {
      float: right;
      padding-right: 40px;
      color: rgba(92, 219, 255, 0.5);
      cursor: pointer;
      user-select: none;
      &--left {
        @extend .toggle;
        float: none;
        padding-left: 20px;
        display: inline-block;
      }
    }
  }
}
</style>


