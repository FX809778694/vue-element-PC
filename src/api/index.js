import axios from 'axios';
import qs from 'qs';
import Api from '../config';
// import store from '../store';
import router from '../router'

import {
  getItem,
  spliceToken
} from '../common/js/util'

const instance = axios.create({
  baseURL: Api.baseUrl,
  timeout: 16000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

// 错误信息处理函数
const handleErrorMsg = function (res) {
  if (res.Success !== true) {
    store.commit('setErrorMsg', res.ErrorMsg)
    store.commit('setRequestErr', true)
  }

  return res
}

/* 请求拦截器 */
instance.interceptors.request.use(config => {
  if (config.method === 'post') {
    // console.log(config)
    // 登陆页、注册页不做拦截
    if (config.url === 'User/Login' || config.url === 'User/Region') return config
    // User 信息不完善时重定向到登录页
    // if (!config.data.Token) {
    //   router.push({
    //     name: 'Login'
    //   })
    //
    //   return false
    // }

    return config;
  }
  return config;
}, err => {
  return Promise.reject(err);
});

/* 响应拦截器 */
instance.interceptors.response.use(res => {

  if (res.data.ErrorCode === 100) {
    router.push({
      name: 'Login'
    })
  }
  //超过十五分钟未操作跳转登陆
  if (res.data.ErrorCode === 205) {
    setTimeout(res => {
      router.push({
        name: 'Login'
      })
    }, 1000)
  }

  if (res.status != 200) {
    return Promise.reject(res);
  }
  return res;
}, err => {
  console.warn(err);
  return Promise.reject(err);
});

/* post 方法 promise 封装 */
const postWrap = (url, params) => {
  return new Promise((resolve, reject) => {
    instance.post(url, params).then(({
      data
    }) => resolve(data)).catch(err => reject(err));
  })
}
/* 从本地存储获取用户信息 */
const getUserInfo = () => {
  const User = getItem('BigUser')

  if (User) {
    let {
      UserId,
      UserType
    } = User

    return {
      UserId: UserId,
      UserType
    }
  } else {
    return {
      login: false
    }
  }
}

/**
 * ---------- 登录的验证图片 -----------
 * User/GetVerImg（GET）
 * @param 无
 */
export const fetchVerifyImg = params => {

  const url = "User/GetVerImgV2"
  return new Promise((resolve, reject) => {
    instance.post(url, params).then(res =>
      resolve(res)
    ).catch(err => reject(err));
  })
}
/**
 * ---------- 登录 -----------
 * login
 * User/Login（POST）
 * @param {*} params
 */
export const Login = params => {
  const url = 'User/Login';

  params = Object.assign({}, params);
  return postWrap(url, params);
}
/**
 * ---------- 退出登录 -----------
 * logout
 * User/Logout（POST）
 * @param {*} params
 */
export const loginOutApi = params => {
  const url = "User/Logout"
  const User = getUserInfo()

  const timeStamp = +new Date()
  const fetchDataJson = params.Data

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params.Data)


  return postWrap(url, Defaults)
}
/**
 * ---------- 主账号购物车中子账号下拉框数据 -----------
 *
 * User/GetOrderChildUser（POST）
 * @param { Obj } 请求参数对象
 */
export const fetchAccountDrop = params => {
  const url = "User/GetOrderChildUser"
  const User = getUserInfo()

  const timeStamp = +new Date()

  const fetchDataJson = params

  const Defaults = {
    TimeSpan: timeStamp,
    Token: spliceToken(timeStamp, fetchDataJson),
    UserType: User.UserType,
    UserId: User.UserId
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params);

  return postWrap(url, Defaults);
}
/**
 * ---------- 获取购物车商品 -----------
 *
 * ShopCar/GetGoods（POST）
 * @param { Obj } 请求参数对象
 */
export const fetchShopCarData = params => {
  const url = 'ShopCar/GetGoods'
  const User = getUserInfo()

  const timeStamp = +new Date()

  const fetchDataJson = params

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      PageIndex: 1,
      PageNum: 15,
      Channel: "",
      UserId: User.UserId
    }
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params)


  return postWrap(url, Defaults)
}
/**
 * ---------- 删除购物车商品多个或单个 -----------
 *
 * ShopCar/DelGoods（POST）
 * @param { Obj } 请求参数对象
 */
export const deleteShopCart = params => {
  const url = "ShopCar/DelGoods"
  const User = getUserInfo()

  const timeStamp = +new Date()

  const fetchDataJson = params

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  console.log(Defaults)

  Defaults.Data = Object.assign({}, Defaults.Data, params);

  return postWrap(url, Defaults)
}
/**
 * ---------- 获取多元产品的列表数据 -----------
 *
 * Good/SearchMultiGood（POST）
 * @param { Obj } 请求参数对象
 */
