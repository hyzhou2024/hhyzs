const api = require('../../utils/api.js');
const config = require('../../utils/config.js');
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


    /**
     * 组件生命周期函数，在组件布局完成后执行
     */
    ready: async function () {
        var that = this
        // 此处编写 ready 时需要执行的代码
        this.animation = wx.createAnimation({
                timingFunction: "ease"
            }),
        this.animation1 = wx.createAnimation({})
        this.animation2 = wx.createAnimation({})
        this.animation3 = wx.createAnimation({})
        this.animation4 = wx.createAnimation({})
        this.animation5 = wx.createAnimation({})
        var ssq_default_data = await this.defaultData()
        console.log(ssq_default_data)
        that.setData({
            ssq_default_data: ssq_default_data
        })
        await that.getRecData()




    },

    /**
     * 组件的初始数据
     */
    data: {
        num1: 0,
        num2: 0,
        num3: 0,
        num4: 0,
        num5: 0,
        lotId: 5,
        redBall: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
        blueBall: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        kill: "",
        recomendRed: "",
        isShareLook: true,
        isShowAd: [true, true, true, true],
        isShowRec: false,
        ssq_default_data: {},
        redhot: {},
        bluehot: {},
        currentTab: 0,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        getRecData: async function () {
            var that = this
            let data = {
                type: 'redis',
                key: 'ssq_rec'
            }
            let res = await api.request('post', config.url, data)
            console.log(res.data)
            that.setData({
                redhot: res.data.red_hot,
                bluehot: res.data.blue_hot,

            })


        },
        ZJonPageScroll: async function (scrollTop) {
            let that = this;
            console.log(scrollTop)
            var chlid = that.selectComponent('.ssqtq')
    chlid.ZJonPageScroll(scrollTop)
          },
        swichNav: async function (e) {
            var that = this
            var id = e.currentTarget.dataset.id;
            console.log(id)
            if (this.data.currentTab === e) return 0;
            that.setData({
              currentTab: id,
            });
          },
        // 热码
        animate1: function () {
            var that = this
            if (!that.data.isShowRec) {
                that.publicAnimation();
                setTimeout(function () {
                    that.animation1.translateY(config.Y).step({
                        duration: 2000
                    })
                    that.setData({
                        num1: 1,
                        num2: 0,
                        num3: 0,
                        num4: 0,
                        num5: 0,
                        animation1: that.animation1.export(),
                        isShowRec: true
                    })

                }, 2000)
                setTimeout(function () {
                    that.endInterval()

                }, 2000)

            }


        },
        // 冷码
        animate2: function () {
            var that = this
            if (!that.data.isShowRec) {
                that.publicAnimation();
                setTimeout(function () {
                    that.animation2.translateY(config.Y).step({
                        duration: 2000
                    })
                    that.setData({
                        num1: 0,
                        num2: 1,
                        num3: 0,
                        num4: 0,
                        num5: 0,
                        animation2: that.animation2.export(),
                        isShowRec: true
                    })
                }, 2000)
                setTimeout(function () {
                    that.endInterval()

                }, 2000)

            }


        },

        // 杀号
        animate3: function () {
            var that = this
            if (!that.data.isShowRec) {
                that.publicAnimation();
                setTimeout(function () {
                    that.animation3.translateY(config.Y).step({
                        duration: 2000
                    })
                    that.setData({
                        num1: 0,
                        num2: 0,
                        num3: 1,
                        num4: 0,
                        num5: 0,
                        animation3: that.animation3.export(),
                        isShowRec: true
                    })
                }, 2000)
                setTimeout(function () {
                    that.endInterval()

                }, 2000)

            } else {
                console.log('弹窗未关闭，不执行')
            }
        },
        // 推荐
        animate4: function (e) {
            var that = this
            if (!that.data.isShowRec) {
                that.publicAnimation();
                setTimeout(function () {
                    that.animation4.translateY(config.Y).step({
                        duration: 2000
                    })
                    that.setData({
                        num1: 0,
                        num2: 0,
                        num3: 0,
                        num4: 1,
                        num5: 0,
                        animation4: that.animation4.export(),
                        isShowRec: true
                    })
                }, 2000)
                setTimeout(function () {
                    that.endInterval()

                }, 2000)
            } else {
                console.log('弹窗未关闭，不执行')
            }

        },
        publicAnimation: async function () {

            var that = this
            await that.startInterval()
            this.animation.rotate().step({
                duration: 2000
            })
            this.animation5.rotate().step({
                duration: 2000
            })
            this.setData({
                num5: 1,
                animation: this.animation.export(),
                animation5: this.animation5.export()
            })
        },
        animate1default: async function () {
            var that = this
            console.log('执行')
            if (that.data.isShowRec && that.data.num1) {
                that.animation1.translateY(0).step({
                    duration: 0
                })

                this.setData({
                    animation1: this.animation1.export(),
                    num1: 0,
                    num2: 0,
                    num3: 0,
                    num4: 0,
                    num5: 0,
                    isShowRec: false,
                    isShowAd: [true, true, true, true],

                })
            } else {
                console.log('无效')
            }


        },
        animate2default: async function () {
            var that = this
            console.log('执行')
            if (that.data.isShowRec && that.data.num2) {
                that.animation2.translateY(0).step({
                    duration: 0
                })

                this.setData({
                    animation2: this.animation2.export(),
                    num1: 0,
                    num2: 0,
                    num3: 0,
                    num4: 0,
                    num5: 0,
                    isShowRec: false,
                    isShowAd: [true, true, true, true],

                })
            } else {
                console.log('无效状态')
            }

        },
        animate3default: async function () {
            var that = this
            console.log('执行')
            if (that.data.isShowRec && that.data.num3) {
                that.animation3.translateY(0).step({
                    duration: 0
                })

                this.setData({
                    animation3: this.animation3.export(),
                    num1: 0,
                    num2: 0,
                    num3: 0,
                    num4: 0,
                    num5: 0,
                    isShowRec: false,
                    isShowAd: [true, true, true, true],

                })
            } else {
                console.log('无效状态')
            }

        },
        animate4default: async function () {
            var that = this
            console.log('执行')
            if (that.data.isShowRec && that.data.num4) {
                that.animation4.translateY(0).step({
                    duration: 0
                })

                this.setData({
                    animation4: this.animation4.export(),
                    num1: 0,
                    num2: 0,
                    num3: 0,
                    num4: 0,
                    num5: 0,
                    isShowRec: false,
                    isShowAd: [true, true, true, true],

                })
            } else {
                console.log('无效状态')
            }

        },
        toPersonal: async function () {
            console.log(123)
        },
        //初始化数据
        defaultData: async function () {
            var res = {
                redBall: [],
                blueBall: []
            }
            try {
                for (var i = 1; i <= 33; i++) {
                    var item = {
                        num: i,
                        selected: false
                    }
                    res.redBall.push(item)
                }
                for (var j = 1; j <= 16; j++) {
                    var itemb = {
                        num: j,
                        selected: false
                    }
                    res.blueBall.push(itemb)
                }
                return res
            } catch (error) {

            }
        },
        returnSelectOne: async function () {
            var that = this
            try {
                var res = await this.defaultData()
                var sel = await this.selectOne()
                for (var i = 0; i < res.redBall.length; i++) {
                    for (var j = 0; j < sel.redBall.length; j++) {
                        if (res.redBall[i].num == sel.redBall[j].num) {
                            res.redBall[i].selected = true
                        }
                    }
                }
                for (var m = 0; m < res.blueBall.length; m++) {
                    for (var n = 0; n < sel.blueBall.length; n++) {
                        if (res.blueBall[m].num == sel.blueBall[n].num) {
                            res.blueBall[m].selected = true
                        }
                    }
                }
                console.log(res)

                that.setData({
                    ssq_default_data: res
                })
            } catch (error) {

            }
        },
        startInterval: async function () {
            var that = this
            var interval = setInterval(async function () {
                await that.returnSelectOne()
                console.log('执行中')
            }, 100)
            that.setData({
                interval: interval
            })



        },
        endInterval: async function () {
            var that = this

            clearTimeout(that.data.interval)
            var ssq_default_data = await this.defaultData()
            console.log(ssq_default_data)
            that.setData({
                ssq_default_data: ssq_default_data
            })


        },
        //产生随机一注

        selectOne: async function () {
            var that = this
            var list = await this.defaultData()
            try {
                for (var i = 0; i < 28; i++) {
                    var n = Math.round(Math.random() * (list.redBall.length - 1));
                    // console.log("过滤值：",list.redBall[n]);
                    list.redBall = list.redBall.filter(o => o != list.redBall[n])
                    // console.log("本期推荐",list.redBall)
                }
                for (var i = 0; i < 10; i++) {
                    var n = Math.round(Math.random() * (list.blueBall.length - 1));
                    // console.log("过滤值：",list.redBall[n]);
                    list.blueBall = list.blueBall.filter(o => o != list.blueBall[n])
                    // console.log("本期推荐",list.blueBall)
                }
                console.log(list)
                that.setData({
                    ssq_red: list.redBall,
                    ssq_blue: list.blueBall
                })
                return list
            } catch (error) {

            }
        },
        onIconClicked: async function (e) {
            console.log(e.currentTarget.dataset.id)
            var id = e.currentTarget.dataset.id
            var videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-9088db88e34e3b41'
            })
            if (id == 'rm') {
                videoAd.show().catch(() => {
                    // 失败重试
                    videoAd.load()
                        .then(() => videoAd.show())
                        .catch(err => {
                            console.log('激励视频 广告显示失败')
                        })
                })
                videoAd.onClose((status) => {
                    if (status && status.isEnded || status === undefined) {

                        let that = this;
                        that.setData({
                            isShowAd: [false, true, true, true]
                        });
                    } else {
                        wx.showToast({
                            title: '视频未完整观看',
                            icon: 'fail',
                            duration: 2000
                        })

                    }
                });
            }
            if (id == 'lm') {
                videoAd.show().catch(() => {
                    // 失败重试
                    videoAd.load()
                        .then(() => videoAd.show())
                        .catch(err => {
                            console.log('激励视频 广告显示失败')
                        })
                })
                videoAd.onClose((status) => {
                    if (status && status.isEnded || status === undefined) {

                        let that = this;
                        that.setData({
                            isShowAd: [true, false, true, true]
                        });
                    } else {
                        wx.showToast({
                            title: '视频未完整观看',
                            icon: 'fail',
                            duration: 2000
                        })

                    }
                });
            }
            if (id == 'kill') {
                videoAd.show().catch(() => {
                    // 失败重试
                    videoAd.load()
                        .then(() => videoAd.show())
                        .catch(err => {
                            console.log('激励视频 广告显示失败')
                        })
                })
                videoAd.onClose((status) => {
                    if (status && status.isEnded || status === undefined) {

                        let that = this;
                        that.setData({
                            isShowAd: [true, true, false, true]
                        });
                    } else {
                        wx.showToast({
                            title: '视频未完整观看',
                            icon: 'fail',
                            duration: 2000
                        })

                    }
                });
            }
            if (id == 'rec') {
                videoAd.show().catch(() => {
                    // 失败重试
                    videoAd.load()
                        .then(() => videoAd.show())
                        .catch(err => {
                            console.log('激励视频 广告显示失败')
                        })
                })
                videoAd.onClose((status) => {
                    if (status && status.isEnded || status === undefined) {

                        let that = this;
                        that.setData({
                            isShowAd: [true, true, true, false]
                        });
                    } else {
                        wx.showToast({
                            title: '视频未完整观看',
                            icon: 'fail',
                            duration: 2000
                        })

                    }
                });
            }
        },
    },



})