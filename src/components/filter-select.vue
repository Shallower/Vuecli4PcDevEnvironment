/*
 * 封装远程数据过滤组件
 * @Author: liangzc 
 * @Date: 2018-04-13 17:48:35 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-09-25 17:38:26
 */
<template>
  <el-select ref="select"
    v-model="selected"
    :filterable="filterable"
    :clearable="clearable"
    :remote="remote"
    :value-key="valueKey"
    :allow-create="allowCreate"
    :multiple="multiple"
    :multiple-limit="multipleLimit"
    :placeholder="placeholder"
    :disabled="disabled"
    :collapse-tags="collapseTags"
    :default-first-option="defaultFirstOption"
    @change="change"
    @visible-change="visibleChange"
    :filter-method="filterMethod"
    :remote-method="remoteMethod">
    <el-option v-if="Array.isArray(dataArray)"
      v-for="(item, index) in dataArray"
      :key="index"
      :label="getLabel(item)"
      :value="getValue(item, valueItem)" />
    <el-option v-if="!Array.isArray(dataArray)"
      v-for="(value, key, index) in dataArray"
      :key="index"
      :label="getValue(value, valueItem)"
      :value="String(key)" />
  </el-select>
</template>
<script>
export default {
  name: 'filter-select',
  props: {
    /**
     * v-model
     */
    value: {
      type: [String, Number, Array, Object]
    },
    placeholder: {
      type: String
    },
    /**
     * 数据源
     */
    data: {
      type: [Array, Object]
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
     * 是否多选
     */
    multiple: Boolean,
    /**
     * 多选时用户最多可以选择的项目数，为 0 则不限制
     */
    multipleLimit: 0,
    /**
     * 数据源过滤函数，仅针对 dataUrl 不为空时有效
     */
    sourceFilter: Function,
    /**
     * 是否禁用
     */
    disabled: Boolean,
    /**
     * 是否可搜索
     */
    filterable: Boolean,
    /**
     * 是否支持远程搜素
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
     * 自定义搜索方法
     */
    filterMethod: Function,
    /**
     * 选择回调
     */
    onSelect: Function,
    /**
     * 是否缓存数据
     */
    cache: {
      type: Boolean,
      default: true
    },
    /**
     * 是否支持清楚
     */
    clearable: Boolean,
    /**
     * 是否允许用户创建新条目，需配合 filterable 使用
     */
    allowCreate: Boolean,
    /**
     * 在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用
     */
    defaultFirstOption: Boolean,
    /**
     * 当仅有一条数据时，默认选中
     */
    autoSelect: Boolean,
    /**
     * 默认选中第一条
     */
    defaultFirst: Boolean,
    /**
     * 多选时是否将选中值按文字的形式展示
     */
    collapseTags: Boolean,
    /**
     * 是否直接绑定 item 为value，不绑定item[valueKey]的值
     */
    valueItem: Boolean,
    /**
     * 当 url 改变时，是否立即请求
     */
    immediate: Boolean,
    /**
     * 请求完成回调
     */
    onResponse: Function
  },
  data() {
    return {
      selected: this.value,
      sourceData: null,
      dataArray: this.data,
      isLoading: false
    }
  },
  created() {
    this.selected =
      Object.prototype.toString.call(this.selected) === '[object Number]' ?
        String(this.selected) :
        this.selected
  },
  mounted() {
    this.getSelectData()
  },
  watch: {
    selected(val) {
      this.$emit('input', val)
    },
    dataUrl(val) {
      this.immediate && !this.isLoading && this.getSelectData()
    },
    urlParam: {
      handler(val) {
        this.immediate && !this.isLoading && this.getSelectData()
      },
      deep: true
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
            if (
              this.autoSelect && val.length === 1 ||
              this.defaultFirst && this.$utils.isEmpty(this.selected)
            ) {
              let firstCode = this.getValue(val[0])
              if (this.selected !== firstCode) {
                if (this.multiple) {
                  this.selected = [this.valueItem ? val[0] : firstCode]
                } else {
                  this.selected = this.valueItem ? val[0] : firstCode
                }
                this.onSelect && this.onSelect(val[0])
              }
            }
          })
      },
      deep: true
    }
  },
  methods: {
    /**
     * 重置
     */
    reset() {
      this.dataArray = null
      this.selected = ''
    },
    /**
     * 获取数据
     */
    getSelectData() {
      if (this.remote || this.$utils.isEmpty(this.dataUrl)) return
      let result
      if (this.method === 'post' || this.method === 'POST') {
        this.isLoading = true
        result = this.axios({
          url: this.dataUrl,
          silence: true,
          data: this.urlParam
        })
      } else if (this.method === 'get' || this.method === 'GET') {
        this.isLoading = true
        result = this.axios(this.dataUrl, {
          params: this.urlParam,
          silence: true
        })
      }
      this.filterData(result)
    },
    /**
     * 获取value
     */
    getValue(item, valueItem) {
      return valueItem ?
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
     * 选中值改变监听
     */
    change(val) {
      this.$emit('input', val)
      this.$emit('change', val)
      let dataArray = this.$utils.deepClone(this.dataArray)
      this.$nextTick(() => {
        this.onSelect &&
          this.onSelect(
            Array.isArray(dataArray) ?
              dataArray.find(
                item => String(this.getValue(item)) === String(val)
              ) :
              (function() {
                let obj = {}
                this.$utils.forEach(dataArray, (value, key) => {
                  if (String(value) === String(val)) {
                    obj = {
                      [this.labelKey]: key,
                      [this.valueKey]: value
                    }
                  }
                })
                return obj
              })()
          )
        dataArray = null
      })
    },
    /**
     * 下拉框出现/隐藏时触发
     */
    visibleChange(visible) {
      visible &&
        !this.remote &&
        (!this.cache || !this.dataArray) &&
        this.getSelectData()
      !visible && this.remote && (this.dataArray = [])
    },
    /**
     * 远程搜索
     */
    remoteMethod(keyword) {
      if (this.$utils.isEmpty(keyword)) return
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
      this.filterData(result)
    },
    /**
     * 过滤
     */
    filterData(result) {
      result &&
        result.then &&
        result
          .then(resp => {
            this.isLoading = false
            let resultData = resp[this.resultKey] || resp,
              resultArray = Array.isArray(resultData) ? resultData : resultData
            this.sourceData = Array.isArray(resultArray) ?
              [...resultArray] :
              { ...resultArray }
            this.mergeData(resultArray, this.sourceData)
            this.onResponse && this.onResponse(resp)
          })
          .catch(error => (this.isLoading = false))
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
    },
    /**
     * 是否为空数据
     */
    isEmpty() {
      return (
        this.$utils.isEmptyObject(this.dataArray) ||
        this.$utils.isEmptyArray(this.dataArray)
      )
    }
  }
}
</script>


