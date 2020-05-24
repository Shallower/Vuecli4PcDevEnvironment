/*
 * 显示图标文本，用于状态展示
 * @Author: 389194069@qq.com 
 * @Date: 2018-05-19 11:41:08 
 * @Last Modified by: 389194069@qq.com
 * @Last Modified time: 2018-06-19 16:16:11
 */
<template>
  <!-- <el-button type="text"
    size="small">
    <i :class="['iconfont', option.icon]"
      :style="{color: option.color}" /> {{ option.label }}
  </el-button> -->
  <div class="icon-text">
    <i :class="[{'iconfont': iconfont}, option.icon]"
      :style="{color: option.color, margin: '4px'}" />
    <span v-text="option.label" />
    <!-- {{ option.label }} -->
  </div>
</template>
<script>
export default {
  name: 'icon-text',
  props: {
    /**
     * 需要转换 option 的 key
     */
    optKey: String,
    /**
     * 需要转换的 option.code
     */
    code: [String, Number]
  },
  data() {
    return {
      option: null
    }
  },
  created() {
    this.convertOption()
  },
  watch: {
    code(val) {
      this.convertOption()
    }
  },
  computed: {
    iconfont() {
      return (
        this.option &&
        this.option.icon &&
        !String(this.option.icon).startWith('el-icon')
      )
    }
  },
  methods: {
    convertOption() {
      let CodeOptions = this.$utils.get(this.MapOption, this.optKey, {})
        .options
      if (CodeOptions) {
        this.option =
          CodeOptions.find(item => item.code === String(this.code)) || {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-text {
  display: table;
  text-align: center;
  margin: auto;
  span {
    display: table-cell;
    vertical-align: middle;
  }
}
</style>
