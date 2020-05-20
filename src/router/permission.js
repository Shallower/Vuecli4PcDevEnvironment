/*
 * @Descripttion:权限拦截
 * @version:
 * @Author: Hevin
 * @Date: 2020-05-20 17:07:21
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-20 17:21:31
 */

import {
  GET_ROLE_INFO,
  LOGOUT,
  HAS_PERMISSION,
  GENERATE_ROUTES
} from "@/store/types";

// eslint-disable-next-line no-unused-vars
export default (vue, to, from) => {
  return new Promise((resolve, reject) => {
    if (vue.$store.getters.isLogin) {
      if (to.path === "/login") {
        resolve({ path: "/" });
      } else {
        if (
          !vue.$store.getters.roles ||
          vue.$store.getters.roles.length === 0
        ) {
          vue.$store
            .dispatch(GET_ROLE_INFO)
            .then(roles => {
              vue.$store
                .dispatch(GENERATE_ROUTES, {
                  roles,
                  filter: permission => {
                    let isTollLogin = !vue.$utils.isEmpty(
                      vue.$utils.get(
                        vue.$store.getters.user,
                        "parkInfo.parkCode"
                      )
                    );
                    if (
                      !isTollLogin &&
                      permission === vue.$utils.roleType().ParkMerSentryBoxToll
                    ) {
                      return false;
                    } else if (isTollLogin) {
                      return (
                        permission ===
                        vue.$utils.roleType().ParkMerSentryBoxToll
                      );
                    }
                    return true;
                  }
                })
                .then(accessedRouters => {
                  // 生成可访问的路由表
                  vue.$router.addRoutes(accessedRouters); // 动态添加可访问路由表
                  resolve({ ...to }); // hack方法 确保addRoutes已完成
                });
            })
            // eslint-disable-next-line no-unused-vars
            .catch(err => {
              vue.$store.dispatch(LOGOUT);
              resolve({
                path: "/login",
                query: {
                  redirect: to.fullPath //将跳转的路由path作为参数
                }
              });
            });
        } else {
          vue.$store
            .dispatch(HAS_PERMISSION, {
              roles: vue.$store.getters.roles,
              route: to
            })
            .then(has => {
              if (has) {
                resolve();
              } else {
                resolve({
                  path: to.query.from === "login" ? "/" : "/401",
                  query: { noGoBack: true }
                });
              }
            });
        }
      }
    } else {
      if (to.path === "/login" || to.meta.constant) {
        // 在免登录白名单，直接进入
        resolve();
      } else {
        reject({
          path: "/login"
        });
      }
    }
  });
};
