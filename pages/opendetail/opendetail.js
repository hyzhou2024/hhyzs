
const api = require('../../utils/api.js');
const config = require('../../utils/config.js');
const regeneratorRuntime = require('../../utils/runtime.js');
let rewardedVideoAd = null
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
    name: "ssqlist",
    prizeList: "",
    prizeTypeList: [{
        name: "ssqlist",
        desc: "双色球",
        prizeList: []
      }, {
        name: "kl8list",
        desc: "快乐8",
        prizeList: []
      }, {
        name: "3dlist",
        desc: "福彩3D",
        prizeList: []
      }, {
        name: "qlclist",
        desc: "七乐彩",
        prizeList: []
      }, {
        name: "dltlist",
        desc: "大乐透",
        prizeList: []
      }, {
        name: "qxclist",
        desc: "七星彩",
        prizeList: []
      },
      {
        name: "pl5list",
        desc: "排列5",
        prizeList: []
      },
      {
        name: "pl3list",
        desc: "排列3",
        prizeList: []
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var that = this
    console.log(options)
    that.setData({
      name: options.name
    })
    await this.getVersion(options.name)
    


  },
  getVersion: async function (name) {
    var that = this
    let res = await api.getVersion()
    console.log(res)
    if (res.showLottery) {
      that.setData({
        config: res,
      })
      await this.requestHistory(name)

    } else {
      that.setData({
        'config.showLottery': 0,
        'config.showCheck': 1,
        'config.showRec': 0,
      })
    }
  },
  selectPrize: async function (e) {
    var that = this
    var name = e.currentTarget.dataset.name;
    console.log(e.currentTarget.dataset.name)
    if (name !== this.data.name) {
      this.setData({
        name: name
      });

    }
    await that.requestHistory(name)
  },
  requestHistory: async function (name) {
    let that = this
    let data = {
      type: 'redis',
      key: name
    }
    let res = await api.request('post', config.url, data)
    var prizeTypeList = that.data.prizeTypeList
    for (var i = 0; i < prizeTypeList.length; i++) {
      var prize_item = prizeTypeList[i];
      if (prize_item.name == name) {
        console.log(prize_item.name)
        prize_item.prizeList = [];
        console.log(res)
        for (var j = 0; j < res.data.length; j++) {
          var res_item = res.data[j]
          console.log(res_item)
          console.log(name == 'dltlist')
          if (name == 'dltlist' || name == 'qxclist' || name == 'pl5list' || name == 'pl3list') {
            res_item.redBallList = res_item.red


          } else {
            res_item.date = res_item.date.split("(")[0]
            res_item.redBallList = res_item.red.split(",")
          }

          for (var n = 0; n < res_item.prizegrades.length; n++) {
            var prizegrades_item = res_item.prizegrades[n];
            res_item[prizegrades_item.type] = prizegrades_item;
          }
          prize_item.prizeList.push(res_item)
        }
        prizeTypeList[i] = prize_item
      }
    }
    that.setData({
      prizeTypeList: prizeTypeList
    });
    console.log(that.data.prizeTypeList)
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
    // var that = this
    // await this.requestHistory('ssqlist')

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