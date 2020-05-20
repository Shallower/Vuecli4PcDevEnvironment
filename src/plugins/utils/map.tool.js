/*
 * 地图工具
 * @Author: 389194069@qq.com 
 * @Date: 2018-05-26 10:04:03 
 * @Last Modified by: 389194069@qq.com
 * @Last Modified time: 2018-08-09 17:11:06
 */
let MapTools = (function () {
  let aMapKey

  /**
   * 配置地图Key
   */
  function configMapKey(key) {
    aMapKey = key
    delete this.configMapKey
  }

  /**
   * 初始化地图SDK
   */
  function initMapSdk(cb) {
    if (!aMapKey || aMapKey === '') {
      console.warn('AMap.Sdk missing key')
      return
    }
    let path = `http://webapi.amap.com/maps?v=1.4.6&key=${aMapKey}&plugin=AMap.Autocomplete,AMap.Geocoder`,
      mapScript = document.querySelector(`script[src$="${path}"]`)
    if (mapScript === null) {
      let a = document.createElement('script')
      a.src = path
      a.onload = () => {
        console.log('AMap.Sdk load success !!! ')
        a.setAttribute('loaded', true)
        cb && cb()
      }
      a.onerror = () => {
        console.error('AMap.Sdk load fail , path : ', path)
      }
      let c = document.getElementsByTagName('script')[0]
      c.parentNode.insertBefore(a, c)
    } else if (mapScript.hasAttribute('loaded')) {
      cb && cb()
    }
  }

  /**
   * 初始化地图
   * @param {String|HTMLDivElement} container 地图容器DIV的ID值或者DIV对象
   * @param {*} options 地图初始化参数对象，参数详情参看MapOptions列表 //https://lbs.amap.com/api/javascript-api/reference/map#MapOption
   */
  function initMap(container, options) {
    return new Promise(resolve => {
      setTimeout(
        () =>
          this.initMapSdk(() => {
            let map = new AMap.Map(
              container,
              options || {
                resizeEnable: true,
                zoom: 18
              }
            )

            map.plugin(['AMap.ToolBar'], () => {
              map.addControl(new AMap.ToolBar())
            })
            if (location.href.indexOf('&guide=1') !== -1) {
              map.setStatus({ scrollWheel: false })
            }
            resolve(map)
          }),
        0
      )
    })
  }

  return {
    configMapKey: configMapKey, //配置地图Key
    initMapSdk: initMapSdk, //初始化地图SDK
    initMap: initMap //初始化地图
  }
})()

typeof exports === 'object' && typeof module !== 'undefined' ?
  module.exports = MapTools :
  window.MapTools = MapTools
