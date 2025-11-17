// components/tj/tj.js
const config = require("../../utils/config");
const api = require('../../utils/api')
const regeneratorRuntime = require('../../utils/runtime.js');
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    ready() {
      this.isShow()

    },
    detached() {

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowLottory: false,
    show: true,
    interval: "",
    ssq: {},
    ssq_red: [{
      num: '?'
    }, {
      num: '?'
    }, {
      num: '?'
    }, {
      num: '?'
    }, {
      num: '?'
    }, {
      num: '?'
    }],
    ssq_blue: [{
      num: '?'
    }],
    history_momey_detail: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化数据
     */
    isShow: async function () {
      let that = this
      let data = {
        type: 'redis',
        key: 'isshowlottory'
      }
      let res = await api.request('post', config.url, data)
      console.log(res.data)
      if (res.data.isShowLottory) {

        that.setData({
          isShowLottory: res.data.isShowLottory
        })
        var ssq_default_data = await this.defaultData()

        that.setData({
          ssq: ssq_default_data
        })
      }


    },
    //初始化数据
    defaultData: async function () {
      var res = {
        redBall: [],
        blueBall: []
      }
      try {
        for (var i = 1; i <= 33; i++) {
          var item = {
            num: i,
            selected: false
          }
          res.redBall.push(item)
        }
        for (var j = 1; j <= 16; j++) {
          var itemb = {
            num: j,
            selected: false
          }
          res.blueBall.push(itemb)
        }
        return res
      } catch (error) {

      }
    },

  }
})