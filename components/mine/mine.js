const config = require("../../utils/config")
const api = require('../../utils/api')
const regeneratorRuntime = require('../../utils/runtime.js')
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    ready:async function() {
      await this.getUserProfile()

    },
    detached() {

    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowLottory: false,
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo: async function (e) {
      var that = this
      console.log(e)
      const {
        avatarUrl
      } = e.detail
      this.setData({
        'userInfo.avatarUrl': avatarUrl,
      })
      var Url = await api.upLoadFile(avatarUrl)

      await this.setUseProfile(Url, '')
    },
    onInputChange: async function (e) {
      const nickName = e.detail.value
      console.log(e)
      this.setData({
        "userInfo.nickName": nickName,
      })
      await this.setUseProfile('', nickName)
    },
    //获取用户的数据
    getUserProfile: async function () {
      let that = this
      let res = await api.getUserProfile();
      that.setData({
        'userInfo.avatarUrl': res.avatar_url,
        "userInfo.nickName": res.nickname,
      })
    },
    setUseProfile: async function (avatarUrl, nickName) {
      let that = this
      let data = {
        type: config.type,
        action: 'setUseProfile'
      }
      if (avatarUrl != '') {
        data.avatarUrl = avatarUrl
      }
      if (nickName != '') {
        data.nickName = nickName
      }
      console.log(data)
      let res = await api.request('post', config.url, data)
    },

  }
})