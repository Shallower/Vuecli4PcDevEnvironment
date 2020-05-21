<template>
  <el-dialog :title="title"
    :width="width"
    :top="top"
    :center="center"
    :custom-class="customClass"
    :visible.sync="visiable"
    :style="{height}"
    @open="openCallback"
    :before-close="beforeCloseTrigger"
    @close="closeCallback"
    :show-close="showClose"
    :append-to-body="appendToBody"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape">
    <slot slot="title"
      name="title" />
    <slot :data="data" />
    <div v-if="!hideFooter"
      slot="footer"
      name="footer">
      <el-button :class="cancelStyle.class"
        v-if="!hideCancel"
        @click="close">{{ cancelStyle.text }}</el-button>
      <el-button type="primary"
        v-if="!hideConfirm"
        :class="confirmStyle.class"
        @click="confirm">{{ confirmStyle.text }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
//属性参考http://element-cn.eleme.io/#/zh-CN/component/dialog
export default {
  name: 'x-dialog',
  props: {
    /**
     * Dialog 的标题，也可通过具名 slot 传入
     */
    title: String,
    /**
     * Dialog 的宽度
     */
    width: String,
    /**
     * Dialog 的高度
     */
    height: String,
    /**
     * Dialog CSS 中的 margin-top 值
     */
    top: String,
    /**
     * Dialog 的自定义类名
     */
    customClass: String,
    /**
     * Dialog 打开的回调
     */
    afterOpen: [String, Function],
    /**
     * 关闭前的回调，会暂停 Dialog 的关闭
     */
    beforeClose: Function,
    /**
     * 关闭后的回调
     */
    afterClose: Function,
    /**
     * 是否可以通过点击 modal 关闭 Dialog
     */
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    /**
     * 是否可以通过按下 ESC 关闭 Dialog
     */
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    /**
     * 是否显示关闭按钮
     */
    showClose: {
      type: Boolean,
      default: true
    },
    /**
     * 是否对头部和底部采用居中布局
     */
    center: Boolean,
    /**
     * 确定按钮配置
     */
    confirmButton: {
      type: Object,
      default: () => {
        return {
          text: '确 定',
          class: ''
        }
      }
    },
    /**
     * 取消按钮配置
     */
    cancelButton: {
      type: Object,
      default: () => {
        return {
          text: '取 消',
          class: ''
        }
      }
    },
    /**
     * Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
     */
    appendToBody: Boolean,
    /**
     * 确定按钮触发方法，可以为String: slot作用于插槽组件实例方法，Function
     * 注：如诺想实现 triggerMethod、afterTrigger 同步调用，请返回 Promise
     */
    triggerMethod: [String, Function],
    /**
     * 确定按钮触发前回调，return false 会拦截 triggerMethod
     */
    beforeTrigger: Function,
    /**
     * 确定按钮触发后回调
     */
    afterTrigger: Function,
    /**
     * 重置函数
     */
    resetFields: [String, Function],
    /**
     * 隐藏页脚按钮区域
     */
    hideFooter: Boolean,
    /**
     * 隐藏取消按钮
     */
    hideCancel: Boolean,
    /**
     * 隐藏确认按钮
     */
    hideConfirm: Boolean
  },
  provide() {
    return {
      xDialog: this
    }
  },
  data() {
    return {
      data: {},
      visiable: false,
      isTriggerSlot:
        Object.prototype.toString.call(this.triggerMethod) ===
        '[object String]',
      slotInstance: null //作用域插槽组件实例
    }
  },
  computed: {
    confirmStyle() {
      return this.confirmButton || {}
    },
    cancelStyle() {
      return this.cancelButton || {}
    }
  },
  methods: {
    is(type, val) {
      return Object.prototype.toString.call(val) === `[object ${type}]`
    },
    /**
     * 初始化作用域插槽实例
     */
    initSlotInstance(cb) {
      //仅当 triggerMethod 为 String(slot作用于插槽组件实例方法)时，获取slot组件实例用于确定按钮触发
      if (!this.slotInstance) {
        this.$nextTick(() => {
          try {
            if (Array.isArray(this.$slots.default)) {
              //slot
              this.slotInstance = this.$slots.default[0] ?
                this.$slots.default[0].componentInstance :
                this.slotInstance
            } else if (this.$scopedSlots.default) {
              //slot-scope
              let _default = this.$scopedSlots.default(this.data),
                _VNode = Array.isArray(_default) ? _default[0] : _default
              let slotTag = _VNode.componentOptions ?
                _VNode.componentOptions.tag :
                ''

              let findDialog = childrens => {
                let dialog
                dialog = childrens.filter(
                  child =>
                    child.$vnode.componentOptions &&
                    child.$vnode.componentOptions.tag === 'x-dialog'
                )
                if (!dialog || dialog.length === 0) {
                  for (let i = 0; i < childrens.length; i++) {
                    dialog = findDialog(childrens[i].$children)
                    if (dialog.length > 0) {
                      break
                    }
                  }
                }
                return dialog
              }
              let xDialog = findDialog(_VNode.context.$children)

              // this.slotInstance = _VNode.context.$children
              //   .find(child =>
              //          child.$vnode.componentOptions.tag === 'x-dialog')
              //   .$children.find(
              //     child => child.$options._componentTag === 'el-dialog'
              //   )
              //   .$children.find(
              //     child => child.$options._componentTag === slotTag
              //   );

              xDialog.forEach(child => {
                child.$children &&
                  child.$children.forEach(child => {
                    if (child.$options._componentTag === 'el-dialog') {
                      !this.slotInstance &&
                        (this.slotInstance = child.$children.find(
                          child => child.$options._componentTag === slotTag
                        ))
                    }
                  })
              })
            }
            cb && cb()
          } catch (error) {
            console.error(error)
          }
        })
      } else {
        cb && cb()
      }
    },
    /**
     * 重置
     */
    reset(cb) {
      this.data = this.is('Object', this.data) ?
        {} :
        Array.isArray(this.data) ? [] : ''

      if (this.resetFields && this.is('Function', this.resetFields)) {
        this.resetFields()
      } else if (
        this.resetFields && this.is('String', this.resetFields) ||
        !this.resetFields
      ) {
        this.initSlotInstance(() => {
          try {
            this.slotInstance &&
              this.slotInstance[this.resetFields || 'resetFields'] &&
              this.slotInstance[this.resetFields || 'resetFields']()
          } catch (error) {}
          cb && cb()
        })
      }
    },
    /**
     * 开启Dialog
     * @param {Object} data 需要传递的参数
     */
    open(data) {
      this.data = this.is('Object', data) ?
        { ...data } :
        Array.isArray(data) ?
          [...data] :
          data === undefined || data === null ? '' : data
      this.visiable = true
      this.initSlotInstance()
    },
    /**
     * 关闭前触发
     */
    beforeCloseTrigger(done) {
      this.reset()
      this.beforeClose ? this.beforeClose(done) : done()
    },
    /**
     * 关闭Dialog
     */
    close() {
      this.reset(() => (this.visiable = false))
    },
    /**
     * 确定
     */
    confirm() {
      this.initSlotInstance(() => {
        if (
          !this.beforeTrigger ||
          this.beforeTrigger && this.beforeTrigger() !== false
        ) {
          let result
          if (
            this.isTriggerSlot &&
            this.slotInstance &&
            this.slotInstance[this.triggerMethod]
          ) {
            result = this.slotInstance[this.triggerMethod]()
          } else if (!this.isTriggerSlot) {
            this.triggerMethod && (result = this.triggerMethod())
          }
          if (result && this.is('Promise', result)) {
            result.then(data => {
              this.handleAfterTrigger(data)
              this.close()
            })
          } else {
            this.handleAfterTrigger()
            this.close()
          }
        }
      })
    },
    /**
     * 处理回调
     */
    handleAfterTrigger(data) {
      if (this.afterTrigger) {
        let parmas = new Array(this.afterTrigger.length)
        parmas.push(data)
        this.afterTrigger.apply(null, parmas)
      }
    },
    /**
     * 开启后的回调
     */
    openCallback() {
      if (this.afterOpen && this.is('Function', this.afterOpen)) {
        this.afterOpen()
      } else if (
        this.afterOpen && this.is('String', this.afterOpen) ||
        !this.afterOpen
      ) {
        this.initSlotInstance(() => {
          try {
            this.slotInstance &&
              this.slotInstance[this.afterOpen || 'activated'] &&
              this.slotInstance[this.afterOpen || 'activated']()
          } catch (error) {}
        })
      }
    },
    /**
     * 关闭后的回调
     */
    closeCallback() {
      this.afterClose && this.afterClose()
    }
  }
}
</script>


