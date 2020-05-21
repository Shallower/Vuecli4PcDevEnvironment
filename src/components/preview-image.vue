<!--
 * @Descripttion: 影像预览
 * @version: 1.0
 * @Author: Hevin
 * @Date: 2020-05-12 11:54:17
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-21 18:21:18
-->
<template>
  <div
    ref="preview"
    class="preview-image"
    :style="{
      width,
      height: height || `${divHeight}px`,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight
    }"
  >
    <div v-if="showTitle" class="preview-title">
      <span>{{ title }}</span>
      <button
        v-if="showClose && !disabled"
        type="button"
        aria-label="Close"
        class="preview-title__headerbtn"
        @click="doClose"
      >
        <i class="el-icon el-icon-close" />
      </button>
    </div>
    <el-tooltip
      :disabled="$utils.isEmpty(tipContent)"
      :effect="tipEffect"
      :placement="tipPlacement"
      :popper-class="popperClass"
      ref="tooltip"
    >
      <slot name="tooltip" slot="content">
        {{ tipContent }}
      </slot>
      <img
        ref="img"
        class="preview-area-img"
        v-show="isComplete"
        width="100%"
        :style="{
          display: 'block',
          width: fill ? '100%' : 'auto',
          height: fill ? '100%' : 'auto',
          maxWidth: imgReWidth > 0 ? `${imgReWidth}px` : '100%',
          maxHeight: imgReHeight > 0 ? `${imgReHeight}px` : '100%'
        }"
        @load="loadComplete"
        @error="loadImage"
        @dblclick="noneImgClick ? null : preview()"
        @click="noneImgClick ? null : preview()"
      />
      <img
        class="preview-area-img"
        v-show="placeholder"
        width="100%"
        :style="{
          display: 'block',
          maxWidth: imgReWidth > 0 ? `${imgReWidth}px` : '100%',
          maxHeight: imgReHeight > 0 ? `${imgReHeight}px` : '100%'
        }"
        :src="placeholder"
      />
    </el-tooltip>
    <i
      v-if="
        !placeholder &&
          placeIonfont &&
          !isComplete &&
          $utils.isEmpty(text) &&
          !$slots.text
      "
      :class="['iconfont', placeIonfont]"
    />
    <i
      v-if="showPreview && isComplete && !disabled"
      :class="{
        'el-icon-zoom-in': !loading,
        'el-icon-loading': loading
      }"
      @dblclick.stop="preview"
      @click.stop="preview"
    />
    <span v-if="!$utils.isEmpty(text) || $slots.text" class="preview-area-text">
      <slot name="text">
        {{ text }}
      </slot>
    </span>
    <x-dialog
      ref="imageDialog"
      :title="title"
      hide-footer
      :width="dialogWidth"
      :append-to-body="appendToBody"
    >
      <img
        ref="previewImg"
        slot-scope="scope"
        width="100%"
        @load="loadDialogImg"
        :src="scope.data"
        alt=""
      />
    </x-dialog>
  </div>
