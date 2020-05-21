/*
 * 公共状态配置
 * @Author: 389194069@qq.com
 * @Date: 2012-04-18 09:29:59
 * @Last Modified by: 389194069@qq.com
 * @Last Modified time: 2012-05-27 16:44:03
 */
module.exports = {
  /**
   * 是否
   */
  Whether: [
    {
      code: "1",
      value: true,
      label: "是",
      name: "Yes"
    },
    {
      code: "0",
      value: false,
      label: "否",
      name: "No"
    }
  ],

  //状态
  ParkingStatus: [
    {
      code: "",
      label: "全部"
    },
    {
      code: "-1",
      label: "未启用",
      icon: "icon-kongtiaoguankong-",
      color: "#69e3ff",
      name: "NotEnabled"
    },
    {
      code: "1",
      label: "启用",
      icon: "icon-qiyong2",
      color: "#4095de",
      name: "Enable"
    },
    {
      code: "0",
      label: "禁用",
      icon: "icon-jinyong",
      color: "#ff3d3d",
      name: "Disable"
    }
  ],

  //启用状态
  StaffStatus: [
    {
      code: "",
      label: "全部"
    },
    {
      code: "0",
      label: "启用",
      icon: "icon-qiyong2",
      color: "#4095de",
      name: "Enable"
    },
    {
      code: "1",
      label: "禁用",
      icon: "icon-jinyong",
      color: "#ff3d3d",
      name: "Disable"
    }
  ]
};
