/* eslint-disable */
/*
 * 数据模拟
 * @Author: 389194069@qq.com
 * @Date: 2012-04-13 17:53:50
 * @Last Modified by: 389194069@qq.com
 * @Last Modified time: 2018-07-12 17:40:05
 */
import Mock from "mockjs";

// 获取 mock.Random 对象
const Random = Mock.Random;
Mock.mock(/v2000/);

// Mock.mock( url, post/get , 返回的数据)；
Mock.mock(/v1\/login\/operatorLogin/, "post", {
  //登录
  ret: 0,
  data: {
    optorCode: Random.id(),
    name: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
    createTime: Random.date() + " " + Random.time(), // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
    uid: Random.guid(),
    id: Random.id(),
    token: Random.guid()
  }
});

Mock.mock(/service\/getUserAndRole/, "post", {
  //获取用户角色
  ret: 0,
  data: {
    userInfo: {
      name: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
      createTime: Random.date() + " " + Random.time(), // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
      uid: Random.guid(),
      optorCode: Random.id(),
      id: Random.id()
    },
    role: {
      name: "admin",
      permission: "ALL"
    }
  }
});

// Mock.mock(/park\/list/, 'get', {
//   //登录
//   ret: 0,
//   'data|20': [
//     {
//       parkname: () => Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
//       createTime: () => Random.date() + ' ' + Random.time(), // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
//       id: () => Random.id(),
//       address: () => Random.county(true),
//       type: () => {
//         let num = Math.floor(Math.random() * 4 + 1);
//         switch (num) {
//           case 1:
//             return '混合停车场';
//           case 2:
//             return '路外停车泊位';
//           case 3:
//             return '路内停车泊位';
//           case 4:
//             return '路测停车场';
//           default:
//             return '';
//         }
//       },
//       shanghu: () => Random.cword(4, 8),
//       status: () => Random.boolean()
//     }
//   ]
// });

// Mock.mock(/getaddress\/sheng/, "get", {
//   //登录
//   ret: 0,
//   "data|34": [
//     {
//       value: () => Random.province() // Random.cname() 随机生成一个常见的中文姓名
//     }
//   ]
// });

// Mock.mock(/getparkinfo/, 'get', {
//   //登录
//   ret: 0,
//   data: {
//     people: () => Random.province(), // Random.cname() 随机生成一个常见的中文姓名
//     parkname: () => Random.cname(),
//     type: () => '路测停车场',
//     tel: () => '13113667777',
//     address: () => '深圳市福田区',
//     lal: () => '123.23,323.23',
//     fixcar: () => '10',
//     total: () => '100'
//   }
// });

// Mock.mock(/start/, 'get', {
//   ret: 0,
//   msg: 'ok'
// });
// Mock.mock(/del/, 'get', {
//   ret: 0,
//   msg: 'ok'
// });
// Mock.mock(/v1\/parking\/photograph/, 'get', {
//   ret: 0,
//   key: '123123',
//   uploadUrl:
//     'http://p94klnnto.bkt.clouddn.com/880edbb9-a951-4fed-b019-10b6f68efb85'
// });
// Mock.mock(/v1\/parking\/exceptionInOut/, 'post', {
//   ret: 0
// });

// Mock.mock(/v1\/term\/findList/, 'get', {
//   //登录
//   ret: 0,
//   list: [
//     {
//       recordCode: Random.id(),
//       hardwareCode: Random.id(),
//       secretyKey: Random.time(), // Random.cname() 随机生成一个常见的中文姓名
//       requireCode: Random.time(), // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
//       remark: 0,
//       status: 1,
//       markInvalid: 1
//     },
//     {
//       recordCode: Random.id(),
//       hardwareCode: Random.id(),
//       secretyKey: Random.time(), // Random.cname() 随机生成一个常见的中文姓名
//       requireCode: Random.time(), // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
//       remark: 0,
//       status: 0,
//       markInvalid: 1
//     }
//   ]
// });