export const fetchMultiData = params => {
  const url = 'Good/SearchMultiGoods'
  const User = getUserInfo()

  const timeStamp = +new Date()

  const fetchDataJson = params

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params);

  return postWrap(url, Defaults)
}
/**
 * ---------- 获取子账号订单数据 -----------
 *
 * Order/ChildUserGetOrder（POST）
 * @param { Obj } 请求参数对象
 */
export const fetchAccountList = (params1, params2) => {
  const url = "Order/GetOrder";
  const User = getUserInfo();

  const timeStamp = +new Date();

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, params2),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params1);

  return postWrap(url, Defaults)
}
/**
 * ---------- 获取子账号订单详情 -----------
 *
 * Order/GetOrderDetail（POST）
 * @param { Obj } 请求参数对象
 */
export const fetchAccountDataList = params => {
  const url = "Order/GetOrderDetail";
  const User = getUserInfo();

  const timeStamp = +new Date();

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, params),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);

  return postWrap(url, Defaults)
}
/**
 * ---------- 提交订单数据 -----------
 *
 * Order/SubmitOrder（POST）
 * @param { Obj } 请求参数对象
 */
export const submitOrderData = params => {
  const url = "Order/SubmitOrder"
  const User = getUserInfo();

  const timeStamp = +new Date();

  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);

  console.log(Defaults);
  return postWrap(url, Defaults)
}
/**
 * ---------- 获取子账号列表数据 -----------
 *
 * User/GetChildUser（POST）
 * @param { Obj } 请求参数对象
 */
export const fetchListData = params => {

  const url = "User/GetChildUser";
  const User = getUserInfo();

  const timeStamp = +new Date();

  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);

  console.log(Defaults);
  return postWrap(url, Defaults)
}
/**
 * ---------- 添加子账号 -----------
 *
 * User/AddChildUser（POST）
 * @param { Obj } 请求参数对象
 */
export const addSubAccount = params => {
  const url = 'User/ChangeChildUser';
  const User = getUserInfo();

  const timeStamp = +new Date();

  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {}
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);

  return postWrap(url, Defaults)
}

/**
 * ---------- 启用和停用子账号 -----------
 *
 * Manage/Good/ChangeUserState（POST）
 * @param { Obj } 请求参数对象
 */
export const ableAccountApi = params => {

  const url = "Manage/Good/ChangeUserState";
  const User = getUserInfo();

  const timeStamp = +new Date();

  const fetchDataJson = params.Data;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params.Data);

  console.log(Defaults);
  return postWrap(url, Defaults)
}

/**
 * ---------- 主页商品数据 -----------
 *
 * Good/GetMainPageGoods（POST）
 * @param {*} null
 */
export const fetchIndexShop = params => {
  const url = 'Good/GetMainPageGoods';

  return postWrap(url, params)
}
/**
 * ---------- 主页轮播图片数据 -----------
 *
 * Activity/GetMainPageActivity（POST）
 * @param {*} null
 */
export const fetchIndexImg = () => {
  const url = 'Activity/GetMainPageActivity'

  let params = {
    Data: {
      IsUse: "1"
    }
  }
  return postWrap(url, params)
}

/**
 * ---------- 首页热词 -----------
 *
 * HotWord/GetMainHotWord（POST）
 * @param { Obj } 请求参数对象
 */
export const GetMainHotWord = params => {
  const url = 'HotWord/GetMainHotWord'

  return postWrap(url, params)
}

/**
 * ---------- 搜索图书 -----------
 *
 * Good/SearchBook（POST）
 * @param {Obj} 请求参数对象
 */
export const SearchBook = params => {
  const url = 'Good/SearchBook'
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    Token: spliceToken(timeStamp, fetchDataJson),
    UserId: User.UserId,
    UserType: User.UserType,
    TimeSpan: timeStamp
  }

  let reqData = {
    ...Defaults
  };

  reqData.Data = Object.assign({}, Defaults.Data, params)

  return postWrap(url, reqData)
}

/**
 * ---------- 获取详请 -----------
 *
 * Good/GetBookById（POST）
 * @param 无
 */
export const fetchBookDetail = (params) => {
  const url = 'Good/GetBookById'
  // console.log(params)
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params.Data;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {}
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params.Data);
  return postWrap(url, Defaults)
}
/**
 * ---------- 获取多元产品详请 -----------
 *
 * Good/GetMultiGoods（POST）
 * @param 无
 */
export const fetchBookMultiDetail = (params) => {
  const url = "Good/GetMultiGoods"

  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {}
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults)
}
/**
 * 大中专教材页面上面的图书banner
 * Good/GetDzzjcBanner(get)
 * @param {obj} params
 */
export const getBookBanner = params => {
  const url = "Good/GetDzzjcBanner"
  const User = getUserInfo();

  const timeStamp = +new Date();

  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);

  return postWrap(url, Defaults)
};
/**
 * ---------- 修改购物车的信息 -----------
 *
 * Good/EditGoods（POST）
 * @param {obj} 参数对象
 */
