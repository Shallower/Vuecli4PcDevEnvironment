/*
 * 错误日志
 * @Author: Hevin
 * @Date: 2018-04-08 10:19:49
 * @Last Modified by: Hevin
 * @Last Modified time: 2018-07-13 12:29:00
 */
import { PUSH_LOG, CLEAR_LOG } from "@/store/types";
const errlog = {
  state: {
    errLog: []
  },
  getters: {
    errLog: state => state.errLog
  },
  mutations: {
    /**
     * 记录错误日志
     */
    [PUSH_LOG]: (state, log) => {
      state.errLog.unshift(log);
    },
    /**
     * 清除错误日志
     */
    // eslint-disable-next-line no-unused-vars
    [CLEAR_LOG]: (state, log) => {
      state.errLog = [];
    }
  },
  actions: {
    /**
     * 记录错误日志
     * @param {Object} log 错误日志
     */
    pushLog({ commit }, log) {
      commit(PUSH_LOG, log);
    },
    clearLog({ commit }) {
      commit(CLEAR_LOG);
    }
  }
};

export default errlog;
