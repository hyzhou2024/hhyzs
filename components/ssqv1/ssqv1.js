const config = require("../../utils/config");

function t(t) {
  if (Array.isArray(t)) {
    for (var a = 0, e = Array(t.length); a < t.length; a++) e[a] = t[a];
    return e;
  }
  return Array.from(t);
};
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
      this.refreshIssueTimer()

    },
    detached() {

    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    time: '',
    lasttime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 计时器
     */
    refreshIssueTimer: function () {
      var that = this
      var next_time = this.properties.ssq.detail.NextDate.n_date_time
      console.log('ssq', this.properties.ssq)
      this.setData({
        lasttime: next_time

      })
      this.tick(next_time)

    },
    //定时事件
    tick() {
      var that = this,
        time
      let next_time = this.data.lasttime
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        var cacheCurrIssueEndTime = new Date(next_time).getTime() - new Date().getTime()
        // console.log(cacheCurrIssueEndTime )
        if (cacheCurrIssueEndTime < 0) {
          time = '已开奖，数据更新中'
        } else {
          // console.log(cacheCurrIssueEndTime)
          var d = Math.floor(cacheCurrIssueEndTime / (1000 * 60 * 60 * 24));
          var h = Math.floor(cacheCurrIssueEndTime / (1000 * 60 * 60)) % 24;
          var m = Math.floor(cacheCurrIssueEndTime / (1000 * 60)) % 60;
          var s = Math.floor(cacheCurrIssueEndTime / 1000) % 60;
          if (h < 10) h = "0" + h;
          if (m < 10) m = "0" + m;
          if (s < 10) s = "0" + s;
          time = "{0}{1}时{2}分{3}秒".format(d > 0 ? d + "天" : "", h, m, s);

        }

        // console.log(time)
        this.setData({
          time: time
        })
        this.tick()
      }, 1000);
    },

  }
})