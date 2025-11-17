// components/luck/luck.js
const config = require("../../utils/config")
const api = require('../../utils/api')
const regeneratorRuntime = require('../../utils/runtime.js')
const socketPool = []

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    config: {
      type: Object,
      value: null,
    }

  },
  lifetimes: {
    ready: async function () {
      await this.isShow()

    },
    detached() {

    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowLottory: false,
    name: "ssqlist",
    luckTypeList: [{
      name: "ssqlist",
      desc: "快乐蓝球",
      prizeList: []
    }, {
      name: "lucklist",
      desc: "幸运红包",
      prizeList: []
    }, ],
    newColor: '#D55B46',
    userProfile: {},
    luckList: [],
    ssqList:[],
    msg_list: []

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
          isShowLottory: res.data.isShowLottory,
          userProfile: await this.getUserProfile()
        })
        this.queryLatestLuckUsers()
        this.websocketInit(this)
      }


    },
    //获取用户的数据
    getUserProfile: async function () {
      var openid = await api.getOpenId()
      let data = {
        type: config.type,
        action: 'getUseProfile',
        openid: openid,
      }
      let res = await api.request('post', config.url, data);
      console.log(res.data);
      return res.data
    },
    queryLatestLuckUsers: async function () {
      var that = this;
      var res = await api.queryLatestLuckUsers()
      // console.log('222222222', res)
      that.setData({
        msg_list: res
      })

    },
    //websocket初始化
    websocketInit: async function (f) {
      var that = this
      const socket = await this.getWebSocket()
      //事件监听
      socket.onOpen(function () {
        console.info('连接');
      });
      socket.onClose(function () {
        // wx.closeSocket()
        console.info('关闭');
        console.log('socket',socket)
        // that.releaseWebSocket(socket)
        that.websocketInit()
      });
      socket.onError(function () {
        console.info('连接报错');
      });
      //服务器发送监听
      socket.onMessage(function (e) {
        // console.info(e.data);
        var data1 = JSON.parse(e.data);
        // var a =JSON.parse(e.data)
        console.log(data1)
        that.setData({
          luckList: data1.result,
          ssqList: data1.ssqlist,
        });
      });


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

    },
    getWebSocket:async function(){
      console.log('socketPool',socketPool)
      if(socketPool.length>0){
        const socket = socketPool.shift();
        console.log('socket',socket)
        return socket
      }
      const socket = wx.connectSocket({
        url: 'wss://minidataservice.com/:3000',
        success: res => {
          console.info('创建新连接');
          //socketTaskId: 22
          console.info(res);
        }
      })
      return socket
    },
    releaseWebSocket:async function(socket){
      socketPool.push(socket)
      console.log(socketPool)
    },
      /**
     * 跳转详情页面
     */
    jump2detial: async function (e) {
      let that = this;
      console.log(e.currentTarget.dataset.data)
      console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
          url: '/pages/find/detail/detail?issue=' + e.currentTarget.dataset.data+'&&id='+e.currentTarget.dataset.id,
      })
  },
  }
})