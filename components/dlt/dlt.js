const config = require("../../utils/config");
const api = require('../../utils/api')
const regeneratorRuntime = require('../../utils/runtime.js');
// component/ssq/ssq.js
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
       this.getDataInt()

    },
    detached() {

    },
},

  /**
   * 组件的初始数据
   */
  data: {
    lastIssue:{},
    a1:false

  },

  /**
   * 组件的方法列表
   */
  methods: {
         /**
   * 初始化数据
   */
  getDataInt: async function(){
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let data = {
      type: 'redis',
      key:'dlt'
  }
    let res= await api.request('post',config.url,data)
    console.log(res.data)
    that.setData({
      lastIssue: res.data,
      a:true
    });
    wx.hideLoading()

  },

  }
})