/*
 * 自定义权限指令
 * @Author: liangzc 
 * @Date: 2018-05-08 16:23:53 
 * @Last Modified by: wu529778790
 * @Last Modified time: 2018-07-07 17:16:06
 */
const hasPermission = {
  has(vue, bindPermission) {
    let permissionList = vue.$route.meta.permission
    if (!permissionList) {
      console.error(
        `权限判断不生效。因路由中不包含permission字段，请检查路由表设置。当前路由地址：${
          vue.$route.path
        }`
      )
      return true
    }
    if (!vue.$utils.is('Object', permissionList)) {
      // console.error(
      //   `权限判断不生效。因路由中permission字段非对象字面量，请检查路由表设置。当前路由地址：${
      //     vue.$route.path
      //   }`
      // );
      return true
    }

    let roles = vue.$store.getters.roles
    if (!roles) return true
    return roles.some(role => {
      let permission = permissionList[role]
      if (permission) {
        if (Array.isArray(permission)) {
          return permission.length === 0 ?
            true :
            Array.isArray(bindPermission) ?
              bindPermission.map(i => permission.includes(i)).includes(true) :
              permission.includes(bindPermission)
        }
        console.error(
          `权限判断不生效。因路由中permission字段对应操作权限配置非数组类型，请检查路由表设置。当前路由地址：${
            vue.$route.path
          }`
        )
      }
      return false
    })
  },
  install(Vue) {
    Vue.mixin({
      created: function() {
        this.$permission = bindPermission =>
          hasPermission.has(this, bindPermission)
      }
    })

    Vue.directive('permission', {
      bind(el, binding, vnode) {
        if (!hasPermission.has(vnode.context, binding.value)) {
          el.parentNode.removeChild(el)
        }
      }
    })
  }
}

export default hasPermission
