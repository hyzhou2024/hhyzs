const config = require('./config.js');
const {
  async
} = require('./runtime.js');
String.prototype.format = function (t) {
  if (arguments.length > 0) {
    var n, r = this;
    if (1 == arguments.length && null != t && "object" == (void 0 === t ? "undefined" : e(t)))
      for (var o in t) n = new RegExp("([{]" + o + "[}])", "g"),
        r = r.replace(n, null == t[o] ? "" : t[o]);
    else
      for (var a = 0; a < arguments.length; a++) n = new RegExp("([{]" + a + "[}])", "g"),
        r = r.replace(n, null == arguments[a] ? "" : arguments[a]);
    return r;
  }
  return this;
};
/**
 * POST/GET请求
 * @param {*} method 
 * @param {*} url
 */
async function request(method, url, data) {
  data.token = await getToken()
  data.mini_app_name = config.mini_app_name
  // data.token = '23445'
  //console.log(data)
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: resolve,
      fail: reject
    })
  })

}

/**
 * POST/GET请求
 * @param {*} method 
 * @param {*} url
 */
async function upLoadFile(avatarUrl) {

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: 'https://minidataservice.com/upload2', //仅为示例，非真实的接口地址
      filePath: avatarUrl,
      name: 'file',
      formData: {
        'user': 'test'
      },
      success(res) {
          
        const data = JSON.parse(res.data)
        console.log(data)
        var url = 'https://minidataservice.com/image/' + data.filename
        resolve(url)
      }
    })

  })

}
/**
 * 获取文章列表
 * @param {} page 
 */
async function getVersion(options) {
  var openid = await getOpenId()
  var onlaunch = wx.getLaunchOptionsSync();
  //console.log(onlaunch.scene)
  let data = {
    openid: openid,
    scene: onlaunch.scene,
    // scene:1037,
    type: config.type,
    action: "getVersion",
    app_version: config.version,
    secondid: await registerSecondId(options),
    shareid: await registerShareId(options)
  }
  let res = await request('post', config.url, data);
  return res.data
}

async function getOpenId() {

  var openid = wx.getStorageSync('openid')
  //console.log('openid',openid)
  if (openid) {
    //console.log('openid已经存在')
    return openid
  } else {
    //console.log('openid不存在')
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            var url = 'https://minidataservice.com/webapi'
            var body = {
              "code": res.code,
              "type": "hlly1.0.0",
              "action": 'getOpenid',
              'token': res.code,
              'mini_app_name': config.mini_app_name
            }
            wx.request({
              method: 'post',
              url: url, //仅为示例，并非真实的接口地址
              data: body,
              header: {
                'content-type': 'application/json' // 默认值
              },

              success(res) {
                resolve(res.data)
                //console.log(res.data)
                wx.setStorageSync('openid', res.data)

              }
            })
            //console.log(res)
          } else {
            //console.log('登录失败！' + res.errMsg)
          }
        }
      })

    })

  }


}

/**
 * 获取文章列表
 * @param {} page 
 */
async function getPostsList(content_type, page, filter, isShow, orderBy, label) {
  let data = {
    type: 'hlzs',
    app_name: config.app_name,
    api: 'uatgetPostsList',
    content_type: content_type,
    page: page,
    filter: filter,
    isShow: isShow,
    orderBy: orderBy,
    label: label
  }
  let res = await request('post', config.url, data);
  console.log(res.data)
  return res.data

}

async function getNewPostsList(page, classify) {
  let data = {
    type: 'hlzs',
    app_name: config.app_name,
    api: 'uatgetPostsList',
    content_type: classify,
    page: page

  }
  console.log(page)
  let res = await request('post', config.url, data);
  console.log(res.data)
  return res.data
}
/**
 * 获取label集合
 */
async function getLabelList() {
  let data = {
    type: 'hlzs',
    app_name: config.app_name,
    api: 'getLabelList',

  }
  let res = await request('post', config.url, data);
  //console.log(res.data)
  return res.data

}
/**
 * 获取文章详情
 * @param {} id 
 */

async function getPostDetail(id) {
  let data = {
    type: 'hlzs',
    app_name: config.app_name,
    api: 'uatgetPostDetail',
    id: id,
  }
  let res = await request('post', config.url, data);
  //console.log(res.data)
  return res.data

}
/**
 * 验证是否是管理员
 */
async function checkAuthor() {
  let data = {
    type: 'adminService',
    action: 'checkAuthor'
  }
  let res = await request('post', config.url, data);
  return res
}

/**
 * 获取label集合
 */
async function getClassifyList() {
  let data = {
    type: 'adminService',
    app_name: config.app_name,
    action: 'getClassifyList'
  }
  let res = await request('post', config.url, data);
  // console.log(res.data)
  return res.data
}
//获取token
async function getToken() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          resolve(res.code)
        } else {
          //console.log('登录失败！' + res.errMsg)
        }
      }
    })

  })
}
/**
 * 查询用户是否参与活动
 * @param {*} 
 */
async function checkUserorder(issue) {
  var openid = await getOpenId()
  let data = {
    type: config.type,
    action: 'checkUserorder',
    issue: issue,
    openid: openid
  }
  let res = await request('post', config.url, data);
  //console.log(res.data)
  return res.data
}

