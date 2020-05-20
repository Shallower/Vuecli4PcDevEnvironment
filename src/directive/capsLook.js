/*
 * 大小写指令，接受修饰符 {upper, lower}
 * @Author: 389194069@qq.com 
 * @Date: 2018-10-17 16:52:45 
 * @Last Modified by:   389194069@qq.com 
 * @Last Modified time: 2018-10-17 16:52:45 
 */
export default {
  install: Vue => {
    Vue.directive('capslook', {
      update(el, binding, vnode) {
        let value = (vnode.data.model || {}).value
        if (value && vnode.componentInstance) {
          let convertValue = binding.modifiers.upper ?
            value.toUpperCase() :
            binding.modifiers.lower ? value.toLowerCase() : value
          vnode.componentInstance.$emit('input', convertValue)
          vnode.componentInstance.currentValue &&
            (vnode.componentInstance.currentValue = convertValue)
          convertValue = null
        }
      }
    })
  }
}
