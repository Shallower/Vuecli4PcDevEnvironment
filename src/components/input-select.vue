/* 
 * 登录页面的模糊搜索组件
 * @Author: wu529778790 
 * @Date: 2018-04-25 09:42:10 
 * @Last Modified by: 389194069@qq.com
 * @Last Modified time: 2018-09-27 15:11:13
 */

<template>
  <div class="line-box"
    :class="{focus: isFocus}">
    <div class="i-box">
      <i class="iconfont"
        :class="iconfont" />
      <div class="right-line">&nbsp;|</div>
    </div>
    <div class="input-box">
      <input ref="input"
        @focus="focus"
        @blur="blur"
        v-model="selectedLabel"
        @keyup.up="updown(--index)"
        @keyup.down="updown(++index)"
        @keyup.enter="select(dataArray[index])"
        @input="remoteMethod"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="!remote">
      <span v-if="!remote"
        class="el-input__suffix">
        <span class="el-input__suffix-inner">
          <i class="el-select__caret el-input__icon el-icon-arrow-down"
            :class="{'is-reverse': listsShow}"
            @click="listsShow ? $refs.input.blur() : $refs.input.focus();" />
        </span>
      </span>
      <ul class="searchData"
        v-show="listsShow">
        <li v-for="(item, i) in dataArray"
          :key="i"
          :class="{listhover: i === index}"
          @click="select(item, i)">
          {{ getLabel(item) }}
        </li>
      </ul>
    </div>
    <p class="error"
      v-if="errorTextShow">{{ rule.message }}</p>
  </div>
