/*
 * @Author: wu529778790 
 * @Date: 2018-04-25 10:44:52 
 * @Last Modified by: 389194069@qq.com
 * @Last Modified time: 2018-07-21 16:29:21
 */

<template>
  <div>
    <slot/>
  </div>
</template>
<script>
export default {
  name: 'input-group',
  data() {
    return {
      slotLength: 0,
      slots: []
    }
  },
  mounted() {
    this.$nextTick(() => this.initSlots())
  },
  methods: {
    /**
     * 初始化插槽对象
     */
    initSlots() {
      let defaultSlost = this.$slots.default
      defaultSlost = Array.isArray(defaultSlost) ?
        defaultSlost :
        [defaultSlost]
      let slotArray = defaultSlost.filter(slot => {
        let componentOptions = slot.componentOptions || {}
        return (
          componentOptions.tag === 'input-box' ||
          componentOptions.tag === 'inputBox' ||
          componentOptions.tag === 'input-mercode' ||
          componentOptions.tag === 'inputMercode' ||
          componentOptions.tag === 'input-select' ||
          componentOptions.tag === 'inputSelect'
        )
      })
      this.slots = slotArray.map(slot => slot.componentInstance)
      this.slotLength = slotArray.length
    },
    /**
     * 校验数据合法性
     * @param {Boolean} validOnly 仅校验，不提示
     */
    validate(validOnly) {
      this.initSlots()
      return (
        this.slots
          .map(slot => slot.validate ? slot.validate(validOnly) : true)
          .indexOf(false) === -1
      )
    },
    /**
     * 清楚校验结果
     */
    clearValidate() {
      this.initSlots()
      this.slots.forEach(slot => slot.clearValidate && slot.clearValidate())
    }
  }
}
</script>