async function joinActivity(issue) {
  var openid = await getOpenId()
  let data = {
    type: config.type,
    action: 'joinActivity',
    issue: issue,
    openid: openid
  }
  let res = await request('post', config.url, data);
  //console.log(res.data)
  return res.data

}
async function sjoinActivity(code, choose_num) {
  var openid = await getOpenId()
  let data = {
    type: config.type,
    action: 'sjoinActivity',
    code: code,
    choose_num: choose_num,
    openid: openid
  }
  let res = await request('post', config.url, data);
  //console.log(res.data)
  return res.data

}
async function queryLuckDetail(issue,id) {
  var openid = await getOpenId()
  let data = {
    type: config.type,
    action: 'queryLuckDetail',
    issue: issue,
    openid: openid,
    id:id
  }
  console.log(data)
  let res = await request('post', config.url, data);
  //console.log(res.data)
  return res.data

}

async function queryLuckUsers(issue) {
  var openid = await getOpenId()
  let data = {
    type: config.type,
    action: 'queryLuckUsers',
    issue: issue,
    openid: openid
  }
  let res = await request('post', config.url, data);
  //console.log(res.data)
  return res.data

}
async function queryLatestLuckUsers() {
  var openid = await getOpenId()
  let data = {
    type: config.type,
    action: 'queryLatestLuckUsers',
    openid: openid
  }
  let res = await request('post', config.url, data);
  // console.log(res.data)
  return res.data

}
async function registerSecondId(options) {
  try {
    if (options.secondId) {
      return options.secondId
    } else {
      ////console.log('路由不带参数')
      return ''
    }
  } catch (error) {

  }
}

async function registerShareId(options) {
  try {
    if (options.shareid) {
      return options.shareid
    } else {
      ////console.log('路由不带参数')
      return ''
    }
  } catch (error) {

  }
}
async function getCoinsDetailList(page) {
  var openid = await getOpenId()
  let data = {
    type: config.type,
    action: 'getCoinsDetailList',
    openid: openid,
    page: page
  }
  let res = await request('post', config.url, data);
  //console.log(res);
  return res.data.list
}

async function getLuckJoinRecord(page, id) {
  var openid = await getOpenId()
  let data = {
    type: config.type,
    action: 'getLuckJoinRecord',
    openid: openid,
    page: page,
    id: id
  }
  let res = await request('post', config.url, data);
  //console.log(res);
  return res.data.list
}
async function gethead(id) {
  var openid = await getOpenId()
  let data = {
    type: config.type,
    action: 'gethead',
    openid: openid,
    id: id
  }
  let res = await request('post', config.url, data);
  console.log(res);
  return res.data.a
}

async function getFxDetail(r, n, a) {
  let data = {
    type: config.type,
    action: 'fx',
    api: 'open',
    lastIssue: r,
    redvalue: n,
    bluevalue: a
  }
  console.log(data)
  let res = await request('post', config.url, data);
  console.log(res);
  return res.data

}
async function getConfig(r, n, a) {
  var xcx_config = wx.getStorageSync('xcx_config')
  if (!xcx_config) {
    let data = {
      type: config.type,
      action: 'config'
    }

    let res = await request('post', config.url, data);
    console.log(res);
    wx.setStorageSync('xcx_config', res.data)
    return res.data
  } else {
    if (new Date().getTime() < xcx_config.d_time) {
      console.log('数据未超过24小时，仍然有效')
      return xcx_config
    } else {
      let data = {
        type: config.type,
        action: 'config'
      }

      let res = await request('post', config.url, data);
      console.log(res);
      wx.setStorageSync('xcx_config', res.data)
      return res.data

    }


  }



}
async function pay() {
  let that = this
  var data = {
    type: config.type,
    action: 'order',
    api: 'pay'
  }
  let res = await request('post', config.url, data);
  console.log(res.data)
  return res.data

}

/**
 * 去重数据
 */
async function combinePostsList(arr) {
  var result = []
  var obj = {}
  for (var i = 0; i < arr.length; i++) {
    if (!obj[arr[i].uniqueId]) {

      result.push(arr[i]);
      obj[arr[i].uniqueId] = true;
    }
  }
  return result
}

//获取用户的数据
async function getUserProfile() {
  let data = {
    type: config.type,
    action: 'getUseProfile',
  }
  let res = await request('post', config.url, data);
  return res.data
}
module.exports = {
  pay: pay,
  getUserProfile: getUserProfile,
  upLoadFile: upLoadFile,
  checkAuthor: checkAuthor,
  getConfig: getConfig,
  getFxDetail: getFxDetail,
  queryLatestLuckUsers: queryLatestLuckUsers,
  queryLuckUsers: queryLuckUsers,
  getCoinsDetailList: getCoinsDetailList,
  getLuckJoinRecord: getLuckJoinRecord,
  gethead: gethead,
  registerSecondId: registerSecondId,
  registerShareId: registerShareId,
  queryLuckDetail: queryLuckDetail,
  joinActivity: joinActivity,
  sjoinActivity: sjoinActivity,
  checkUserorder: checkUserorder,
  getToken: getToken,
  getOpenId: getOpenId,
  getVersion: getVersion,
  getNewPostsList: getNewPostsList,
  getClassifyList: getClassifyList,
  getPostDetail: getPostDetail,
  getLabelList: getLabelList,
  request: request,
  getPostsList: getPostsList,
  combinePostsList: combinePostsList
}