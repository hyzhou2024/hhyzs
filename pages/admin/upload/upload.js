// pages/admin/upload/upload.js
const config = require('../../../utils/config.js')
const api = require('../../../utils/api.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuthor: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function(options) {
    var that = this
    await this.checkAuthor()

  },
  checkAuthor: async function (e) {
    let that = this;
    const value = wx.getStorageSync('isAuthor')
    console.log('value',value)
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