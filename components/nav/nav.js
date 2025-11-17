// components/nav/nav.js
const api = require('../../utils/api.js');
const config = require('../../utils/config.js');
const regeneratorRuntime = require('../../utils/runtime.js');
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    ready: async function(){
        await this.getConfig()
       
    },
    detached: async function() {
   
    },
},

  /**
   * 组件的初始数据
   */
  data: {
    iconList:[]

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getConfig: async function(){
        let that  = this
        let data = {
            type: 'redis',
            key:'hlzs_nav'
        }
        let res = await api.request('post', config.url, data);
        console.log('hlzs_nav',res)
        that.setData({
            iconList:res.data
        })

    }


  }
})