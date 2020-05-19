//全局注册指令
import Vue from "vue";
(r => r.keys().map(key => Vue.use(r(key).default || r(key))))(
  require.context("./", false, /^((?!index).)*\.js$/)
);
export default Vue;
