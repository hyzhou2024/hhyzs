const api = require('../../utils/api.js');
const config = require('../../utils/config.js');
const regeneratorRuntime = require('../../utils/runtime.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_type: "小鸭子简笔画",
    config: {
      showLottery: false,
      showCheck: false,
      showRec: false,
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getVersion()

  },
  getVersion: async function () {
    var that = this
    let res = await api.getVersion()
    console.log(res)
    if (res.showLottery) {
      that.setData({
        config: res,
        content_type: res.content_type,
      })



    } else {
      var res_config = {
        showLottery: 0,
        showRec: 0,
        showCheck: 1
      }
      that.setData({
        config: res_config,
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
    var that = this
      console.log('下滑')
      var chlid = that.selectComponent('.art')
      chlid.ZJonPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    var that = this
    if (!that.data.config.showLottery) {
      console.log('滑动到底部')
      var chlid = that.selectComponent('.art')
      chlid.ZJonReachBottom()
    }
 
  },

  onPageScroll: function (t) {
    var that = this
    if (!that.data.config.showLottery) {
      var that = this;
      var chlid = that.selectComponent('.art')
      chlid.ZJonPageScroll(t.scrollTop)

    }
   
  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  
})