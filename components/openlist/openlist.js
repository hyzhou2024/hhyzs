const config = require("../../utils/config");
const api = require('../../utils/api')
const regeneratorRuntime = require('../../utils/runtime.js');
Component({

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
  lifetimes: {
    ready() {
      this.isShow()

    },
    detached() {

    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    openlist: [],
    isShowLottory:false,
    a1: false

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化数据
     */
    isShow:async function(){
      let that = this 
      let data = {
        type: 'redis',
        key: 'isshowlottory'
      }
      let res = await api.request('post', config.url, data)
      console.log(res.data)
      if(res.data.isShowLottory){
        await this.getDataInt()
        that.setData({
          isShowLottory:res.data.isShowLottory
        })
      }
    

    },
    getDataInt: async function () {
      wx.showLoading({
        title: '加载中...',
      })
      let that = this
      let data = {
        type: 'redis',
        key: 'lottory_list'
      }
      let res = await api.request('post', config.url, data)
      console.log(res.data)
      that.setData({
        openlist: res.data,
        a: true
      });
      wx.hideLoading()

    },

  }
})