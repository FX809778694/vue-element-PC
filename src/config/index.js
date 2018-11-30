/* 开发环境地址配置 */
const dev = {
  //模拟接口
  // baseUrl: "https://www.easy-mock.com/mock/5b332666f3843242266468be/large_customer",
  //后台正式接口
  // baseUrl: "http://200.1.3.234:5568/api",
  baseUrl: "http://200.1.3.234:5566/api",
  uploadUrl: "",
  downloadUrl: ""
}

/* 生产环境地址配置 */
const prod = {
  baseUrl: "http://opbsb.etjbooks.com.cn/api",
  uploadUrl: "",
  downloadUrl: ""
}

const env = process.env.NODE_ENV

let Api

if (env === 'development') {
  Api = dev
} else {
  Api = prod
}


export default Api
