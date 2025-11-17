// pages/mine/mine.js
const config = require('../../utils/config.js')
const api = require('../../utils/api.js');
const regeneratorRuntime = require('../../utils/runtime.js');
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({

  /**
   * 页面的初始数据
   */
  /**
   * 页面的初始数据
   */
  data: {
    config: {
      showLottery: false,
      showCheck: false,
      showRec: false,
    },
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    showLogin: false,
    isAuthor: false,
    isVip: false,
    vipDesc: '点击申请VIP',
    showRedDot: '',
    signedDays: 0, //连续签到天数
    signed: 0,
    signedRightCount: 0,
    applyStatus: 0,
    showVIPModal: false,
    signBtnTxt: "每日签到",
    iconList: [{
      icon: 'favorfill',
      color: 'grey',
      badge: 0,
      name: '我的收藏',
      bindtap: "bindCollect"
    }, {
      icon: 'appreciatefill',
      color: 'green',
      badge: 0,
      name: '我的点赞',
      bindtap: "bindZan"
    }, {
      icon: 'noticefill',
      color: 'yellow',
      badge: 0,
      name: '我的消息',
      bindtap: "bindNotice"
    }, {
      icon: 'goodsfavor',
      color: 'orange',
      badge: 0,
      name: '我的积分',
      bindtap: "bindPoint"
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this;
    let showRedDot = wx.getStorageSync('showRedDot');
    console.info(showRedDot)

    console.info(showRedDot != '1')
    that.setData({
      showRedDot: showRedDot
    });

    await that.checkAuthor()
    await that.getVersion()

  },
  getVersion: async function () {
    var that = this
    let res = await api.getVersion()
    console.log(res)
    if (res.showLottery) {
      that.setData({
        config: res,
        'userInfo.avatarUrl': res.userProfile.avatar_url,
        "userInfo.nickName": res.userProfile.nickname,
      })

    } else {
      that.setData({
        'config.showLottery': 0,
        'config.showCheck': 1,
        'config.showRec': 0
      })
    }
  },

  /**
   * 获取用户头像
   * @param {} e 
   */
  getUserInfo: async function (e) {
    var that = this
    console.log(e)
    const {
      avatarUrl
    } = e.detail
    this.setData({
      'userInfo.avatarUrl': avatarUrl,
    })
    var Url = await api.upLoadFile(avatarUrl)

    await this.setUseProfile(Url, '')
  },
  onInputChange: async function (e) {
    const nickName = e.detail.value
    console.log(e)
    this.setData({
      "userInfo.nickName": nickName,
    })
    await this.setUseProfile('', nickName)
  },
  checkAuthor: async function (e) {
    let that = this;
    const value = wx.getStorageSync('isAuthor')
    if (value) {
      that.setData({
        isAuthor: value
      })
    } else {
      let res = await api.checkAuthor();
      console.info('res', res)
      wx.setStorageSync('isAuthor', res.data.isAuthor)
      that.setData({
        isAuthor: res.data.isAuthor
      })
    }
  },
  //设置头像
  setUseProfile: async function (avatarUrl, nickName) {
    let that = this
    let data = {
      type: config.type,
      action: 'setUseProfile'
    }
    if (avatarUrl != '') {
      data.avatarUrl = avatarUrl
    }
    if (nickName != '') {
      data.nickName = nickName
    }
    console.log(data)
    let res = await api.request('post', config.url, data)
  },
  /**
   * 返回
   */
  navigateBack: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
  },

  /**
   * 展示打赏二维码
   * @param {} e 
   */
  showQrcode: async function (e) {
    wx.previewImage({
      urls: [config.moneyUrl],
      current: config.moneyUrl
    })
  },
  /**
   * 展示微信二维码
   * @param {*} e 
   */
  showWechatCode: async function (e) {
    wx.previewImage({
      urls: [config.wechatUrl],
      current: config.wechatUrl
    })
  },
  /**
   * 跳转我的收藏
   * @param {*} e 
   */
  bindCollect: async function (e) {
    wx.navigateTo({
      url: '../mine/collection/collection?type=1'
    })
  },
  /**
   * 跳转我的点赞 
   * @param {*} e 
   */
  bindZan: async function (e) {
    wx.navigateTo({
      url: '../mine/collection/collection?type=2'
    })
  },

  /**
   * 后台设置
   * @param {} e 
   */
  showAdmin: async function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../admin/admin'
    })
  },

  /**
   * 历史版本
   * @param {} e 
   */
  showRelease: async function (e) {
    wx.navigateTo({
      url: '../mine/release/release'
    })
  },

  /**
   * 我的消息
   * @param {*} e 
   */
  bindNotice: async function (e) {
    wx.navigateTo({
      url: '../mine/notice/notice'
    })
  },

  /**
   * 签到列表
   * @param {*} e 
   */
  btnSigned: async function (e) {
    wx.navigateTo({
      url: '../mine/sign/sign?signedDays=' + this.data.signedDays + '&signed=' + this.data.signed + '&signedRightCount=' + this.data.signedRightCount
    })
  },

  /**
   * 我的积分
   * @param {} e 
   */
  bindPoint: async function (e) {
    wx.navigateTo({
      url: '../mine/point/point'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})