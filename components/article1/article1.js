const api = require('../../utils/api.js');
const regeneratorRuntime = require('../../utils/runtime.js');
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    content_type: {
      type: String,
      value: '小鸭子简笔画',
    },
    scrollTop: {
      type:Number,
      value: 0,
    }

  },
  lifetimes: {
    ready: async function () {

      await this.getPostsList()
    },
    detached() {

    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    posts: [],
    page: 0,
    filter: "",
    nodata: false,
    nomore: false,
    defaultSearchValue: "",
    navItems: [{
      name: '最新',
      index: 1
    }, {
      name: '热门',
      index: 2
    }, {
      name: '标签',
      index: 3
    }],
    tabCur: 1,
    scrollLeft: 0,
    showHot: false,
    showLabels: false,
    hotItems: ["浏览最多", "评论最多", "点赞最多", "收藏最多"],
    hotCur: 0,
    labelList: [],
    labelCur: "全部",
    whereItem: ['', 'createTime', ''], //下拉查询条件
    showLogin: false,
    scrollTop:0

  },

  /**
   * 组件的方法列表
   */
  methods: {
    ZJonReachBottom: async function () {
      console.log('哈哈')
      let whereItem = this.data.whereItem
      let filter = this.data.filter
      await this.getPostsList(whereItem[0], whereItem[1], whereItem[2])
    },
    ZJonPullDownRefresh: async function () {
      let that = this;
      let page = 0
      that.setData({
        page: page,
        posts: [],
        filter: "",
        nomore: false,
        nodata: false,
        defaultSearchValue: ""
      })
      await this.getPostsList("")
      wx.stopPullDownRefresh();
    },
    ZJonPullDownRefresh: async function () {
      let that = this;
      let page = 0
      that.setData({
        page: page,
        posts: [],
        filter: "",
        nomore: false,
        nodata: false,
        defaultSearchValue: ""
      })
      await this.getPostsList("")
      wx.stopPullDownRefresh();
    },

    ZJonPageScroll: async function (scrollTop) {
      let that = this;
      // console.log(scrollTop)
      that.setData({
        scrollTop:scrollTop
      })
    },
    getPostsList: async function (filter, orderBy, label) {
      wx.showLoading({
        title: '加载中...',
      })
      let that = this
      let page = that.data.page
      let content_type = that.properties.content_type
      if (that.data.nomore) {
        wx.hideLoading()
        return
      }
      let result = await api.getPostsList(content_type, page, filter, 1, orderBy, label)
      if (result.length === 0) {
        that.setData({
          nomore: true
        })
        if (page === 1) {
          that.setData({
            nodata: true
          })
        }
      } else {

        that.setData({
          page: page + 1,
          posts:that.data.posts.concat(result),
        })
      }
      wx.hideLoading()
    },
    /**
     * 点击文章明细
     */
    bindPostDetail: async function (e) {
      let blogId = e.currentTarget.id;
      wx.navigateTo({
        url: '../detail/detail?id=' + blogId
      })
    },
    /**
     * 热门按钮切换
     * @param {*} e 
     */
    hotSelect: async function (e) {
      let that = this
      let hotCur = e.currentTarget.dataset.id
      let orderBy = "createTime"
      switch (hotCur) {
        //浏览最多
        case 0: {
          orderBy = "totalVisits"
          break
        }
        //评论最多
        case 1: {
          orderBy = "totalComments"
          break
        }
        //点赞最多
        case 2: {
          orderBy = "totalZans"
          break
        }
        //收藏最多
        case 3: {
          orderBy = "totalCollection"
          break
        }
      }
      that.setData({
        posts: [],
        hotCur: hotCur,
        defaultSearchValue: "",
        page: 0,
        nomore: false,
        nodata: false,
        whereItem: ['', orderBy, '']
      })
      await that.getPostsList("", orderBy)
    },
    /**
     * 标签按钮切换
     * @param {*} e 
     */
    labelSelect: async function (e) {
      let that = this
      let labelCur = e.currentTarget.dataset.id

      that.setData({
        posts: [],
        labelCur: labelCur,
        defaultSearchValue: "",
        page: 0,
        nomore: false,
        nodata: false,
        whereItem: ['', 'createTime', labelCur == "全部" ? "" : labelCur]
      })

      await that.getPostsList("", "createTime", labelCur == "全部" ? "" : labelCur)
    },
    /**
     * tab切换
     * @param {} e 
     */
    tabSelect: async function (e) {
      let that = this;
      console.log(e);
      let tabCur = e.currentTarget.dataset.id
      switch (tabCur) {
        case 1: {
          that.setData({
            tabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
            nomore: false,
            nodata: false,
            showHot: false,
            showLabels: false,
            defaultSearchValue: "",
            posts: [],
            page: 0,
            whereItem: ['', 'createTime', '']
          })

          await that.getPostsList("", 'createTime')
          break
        }
        case 2: {
          that.setData({
            posts: [],
            tabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
            showHot: true,
            showLabels: false,
            defaultSearchValue: "",
            page: 0,
            nomore: false,
            nodata: false,
            whereItem: ['', 'totalVisits', '']
          })
          await that.getPostsList("", "totalVisits")
          break
        }
        case 3: {
          that.setData({
            tabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
            showHot: false,
            showLabels: true,
          })

          let task = that.getPostsList("", 'createTime')
          let labelList = await api.getLabelList()
          that.setData({
            labelList: labelList.data
          })
          await task

          break
        }
      }
    },
    /**
     * 搜索功能
     * @param {} e 
     */
    bindconfirm: async function (e) {
      let that = this;
      console.log('e.detail.value', e.detail.value)
      let page = 1
      that.setData({
        page: page,
        posts: [],
        filter: e.detail.value,
        nomore: false,
        nodata: false,
        whereItem: [e.detail.value, 'createTime', '']
      })
      await this.getPostsList(e.detail.value, 'createTime')
    },
  }
})