/* eslint-disable no-unused-vars */
import Vue from "vue";
import { asyncRoutes, constantRoutes } from "@/router";
import {
  UPDATE_ROUTES,
  RESET_ROUTERS,
  HAS_PERMISSION,
  GENERATE_ROUTES
} from "@/store/types";

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles 用户角色 [103,104]
 * @param route
 * @param filter 过滤函数，function
 */
function hasPermission(roles, route, filter) {
  if (roles && roles.length > 0) {
    if ((route.meta || {}).constant) return true;
    let permissionList = (route.meta || {}).permission;
    if ((route.path === "/" || route.path === "/home") && !permissionList) {
      //首页路由，不配置权限时，默认所有角色可以访问，配置权限时根据权限配置访问
      return true;
    } else if (permissionList) {
      return (Array.isArray(permissionList)
        ? permissionList
        : Object.keys(permissionList)
      ).some(permission =>
        roles.some(
          role =>
            String(role) === String(permission) &&
            (filter ? filter(permission, role) : true)
        )
      );
    }
  }
  return false;
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRoutes
 * @param roles 用户角色 [103,104]
 * @param filter 过滤函数，function
 */
function filterAsyncRouter(asyncRoutes, roles, filter) {
  const accessedRouters = asyncRoutes.filter(route => {
    if ((route.meta || {}).constant) return true;
    if (hasPermission(roles, route, filter)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles, filter);
      }
      return true;
    }
    return false;
  });
  return accessedRouters;
}

/**
 * 路由权限过滤
 */
const permission = {
  state: {
    routes: constantRoutes, //全部路由
    accessedRouters: null //允许访问的路由
  },
  getters: {
    routes: state => state.routes,
    accessedRouters: state => state.accessedRouters
  },
  mutations: {
    /**
     * 设置全局路由和可访问路由
     */
    [UPDATE_ROUTES](state, routes) {
      state.accessedRouters = Vue.$utils.deepClone(routes);
      state.routes = Vue.$utils.deepClone(constantRoutes.concat(routes));
    },
    [RESET_ROUTERS](state) {
      state.routes = constantRoutes;
      state.accessedRouters = [];
    }
  },
  actions: {
    /**
     * 检测当前用户是否有权限访问
     */
    [HAS_PERMISSION]({ commit }, data) {
      return new Promise((resolve, reject) => {
        resolve(hasPermission(data.roles, data.route));
      });
    },
    /**
     * 根据用户角色过滤可访问路由
     * @param {Array} roles 角色信息
     * @param {Function} filter(permission, role) 过滤函数
     */
    [GENERATE_ROUTES]({ commit }, { roles, filter }) {
      return new Promise(resolve => {
        let accessedRouters = filterAsyncRouter(
          Vue.$utils.deepClone(asyncRoutes),
          roles || [],
          filter
        );
        commit(UPDATE_ROUTES, accessedRouters);
        resolve(accessedRouters);
      });
    },
    /**
     * 重置
     */
    [RESET_ROUTERS]({ commit }) {
      commit(RESET_ROUTERS);
    }
  }
};

export default permission;
