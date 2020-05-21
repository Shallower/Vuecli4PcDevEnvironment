/* * 查看二维码 * @Author: hyzh * @Date: 2018-06-12 11:04:12 * @Last Modified
by: liangzc * @Last Modified time: 2018-08-31 09:49:54 */
<template>
  <div ref="qrcode" class="page-container page-qrcode">
    <div class="qrcode-box">
      <div ref="qrcodeBox" :class="boxClass">
        <p
          class="qrcode-text"
          v-if="!$utils.isEmpty(qrSubTitle)"
          v-text="qrTitle"
        />
        <p
          class="qrcode-text qrcode-text--bottom"
          v-text="!$utils.isEmpty(qrSubTitle) ? qrSubTitle : qrTitle"
        />
        <div :id="id" />
      </div>
    </div>
    <div class="canvas-box" ref="canvasBox">
      <img v-if="dataContent" :src="dataContent" @load="qrImageComplete" />
      <el-button v-if="loading" type="text" loading>loading...</el-button>
    </div>
    <div
      class="qrcode-button"
      :style="{ marginTop: `${saveMarginTop}px` }"
      v-if="!loading && !hideSave"
    >
      <slot name="save">
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="downloadIamge"
        >
          {{ saveText }}
        </el-button>
      </slot>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcode-lib";
import Html2Canvas from "html2canvas";
export default {
  name: "qrcode",
  props: {
    /**
     * 二维码标题
     */
    title: {
      type: String,
      default: "二维码"
    },
    /**
     * 二维码副标题
     */
    subTitle: {
      type: String
    },
    /**
     * 二维码内容
     */
    content: String,
    /**
     * 二维码信息{title,subTitle,content}
     */
    info: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 保存按钮文字
     */
    saveText: {
      type: String,
      default: "下载二维码"
    },
    /**
     * 保存文件的名称
     */
    fileName: {
      type: String,
      default: "下载二维码"
    },
    /**
     * 隐藏保存按钮
     */
    hideSave: Boolean,
    /**
     * 二维码外层样式
     */
    boxClass: [String, Array, Object],
    /**
     * 二维码配置项
     * width: 128,
     * height: 128,
     * imgWidth: 32,
     * imgHeight: 32,
     * logo: 'http://xxx',
     * colorDark : "#000000",
     * colorLight : "#ffffff",
     * correctLevel : QRCode.CorrectLevel.H
     */
    qrOption: {
      type: Object,
      default() {
        return {
          width: 256,
          height: 256,
          imgWidth: 85,
          imgHeight: 85,
          logo: null,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        };
      }
    }
  },
  data() {
    return {
      id: `qrcode${Date.now()}`,
      qrCode: null,
      canvas: null,
      dataContent: null,
      loading: false,
      saveMarginTop: 0
    };
  },
  mounted() {
    this.createQRCode();
  },
  watch: {
    content(val) {
      this.createQRCode();
    },
    info: {
      handler(val) {
        this.createQRCode();
      },
      deep: true
    }
  },
  computed: {
    qrTitle() {
      return (this.info || {}).title || this.title;
    },
    qrSubTitle() {
      return (this.info || {}).subTitle || this.subTitle;
    },
    saveName() {
      return (
        this.qrTitle +
        (!this.$utils.isEmpty(this.qrSubTitle) ? ` - ${this.qrSubTitle}` : "")
      );
    },
    qrContent() {
      return (this.info || {}).content || this.content;
    }
  },
  methods: {
    /**
     * 生成二维码
     */
    createQRCode(content) {
      this.canvas = null;
      this.dataContent = null;
      this.qrCode && this.qrCode.clear();
      if (this.$utils.isEmpty(this.qrContent)) return;
      this.loading = true;
      if (!this.qrCode) {
        this.qrCode = new QRCode(document.getElementById(this.id), {
          ...(this.qrOption || {}),
          text: this.qrContent
        });
      } else {
        this.qrCode.makeCode(this.qrContent);
      }
      this.createCanvas(canvas => (this.loading = false));
    },
    /**
     * 生成canvas
     */
    createCanvas(cb) {
      if (this.canvas) {
        cb && cb(this.canvas);
      } else {
        let defaultView = this.$refs.qrcodeBox.ownerDocument.defaultView;
        Html2Canvas(this.$refs.qrcodeBox, {
          allowTaint: true,
          taintTest: false,
          logging: $globalConfig.debug,
          windowWidth: defaultView.innerWidth * 0.3,
          backgroundColor: "transparent",
          scale: 0.1
        }).then(canvas => {
          this.canvas = canvas;
          this.dataContent = canvas.toDataURL();
          cb && cb(this.canvas);
        });
      }
    },
    /**
     * 二维码图片加载完成
     */
    qrImageComplete() {
      this.$nextTick(
        () => (this.saveMarginTop = this.$refs.canvasBox.offsetHeight)
      );
    },
    /***
     * 图片下载
     */
    downloadIamge(name) {
      // this.createCanvas(canvas => {
      Html2Canvas(this.$refs.qrcodeBox, {
        allowTaint: true,
        taintTest: false,
        logging: $globalConfig.debug,
        backgroundColor: "transparent"
      }).then(canvas => {
        this.$utils.download(
          canvas,
          !this.$utils.isEmpty(this.saveName) ? this.saveName : this.fileName
        );
      });
      // });
    }
  }
};
</script>
<style lang="scss">
$scale: 10;
.page-qrcode {
  position: relative;
  overflow: hidden;
  .qrcode-box {
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
    text-align: center;
    text-align: -webkit-center;
    text-align: -moz-center;
    & > div {
      height: 495px * $scale;
      width: 350px * $scale;
      padding-top: 167px * $scale;
      padding-bottom: 15px * $scale;
      .qrcode-text {
        text-align: center;
        font-size: 13px * $scale;
        margin: 0;
        line-height: 1.2;
        padding-bottom: 7px * $scale;
        color: #000;
        font-weight: bold;
        font-family: "SourceHanSansCN-Medium";
        &--bottom {
          color: #000;
          font-size: 12px * $scale;
          font-weight: normal;
          padding-bottom: 15px * $scale;
          font-family: "SourceHanSansCN-Regular";
          // margin-top: 10px;
        }
      }
    }
  }
  .canvas-box {
    text-align: center;
    text-align: -webkit-center;
    text-align: -moz-center;
    position: absolute;
    top: 0;
    width: 100%;
    // height: 318px;
    background-color: white;
    .el-button.is-loading {
      position: absolute;
      bottom: 0;
      top: 0;
    }
  }
  .qrcode-button {
    text-align: right;
    position: relative;
  }
}
</style>