export const editShopCartData = params => {
  const url = "ShopCar/UpdateGoods"

  const User = getUserInfo();

  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {}
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);

  console.log(Defaults);
  return postWrap(url, Defaults)
}
/**
 * ---------- 批量修改购物车的信息 -----------
 *
 * ShopCar/UpdateGoods（POST）
 * @param {obj} 参数对象
 */
export const editShopBatchCartData = params => {
  const url = "ShopCar/UpdateGoods"

  const User = getUserInfo();

  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);

  console.log(Defaults);
  return postWrap(url, Defaults)
}
/**
 * 加入购物车
 * ShopCar/AddGoods(post)
 * @param {obj} params参数对象
 */
export const addShopCartApi = params => {
  const url = "ShopCar/AddGoods"

  const User = getUserInfo()
  const timeStamp = +new Date()
  const fetchDataJson = params.Data;

  let Defaults = {
    Token: spliceToken(timeStamp, fetchDataJson),
    UserId: User.UserId,
    UserType: User.UserType,
    TimeSpan: timeStamp,
    Data: params.Data
  }

  return postWrap(url, Defaults)
}
/**
 * 详情的业务员联系方式
 * Good/GetCipInfo(post)
 * @param {obj} params参数对象
 */
export const fetchContact = params => {
  const url = "Good/GetCipInfo"

  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Spxxid: '',
      Type: ''
    }
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params.Data);
  console.log(Defaults);
  return postWrap(url, Defaults)
}
/**
 * 大中专上面的出版社Logo
 * Good/GetDzzjcCbs(post)
 * @param {obj} params参数对象
 */
export const fetchKeyProducts = () => {
  const url = "Good/GetDzzjcCbs"

  return postWrap(url)
}
/**
 * 导出选中商品
 * Good/ExportDataById(post)
 * @param {obj} params参数对象
 */
export const exportShopApi = params => {
  const url = "Good/ExportDataById"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson.Data),
    Data: {
      BookId: ''
    }
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params.Data);
  console.log(Defaults)
  return postWrap(url, Defaults)
}
/**
 * 导出全部商品
 * Good/ExportData(post)
 * @param {obj} params参数对象
 */
export const exportAllShopApi = params => {
  const url = "Good/ExportData"

  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson.Data),
    Data: {

    }
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params.Data);

  return postWrap(url, Defaults)
}
/**
 * 导出购物车全部商品
 * ShopCar/ExportGoods(post)
 * @param {obj} params参数对象
 */
export const exportCarAllShopApi = params => {
  const url = "ShopCar/ExportGoods"

  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson.Data),
    Data: {

    }
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params.Data);

  return postWrap(url, Defaults)
}
/**
 * 导出购物车选中商品
 * ShopCar/ExportGoods(post)
 * @param {obj} params参数对象
 */
export const exportShopCarApi = params => {
  const url = "ShopCar/ExportGoods"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson.Data),
    Data: {
      Guid: ''
    }
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params.Data);
  console.log(Defaults)
  return postWrap(url, Defaults)
}
/**
 * 获取聊天记录
 * Chat/GetChatHistory(post)
 * @param {obj} params参数对象
 */
export const getRecordApi = params => {
  const url = "Chat/GetChatHistory"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Type: '',
      PageIndex: 1,
      PageNum: 50
    }
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params);

  return Defaults;
}
/**
 * 发送消息
 * Chat/SendMessage(post)
 * @param {obj} params参数对象
 */
export const sendMessageApi = params => {

  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  console.log(spliceToken(timeStamp, fetchDataJson))
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Message: '',
      Type: ''
    }
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params);

  return Defaults;
}

/**
 * 导出订单
 * Order/ExportOrderDetail(post)
 * @param {obj} params参数对象
 */
export const exportOrderApi = params => {
  const url = "Order/ExportOrderDetail"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson.Data),
    Data: {
      OrderId: ''
    }
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params.Data);

  return postWrap(url, Defaults)
}

/**
 * 撤回订单
 * Order/CancelOrder(post)
 * @param {obj} params参数对象
 */
export const revokeOrderApi = params => {
  const url = "Order/CancelOrder"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson.Data),
    Data: {
      OrderId: ''
    }
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params.Data);

  return postWrap(url, Defaults)
}
/**
 * 获取热词商品列表
 * Good/GetBookByHotWord(post)
 * @param {obj} params参数对象
 */
export const getHotWordListApi = params => {
  const url = "Good/GetBookByHotWord"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson.Data),
    Data: {

    }
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params.Data);

  return postWrap(url, Defaults)
}

/**
 * 获取频道
 * Channel/GetChannelTree(post)
 */
export const getChannelApi = () => {
  const url = "Channel/GetChannelTree";

  return postWrap(url, {})
}
