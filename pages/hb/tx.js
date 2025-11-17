const config = require('../../utils/config.js')
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
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
        allGoodsFilte: [{
                name: '0.3元',
                value: 3000,
                checked: true
            },
            {
                name: '3元',
                value: 29000,
                checked: false
            },
            {
                name: '10元',
                value: 98000,
                checked: false
            },
            {
                name: '50元',
                value: 497000,
                checked: false
            },
            {
                name: '100元',
                value: 980000,
                checked: false
            },
            {
                name: '200元',
                value: 1900000,
                checked: false
            },
        ],
        showBanner: false,
        showBannerId: "",
        readMoreId: "",
        t: "",
        txVal: 3000,
        showVIPModal: false,
        recList: [],
        page: 1,
        nodata: false,
        nomore: false,
        userProfile: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        await this.getVersion(options)

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
                title: '提现中心', //页面标题为路由参数

            })


            that.setData({
                config: res.data,
                userProfile: await this.getUserProfile(openid)
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
    //选择框改变颜色
    checkChange: function (e) {
        var that = this
        var allGoodsFilte = that.data.allGoodsFilte
        var tx_checkArr = e.detail.value
        //console.log('11', tx_checkArr)
        for (var i = 0; i < allGoodsFilte.length; i++) {
            if (tx_checkArr == allGoodsFilte[i].value) {
                allGoodsFilte[i].checked = true;
            } else {
                allGoodsFilte[i].checked = false;
            }
        }
        that.setData({
            allGoodsFilte: allGoodsFilte,
            txVal: e.detail.value
        })
    },
    onUnload: function () {

    },

    /**
     * 获取用户红包券信息
     */
    getUserProfile: async function (openid) {
        let data = {
            type: config.type,
            action: 'getUseProfile',
            openid: openid,
        }
        let res = await api.request('post', config.url, data);
        //console.log(res.data);
        return res.data
    },
    /**
     * 提现红包
     */
    txLuck: async function () {
        var that = this
        var txVal = parseInt(that.data.txVal)
        wx.showLoading({
            title: '兑换中,请稍后',
        })
       //console.log(txVal)
       let data = {
        type: config.type,
        action: 'txWechat',
        openid: await api.getOpenId(),
        txVal:txVal,
       
    }
    let res = await api.request('post', config.url, data);
    if (res.data) {
       //console.log(res.data)
        wx.showToast({
            title: res.data.desc,
          icon: "none",
          duration: 3000
        });
        that.setData({
            userProfile: await this.getUserProfile(await api.getOpenId())
        })
      }
      else {
        wx.showToast({
          title: "红包券不足",
          icon: "none",
          duration: 3000
        });
      }

    },
    /**
     * 获取广告数据
     */
    getBannerAdvert: async function () {
        let that = this
        let advert = app.globalData.advert
        // //console.log(advert)
        if (advert.bannerStatus) {
            that.setData({
                showBanner: true,
                showBannerId: advert.bannerId
            })
        }

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})