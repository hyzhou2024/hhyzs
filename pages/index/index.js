// pages/index/index.js

const api = require('../../utils/api.js');
const config = require('../../utils/config.js');
const regeneratorRuntime = require('../../utils/runtime.js');
let rewardedVideoAd = null
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
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
    var that = this
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
      await this.getData()


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
  getData: async function () {
    let that = this
    let data = {
      type: 'redis',
      key: 'hlzs_lottory'
    }
    let res = await api.request('post', config.url, data);
    console.log(res)
    that.setData({
      result: res.data
    })
  },
  swichNav: async function (e) {
    var that = this
    var id = e.currentTarget.dataset.id;
    if (this.data.currentTab === e) return 0;
    that.setData({
      currentTab: id,
    });
  },
  onPageScroll: function (t) {

    var that = this;
    if(that.data.currentTab == 1 ){
        console.log(t)
        var chlid = that.selectComponent('.rec')
        chlid.ZJonPageScroll(t.scrollTop)
        that.setData({
            scrollTop:t.scrollTop
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
    if (that.data.config.showCheck) {
      console.log('下滑')
      var chlid = that.selectComponent('.art')
      chlid.ZJonPullDownRefresh()

    }

  },
 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    var that = this
    if (that.data.config.showCheck) {
      console.log('滑动到底部')
      var chlid = that.selectComponent('.art')
      chlid.ZJonReachBottom()

    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

})