// pages/hb/hb.js
const config = require('../../utils/config.js');
const api = require('../../utils/api.js');
const regeneratorRuntime = require('../../utils/runtime.js');
const app = getApp();
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
        pointList: [],
        page: 0,
        nodata: false,
        nomore: false,
        id:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async  function (options) {
        var that = this
        await this.getVersion(options)
        
        ////console.log(that.data.pointList)

    },
  /**
     * 获取最新版本
     */
    getVersion: async function (options) {
        let that = this;
        var onlaunch = wx.getLaunchOptionsSync();
        var openid = await api.getOpenId()
        var secondid = await api.registerSecondId(options)
        let data = {
            type: config.type,
            action: 'getVersion',
            app_version: config.version,
            scene: onlaunch.scene,
            openid: openid,
            secondid: secondid
        }
        //console.log(data)
        let res = await api.request('post', config.url, data);
        //console.log(res.data);
        if (res.data.showLottery) {
            wx.setNavigationBarTitle({
                title: '记录', //页面标题为路由参数

            })
            await this.getPointDetailList(options.id)
            var head = await this.gethead(options.id)
            that.setData({
                config: res.data,
                head:head,
                id:options.id
                
            })

            
        } else {
            var res_config = {
                showLottery: 0,
                showRec: 0,
                showCheck: 1
            }
            that.setData({
                config: res_config,
                nodata:true
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
    onShow: async function() {
        

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
    onPullDownRefresh:async function() {
        let that = this;
        let page = 0
        that.setData({
          page: page,
          pointList: [],
          nomore: false,
          nodata: false
        })
        await this.getPointDetailList(that.data.id)
        wx.stopPullDownRefresh();

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom:async function() {
        var that  = this
        await this.getPointDetailList(that.data.id)

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    gethead:async function(id){
        var that  = this
        console.log(id)
        var res  = await api.gethead(id)
        return res

    },
     /**
    * 获取积分明细列表
  */
  getPointDetailList: async function (id) {
   
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let page = that.data.page
    if (that.data.nomore) {
      wx.hideLoading()
      return
    }
    let result = await api.getLuckJoinRecord(page,id)
    console.log(result)
    if (result.length === 0) {
      that.setData({
        nomore: true
      })
      if (page === 0) {
        that.setData({
          nodata: true
        })
      }
    }
    else {
      that.setData({
        page: page + 1,
        pointList: that.data.pointList.concat(result),
      })
     
      ////console.log(that.data.pointList)
    }
    wx.hideLoading()
  },

  

})