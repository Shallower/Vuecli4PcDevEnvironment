import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { MapOption, RoleType } from "@/js/mapOption";
import "./plugins";
import "./directive";

Vue.config.productionTip = false;
//install Global
let installGlobal = () => {
  //IE
  window.FormData = (function() {
    if (window.FormData === undefined) {
      let ieFormData = function() {
        this.processData = true;
        this.contentType = "application/x-www-form-urlencoded";
      };
      ieFormData.prototype.append = function(name, value) {
        this[name] = value === undefined ? "" : value;
        return true;
      };
      return ieFormData;
    }
    return window.FormData;
  })();

  if (!window.location.origin) {
    window.location.origin =
      window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port ? ":" + window.location.port : "");
  }

  let Axios = require("./axios").default;
  Vue.axios = Axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return Axios;
      }
    },
    //全局字典项
    MapOption: {
      get() {
        return MapOption;
      }
    },
    RoleType: {
      get() {
        return RoleType;
      }
    }
  });
};
installGlobal();
window.Vue = Vue;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
