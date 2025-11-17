const api = require('../../utils/api.js');
const regeneratorRuntime = require('../../utils/runtime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: {
      showLottery: false,
      showCheck: false,
      showRec: false,
  },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function(options) {
    var that  = this
    await that.getVersion()
  },
  getVersion: async function () {
    var that = this
    let res = await api.getVersion()
    console.log(res)
    if (res.showLottery) {
        that.setData({
            config: res
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