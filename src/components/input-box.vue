/* 
 * 登录页面的input组件，focus改变css，blur校验
 * @Author: wu529778790 
 * @Date: 2018-04-25 09:42:10 
 * @Last Modified by: 389194069@qq.com
 * @Last Modified time: 2018-07-21 16:30:10
 */

<template>
  <div class="line-box"
    :class="{focus: isFocus}">
    <div class="i-box">
      <i class="iconfont"
        :class="inputBox.iconfont" />
      <div class="right-line">&nbsp;|</div>
    </div>
    <div class="input-box">
      <input v-if="isInputPassword"
        :type="inputBox.type"
        v-bind="$attrs"
        @focus="focus"
        @blur="blur"
        v-model="input"
        :placeholder="inputBox.placeholder"
        :disabled="disabled"
        onpaste="return false"
        oncontextmenu="return false"
        oncopy="return false"
        oncut="return false">
      <input v-else
        :type="inputBox.type"
        v-bind="$attrs"
        @focus="focus"
        @blur="blur"
        v-model="input"
        :placeholder="inputBox.placeholder"
        :disabled="disabled">
    </div>
      <p class="error"
        v-show="inputBox.errorTextShow">{{ error }}</p>
    </div>
</template>
<script>
export default {
  name: 'input-box',
  data() {
    return {
      input: '',
      error: '',
      isFocus: false,
      errorTextShow: false
    }
  },
  props: {
    inputBox: {
      type: Object
    },
    value: '',
    /**
     * 是否禁用
     */
    disabled: Boolean
  },
  mounted() {
    this.input = this.value
  },
  watch: {
    value(newVal) {
      this.input = newVal
    },
    input(newVal) {
      this.$emit('input', newVal)
    }
  },
  computed: {
    isInputPassword() {
      return this.inputBox && this.inputBox.type === 'password'
    }
  },
  methods: {
    focus() {
      this.isFocus = !this.isFocus
    },
    blur() {
      this.isFocus = !this.isFocus
      this.validate()
    },
    /**
     * 校验合法性
     * @param {Boolean} validOnly 仅校验，不提示
     */
    validate(validOnly) {
      if (this.$utils.isEmpty(this.input)) {
        if (!validOnly) {
          this.inputBox.errorTextShow = true
          this.error = this.inputBox.errorText
        }
        return false
      }
      if (this.inputBox.pattern) {
        if (this.inputBox.pattern.test(this.input)) {
          this.inputBox.errorTextShow = false
        } else {
          if (!validOnly) {
            this.inputBox.errorTextShow = true
            this.error = this.inputBox.errorText2
          }
          return false
        }
      }
      return true
    },
    /**
     * 清楚校验结果
     */
    clearValidate() {
      this.errorTextShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
.line-box {
  border: 1px solid rgba(92, 219, 255, 0.5);
  width: 260px;
  height: 38px;
  border-radius: 10px;
  margin-bottom: 30px;
  .i-box,
  .input-box {
    display: inline-block;
    color: rgba(92, 219, 255, 0.5);
    input {
      position: relative;
      top: 1px;
    }
  }
  .i-box {
    padding: 10px;
    .right-line {
      display: inline-block;
      position: relative;
      top: -1px;
    }
  }
  .input-box {
    input {
      background-color: transparent;
      border: none;
      width: 200px;
      padding: 8px;
      padding-left: 0;
      color: #5cdbff;
      letter-spacing: 2px;
    }
    input:focus {
      outline: none;
    }
    input::-webkit-input-placeholder {
      color: rgba(92, 219, 255, 0.5);
    }
  }
  .error {
    margin: 0;
    border: 0;
    font: inherit;
    vertical-align: baseline;
    color: rgba(255, 0, 0, 1);
    padding: 8px 0 0 5px;
    font-size: 12px;
    font-weight: 240;
  }
}
.focus {
  border: 1px solid rgba(92, 219, 255, 1);
}
</style>

