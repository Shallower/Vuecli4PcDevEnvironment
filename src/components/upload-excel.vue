<!--
 * @Descripttion: 解析 Excel 文件
 * @version: 1.0
 * @Author: Hevin
 * @Date: 2020-05-12 11:54:17
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-21 18:23:02
-->
<template>
  <div class="upload-excel">
    <el-button :loading="loading" @click="handleUpload">{{
      placeholder
    }}</el-button>
    <slot />
    <input
      :id="clickId"
      type="file"
      accept=".xlsx, .xls"
      class="hide"
      @change="handkeFileChange"
    />
    <p class="pt-20">{{ headerTitle }}</p>
    <slot name="table">
      <el-table
        ref="resultTable"
        v-if="preview"
        :data="excelData.results"
        border
        :max-height="tableMaxHeight"
        highlight-current-row
      >
        <el-table-column
          v-for="item of excelData.header"
          :prop="item"
          :label="item"
          :key="item"
          :align="tableAlign"
        />
      </el-table>
    </slot>
  </div>
</template>

<script>
import XLSX from "xlsx";

export default {
  name: "upload-excel",
  props: {
    /**
     * 按钮占位符
     */
    placeholder: {
      type: String,
      default: "选择Excel文件"
    },
    /**
     * 题头标题
     */
    headerTitle: {
      type: String,
      default: "Excel文件预览"
    },
    /**
     * 是否显示预览结果
     */
    preview: {
      type: Boolean,
      default: false
    },
    /**
     * Header映射表
     */
    headerMapping: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**
     * 开始单元格，默认从Excel第一个单元格开始（示例: A1）
     */
    startCell: String,
    /**
     * 结束单元格，默认读取所有（示例: O11）
     */
    endCell: String,
    /**
     * 读取真值还是格式化后的字符串，默认读取 excel 单元格展示出来的格式化值
     * {v: 1231, w: '1231'}，为 false 读取 w 的值
     */
    xlsxRaw: Boolean,
    /**
     * 表格对齐方式
     */
    tableAlign: {
      type: String,
      default: "left"
    },
    /**
     * 表格最大高度
     */
    tableMaxHeight: {
      type: [String, Number],
      default: "300"
    },
    /**
     * 选择回调
     */
    onSelected: {
      type: Function
    }
  },
  data() {
    return {
      loading: false,
      clickId: "",
      excelData: {
        header: null,
        results: null
      }
    };
  },
  created() {
    this.clickId = this.gengerateID();
  },
  methods: {
    generateDate({ header, results }) {
      this.excelData.header = header;
      this.excelData.results = results;
      let convertData = null;
      if (
        this.headerMapping &&
        !this.$utils.isEmptyObject(this.headerMapping)
      ) {
        convertData = results.map(item => {
          let jsonObj = {};
          this.$utils.forEach(item, (value, code) => {
            jsonObj[this.headerMapping[code]] = value;
          });
          return jsonObj;
        });
      }
      this.loading = false;
      let result =
        Array.isArray(convertData) && convertData.length > 0
          ? {
              header: header,
              results: convertData
            }
          : this.excelData;
      this.onSelected
        ? this.onSelected(result)
        : this.$emit("on-selected", result);
    },
    handleUpload() {
      let evObj = document.createEvent("MouseEvents");
      evObj.initEvent("click", true, false);
      document.getElementById(this.clickId).dispatchEvent(evObj);
    },
    handkeFileChange(e) {
      this.loading = true;
      const el = e;
      const itemFile =
        typeof e.target === "undefined" ? e[0] : e.target.files[0];
      if (!itemFile) {
        this.loading = false;
        return;
      }
      if (!itemFile.type || !itemFile.type.endWith("sheet")) {
        this.$message({ message: "请选择Excel表格文件", type: "warning" });
        this.loading = false;
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        const data = e.target.result;
        const fixedData = this.fixdata(data);
        const workbook = XLSX.read(btoa(fixedData), { type: "base64" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        let ref = worksheet["!ref"];
        if (ref && ref !== undefined && ref !== null) {
          ref = ref.split(":");
          if (ref.length !== 0) {
            if (
              ref[0] &&
              this.startCell &&
              this.startCell !== "" &&
              this.startCell !== null &&
              this.startCell !== undefined
            ) {
              ref[0] = this.startCell;
            }
            if (
              ref[1] &&
              this.endCell &&
              this.endCell !== "" &&
              this.endCell !== null &&
              this.endCell !== undefined
            ) {
              ref[1] = this.endCell;
            }
            worksheet["!ref"] = ref.join(":");
          }
        }
        const header = this.get_header_row(worksheet);
        const results = XLSX.utils.sheet_to_json(worksheet, {
          raw: this.xlsxRaw
        });
        this.generateDate({ header, results });
        this.resetInput(el);
      };
      reader.readAsArrayBuffer(itemFile);
    },
    fixdata(data) {
      let o = "";
      let l = 0;
      const w = 10240;
      for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    get_header_row(sheet) {
      const headers = [];
      const range = XLSX.utils.decode_range(sheet["!ref"]);
      let C;
      const R = range.s.r; /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        var cell =
          sheet[
            XLSX.utils.encode_cell({ c: C, r: R })
          ]; /* find the cell in the first row */
        var hdr = "UNKNOWN " + C; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
      return headers;
    },
    /**
     * 获取Table Dom节点
     */
    eltable() {
      return this.$refs.resultTable ? this.$refs.resultTable.$el : null;
    },
    /**
     * 清除数据
     */
    clear() {
      this.excelData.header = null;
      this.excelData.results = null;
    },
    /**
     * 获取ID
     */
    gengerateID() {
      let nonstr = Math.random()
        .toString(36)
        .substring(3, 8);
      if (!document.getElementById(nonstr)) {
        return nonstr;
      }
      return this.gengerateID();
    },
    /**
     * 重置input
     */
    resetInput(e) {
      let input = e.target;
      let parentNode = input.parentNode;
      parentNode.removeChild(input);
      input = document.createElement("input");
      input.className = "hide";
      input.setAttribute("type", "file");
      input.setAttribute("accept", ".xlsx, .xls");
      this.clickId = this.gengerateID();
      input.setAttribute("id", this.clickId);
      input.addEventListener("change", this.handkeFileChange, false);
      parentNode.appendChild(input);
    },
    /**
     * 数据变换，Excel 数据转换成 json 数据
     */
    flatMap(row) {
      if (this.headerMapping) {
        let rowInfo = {};
        for (let key in row) {
          rowInfo[this.headerMapping[key]] = row[key];
        }
        return rowInfo;
      }
      return row;
    }
  }
};
</script>

<style lang="scss">
.upload-excel {
  p {
    // border: 1px solid #dfe6ec;
    // border-bottom: none;
    padding: 5px;
    font-weight: bold;
    line-height: 30px;
    text-align: center;
    margin-top: 20px;
  }
}
</style>
