/*
 * @Descripttion:全局状态管理
 * @version:
 * @Author: Hevin
 * @Date: 2020-05-20 17:07:43
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-20 17:30:03
 */

import Vue from "vue";
import Vuex from "vuex";
import global from "./modules/global";
import user from "./modules/user";
import permission from "./modules/permission";
import errlog from "./modules/errLog";
Vue.use(Vuex);

/**Default Module */
const store = new Vuex.Store({
  modules: {
    global,
    user,
    permission,
    errlog
  },
  strict: process.env.NODE_ENV !== "production"
});
export default store;
