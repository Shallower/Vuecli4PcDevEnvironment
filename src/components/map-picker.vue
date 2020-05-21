/*
 * 地图坐标拾取
 * @Author: liangzc 
 * @Date: 2018-04-27 16:32:41 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-09-19 17:59:53
 */
<template>
  <el-dialog v-if="isDialog"
    ref="elDialog"
    class="map-picker"
    :title="title"
    :visible.sync="dialogVisible"
    :show-close="showClose"
    :append-to-body="appendToBody">
    <div id="mappicker-container"
      :style="{height: mapHeight + 'px'}" />
    <div v-if="!readonly"
      id="mappicker-input">
      <table>
        <tr>
          <td>
            <label>按关键词搜索：</label>
          </td>
          <td class="column2"
            v-if="!autoComplete">
            <label/>
          </td>
          <td class="column2">
            <label>左击获取经纬度：</label>
          </td>
        </tr>
        <tr>
          <td>
            <input ref="autocomplete"
              type="text"
              :value="name"
              @blur="autoComplete ? completeSearch() : null"
              placeholder="请输入关键词进行搜索">
            <input ref="autocompleteTemp"
              style="visibility:hidden;position:absolute;bottom:14px">
          </td>
          <td class="column2"
            v-if="!autoComplete">
            <el-button type="primary"
              size="small"
              @click="completeSearch(true)"
              v-text="'搜索'" />
          </td>
          <td class="column2">
            <input :value="lnglat"
              type="text"
              readonly="true">
          </td>
        </tr>
      </table>
    </div>
    <span v-if="!hideFooter && !readonly"
      slot="footer"
      class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary"
        @click="confirm">完 成</el-button>
    </span>
  </el-dialog>
  <div v-else
    id="mappicker-container"
    :style="{height: mapHeight + 'px'}" />
