// component/topic/topic.js
const api = require('../../utils/api')
const regeneratorRuntime = require('../../utils/runtime.js');
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: async function () { 
      await this.getClassifyList()


    },
    moved: function () { },
    detached: function () { },
  },

  /**
   * 组件的初始数据
   */
  data: {
    classifyList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
        /**
   * 获取专题集合
   * @param {*} e 
   */
  getClassifyList: async function () {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let classifyList = await api.getClassifyList()
    console.info(classifyList)
    that.setData({
      classifyList: classifyList
    })
    wx.hideLoading()
  },
   /**
   * 跳转至专题详情
   * @param {} e 
   */
  openTopicPosts:async function(e){
    let classify = e.currentTarget.dataset.tname;
    console.log(classify)
    wx.navigateTo({
      url: '../topic/topiclist/topiclist?classify=' + classify
    })
  }

  }
})