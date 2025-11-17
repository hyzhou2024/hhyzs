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
    },
    scrollTop: {
        type:Number,
        value: 0,
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
    isShowLottory:false,
    ssqtq:[],

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
      let body ={     
        type:'hlly1.0.0',
        action: 'ssqtq',
        lottory_id:'write'
     
    }
    let res= await api.request('post',config.url,body)
    
      that.setData({
        ssqtq:res.data
      });
      wx.hideLoading()

    },
    ZJonPageScroll: async function (scrollTop) {
      let that = this;
      console.log('同期页面滚动',scrollTop)
      that.setData({
        scrollTop:scrollTop
      })
    },

  }
})