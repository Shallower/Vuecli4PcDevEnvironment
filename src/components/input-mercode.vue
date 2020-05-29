/* 
 * 登录页面的input-mercode模糊搜索组件
 * @Author: wu529778790 
 * @Date: 2018-04-25 09:42:10 
 * @Last Modified by: 389194069@qq.com
 * @Last Modified time: 2018-07-21 16:30:02
 */

<template>
  <div class="input-mercode"
    :class="{focus: isFocus}">
    <div class="i-box">
      <i class="iconfont"
        :class="inputBox.iconfont" />
      <div class="right-line">&nbsp;|</div>
    </div>
    <div class="input-box">
      <input :type="inputBox.type"
        @focus="focus"
        @blur="blur"
        v-model="selectItem.merName"
        @click="listsShow=true"
        @keyup.up="updown(--index)"
        @keyup.down="updown(++index)"
        @keyup.enter="selectMercode(lists[index])"
        @input="search"
        :placeholder="inputBox.placeholder"
        :disabled="disabled">
      <ul class="searchData"
        v-show="listsShow">
        <li v-for="(list, i) in lists"
          :class="{listhover: i === index}"
          @click="selectMercode(list, i)"
          :key="list.mercode">
          {{ list.merName }}
        </li>
      </ul>
    </div>
    <p class="error"
      v-if="errorTextShow">{{ inputBox.errorText }}</p>
  </div>
</template>
<script>
export default {
  name: 'input-mercode',
  data() {
    return {
      selectItem: {}, //选中项
      error: '',
      isFocus: false,
      errorTextShow: false,
      lists: [],
      listsShow: false,
      index: -1 // 上下键下彪
    }
  },
  props: {
    inputBox: {
      type: Object
    },
    /**
     * 是否禁用
     */
    disabled: Boolean,
    /**
     * 选择回调
     */
    onSelect: Function,
    value: '' //用来双向绑定 merCode
  },
  created() {
    this.selectItem = this.$utils.getLocalItem('phton_merchant') || {}
    if (
      !this.$utils.isEmpty(this.selectItem.merCode) &&
      !this.$utils.isEmpty(this.selectItem.merName)
    ) {
      this.$nextTick(
        () => this.onSelect && this.onSelect({ ...this.selectItem })
      )
    }
  },
  watch: {
    'selectItem.merCode': {
      handler(val) {
        this.$emit('input', val)
        if (!this.$utils.isEmpty(val)) {
          this.$utils.setLocalItem('phton_merchant', this.selectItem)
        }
      },
      deep: true
    }
  },
  methods: {
    focus() {
      this.isFocus = !this.isFocus
    },
    blur() {
      setTimeout(() => {
        this.listsShow = false
        this.isFocus = !this.isFocus
        this.errorTextShow = !(
          this.selectItem && !this.$utils.isEmpty(this.selectItem.merCode)
        )
      }, 200)
    },
    /**
     * 校验合法性
     * @param {Boolean} validOnly 仅校验，不提示
     */
    validate(validOnly) {
      if (this.$utils.isEmpty(this.value)) {
        if (!validOnly) {
          this.inputBox.errorTextShow = true
          this.error = this.inputBox.errorText
        }
        return false
      }
      if (this.inputBox.pattern) {
        if (this.inputBox.pattern.test(this.value)) {
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
    },
    /**
     * 模糊搜索
     */
    search() {
      this.index = -1
      this.selectItem.merCode = ''
      if (!this.$utils.isEmpty(this.selectItem.merName)) {
        this.axios('v1/merchant/queryMerchant2Login', {
          params: {
            keyword: this.selectItem.merName
          }
        }).then(res => {
          this.lists = res.list
          this.listsShow = true
        })
      }
    },
    selectMercode(list, i) {
      if (list) {
        this.index = i !== undefined ? i : this.index
        this.selectItem = list
        this.listsShow = false
        this.onSelect && this.onSelect(list)
      }
    },
    /**
      监听上下键
     */
    updown(i) {
      if (i >= this.lists.length) {
        i = 0
      } else if (i < 0) {
        i = this.lists.length - 1
      }
      this.index = i
      this.lists.length === 1 && this.selectMercode(this.lists[this.index])
    }
  }
}
</script>
<style lang="scss" scoped>
.input-mercode {
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
    i {
      position: relative;
      top: 1px;
    }
  }
  .input-box {
    position: relative;
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
    .searchData {
      margin: 0;
      border: 0;
      padding: 0;
      font: inherit;
      vertical-align: baseline;
      list-style: none;
      position: absolute;
      width: 215px;
      left: -17px;
      top: 36px;
      background-color: rgb(12, 21, 84);
      z-index: 200;
      li {
        margin: 0;
        font: inherit;
        vertical-align: baseline;
        padding: 7px 15px;
        border: 1px solid rgba(92, 219, 255, 0.5);
        cursor: pointer;
      }
      li + li {
        border-top: none;
      }
      .listhover,
      li:hover {
        border: 1px solid rgba(92, 219, 255, 1);
        color: rgba(92, 219, 255, 1);
      }
      li:last-child {
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
      }
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

