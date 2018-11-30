import md5 from "js-md5";

export const setItem = (name, val) => {
  val = JSON.stringify(val);

  return window
    .localStorage
    .setItem(name, val);
}
export const getItem = name => {
  name = window
    .localStorage
    .getItem(name);
  name = JSON.parse(name);

  return name
};
export const removeItem = opt => window
  .localStorage
  .removeItem(opt);

export function getCheckedArr(checkData, tableData, Str) {
  let arr = []
  for (let j = 0; j < checkData.length; j++) {

    for (let i = 0; i < tableData.length; i++) {
      console.log(tableData[i][Str])
      if (tableData[i][Str] === checkData[j][Str]) {
        arr.push(tableData[i])
        break;
      }
    }
  }
  return arr
}
// 组合数据 主用于 几大频道获取列表数据共用搜索接口处
export function recombinedData(data) {
  let certainChannel = []
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      certainChannel.push(data[i][j])
    }
  }
  return certainChannel
}
/**
 * 拼接 Id 变成,连接
 * Str 主键
 */
export function splitData(data, Str) {

  let arr = []
  for (let i = 0; i < data.length; i++) {
    arr.push(data[i][Str])
  }

  return arr.join(',')
}

/**
 * 拼接 token
 */
export const spliceToken = function (timeStamps, fetchDataJson) {
  let User = getItem('BigUser')
  let JsonData = JSON.stringify(fetchDataJson).replace(/\s+/g, "");

  if (User) {
    let {
      UserId,
      UserType,
      Token
    } = User;

    UserType = UserType.toLowerCase();
    // debugger
    // console.log(UserId + UserType + timeStamps + JsonData + Token)
    return md5(UserId + UserType + timeStamps + JsonData + Token);
  } else {
    return ''
  }

}

//获取精确的计算
//加
export const add = function (a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}
//乘
export const mul = function (a, b) {
  var c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) {}
  try {
    c += e.split(".")[1].length;
  } catch (f) {}
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
//减
export const sub = function (a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;

}
//除
export const div = function (a, b) {
  var c, d, e = 0,
    f = 0;
  try {
    e = a.toString().split(".")[1].length;
  } catch (g) {}
  try {
    f = b.toString().split(".")[1].length;
  } catch (g) {}
  return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}

// 去除时间格式的:输出一个以空格代替的 一个以空代替的为了加密
export const adjustTime = (timeStart, timeEnd) => {

  let timeStart1 = timeStart.split("");
  timeStart1[10] = ""
  let timeStart11 = timeStart1.join("")

  let timeEnd2 = timeEnd.split("");
  timeEnd2[10] = ""
  let timeEnd12 = timeEnd2.join("")

  let timeStart3 = timeStart.split("");
  timeStart3[10] = " "
  let timeStart13 = timeStart3.join("")

  let timeEnd4 = timeEnd.split("");
  timeEnd4[10] = " "
  let timeEnd14 = timeEnd4.join("")

  let time = {
    timeStart11: timeStart11,
    timeEnd12: timeEnd12,
    timeStart21: timeStart13,
    timeEnd22: timeEnd14
  }

  return time
}

// 权限管理工具处理函数
export const authorFn = (channelLimit, type) => {

  if(channelLimit.find( item => item === type )) {
    return true
  }
  return false
};
