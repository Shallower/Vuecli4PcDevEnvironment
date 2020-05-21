/*
 * 封装省市级联
 * @Author: liangzc 
 * @Date: 2018-04-16 13:27:25 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-06-25 14:44:24
 */
<template>
  <el-cascader class="city-picker"
    :options="options"
    :props="{
      value:'adcode',
      label:'name',
      children:'districts'
    }"
    :separator="separator"
    :placeholder="placeholder"
    :clearable="clearable"
    :expand-trigger="expandTrigger"
    :show-all-levels="showAllLevels"
    :filterable="filterable"
    :size="size"
    :disabled="disabled"
    :before-filter="beforeFilter"
    v-model="selected"
    @change="change"
    @active-item-change="handleItemChange" />
</template>

<script>
//配置参考 http://element-cn.eleme.io/#/zh-CN/component/cascader
export default {
  name: 'city-picker',
  props: {
    /**
     * 选项分隔符
     */
    separator: {
      type: String,
      default: '/'
    },
    /**
     * 占位文本
     */
    placeholder: {
      type: String,
      default: '请选择地址'
    },
    /**
     * 是否支持清空选项
     */
    clearable: Boolean,
    /**
     * 次级菜单的展开方式
     */
    expandTrigger: String,
    /**
     * 输入框中是否显示选中值的完整路径
     */
    showAllLevels: {
      type: Boolean,
      default: true
    },
    /**
     * 是否可搜索
     */
    filterable: {
      type: Boolean
    },
    /**
     * 尺寸(medium / small / mini)
     */
    size: {
      type: String
    },
    /**
     * 筛选之前的钩子，参数为输入的值，若返回 false 或者返回 Promise 且被 reject，则停止筛选
     */
    beforeFilter: Function,
    value: Array,

    /**
     * 选择回调
     */
    onPick: Function,
    /**
     * 是否禁用
     */
    disabled: Boolean
  },
  data() {
    return {
      areaData: {},
      options: [],
      selected: []
    }
  },
  created() {
    this.areaData =
      this.$utils.CityData ||
      (this.$utils.CityData = require('@/js/data/city.data'))
    setTimeout(() => {
      let provincelist = [],
        areaData = this.$utils.deepClone(this.areaData)
      for (let code in areaData) {
        let province = areaData[code]
        province.districts && (province.districts = [])
        provincelist.push(province)
      }
      this.options = provincelist
      this.initSelected(this.value)
    })
  },
  watch: {
    value(val) {
      this.initSelected(val)
    },
    selected(val, oldVal) {
      this.$emit('input', val)
    }
  },
  computed: {
    selectedData() {
      let province = this.areaData[this.selected[0]],
        city,
        district
      if (province) {
        city = province.districts ?
          province.districts[this.selected[1]] :
          undefined
        if (city) {
          district = city.districts ?
            city.districts[this.selected[2]] :
            undefined
        }
      }
      return {
        province,
        city,
        district
      }
    }
  },
  methods: {
    initSelected(val) {
      let province = this.areaData[val[0]]
      if (!province || !province.districts) {
        val = ['', '', '']
      } else {
        let city = province.districts[val[1]]
        if (!city || !city.districts) {
          val = [val[0], '', '']
        } else {
          if (!city.districts[val[2]]) {
            val = [val[0], val[1], '']
          }
        }
      }

      this.options.map(option => {
        if (
          option.adcode === val[0] &&
          (!option.districts ||
            option.districts && option.districts.length === 0)
        ) {
          option.districts = Object.values(
            this.$utils.deepClone(this.areaData[val[0]].districts)
          ).map(city => {
            city.districts && (city.districts = Object.values(city.districts))
            return city
          })
        }
        return option
      })
      this.selected = val
    },
    change(val) {
      this.onPick && this.onPick(this.selectedData)
    },
    handleItemChange(val) {
      this.filterData(val)
    },
    filterData(val) {
      let data = this.areaData
      val.forEach(vl => {
        if (data[vl] && data[vl].districts) data = data[vl].districts
      })
      data = this.$utils.deepClone(data)
      this.options = this.options.map(option => {
        if (option.adcode === val[0]) {
          if (val[1]) {
            option.districts = option.districts.map(child => {
              if (child.adcode === val[1]) {
                child.districts = Object.values(data)
              }
              return child
            })
          } else {
            option.districts &&
              (option.districts = Object.values(data).map(item => {
                item.districts && (item.districts = [])
                return item
              }))
          }
        }
        return option
      })
    }
  }
}
</script>


