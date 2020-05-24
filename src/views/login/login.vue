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
      <template v-if="!tollLogin">
        <div class="bottom">
          <input-group ref="inputGroup">
            <!-- <input-mercode :input-box="merCodeInputBox"
              v-model="loginForm.merCode"
              v-if="merCodeLogin"
              :disabled="loading"
              :on-select="onMerSelect" /> -->
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
        <!-- <div class="toggle--left"
          @click="!loading ? 
              (loginForm.loginName = '',loginForm.password = '',
                  tollLogin = !tollLogin) : null">
          收费员登录
        </div> -->
        <div class="toggle--left"
          @click="loginToll">
          收费员登录
        </div>
        <div class="toggle"
          @click="!loading ? merCodeLogin = !merCodeLogin : null">
          {{ merCodeLogin ? '转至运营商登录' : '转至商户登录' }}
        </div>
      </template>
      <template v-else>
        <div class="bottom bottom--large">
          <input-group ref="inputGroup">
            <input-mercode :input-box="merCodeInputBox"
              v-model="loginForm.merCode"
              :disabled="loading"
              :on-select="onMerSelect" />
            <input-box :input-box="userNameInputBox"
              class="loginName"
              v-model="loginForm.loginName"
              :disabled="loading" />
            <input-box :input-box="passwordInputBox"
              class="password"
              v-model="loginForm.password"
              @keyup.enter.native="login"
              :disabled="loading" />
            <input-select v-model="userInfo.parkInfo.parkCode"
              auto-select
              :cache="false"
              iconfont="icon-parkinglot"
              :rule="{
                test: value => 
                  value !== null && value !== undefined && /\S+/.test(value),
                message: '请选择停车场'
              }"
              :data-url="!$utils.isEmpty(loginForm.merCode) && 
                        !$utils.isEmpty(loginForm.loginName) ? 
                    'v1/parking/queryParkPullDownListByLoginName' : 
                    ''"
              :url-param="{
                merCode: loginForm.merCode,
                loginName: loginForm.loginName
              }"
              result-key="list"
              label-key="parkName"
              value-key="parkCode"
              placeholder="请选择停车场"
              @keyup.enter.native="login"
              :on-select="onParkSelect"
              :disabled="loading" />
            <input-select v-model="userInfo.parkInfo.gwCode"
              auto-select
              iconfont="icon-chukou"
              :data-url="!$utils.isEmpty(userInfo.parkInfo.parkCode) ? 
                    'v1/areaGw/findAreaGwByParkCode' : 
                    ''"
              :url-param="{
                parkCode:'',
                gwType:''
              }"
              result-key="dropdownBox"
              label-key="name"
              value-key="code"
              placeholder="请选择出口"
              @keyup.enter.native="login"
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
        <!-- <div class="toggle--left"
          @click="!loading ? tollLogin = !tollLogin : null">
          返回
        </div> -->
        <div class="toggle--left"
          @click="back">
          返回
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { InputGroup, InputBox, InputSelect, InputMercode } from '@/components'
export default {
  data() {
    return {
      loading: false,
      loginForm: {
        loginName: '',
        password: '',
        merCode: ''
      },
      tollLogin: false, //收费员登录面板
      merCodeLogin: true, // 默认商户登录
      loginActive: false,
      userInfo: {
        merCode: '',
        merName: '',
        token: '',
        parkInfo: {
          parkCode: '',
          parkName: '',
          gwType: '',
          gwCode: ''
        }
      },
      userNameInputBox: {
        placeholder: '请输入用户名',
        errorText: '用户名不能为空',
        iconfont: 'icon-yonghu',
        pattern: /^[a-zA-z][a-zA-Z0-9_-]{3,15}$/,
        errorText2: '请正确填写用户名'
      },
      passwordInputBox: {
        placeholder: '请输入密码',
        errorText: '密码不能为空',
        type: 'password',
        iconfont: 'icon-icon-mima',
        pattern: /^\w{4,15}$/,
        errorText2: '请正确输入密码'
      },
      merCodeInputBox: {
        placeholder: '请输入商户名',
        iconfont: 'icon-icon-home',
        errorText: '请正确选择商户名'
      }
    }
  },
  created() {
    if (localStorage.getItem('phton_merCodeLogin')) {
      this.merCodeLogin = JSON.parse(
        localStorage.getItem('phton_merCodeLogin')
      )
    }
    this.tollLogin = this.$route.params.type === 'toll'
  },
  methods: {
    /**
     * 跳转收费员登录
     */
    loginToll() {
      if (!this.loading) {
        //解决闸机 websocket ip+端口的模式在 wss 协议下不可用问题
        location.href = `http://${location.host}/#/login/toll`
      }
    },
    /**
     * 返回
     */
    back() {
      if (!this.loading) {
        history.back()
      }
    },
    /**
     * 商户选择回调
     */
    onMerSelect(merchant) {
      this.userInfo.merName = merchant.merName || {}
    },
    /**
     * 登录
     */
    login() {
      if (this.$refs.inputGroup.validate()) {
        this.loading = true
        let result
        if (this.tollLogin) {
          result = this.axios.post('v1/login/sentryBoxTollLogin', {
            ...this.loginForm,
            parkCode: this.userInfo.parkInfo.parkCode
          }) // 收费员登录
        } else if (this.merCodeLogin) {
          result = this.axios.post('v1/login/merchantLogin', this.loginForm) // 商户登录
        } else {
          result = this.axios.post('v1/login/operatorLogin', {
            // 运营商登录
            loginName: this.loginForm.loginName,
            password: this.loginForm.password
          })
        }
        !result && (this.loading = false)
        result &&
          result
            .then(response => {
              this.loading = false
              localStorage.setItem('phton_merCodeLogin', this.merCodeLogin) // 登陆成功缓存登录模式(是运营商还是商户)
              response.loginName = this.loginForm.loginName
              let roles = (response.roleIds || '').split(',')
              if (
                roles.every(role => role.startWith('2')) &&
                !this.merCodeLogin
              ) {
                //运营商登录
                response.optorCode = response.merCode
                response.merCode = ''
              }
              if (roles.includes(this.RoleType.ParkMerSentryBoxToll)) {
                this.userInfo = Object.assign(this.userInfo, response)
                this.redirect(this.userInfo, roles)
              } else {
                response.merName = this.$utils.isEmpty(response.merName) ?
                  this.userInfo.merName :
                  response.merName
                this.redirect(response, roles)
              }
            })
            .catch(error => (this.loading = false))
      }
    },
    /**
     * 停车场选择回调
     */
    onParkSelect(park) {
      this.userInfo.parkInfo.parkCode = park.parkCode
      this.userInfo.parkInfo.parkName = park.parkName
    },
    /**
     * 重定向
     */
    redirect(userInfo, roles = []) {
      this.$store.dispatch('updateUser', userInfo)
      this.$store.dispatch('initSocket')
      let path = '/'
      if (Array.isArray(roles)) {
        if (
          roles.some(
            role =>
              String(role) === this.RoleType.ParkMerAdmin ||
              String(role) === this.RoleType.ParkMerCfg
          ) &&
          this.$utils.isEmpty(this.$utils.get(userInfo, 'parkInfo.parkCode'))
        ) {
          path = 'property/parking'
        } else if (roles.includes(this.RoleType.ParkMerSentryBoxToll)) {
          path = '/merchant/console'
        }
      }
      this.$router.replace({
        path: this.$route.query.redirect ? this.$route.query.redirect : path,
        query: { from: 'login' }
      })
    }
  },
  watch: {
    $route(to, from) {
      this.tollLogin = this.$route.params.type === 'toll'
    },
    loginForm: {
      handler(newVal) {
        this.$nextTick(() => {
          this.loginActive = this.$refs.inputGroup ?
            this.$refs.inputGroup.validate(true) :
            false
        })
      },
      deep: true
    },
    'userInfo.parkInfo': {
      handler(newVal) {
        this.$nextTick(() => {
          this.loginActive = this.$refs.inputGroup ?
            this.$refs.inputGroup.validate(true) :
            false
        })
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
}
</script>

<style lang="scss">
.login-page {
  height: 100%;
  color: #5cdbff;
  background: url('~@/assets/loginBackground.png');
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
      background: url('~@/assets/loginBottom.png');
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


