/*
 * @Descripttion:用户信息Module
 * @version:
 * @Author: Hevin
 * @Date: 2020-05-20 17:07:43
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-20 18:16:51
 */

import Vue from "vue";
import {
  LOGOUT,
  INIT_USER,
  UPDATE_USER,
  UPDATE_ROLES,
  GET_ROLE_INFO,
  DEL_VISITED_VIEWS,
  RESET_ROUTERS,
  INIT_SOCKET
} from "@/store/types";
const user = {
  state: {
    user: null, //用户信息
    /**
     * 角色列表
     */
    roles: null
  },
  getters: {
    token: (state, getters) => (getters.user || {}).token, //授权身份标识
    isLogin: (state, getters) => {
      //是否登录，校验本地存储的token
      let user = getters.user;
      return (
        user &&
        !Vue.$utils.isEmpty(user.token) &&
        !Vue.$utils.isEmpty(user.roleIds)
      );
    },
    user: state => state.user || {},
    roles: state => state.roles || []
  },
  mutations: {
    /**
     * 触发登出，暂时闲置
     */
    [LOGOUT]: state => {
      localStorage.removeItem("phton_u_info");
      state.user = null;
    },
    /**
     * 更新本地用户缓存(包含有效时间,默认1天)
     */
    [UPDATE_USER]: (state, userInfo) => {
      if (!Vue.$utils.isEmptyObject(userInfo)) {
        Vue.$utils.setLocalItem("phton_u_info", (state.user = userInfo), {
          exp: 60 * 60 * 24,
          needCipher: true
        });
      }
    },
    /**
     * 缓存用户角色
     */
    [UPDATE_ROLES]: (state, roles) => {
      state.roles = roles;
    }
  },
  actions: {
    /**
     * 登出事件
     */
    [LOGOUT]({ dispatch, commit }) {
      commit(LOGOUT);
      commit(UPDATE_USER, null);
      commit(UPDATE_ROLES, null);
      dispatch(DEL_VISITED_VIEWS);
      dispatch(RESET_ROUTERS);
      dispatch(INIT_SOCKET);
    },
    /**
     * 初始化用户信息
     */
    [INIT_USER](context) {
      !context.state.user &&
        context.commit(
          UPDATE_USER,
          Vue.$utils.getLocalItem("phton_u_info", true) || {}
        );
    },
    /**
     * 更新缓存用户信息
     * @param {*} commit module
     * @param {Object} userInfo 用户信息
     */
    [UPDATE_USER]({ commit }, userInfo) {
      return new Promise(resolve => {
        commit(UPDATE_USER, userInfo);
        resolve(userInfo);
      });
    },
    /**
     * 设置用户角色
     * @param {*} roles 用户角色
     */
    [UPDATE_ROLES]({ commit }, roles) {
      return new Promise(resolve => {
        commit(UPDATE_ROLES, roles);
        resolve(roles);
      });
    },
    /**
     * 获取角色信息
     */
    [GET_ROLE_INFO]({ commit, getters }) {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        let roles = getters.user.roleIds
          ? getters.user.roleIds.split(",")
          : null;
        commit(UPDATE_ROLES, roles);
        resolve(roles);
      });
    }
  }
};

export default user;