</template>
<script>
export default {
  name: "preview-image",
  props: {
    /**
     * 图片地址
     */
    src: String,
    /**
     * 用于获取图片的 socket 地址
     */
    ws: String,
    /**
     * 标题
     */
    title: String,
    /**
     * 占位图
     */
    placeholder: String,
    /**
     * 字体图标占位
     */
    placeIonfont: {
      type: String,
      default: "icon-holder-picture"
    },
    /**
     * tooltip content
     */
    tipContent: String,
    /**
     * 显示内容
     */
    text: String,
    /**
     * popper-class
     */
    popperClass: String,
    /**
     * tooltip 主题
     */
    tipEffect: String,
    /**
     * tooltip出现位置
     */
    tipPlacement: {
      type: String,
      default: "top"
    },
    /**
     * 图片加载延时，默认立即加载
     */
    delay: {
      type: Number,
      default: 0
    },
    /**
     * 加载图片失败时,是否循环获取图片，仅当 src 存在的情况下
     */
    loop: Boolean,
    /**
     * 循环间隔，仅在 src 模式下生效，默认5秒
     */
    interval: {
      type: Number,
      default: 5000
    },
    /**
     * 超时时间，仅在 src 模式下生效，默认15分钟
     */
    timeout: {
      type: Number,
      default: 900000
    },
    /**
     * 是否需要心跳检测，仅在 socket 模式下有效
     */
    heartCheck: {
      type: Boolean,
      default: true
    },
    /**
     * 是否需要断线重连，仅在 socket 模式下有效，默认为 true
     */
    reconnect: {
      type: Boolean,
      default: true
    },
    /**
     * 心跳时间，默认 60 秒，仅在 socket 模式下有效
     */
    heartTime: {
      type: Number,
      default: 60000
    },
    /**
     * socket 取值路径
     */
    wsKeyPath: String,
    /**
     * Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
     */
    appendToBody: Boolean,
    /**
     * 弹窗宽度
     */
    dialogWidth: {
      type: String,
      default: "50%"
    },
    /**
     * 宽度
     */
    width: String,
    /**
     * 高度
     */
    height: String,
    /**
     * 图片宽度预设
     */
    imgWidth: Number,
    /**
     * 图片高度预设
     */
    imgHeight: Number,
    /**
     * 最小宽度
     */
    minWidth: String,
    /**
     * 最小高度
     */
    minHeight: String,
    /**
     * 最大宽度
     */
    maxWidth: String,
    /**
     * 最大高度
     */
    maxHeight: String,
    /**
     * 是否显示预览按钮
     */
    showPreview: Boolean,
    /**
     * 附加信息，点击删除时会回调
     */
    extra: [Object, Array, String, Number],
    /**
     * 是否显示关闭按钮
     */
    showClose: {
      type: Boolean,
      default: true
    },
    /**
     * 是否填充图片，不考虑拉伸问题
     */
    fill: Boolean,
    /**
     * 关闭前回调，返回 false 会阻止关闭
     */
    beforeClose: Function,
    /**
     * 关闭按钮点击回调
     */
    onClose: Function,
    /**
     * 是否禁用
     */
    disabled: Boolean,
    /**
     * 禁用图片点击
     */
    noneImgClick: Boolean,
    /**
     * 加载失败回调(src模式)
     */
    loadFail: {
      type: Function,
      default: () => {}
    },
    /**
     * 加载成功回调(src模式)
     */
    loadSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      divWidth: 0,
      divHeight: 0,
      imgReWidth: 0,
      imgReHeight: 0,
      imgSrc: null,
      imgWs: null,
      toolTipContent: null,
      timer: {
        timeout: null,
        interval: null
      },
      socket: null,
      isComplete: false,
      loading: false,
      imgFail: null,
      imgSuccess: null
    };
  },
  mounted() {
    window.addEventListener("resize", this.resize);
    this.init();
  },
  watch: {
    src(val) {
      this.init();
    },
    ws(val) {
      this.init();
    }
  },
  computed: {
    showTitle() {
      return this.title || this.showClose;
    },
    toolTip() {
      return !this.$utils.isEmpty(this.tipContent)
        ? this.tipContent
        : this.toolTipContent;
    },
    loadImgFail() {
      return this.imgFail || this.loadFail;
    },
    loadImgSuccess() {
      return this.imgSuccess || this.loadSuccess;
    }
  },
  methods: {
    loadLoop() {
      try {
        let loop = this.$refs.img.getAttribute("loop");
        return this.$utils.isEmpty(loop) ? this.loop : JSON.parse(loop);
      } catch (error) {
        return this.loop;
      }
    },
    resize() {
      this.$nextTick(() => {
        this.divWidth = 0;
        this.initStyle();
      });
    },
    initStyle() {
      if (
        this.$refs.preview &&
        (this.divWidth === 0 || this.divWidth === undefined)
      ) {
        this.divWidth = this.$refs.preview.offsetWidth;
        let width = this.imgWidth,
          height = this.imgHeight;
        if (this.imgWidth > this.divWidth || this.imgWidth <= 0) {
          width = this.divWidth;
          height = height / (this.imgWidth / width);
        }
        if (this.imgWidth < this.divWidth) {
          width = this.divWidth;
          height = height * (this.divWidth / this.imgWidth);
        }
        this.imgReWidth = width;
        this.imgReHeight = height;
        this.divHeight = this.showTitle ? height + 30 : height;
      }
    },
    init() {
      this.$nextTick(() => this.initStyle());
      this.loading = true;
      if (!this.$utils.isEmpty(this.src)) {
        this.initSrc();
      } else if (!this.$utils.isEmpty(this.ws)) {
        this.initSocket();
      }
    },
    /**
     * 初始化Src
     */
    initSrc(src) {
      setTimeout(() => {
        this.reset();
        this.imgSrc = src || this.src;
        if (
          this.$utils.isEmpty(this.imgSrc) ||
          !this.$utils.isEmpty(this.imgWs)
        )
          return;
        this.loadLoop() &&
          (this.timer.interval = setTimeout(() => {
            this.destoryTickClock();
            this.loading = false;
            this.imgCallback();
            console.warn("image load timeout!");
          }, this.timeout));
        this.$refs.img.src = this.imgSrc;
      }, this.delay);
    },
    /**
     * 初始化Socket
     */
    initSocket(ws) {
      this.reset();
      this.imgWs = ws || this.ws;
      if (this.$utils.isEmpty(this.imgWs) || !this.$utils.isEmpty(this.imgSrc))
        return;
      this.$refs.img && this.$refs.img.removeAttribute("loop");
      this.socket = this.$utils.createWebSocket(this.imgWs, {
        heartCheck: this.heartCheck,
        reconnect: this.reconnect,
        heartTime: this.heartTime,
        callbacks: {
          onopen: () => {
            this.loading = false;
          },
          onclose: () => {
            this.loading = false;
          },
          onerror: () => {
            this.loading = false;
          },
          onmessage: event => {
            this.loading = false;
            let selfRefs = this.$refs;
            let data = event.data;
            if (
              typeof data === "object" &&
              window.Blob &&
              data instanceof Blob &&
              this.imgWs === (event.currentTarget || {}).url
            ) {
              let result = window.URL.createObjectURL(data);
              if (selfRefs.img) {
                selfRefs.img.src = result;
                if (selfRefs.imageDialog.visiable && selfRefs.previewImg) {
                  selfRefs.previewImg.src = result;
                }
                result = null;
              }
            } else {
              let result = this.$utils.evalJson(event.data);
              if (!this.$utils.isEmpty(this.wsKeyPath)) {
                this.imgSrc = this.$utils.get(result, this.wsKeyPath);
                this.initSrc();
              }
            }
          }
        }
      });
    },
    /**
     * 设置图片地址
     */
    loadImage() {
      if (
        this.loadLoop() &&
        this.timer.interval !== undefined &&
        this.timer.interval !== null
      ) {
        clearTimeout(this.timer.timeout);
        !this.$utils.isEmpty(this.imgSrc) &&
          (this.timer.timeout = setTimeout(
            () =>
              (this.$refs.img.src = this.$utils.setUrlParams(
                { [`t${Date.now()}`]: Date.now() },
                this.imgSrc
              )),
            this.interval
          ));
      } else {
        this.loading = false;
        this.isComplete = false;
        this.imgCallback();
      }
    },
    /**
     * 加载完毕
     */
    loadComplete() {
      !this.$utils.isEmpty(this.imgSrc) && this.destoryTickClock();
      this.loading = false;
      this.isComplete = true;
      window.URL && window.URL.revokeObjectURL(this.$refs.img.src);
      this.imgCallback();
    },
    /**
     * dialog image 加载完毕
     */
    loadDialogImg() {
      window.URL &&
        this.$refs.previewImg &&
        window.URL.revokeObjectURL(this.$refs.previewImg.src);
    },
    imgCallback() {
      if (!this.$utils.isEmpty(this.imgSrc)) {
        this.destoryTickClock();
        this.$refs.img && this.$refs.img.removeAttribute("loop");
        this.isComplete ? this.loadImgSuccess() : this.loadImgFail();
        this.imgFail = null;
        this.imgSuccess = null;
      }
    },
    /**
     * 预览
     */
    preview() {
      if (!this.loading && this.isComplete && !this.disabled) {
        this.$refs.imageDialog.open(this.$refs.img.src);
      }
    },
    /**
     * 点击关闭按钮
     */
    doClose() {
      if ((this.beforeClose && this.beforeClose()) || !this.beforeClose) {
        this.reset();
        this.onClose && this.onClose(this.extra);
      }
    },
    /**
     * 设置Src
     * @param {String} src 图片地址
     * @param {Object} option 配置项
     * @param {Boolean} option.loop 是否开启轮询
     * @param {Function} option.fail 加载失败回调
     * @param {Function} option.success 加载成功回调
     */
    setSrc(src, { loop = this.loop, fail, success } = { loop: this.loop }) {
      // if (!this.$utils.isEmpty(src)) {
      this.$refs.img && this.$refs.img.setAttribute("loop", loop);
      this.imgFail = fail;
      this.imgSuccess = success;
      this.initSrc(src);
      // }
    },
    /**
     * 获取 Src
     */
    getSrc() {
      return this.imgSrc;
    },
    /**
     * 设置Ws
     */
    setWs(ws) {
      // if (!this.$utils.isEmpty(ws)) {
      this.$refs.img && this.$refs.img.removeAttribute("loop");
      this.imgFail = null;
      this.imgSuccess = null;
      this.initSocket(ws);
      // }
    },
    /**
     * 获取 ws
     */
    getWs() {
      return this.imgWs;
    },
    /**
     * 设置TipContent
     */
    setTipContent(content) {
      this.toolTipContent = content;
    },
    /**
     * 销毁定时器
     */
    destoryTickClock() {
      clearTimeout(this.timer.timeout);
      this.timer.timeout = null;
      clearInterval(this.timer.interval);
      this.timer.interval = null;
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    },
    /**
     * 重置
     */
    reset() {
      this.imgSrc = null;
      this.imgWs = null;
      this.toolTipContent = null;
      this.isComplete = false;
      this.loading = false;
      this.destoryTickClock();
    }
  },
  errorCaptured() {
    this.reset();
    window.removeEventListener("resize", this.resize);
  },
  beforeDestroy() {
    this.reset();
    window.removeEventListener("resize", this.resize);
  }
};
</script>
<style lang="scss">
.preview-image {
  position: relative;
  text-align: center;
  overflow: hidden;
  background-color: lightgray;
  cursor: pointer;
  .preview-title {
    height: 30px;
    padding: 5px 10px;
    text-align: left;
    background-color: white;
    border: 1px solid #ebeef5;
    .preview-title__headerbtn {
      position: absolute;
      top: 8px;
      right: 10px;
      padding: 0;
      background: 0 0;
      border: none;
      outline: 0;
      cursor: pointer;
      font-size: 16px;
      .el-icon-close {
        color: #909399;
      }
    }
  }
  .preview-area-img {
    width: auto;
    height: auto;
    margin: 0 auto;
    cursor: pointer;
  }
  .preview-area-text {
    display: block;
    position: absolute;
    left: 0;
    right: 0px;
    top: 45%;
    bottom: 0px;
    color: white;
    font-size: 16px;
  }
  & > .iconfont {
    color: #4095de;
    font-size: 48px;
    cursor: pointer;
    top: 40%;
    display: block;
    position: relative;
  }
  & > i[class^="el-icon-"] {
    color: white;
    font-size: 20px;
    cursor: pointer;
    top: 45%;
    position: absolute;
  }
  .el-dialog__body {
    padding-top: 10px;
  }
}
</style>