</template>
<script>
export default {
  name: 'input-select',
  props: {
    /**
     * 占位
     */
    placeholder: {
      type: String
    },
    /**
     * 数据源
     */
    data: {
      type: Array
    },
    /**
     * 通过接口获取数据源
     */
    dataUrl: {
      type: String
    },
    /**
     * get/post等
     */
    method: {
      type: String,
      default: 'get'
    },
    /**
     * 请求接口需要的参数
     */
    urlParam: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /**
     * response 返回的 key
     */
    resultKey: {
      type: String,
      default: 'data'
    },
    /**
     * 要展示的label对应的key值
     */
    labelKey: {
      type: String,
      default: 'label'
    },
    /**
     * 要展示的value对应的key值
     */
    valueKey: {
      type: String,
      default: 'code'
    },
    /**
     * 是否为远程搜索
     */
    remote: Boolean,
    /**
     * 远程搜索关键字key
     */
    remoteKey: {
      type: String,
      default: 'keyword'
    },
    /**
     * 当仅有一条数据时，默认选中
     */
    autoSelect: Boolean,
    /**
     * 默认选中第一条
     */
    defaultFirst: Boolean,
    /**
     * 是否直接绑定 item 为value，不绑定item[valueKey]的值
     */
    valueItem: Boolean,
    /**
     * 是否缓存数据
     */
    cache: {
      type: Boolean,
      default: true
    },
    /**
     * 字体图标
     */
    iconfont: String,
    /**
     * 验证信息 {test, message}
     */
    rule: {
      type: Object,
      default() {
        return {}
      }
    },
    /**
     * 是否禁用
     */
    disabled: Boolean,
    /**
     * 选择回调
     */
    onSelect: Function,
    value: ''
  },
  data() {
    return {
      selected: this.value || '',
      selectedLabel: '',
      sourceData: null,
      dataArray: this.data,
      error: '',
      isFocus: false,
      errorTextShow: false,
      listsShow: false,
      index: -1 // 上下键下彪
    }
  },
  created() {
    this.selected =
      Object.prototype.toString.call(this.selected) === '[object Number]' ?
        String(this.selected) :
        this.selected
  },
  mounted() {
    !this.$utils.isEmpty(this.dataUrl) && this.getSelectData()
  },
  watch: {
    selected(val, oldVal) {
      this.$emit('input', val);
      (val || '') !== oldVal && this.$nextTick(() => this.validate())
    },
    value(val) {
      this.selected =
        Object.prototype.toString.call(val) === '[object Number]' ?
          String(val) :
          val
      this.mergeData(this.dataArray, this.sourceData)
    },
    data: {
      handler(val) {
        this.dataArray = val
      },
      deep: true
    },
    dataArray: {
      handler(val) {
        Array.isArray(val) &&
          (this.autoSelect || this.defaultFirst) &&
          this.$nextTick(() => {
            if (this.autoSelect && val.length === 1 || this.defaultFirst) {
              let firstCode = this.getValue(val[0])
              if (this.selected !== firstCode) {
                this.select(val[0], 0)
              }
            }
          })
      },
      deep: true
    },
    listsShow(val) {
      val &&
        !this.remote &&
        (!this.cache || !this.dataArray) &&
        !this.$utils.isEmpty(this.dataUrl) &&
        this.getSelectData(true)
      !val && this.remote && (this.dataArray = [])
    }
  },
  methods: {
    /**
     * 获取数据
     */
    getSelectData(showList) {
      if (this.remote || !this.dataUrl) return
      let result
      if (this.method === 'post' || this.method === 'POST') {
        result = this.axios({
          url: this.dataUrl,
          silence: true,
          data: this.urlParam
        })
      } else if (this.method === 'get' || this.method === 'GET') {
        result = this.axios(this.dataUrl, {
          params: this.urlParam,
          silence: true
        })
      }
      this.filterData(result, showList)
    },
    /**
     * 获取value
     */
    getValue(item) {
      return this.valueItem ?
        item :
        Object.prototype.toString.call(item) === '[object Object]' ?
          String(item[this.valueKey]) :
          item
    },
    /**
     * 获取label
     */
    getLabel(item) {
      return item[this.labelKey]
    },
    /**
     * 选中监听
     */
    select(item, i) {
      if (item) {
        this.index = i !== undefined ? i : this.index
        this.selected = this.getValue(item)
        this.selectedLabel = this.getLabel(item)
        this.listsShow = false
        this.onSelect && this.onSelect(item)
      }
    },
    /**
      监听上下键
     */
    updown(i) {
      if (i >= this.dataArray.length) {
        i = 0
      } else if (i < 0) {
        i = this.dataArray.length - 1
      }
      this.index = i
      this.dataArray.length === 1 && this.select(this.dataArray[this.index])
    },
    focus() {
      this.listsShow = true
      this.isFocus = !this.isFocus
    },
    blur() {
      setTimeout(() => {
        this.listsShow = false
        this.isFocus = !this.isFocus
      }, 200)
    },
    /**
     * 校验合法性
     * @param {Boolean} validOnly 仅校验，不提示
     */
    validate(validOnly = false) {
      let validate = this.rule || {}
      if (validate.test) {
        let result = true
        if (this.$utils.is('Function', validate.test)) {
          result = validate.test.call(this, this.value)
        } else {
          result = validate.test.test(this.value)
        }
        if (!validOnly) {
          this.errorTextShow = !result
        }
        return result
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
     * 远程搜索
     */
    remoteMethod(e) {
      this.selected = ''
      let keyword = e.target.value
      this.index = -1
      if (this.$utils.isEmpty(keyword) || this.$utils.isEmpty(this.dataUrl))
        return
      let result
      if (this.method === 'post' || this.method === 'POST') {
        result = this.axios({
          url: this.dataUrl,
          silence: true,
          data: { ...this.urlParam, [this.remoteKey]: keyword }
        })
      } else if (this.method === 'get' || this.method === 'GET') {
        result = this.axios(this.dataUrl, {
          params: { ...this.urlParam, [this.remoteKey]: keyword },
          silence: true
        })
      }
      this.filterData(result, true)
    },
    /**
     * 过滤
     */
    filterData(result, showList = false) {
      result &&
        result.then &&
        result.then(resp => {
          let resultData = resp[this.resultKey] || resp,
            resultArray = Array.isArray(resultData) ? resultData : resultData
          this.sourceData = Array.isArray(resultArray) ?
            [...resultArray] :
            { ...resultArray }
          this.mergeData(resultArray, this.sourceData)
          if (!this.$utils.isEmpty(this.selected)) {
            this.selectedLabel = this.getLabel(
              this.dataArray.find(
                item => this.getValue(item) === this.selected
              ) || {}
            )
          }
          this.listsShow = showList
        })
    },
    /**
     * 合并数据
     */
    mergeData(newOld, oldVal) {
      this.dataArray = this.sourceFilter ?
        this.sourceFilter(
          newOld,
          Array.isArray(oldVal) ? [...oldVal] : { ...oldVal }
        ) :
        newOld
    }
  }
}
</script>
<style lang="scss">
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
    .el-input__icon {
      line-height: 30px;
      cursor: pointer;
      color: rgba(92, 219, 255, 0.5);
      &.is-reverse {
        transform: rotate(180deg);
      }
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

