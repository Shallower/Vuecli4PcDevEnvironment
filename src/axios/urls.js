/*
 * 全局URL配置
 * @Author: 389194069@qq.com 
 * @Date: 2012-04-13 17:48:21 
 * @Last Modified by: 389194069@qq.com
 * @Last Modified time: 2018-06-28 16:46:53
 */
const Config = {
  prod: 'http://pay81.phtonspark.com', //Production
  uat: 'http://pay81.phtonspark.com', //UAT
  sit: 'http://dev2.phtonspark.com', //SIT
  dev: 'http://dev2.phtonspark.com' //DEV
}

const REQUEST_URL = location.origin || Config[process.env.ENV_CONFIG] //URL地址暂时设置为访问地址

const Url = {
  baseUrl: `${REQUEST_URL}/api`,

  /**资源路径 */
  asserts: `${REQUEST_URL}/asserts`
}
export default Url
