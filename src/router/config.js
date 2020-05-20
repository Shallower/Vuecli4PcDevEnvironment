/*
 * @Descripttion:路由配置
 * @version:
 * @Author: Hevin
 * @Date: 2020-05-20 17:07:21
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-20 17:28:33
 */

const _import = file => () => import(`@/views/${file}`);

/**
 * redirect : vue-router 默认参数
 * meta: {
 *     title: 菜单名称,
 *     icon: 侧边栏图标 iconfont,
 *     menu: 是否显示在侧边栏菜单,
 *     noredirect: Boolean, 是否支持重定向
 *     hideNavbar: Boolean, 是否隐藏 navbar
 *     index: 菜单顺序，默认按照添加顺序生成菜单,
 *     noDropDown: Boolean 是否显示展开箭头（false 不展开菜单）
 *     permission: 详见 readme.md 权限配置
 *     roles: 适用角色，当不同的角色拥有同样的权限时，控制哪些角色可见
 *   }
 **/
export const constantRoutes = [
  {
    path: "/login/:type?",
    component: _import("login/login"),
    meta: {
      title: "管理后台-登录",
      constant: true
    }
  },
  // { path: '/register', component: _import('login/register') },
  {
    path: "/404",
    component: _import("errorPage/404"),
    meta: {
      title: "404",
      constant: true
    }
  },
  {
    path: "/401",
    component: _import("errorPage/401"),
    meta: {
      title: "401",
      constant: true
    }
  }
];

/**
 * 转换 import 导入
 */
let convertImport = route => {
  route.component =
    typeof route.component === "string"
      ? _import(route.component)
      : route.component;
  if (Array.isArray(route.children) && route.children.length > 0) {
    route.children.forEach(child => convertImport(child));
  }
  return route;
};

/**
 * 动态扫描
 */
let modules = (r => {
  let tempModules = [];
  r.keys().forEach(key => {
    let moduleItem = r(key).default || r(key);
    if (Array.isArray(moduleItem)) {
      moduleItem.forEach(item => tempModules.push(convertImport(item)));
    } else {
      tempModules.push(convertImport(moduleItem));
    }
  });
  return tempModules;
})(require.context("./", true, /^\.\/modules\/((?!\/)[\s\S])+\.js$/));

modules.unshift({
  path: "home",
  component: _import("home/index"),
  meta: {
    title: "首页",
    constant: true
  }
});
//兼容 IE 排序
let length = modules.length - 1;
modules.forEach((route, index) => {
  for (let i = 0; i < length - index; i++) {
    let current = modules[i];
    let next = modules[i + 1];
    if (
      next &&
      ((current.meta || {}).index || 0) > ((next.meta || {}).index || 0)
    ) {
      modules[i] = next;
      modules[i + 1] = current;
    }
  }
});

/**
 * 权限动态配置路由
 */
export const asyncRoutes = [
  {
    path: "/",
    component: _import("layout/Layout"),
    redirect: "/home",
    children: modules
  },
  { path: "*", redirect: "/404", meta: { constant: true } }
];
