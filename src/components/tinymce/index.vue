<template>
  <div class="tinymce-container editor-container"
    :class="{fullscreen:fullscreen}">
    <textarea class="tinymce-textarea"
      :id="tinymceId" />
  </div>
</template>

<script>
import plugins from './plugins'
import toolbar from './toolbar'

export default {
  name: 'tinymce',
  props: {
    id: {
      type: String
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: [Boolean, String],
      default: 'file edit insert view format table'
    },
    height: {
      type: Number,
      required: false,
      default: 300
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || 'vue-tinymce-' + Number(new Date()),
      fullscreen: false
    }
  },
  watch: {
    value(val) {
      if (this.hasInit) {
        this.$nextTick(
          () =>
            window.tinymce.get(this.tinymceId).getContent() !== val &&
            window.tinymce.get(this.tinymceId).setContent(val || '')
        )
      }
    }
  },
  mounted() {
    this.initTinymce()
  },
  activated() {
    this.initTinymce()
  },
  deactivated() {
    this.destroyTinymce()
  },
  methods: {
    initSdk(cb) {
      let path = '/assets/tinymce/tinymce.min.js',
        mapScript = document.querySelector(`script[src$="${path}"]`)
      if (mapScript === null) {
        let a = document.createElement('script')
        a.src = path
        a.onload = () => {
          console.log('Tinymce load success !!! ')
          a.setAttribute('loaded', true)
          cb && cb()
        }
        a.onerror = () => {
          console.error('Tinymce load fail , path : ', path)
        }
        let c = document.getElementsByTagName('script')[0]
        c.parentNode.insertBefore(a, c)
      } else if (mapScript.hasAttribute('loaded')) {
        cb && cb()
      }
    },
    initTinymce() {
      this.initSdk(() => {
        const _this = this
        window.tinymce.init({
          selector: `#${this.tinymceId}`,
          height: this.height,
          body_class: 'panel-body ',
          object_resizing: false,
          toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
          menubar:
            Object.prototype.toString.call(this.menubar) === '[object String]' ?
              this.menubar :
              '',
          plugins: plugins,
          end_container_on_empty_block: true,
          powerpaste_word_import: 'clean',
          code_dialog_height: 450,
          code_dialog_width: 1000,
          advlist_bullet_styles: 'square',
          advlist_number_styles: 'default',
          imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
          default_link_target: '_blank',
          link_title: false,
          init_instance_callback: editor => {
            if (_this.value) {
              editor.setContent(_this.value)
            }
            _this.hasInit = true
            editor.on('NodeChange Change KeyUp SetContent', () => {
              this.hasChange = true
              this.$emit('input', editor.getContent())
            })
          },
          setup(editor) {
            editor.on('FullscreenStateChanged', e => {
              _this.fullscreen = e.state
            })
          }
        })
      })
    },
    destroyTinymce() {
      if (window.tinymce && window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    }
  },
  destroyed() {
    this.destroyTinymce()
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
}
.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
</style>
