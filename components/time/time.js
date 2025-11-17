let interval = 1000;
Component({
	options: {
		multipleSlots: true,
	},
	properties: {
		expireTime: {
			type: String,
		},
		emptyType: {
			type: String,
			value: '1',
		},
	},
	lifetimes: {
		ready() {
			this.startCountdown();
		},
		detached() {
			clearTimeout(this.timer);
		},
	},
	/**
	 * 组件的初始数据
	 */
	data: {
		d: 0, //天
		h: 0, //时
		m: 0, //分
		s: 0, //秒
		lastTime: '', //倒计时的时间戳
		isCountOver: false, // 倒计时是否完成
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		startCountdown() {
			const lastTime = this.initTime(this.properties.expireTime);
			if (lastTime > interval) {
				this.defaultFormat(lastTime);
				this.setData({
					isCountOver: true,
					lastTime,
				});
				this.tick();
			}
		},
		//默认处理时间格式
		defaultFormat(time) {
			const days = 60 * 60 * 1000 * 24;
			const hours = 60 * 60 * 1000;
			const minutes = 60 * 1000;
			const d = Math.floor(time / days);
			const h = Math.floor((time % days) / hours);
			const m = Math.floor((time % hours) / minutes);
			const s = Math.floor((time % minutes) / 1000);
			this.setData({
				d: this.fixedZero(d),
				h: this.fixedZero(h),
				m: this.fixedZero(m),
				s: this.fixedZero(s),
			});
		},
		//定时事件
		tick() {
            let { lastTime } = this.data;
            // console.log(lastTime)
			this.timer = setTimeout(() => {
				clearTimeout(this.timer);
				if (lastTime < interval) {
					this.setData({
						lastTime: 0,
						isCountOver: false,
					});
				} else {
					lastTime -= 1000;
					this.setData(
						{
							lastTime,
						},
						() => {
							this.defaultFormat(lastTime);
							this.tick();
						},
					);
				}
			}, interval);
		},
		//初始化时间
		initTime(expireTime) {
			let lastTime = Number(new Date(expireTime * 1000)) - new Date().getTime();
			// console.log('lastTime', lastTime);
			return Math.max(lastTime, 0);
		},
		// 格式化时间加0
		fixedZero(val) {
			return val < 10 ? `0${val}` : val;
		},
	},
});