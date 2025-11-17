// pages/more/detail/detail.js
const api = require('../../../utils/api.js');
const config = require('../../../utils/config.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
let rewardedVideoAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: [{
      showLottery: false,
      showCheck: false,
      showRec: false,
    }],
    id: '',
    wins: [],
    status: 0,
    _status: 0,
    userorder: {},
    nodata: false,
    isjoin: false,
    luckType: '',
    isShowCount: false,
    showVIPModal: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    var that = this
    await that.getVersion(options)
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
    console.log(res.data);
    if (res.data.showLottery) {
      wx.setNavigationBarTitle({
        title: '红包券活动中心', //页面标题为路由参数

      })
      that.setData({
        config: res.data,
        bitems: res.data.bitems,
        lucknav:res.data.lucknav
      })
      await that.queryLuckDetail(options.issue, options.id)
      // console.log(that.data.activity)
      await that.checkUserorder(that.data.activity.issue)
      that.loadInterstitialAd('adunit-9088db88e34e3b41');


    } else {
      var res_config = {
        showLottery: 0,
        showRec: 0,
        showCheck: 1
      }
      that.setData({
        config: res_config,
        nodata: true
      })
    }

  },
  queryLuckDetail: async function (issue, id) {
    var that = this;
    console.log(id)
    var res = await api.queryLuckDetail(issue, id)
    console.log(res)
    that.setData({
      activity: res[0],
      isShowCount: true,
      luckType: id
    })
    if (res[0].isopen) {
      var res = await that.queryLuckUsers(issue)

    }
    if (id == 'ssqlist') {
      await this.squeryLuckUsers(issue)
    }
  },
  queryLuckUsers: async function (issue) {
    var that = this;
    var res = await api.queryLuckUsers(issue)
    console.log('222222222', res)
    that.setData({
      wins: res
    })
    await this.getPersionalDetail(res)

  },
  squeryLuckUsers: async function (code) {
    var that = this
    let data = {
      type: config.type,
      code: code,
      action: 'squeryLuckUsers',
    }
    let res = await api.request('post', config.url, data);
    console.log(res)
    that.setData({
      luckusers: res.data.joinuser,
      msg_list: res.data.binggouser
    })


  },
  //个人的获奖情况
  getPersionalDetail: async function (arr) {
    var that = this
    var openid = await api.getOpenId()
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].openid == openid) {
        that.setData({
          a: arr[i].final_gain
        })
      }
    }

  },
  showSelectModal: async function () {
    var that = this
    that.setData({
      showVIPModal: true
    })
  },
  hideModal: async function () {
    var that = this
    that.setData({
      showVIPModal: false
    })
  },
  checkChange: function (e) {
    self = this
    wx.removeStorage({
      key: 'redvalue'
    });
    wx.removeStorage({
      key: 'bluevalue'
    });
    switch (e.currentTarget.id) {
      case "1":
        var ritems = self.data.ritems;
        var red_checkArr = e.detail.value;

        for (var i = 0; i < ritems.length; i++) {
          var index = (parseInt(i) + 1) < 10 ? "0" + (parseInt(i) + 1) : (parseInt(i) + 1);
          if (red_checkArr.indexOf(index + "") != -1) {
            if (red_checkArr.length <= 6) {
              ritems[parseInt(index) - 1].red_checked = true;
            } else {
              red_checkArr.pop();
              wx.showModal({
                title: '提示',
                content: '最多可以选择6个红球',
                showCancel: false
              })
            }
          } else {
            ritems[parseInt(index) - 1].red_checked = false;
          }
        }
        red_checkArr.sort(function (a, b) {
          return a - b;
        });
        self.setData({
          red_checkArr: red_checkArr,
          ritems: ritems,
          click_num: true
        })
        break;
      case "2":
        var bitems = self.data.bitems;
        var blue_checkArr = e.detail.value;
        for (var i = 0; i < bitems.length; i++) {
          if (blue_checkArr === bitems[i].bvalue) {
            bitems[i].blue_checked = true;
          } else {
            bitems[i].blue_checked = false;
          }
        }
        self.setData({
          blue_checkArr: new Array(blue_checkArr),
          bitems: bitems,
          click_num: true
        })
        break;
      default:

        break;
    }
  },
  clearAll: function () {
    var bitems = this.data.bitems;

    for (var j = 0; j < bitems.length; j++) {
      bitems[j].blue_checked = false;
    }
    this.setData({
      blue_checkArr: [],
      bitems: bitems,
    })
  },
  submitNum: function () {
    var that = this
    if (this.data.blue_checkArr.length == 1) {
      console.log(this.data.blue_checkArr)
      wx.setStorageSync('bluevalue', this.data.blue_checkArr);

    } else {
      wx.showModal({
        title: '提示',
        content: '请选择1个蓝球',
        showCancel: false
      })
    }
    return this.data.blue_checkArr
  },

  /**
   * 查询用户是否参与活动
   */

  checkUserorder: async function (e) {
    var that = this
    let result = await api.checkUserorder(e)
    console.log(result.length)
    if (result.length) {
      if (that.data.activity.isopen) {
        that.setData({
          _status: 2,
          status: 4
        })
      } else {
        that.setData({
          _status: 2,
          status: 3
        })
      }
    } else {
      if (that.data.activity.isopen) {
        that.setData({
          _status: 1,
          status: 2
        })
      } else {
        that.setData({
          _status: 1,
          status: 1
        })
      }
    }


  },
  /**
   * 初始化广告视频
   * @param {} excitationAdId 
   */
  loadInterstitialAd: async function (excitationAdId) {
    let that = this;
    if (wx.createRewardedVideoAd) {
      rewardedVideoAd = wx.createRewardedVideoAd({
        adUnitId: excitationAdId
      })
      rewardedVideoAd.onLoad(() => {
        console.log('onLoad event emit')
      })
      rewardedVideoAd.onError((err) => {
        console.log(err);
        wx.showToast({
          title: "视频广告出现问题啦",
          icon: "none",
          duration: 3000
        });
      })
      rewardedVideoAd.onClose(async (res) => {
        if (res && res.isEnded) {
          await that.finishAd()
        } else {
          wx.showToast({
            title: "完整看完视频才能参与哦",
            icon: "none",
            duration: 3000
          });
        }
      })

    }

  },

  finishAd: async function () {
    var that = this
    if (that.data.luckType == 'ssqlist') {
      var result = await api.sjoinActivity(that.data.id, that.data.choose_num)
      console.log(result)
      if (result.msg == 'ok') {
        that.setData({
          showVIPModal: false
        })
        wx.showToast({
          title: "成功参与，请等待开奖",
          icon: "none",
          duration: 2000
        });
        await this.getLuckDetail()



      } else {
        that.setData({
          showVIPModal: false
        })
        wx.showToast({
          title: "抱歉！截止时间到，请参与下一期",
          icon: "none",
          duration: 2000
        });

      }

    }
    if(that.data.luckType =='lucklist'){
      if (that.data.time != '开奖中......') {
        var result = await api.joinActivity(that.data.id)
        that.setData({
          _status: 2,
          status: 3
        })
        wx.showToast({
          title: "成功参与，请等待开奖",
          icon: "none",
          duration: 2000
        });
        await this.queryLuckDetail(that.data.activity.issue)
      } else {
        wx.showToast({
          title: "抱歉！截止时间到，请参与下一期",
          icon: "none",
          duration: 2000
        });

      }
    }


  },
  attempJoin: async function (e) {
    var that = this
    console.log(e.currentTarget.dataset.issue)
    var id = e.currentTarget.dataset.issue
    if (that.data.luckType == 'ssqlist') {
      var choose_num = await this.submitNum()
      console.log(choose_num)
      if (choose_num.length == 0) {
        return 0
      } else {
        that.setData({
          id: id,
          choose_num: choose_num[0]
        })
        rewardedVideoAd.show()
      }
    } else {

      that.setData({
        id: id
      })
      rewardedVideoAd.show()

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
  onShow: async function () {


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
    var that = this
    console.log('hah')
    if (rewardedVideoAd && rewardedVideoAd.destroy) {
      rewardedVideoAd.destroy()
    }
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