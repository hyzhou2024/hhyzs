// components/prize_count/prize_count.js
const config = require("../../utils/config");
var util = require("../../utils/util.js");
const api = require('../../utils/api')
const regeneratorRuntime = require('../../utils/runtime.js');
Component({

  /**
   * 组件的属性列表
   */
  /**
   * 组件的属性列表
   */
  properties: {
    
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    ssq: {
      type: Object,
      value: null,
    },
    config: {
      type: Object,
      value: null,
    }
   

  },

  /**
   * 组件的初始数据
   */
  data: {
    red_checkArr: [],
    blue_checkArr: [],
    click_num: false,
    ritems: [
      { rvalue: '01', red_checked: false, },
      { rvalue: '02', red_checked: false, },
      { rvalue: '03', red_checked: false, },
      { rvalue: '04', red_checked: false },
      { rvalue: '05', red_checked: false },
      { rvalue: '06', red_checked: false },
      { rvalue: '07', red_checked: false },
      { rvalue: '08', red_checked: false },
      { rvalue: '09', red_checked: false },
      { rvalue: '10', red_checked: false },
      { rvalue: '11', red_checked: false },
      { rvalue: '12', red_checked: false },
      { rvalue: '13', red_checked: false },
      { rvalue: '14', red_checked: false },
      { rvalue: '15', red_checked: false },
      { rvalue: '16', red_checked: false },
      { rvalue: '17', red_checked: false },
      { rvalue: '18', red_checked: false },
      { rvalue: '19', red_checked: false },
      { rvalue: '20', red_checked: false },
      { rvalue: '21', red_checked: false },
      { rvalue: '22', red_checked: false },
      { rvalue: '23', red_checked: false },
      { rvalue: '24', red_checked: false },
      { rvalue: '25', red_checked: false },
      { rvalue: '26', red_checked: false },
      { rvalue: '27', red_checked: false },
      { rvalue: '28', red_checked: false },
      { rvalue: '29', red_checked: false },
      { rvalue: '30', red_checked: false },
      { rvalue: '31', red_checked: false },
      { rvalue: '32', red_checked: false },
      { rvalue: '33', red_checked: false }
    ],
    bitems: [
      { bvalue: '01', blue_checked: false },
      { bvalue: '02', blue_checked: false },
      { bvalue: '03', blue_checked: false },
      { bvalue: '04', blue_checked: false },
      { bvalue: '05', blue_checked: false },
      { bvalue: '06', blue_checked: false },
      { bvalue: '07', blue_checked: false },
      { bvalue: '08', blue_checked: false },
      { bvalue: '09', blue_checked: false },
      { bvalue: '10', blue_checked: false },
      { bvalue: '11', blue_checked: false },
      { bvalue: '12', blue_checked: false },
      { bvalue: '13', blue_checked: false },
      { bvalue: '14', blue_checked: false },
      { bvalue: '15', blue_checked: false },
      { bvalue: '16', blue_checked: false }
    ],
    redvalue:[],
    bluevalue:[],
    red_binggo_number: [],
    blue_binggo_number: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkChange: function (e) {
        self = this
        console.log(this.properties.ssq)
        wx.removeStorage({ key: 'redvalue' });
        wx.removeStorage({ key: 'bluevalue' });
        switch (e.currentTarget.id) {
          case "1":
            var ritems = self.data.ritems;
            var red_checkArr = e.detail.value;
            console.log(e.detail.value)
            self.setData({
                redvalue:e.detail.value
            })
            for (var i = 0; i < ritems.length; i++) {
              var index = (parseInt(i) + 1) < 10 ? "0" + (parseInt(i) + 1) : (parseInt(i) + 1);
              if (red_checkArr.indexOf(index + "") != -1) {
                if (red_checkArr.length <= 20) {
                  ritems[parseInt(index) - 1].red_checked = true;
                } else {
                  red_checkArr.pop();
                  wx.showModal({
                    title: '提示',
                    content: '最多可以选择20个红球',
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
            console.log(e.detail.value)
            self.setData({
                bluevalue:e.detail.value
            })
            for (var i = 0; i < bitems.length; i++) {
                var index = (parseInt(i) + 1) < 10 ? "0" + (parseInt(i) + 1) : (parseInt(i) + 1);
                if (blue_checkArr.indexOf(index + "") != -1) {
                  if (blue_checkArr.length <= 16) {
                    bitems[parseInt(index) - 1].blue_checked = true;
                  } else {
                    blue_checkArr.pop();
                    wx.showModal({
                      title: '提示',
                      content: '最多可以选择16个红球',
                      showCancel: false
                    })
                  }
                } else {
                  bitems[parseInt(index) - 1].blue_checked = false;
                }
              }
              blue_checkArr.sort(function (a, b) {
                return a - b;
              });
            self.setData({
              blue_checkArr: blue_checkArr,
              bitems: bitems,
              click_num: true
            })
            break;
          default:
    
            break;
        }
      },
      clearAll: function () {
        var ritems = this.data.ritems;
        var bitems = this.data.bitems;
        for (var i = 0; i < ritems.length; i++) {
          ritems[i].red_checked = false;
        }
        for (var j = 0; j < bitems.length; j++) {
          bitems[j].blue_checked = false;
        }
        this.setData({
          red_checkArr: [],
          blue_checkArr: [],
          ritems: ritems,
          bitems: bitems,
          click_num: false
        })
      },
      selAuto: function () {
        self = this;
        wx.removeStorage({ key: 'redvalue' });
        wx.removeStorage({ key: 'bluevalue' });
        var ritems = self.data.ritems;
        var bitems = self.data.bitems;
        var redArr = util.selNumAuto(33, 6, ritems);
        var blueArr = util.selNumAuto(16, 1, bitems);
        self.setData({
            redvalue:redArr,
            bluevalue:blueArr,
          red_checkArr: redArr,
          blue_checkArr: blueArr,
          ritems: ritems,
          bitems: bitems,
          click_num: true
        })
      },
      submitNum: async function () {
          var that = this
        if (this.data.red_checkArr.length >= 6 && this.data.red_checkArr.length <= 20 &&this.data.blue_checkArr.length >= 1&&this.data.blue_checkArr.length <= 16) {
          wx.setStorageSync('redvalue', this.data.red_checkArr);
          wx.setStorageSync('bluevalue', this.data.blue_checkArr);
          let data = {
            type: "cal",
            action: "test",
            lastIssue: this.properties.ssq.detail,
            redvalue: this.data.red_checkArr,
            bluevalue: this.data.blue_checkArr
          }
          
          let res = await api.request('post', config.url, data)
          console.log(res.data)
          that.setData({
            sum: res.data.total.sum,
            sum_money: res.data.total.sum_money,
            red_binggo_number: res.data.red_binggo_number,
            blue_binggo_number: res.data.blue_binggo_number,
          })

        } else {
          wx.showModal({
            title: '提示',
            content: '请选择至少6个红球+至少1个蓝球',
            showCancel: false
          })
        }
      },


  }
})