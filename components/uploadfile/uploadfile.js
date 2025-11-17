// components/FriendPub/index.js
const api = require('../../utils/api.js');
const regeneratorRuntime = require('../../utils/runtime.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    location: null,
    tempFiles: [],
    content: '',
    imgid: 0,
    realList: [],
  },
  /**
   * 组件生命周期
   */
  lifetimes:{
    attached(){
      let postdata = wx.getStorageSync('postdata') || null
      if(postdata!=null){
        this.setData(postdata)
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    post:async function(){
      var that = this;
      /**
       * @信息传递到首页
       */
      this.triggerEvent('postlistener',{
        tempFiles:this.data.tempFiles,
        
      })
      for(var i = 0; i<that.data.tempFiles.length;i++){
          await api.upLoadFile(that.data.tempFiles[i].tempFilePath)
      }

    },
    chooseImage() {
      wx.chooseMedia({
        count: 9, //默认9
        mediaType:['image', 'video'],
        sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], //从相册选择
        success: (res) => {
            console.log(res)
          if (this.data.tempFiles.length != 0) {
            this.setData({
                tempFiles: this.data.tempFiles.concat(res.tempFiles)
            })
          } else {
            this.setData({
                tempFiles: res.tempFiles
            })
          }
        }
      });
    },
    ViewImage(e) {
      wx.previewImage({
        urls: this.data.tempFiles,
        current: e.currentTarget.dataset.url
      });
    },
    DelImg(e) {

      this.data.tempFiles.splice(e.currentTarget.dataset.index, 1);
      this.setData({
        tempFiles: this.data.tempFiles
      })
    },
    getInputValue(e) {
      this.setData({
        content: e.detail.value
      })
    },
    saveEditOrNot() {
      var that = this;
      wx.showModal({
        title: '将此次编辑保留',
        content: '',
        cancelText: '不保留',
        confirmText: '保留',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.setStorageSync('postdata', that.data)
            wx.navigateBack({
              delta: 1
            })
          } else if (res.cancel) {
            wx.clearStorageSync('postdata')
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    },


  }
})