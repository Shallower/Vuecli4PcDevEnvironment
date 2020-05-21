/*
 * 错误日志路由
 * @Author: Hevin
 * @Date: 2018-04-13 17:55:24
 * @Last Modified by: Hevin
 * @Last Modified time: 2018-06-12 11:08:48
 */
import { RoleType } from "@/js/mapOption";
export default {
  path: "errlog",
  component: "errlog/index",
  meta: {
    title: "错误日志",
    icon: "el-icon-warning",
    menu: true,
    index: 999, //默认最后一级
    permission: [process.env.NODE_ENV !== "prod" ? RoleType.OptorAdmin : "000"]
  }
};