</template>
<script>
export default {
  name: 'map-picker',
  props: {
    /**
     * 标题文字
     */
    title: {
      type: String,
      default: '选取坐标'
    },
    /**
     * { name, address, district, lat, lng, modify: true/false 是否修改 }
     */
    value: Object,
    /**
     * 搜索类型，默认停车场，参考 http://lbs.amap.com/api/javascript-api/reference/search#m_AMap.Autocomplete
     */
    poiType: {
      type: String,
      default: ''
    },
    /**
     * 是否搜索停车场
     */
    isParklot: Boolean,
    /**
     * Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
     */
    appendToBody: Boolean,
    /**
     * 是否显示关闭按钮
     */
    showClose: {
      type: Boolean,
      default: true
    },
    /**
     * 是否隐藏底部按钮
     */
    hideFooter: Boolean,
    /**
     * 是否为dialog模式
     */
    isDialog: {
      type: Boolean,
      default: true
    },
    /**
     * 是否只读
     */
    readonly: Boolean,
    /**
     * 选择完成回调，与 value 不共存
     */
    onPicker: Function,
    /**
     * 是否支持自动完成
     */
    autoComplete: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mapHeight: 0,
      calcHeight: false,
      dialogVisible: false,
      map: null, //地图
      marker: null, //标记
      mapComplete: null, //Autocomplete
      mapSugEl: null, //地图搜索结果Dom
      poi: {}
    }
  },
  created() {
    this.initData()
    this.openViewMap()
    this.mapHeight = window.innerHeight * 60 / 100
    this.areaData =
      this.$utils.CityData ||
      (this.$utils.CityData = require('@/js/data/city.data'))
  },
  watch: {
    value: {
      handler(val) {
        setTimeout(() => this.openViewMap(), 500)
      },
      deep: true
    }
    // name() {
    //   this.completeSearch(true);
    // }
  },
  computed: {
    lnglat() {
      let { lng, lat } = this.poi
      return lng && lat ? `${lng},${lat}` : ''
    },
    geocoder() {
      return this.map ? new AMap.Geocoder() : null
    },
    name() {
      let { name, address } = this.poi
      return !this.$utils.isEmpty(name) ?
        name :
        !this.$utils.isEmpty(address) ? address : ''
    },
    completeInput() {
      return this.autoComplete ?
        this.$refs.autocomplete :
        this.$refs.autocompleteTemp
    }
  },
  methods: {
    initData() {
      this.poi = { ...this.value } || {}
    },
    /**
     * 打开只读地图
     */
    openViewMap() {
      !this.isDialog &&
        this.$utils.initMapSdk(() => {
          !this.isDialog &&
            this.$nextTick(() => {
              !this.map && this.initMap()
              if (this.value) {
                let { lng, lat } = this.value
                if (!isNaN(lng) && !isNaN(lat)) {
                  let lngLat = new AMap.LngLat(lng, lat)
                  this.map.setCenter(lngLat)
                  this.updateMarker(lngLat)
                }
              }
            })
        })
    },
    /**
     * 打开拾取框
     */
    open() {
      if (!this.isDialog) return
      this.dialogVisible = true
      this.$utils.initMapSdk(() => {
        this.$nextTick(() => {
          if (!this.calcHeight && this.isDialog) {
            let dialogBody = this.$refs.elDialog.$el.querySelector(
              '.el-dialog__body'
            )
            dialogBody && (dialogBody.style.height = this.mapHeight + 'px')
            this.calcHeight = true
          }
          !this.map && this.initMap()
          if (this.value) {
            this.initData()
            let { lng, lat } = this.poi
            if (!isNaN(lng) && !isNaN(lat)) {
              let lngLat = new AMap.LngLat(lng, lat)
              this.map && this.map.setCenter(lngLat)
              this.updateMarker(lngLat)
            }
            !this.mapSugEl && setTimeout(() => this.completeSearch(true), 500)
          }
        })
      })
    },
    /**
     * 关闭拾取框
     */
    close() {
      this.poi = {}
      this.map && this.map.clearMap()
      this.dialogVisible = false
      this.mapSugEl =
        this.mapSugEl || document.querySelector('.amap-sug-result')
      this.mapSugEl.style.visibility = 'hidden'
    },
    /**
     * 初始化地图
     */
    initMap() {
      this.map = new AMap.Map('mappicker-container', {
        resizeEnable: true,
        zoom: 18
      })

      this.map.plugin(['AMap.ToolBar'], () => {
        this.map.addControl(new AMap.ToolBar())
      })
      if (location.href.indexOf('&guide=1') !== -1) {
        this.map.setStatus({ scrollWheel: false })
      }

      //为地图注册click事件获取鼠标点击出的经纬度坐标
      !this.readonly &&
        this.map.on('click', e => {
          this.$refs.autocomplete.value = ''
          if (this.geocoder) {
            this.geocoder.getAddress(
              [e.lnglat.lng, e.lnglat.lat],
              (status, result) => {
                if (status === 'complete') {
                  let {
                    formattedAddress,
                    addressComponent: {
                      province,
                      city,
                      district,
                      building,
                      adcode,
                      township = '',
                      street = '',
                      streetNumber = ''
                    }
                  } = result.regeocode

                  let getBuilding = str => {
                    let index = formattedAddress.indexOf(str)
                    return index >= 0 ? str : ''
                  }

                  this.poi = {
                    name: !this.$utils.isEmpty(building) ?
                      building :
                      formattedAddress.substring(
                        (
                          province +
                            city +
                            district +
                            getBuilding(township) +
                            getBuilding(street) +
                            getBuilding(streetNumber)
                        ).length
                      ),
                    address: township + street + streetNumber,
                    ...this.filterCity(adcode),
                    lat: e.lnglat.lat,
                    lng: e.lnglat.lng,
                    modify: true
                  }
                  this.$refs.autocomplete.value = this.poi.name
                } else {
                  this.poi = {
                    lat: e.lnglat.lat,
                    lng: e.lnglat.lng,
                    modify: true
                  }
                }
                this.updateMarker(e.lnglat)
              }
            )
          } else {
            this.poi = { lat: e.lnglat.lat, lng: e.lnglat.lng, modify: true }
            this.updateMarker(e.lnglat)
          }
        })

      //注册自动完成监听，当选中某条记录时会触发
      let parkType =
        '150900|150903|150904|150905|150906|' +
        '190000|190100|190101|190102|190103|' +
        '190104|190105|190106|190107|190108|' +
        '190109|190200|190300|190301|190302|' +
        '190303|190304|190305|190306|190307|' +
        '190308|190309|190310|190311|190400|' +
        '190401|190402|190403|190500|190600|190700'
      !this.readonly &&
        AMap.event.addListener(
          this.mapComplete = new AMap.Autocomplete({
            input: this.completeInput,
            outPutDirAuto: true,
            type: this.isParklot ? parkType : this.poiType
          }),
          'select',
          e => {
            this.mapSugEl &&
              setTimeout(
                () =>
                  this.$utils.isEmpty(this.lnglat) &&
                  this.mapSugEl &&
                  (this.mapSugEl.style.visibility = 'hidden'),
                200
              )
            if (e.poi && e.poi.location) {
              let { name, adcode, address, location: { lat, lng } } = e.poi

              this.poi = {
                name,
                address,
                ...this.filterCity(adcode),
                lat,
                lng,
                modify: true
              }

              this.map.setZoom(15)
              this.map.setCenter(e.poi.location)
              this.updateMarker(new AMap.LngLat(lng, lat))
            }
          }
        )
    },
    /**
     * 变更 Marker
     */
    updateMarker(lnglat) {
      if (!this.marker) {
        this.marker = new AMap.Marker({
          icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: lnglat
        })
        this.marker.setMap(this.map)
      } else {
        this.marker.setPosition(lnglat)
      }
    },
    /**
     * 过滤省市区数据
     */
    filterCity(adcode) {
      let province, city, district
      this.$utils.forEach(this.areaData, (pVal, pKey) => {
        if (pKey === adcode) {
          province = pKey
          return false
        }
        if (!pVal.districts) return false
        this.$utils.forEach(pVal.districts, (cVal, cKey) => {
          if (cKey === adcode) {
            city = cKey
            return false
          }
          if (!cVal.districts) return false
          this.$utils.forEach(cVal.districts, (dVal, dKey) => {
            if (dKey === adcode) {
              province = pKey
              city = cKey
              district = dKey
              return false
            }
          })
        })
      })
      return { province, city, district }
    },
    /**
     * 自动完成搜索
     */
    completeSearch(isSearch = false) {
      console.log('search', isSearch)
      !this.$utils.isEmpty(this.$refs.autocomplete.value) &&
        this.mapComplete &&
        (isSearch || this.$utils.isEmpty(this.lnglat)) &&
        this.mapComplete.search(this.$refs.autocomplete.value, status => {
          if (status === 'complete') {
            this.mapSugEl =
              this.mapSugEl || document.querySelector('.amap-sug-result')
            if (this.mapSugEl) {
              setTimeout(
                () =>
                  this.$utils.isEmpty(this.lnglat) &&
                  (this.mapSugEl.style.visibility = 'visible'),
                200
              )
            }
          }
        })
    },
    /**
     * 确认完成
     */
    confirm() {
      this.dialogVisible = false
      if (this.onPicker) {
        this.onPicker(this.poi)
      } else {
        this.$emit('input', this.poi)
      }
    }
  }
}
</script>
<style lang="scss">
.amap-sug-result {
  z-index: 3000;
}
.map-picker {
  .el-dialog {
    .el-dialog__body {
      #mappicker-container {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 300px;
      }

      #mappicker-input {
        position: absolute;
        top: 55px;
        right: 10px;
        background: #fff none repeat scroll 0 0;
        border: 1px solid #ccc;
        margin: 10px auto;
        padding: 6px;
        font-family: 'Microsoft Yahei', '微软雅黑', 'Pinghei';
        font-size: 14px;
        label {
          margin: 0 20px 0 0;
          color: #666666;
          font-weight: normal;
        }
        input {
          width: 170px;
        }
        .column2 {
          padding-left: 25px;
        }
      }
    }
  }
}
</style>

