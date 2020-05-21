/*
 * @Descripttion:全局配置Module
 * @version:1.0
 * @Author: Hevin
 * @Date: 2020-05-20 17:07:43
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-20 19:08:06
 */

import {
  UPDATE_CONFIG,
  TOGGLE_SIDEBAR,
  ADD_VISITED_VIEWS,
  DEL_VISITED_VIEWS
  // GET_GATEWAY_SOCKET,
  // INIT_SOCKET
} from "@/store/types";

const global = {
  state: {
    sidebar: {
      //侧边栏是否打开
      opened: !+Number(sessionStorage.sidebarStatus || "0")
    },
    visitedViews: [], //顶部边栏显示已经点击过的 el-tag
    //全局配置
    config: {
      amapKey: "8d0584f43d6c3e520dc96fe877062bc0",
      socketUrl: `${location.protocol === "https:" ? "wss" : "ws"}://${
        location.host
      }/ws/eventStream`
    }
  },
  getters: {
    global: state => state.config || {},
    sidebar: state => state.sidebar,
    visitedViews: state => state.visitedViews
  },
  mutations: {
    /**
     * 更新全局配置
     */
    [UPDATE_CONFIG]: (state, config) => {
      state.config = Object.assign(state.config, state.config, config || {});
    },
    /**
     * 切换侧边栏打开/关闭
     */
    [TOGGLE_SIDEBAR]: state => {
      if (state.sidebar.opened) {
        sessionStorage.sidebarStatus = 1;
      } else {
        sessionStorage.sidebarStatus = 0;
      }
      state.sidebar.opened = !state.sidebar.opened;
    },
    /**
     * 增加已访问的视图用于顶栏 el-tag 标签展示
     */
    [ADD_VISITED_VIEWS]: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return;
      state.visitedViews.push({
        meta: view.meta,
        name: view.name,
        path: view.path,
        fullPath: view.fullPath
      });
    },
    /**
     * 删除已访问的视图
     */
    [DEL_VISITED_VIEWS]: (state, view) => {
      if (!view) {
        state.visitedViews = [];
        return;
      }
      let index;
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          index = i;
          break;
        }
      }
      state.visitedViews.splice(index, 1);
    }
  },
  actions: {
    /**
     * 更新全局配置
     * @param {Store} commit module
     * @param {Object} config 配置信息
     */
    [UPDATE_CONFIG]({ commit }, config) {
      commit(UPDATE_CONFIG, config);
    },
    /**
     * 切换侧边栏打开/关闭
     */
    [TOGGLE_SIDEBAR]({ commit }) {
      commit(TOGGLE_SIDEBAR);
    },
    /**
     * 增加已访问的视图用于顶栏 el-tag 标签展示
     * @param {Router} view 访问过的视图
     */
    [ADD_VISITED_VIEWS]({ commit }, view) {
      commit(ADD_VISITED_VIEWS, view);
    },
    /**
     * 删除已访问的视图
     * @param {Router} view 访问过的视图
     */
    [DEL_VISITED_VIEWS]({ commit, state }, view) {
      return new Promise(resolve => {
        commit(DEL_VISITED_VIEWS, view);
        resolve([...state.visitedViews]);
      });
    }
    /**
     * 获取出入口socket地址
     */
    // [GET_GATEWAY_SOCKET]({ commit }, gwCode) {
    //   return new Promise(resolve => {
    //     Vue.axios
    //       .get('/v1/term/queryCameraIP', {
    //         params: {
    //           gwCode
    //         },
    //         silence: true
    //       })
    //       .then(res => {
    //         // ws://192.168.1.62:9080/ws
    //         !Vue.$utils.isEmpty(res.data) &&
    //           resolve(
    //             `${location.protocol === 'https:' ? 'wss' : 'ws'}://${
    //               res.data
    //             }:9080/ws`
    //           )
    //       })
    //   })
    // },
    /**
     * 初始化 Socket
     */
    // [INIT_SOCKET]({ getters }, socketUrl) {
    //   return new Promise(resolve => {
    //     if (
    //       Vue.prototype.$socket &&
    //       Vue.prototype.$socket.readyState() === WebSocket.OPEN
    //     ) {
    //       Vue.prototype.$socket.close()
    //     }
    //     Vue.prototype.$socket = null
    //     if (!Vue.$utils.isEmpty(socketUrl)) {
    //       Vue.prototype.$socket = Vue.$utils.createWebSocket(socketUrl, {
    //         debug: $globalConfig.console,
    //         heartCheck: false
    //       })
    //       resolve(Vue.prototype.$socket)
    //     } else {
    //       let parkCode = (getters.user.parkInfo || {}).parkCode
    //       if (!Vue.$utils.isEmpty(parkCode)) {
    //         Vue.prototype.$socket = Vue.$utils.createWebSocket(
    //           `${getters.global.socketUrl}?${parkCode}`,
    //           {
    //             debug: $globalConfig.console,
    //             heartCheck: false
    //           }
    //         )
    //         resolve(Vue.prototype.$socket)
    //       }
    //     }
    //   })
    // }
  }
};
export default global;
