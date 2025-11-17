// components/ssqsel/ssqsel.js
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

  /**
   * 组件的初始数据
   */
  data: {
    // 双色球数据
    redBalls: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33],
    blueBalls: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
    
    // 选择状态
    redSelected: new Array(33).fill(false),
    blueSelected: new Array(16).fill(false),
    redSelectedList: [],
    blueSelectedList: [],
    
    // 热号数据
    hotRedBalls: [3,6,9,12,15,18,21,24,27,30,33],
    hotBlueBalls: [3,6,9,12,16],
    
    // 结果数据
    allResults: [],
    filteredResults: [],
    currentPage: 1,
    pageSize: 20,
    
    // 计算属性
    redSelectedCount: 0,
    blueSelectedCount: 0,
    combinationCount: 0,
    activeFilterCount: 0,
    filterRate: 0,
    totalPages: 1,
    currentPageResults: [],
    
    // 筛选条件
    filters: {
      redOddEven: null,
      redSizeRatio: null,
      redSumRange: [21, 183],
      redConsecutive: null,
      acValue: null,
      zoneCounts: [0,0,0,0,0,0]
    },
    
    // 筛选选项
    redOddEvenRatios: [
      { name: '不限', value: null },
      { name: '6:0', value: '6:0' },
      { name: '5:1', value: '5:1' },
      { name: '4:2', value: '4:2' },
      { name: '3:3', value: '3:3' },
      { name: '2:4', value: '2:4' },
      { name: '1:5', value: '1:5' },
      { name: '0:6', value: '0:6' }
    ],
    
    redSizeRatios: [
      { name: '不限', value: null },
      { name: '6:0', value: '6:0' },
      { name: '5:1', value: '5:1' },
      { name: '4:2', value: '4:2' },
      { name: '3:3', value: '3:3' },
      { name: '2:4', value: '2:4' },
      { name: '1:5', value: '1:5' },
      { name: '0:6', value: '0:6' }
    ],
    
    consecutiveOptions: [
      { name: '不限', value: null, desc: '包含所有' },
      { name: '有连号', value: 'has', desc: '包含连号' },
      { name: '无连号', value: 'none', desc: '不包含连号' }
    ],
    
    acValues: [null, 3, 4, 5, 6, 7, 8, 9, 10],
    
    zoneOptions: [
      { name: '一', zone: 0, range: '1-6' },
      { name: '二', zone: 1, range: '7-12' },
      { name: '三', zone: 2, range: '13-18' },
      { name: '四', zone: 3, range: '19-24' },
      { name: '五', zone: 4, range: '25-30' },
      { name: '六', zone: 5, range: '31-33' }
    ],
    
    // 筛选状态
    filterStats: null,
    activeFilterTags: [],
    isLoading: false
  },
  lifetimes: {
    ready() {
       console.log('双色球选号工具加载完成');
       this.updateCalculatedValues();

    },
    detached() {

    },
},
  // 组件所在页面的生命周期
  pageLifetimes: {
    show: function () {
        this.updateCalculatedValues();
      
    },
    hide: function () {
    
    },
    resize: function(size) {
    
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
          // 更新计算属性
    updateCalculatedValues: function() {
        var redSelectedCount = this.calculateSelectedCount(this.data.redSelected);
        var blueSelectedCount = this.calculateSelectedCount(this.data.blueSelected);
        var combinationCount = this.calculateCombinations();
        var activeFilterCount = this.calculateActiveFilters();
        var filterRate = this.calculateFilterRate();
        var totalPages = Math.ceil(this.data.filteredResults.length / this.data.pageSize);
        var currentPageResults = this.getCurrentPageResults();
        
        this.setData({
          redSelectedCount: redSelectedCount,
          blueSelectedCount: blueSelectedCount,
          combinationCount: combinationCount,
          activeFilterCount: activeFilterCount,
          filterRate: filterRate,
          totalPages: totalPages,
          currentPageResults: currentPageResults
        });
      },
    
      // 计算选中数量
      calculateSelectedCount: function(selectedArray) {
        var count = 0;
        for (var i = 0; i < selectedArray.length; i++) {
          if (selectedArray[i]) count++;
        }
        return count;
      },
    
      // 计算组合数量
      calculateCombinations: function() {
        var redCount = this.data.redSelectedCount;
        var blueCount = this.data.blueSelectedCount;
        
        if (redCount < 6 || blueCount < 1) return 0;
        
        // 红球组合数：C(6, redCount)
        var redCombinations = this.combination(redCount, 6);
        // 蓝球组合数：C(1, blueCount)
        var blueCombinations = this.combination(blueCount, 1);
        
        return redCombinations * blueCombinations;
      },
    
      // 组合数计算 C(n, m)
      combination: function(n, m) {
        if (m > n) return 0;
        if (m === 0 || m === n) return 1;
        
        var numerator = 1;
        var denominator = 1;
        
        for (var i = 1; i <= m; i++) {
          numerator *= (n - i + 1);
          denominator *= i;
        }
        
        return numerator / denominator;
      },
    
      // 选择红球
      selectRedBall: function(e) {
        var index = e.currentTarget.dataset.index;
        var redSelected = this.data.redSelected;
        
        if (redSelected[index]) {
          // 取消选择
          redSelected[index] = false;
        } else {
          // 检查是否已选满6个
          if (this.data.redSelectedCount >= 6) {
            wx.showToast({
              title: '红球最多选6个号码',
              icon: 'none'
            });
            return;
          }
          redSelected[index] = true;
        }
        
        this.setData({ redSelected: redSelected });
        this.updateRedSelectedList();
        this.updateCalculatedValues();
      },
    
      // 选择蓝球
      selectBlueBall: function(e) {
        var index = e.currentTarget.dataset.index;
        var blueSelected = this.data.blueSelected;
        
        if (blueSelected[index]) {
          // 取消选择
          blueSelected[index] = false;
        } else {
          // 检查是否已选满1个
          if (this.data.blueSelectedCount >= 1) {
            // 蓝球只能选1个，先清空再选择
            blueSelected = new Array(16).fill(false);
          }
          blueSelected[index] = true;
        }
        
        this.setData({ blueSelected: blueSelected });
        this.updateBlueSelectedList();
        this.updateCalculatedValues();
      },
    
      // 更新选中列表
      updateRedSelectedList: function() {
        var redSelectedList = [];
        for (var i = 0; i < this.data.redSelected.length; i++) {
          if (this.data.redSelected[i]) {
            redSelectedList.push(i + 1);
          }
        }
        this.setData({ redSelectedList: redSelectedList });
      },
    
      updateBlueSelectedList: function() {
        var blueSelectedList = [];
        for (var i = 0; i < this.data.blueSelected.length; i++) {
          if (this.data.blueSelected[i]) {
            blueSelectedList.push(i + 1);
          }
        }
        this.setData({ blueSelectedList: blueSelectedList });
      },
    
      // 全选红球
      selectAllRed: function() {
        if (this.data.redSelectedCount >= 6) {
          this.clearRed();
          return;
        }
        
        var redSelected = new Array(33).fill(false);
        var count = 0;
        for (var i = 0; i < 33 && count < 6; i++) {
          redSelected[i] = true;
          count++;
        }
        
        this.setData({ redSelected: redSelected });
        this.updateRedSelectedList();
        this.updateCalculatedValues();
      },
    
      // 全选蓝球
      selectAllBlue: function() {
        if (this.data.blueSelectedCount >= 1) {
          this.clearBlue();
          return;
        }
        
        var blueSelected = new Array(16).fill(false);
        blueSelected[0] = true; // 选择第一个蓝球
        
        this.setData({ blueSelected: blueSelected });
        this.updateBlueSelectedList();
        this.updateCalculatedValues();
      },
    
      // 清空红球
      clearRed: function() {
        this.setData({ redSelected: new Array(33).fill(false) });
        this.updateRedSelectedList();
        this.updateCalculatedValues();
      },
    
      // 清空蓝球
      clearBlue: function() {
        this.setData({ blueSelected: new Array(16).fill(false) });
        this.updateBlueSelectedList();
        this.updateCalculatedValues();
      },
    
      // 随机红球
      randomRed: function() {
        this.clearRed();
        var redSelected = new Array(33).fill(false);
        var selected = [];
        
        while (selected.length < 6) {
          var randomNum = Math.floor(Math.random() * 33) + 1;
          if (selected.indexOf(randomNum) === -1) {
            selected.push(randomNum);
            redSelected[randomNum - 1] = true;
          }
        }
        
        this.setData({ redSelected: redSelected });
        this.updateRedSelectedList();
        this.updateCalculatedValues();
      },
    
      // 随机蓝球
      randomBlue: function() {
        this.clearBlue();
        var blueSelected = new Array(16).fill(false);
        var randomNum = Math.floor(Math.random() * 16) + 1;
        blueSelected[randomNum - 1] = true;
        
        this.setData({ blueSelected: blueSelected });
        this.updateBlueSelectedList();
        this.updateCalculatedValues();
      },
    
      // 移除红球
      removeRedBall: function(e) {
        var ball = parseInt(e.currentTarget.dataset.ball);
        var redSelected = this.data.redSelected;
        redSelected[ball - 1] = false;
        
        this.setData({ redSelected: redSelected });
        this.updateRedSelectedList();
        this.updateCalculatedValues();
      },
    
      // 移除蓝球
      removeBlueBall: function(e) {
        var ball = parseInt(e.currentTarget.dataset.ball);
        var blueSelected = this.data.blueSelected;
        blueSelected[ball - 1] = false;
        
        this.setData({ blueSelected: blueSelected });
        this.updateBlueSelectedList();
        this.updateCalculatedValues();
      },
    
      // 获取选择顺序
      getRedSelectionOrder: function(index) {
        if (!this.data.redSelected[index]) return '';
        var order = 0;
        for (var i = 0; i <= index; i++) {
          if (this.data.redSelected[i]) order++;
        }
        return order;
      },
    
      getBlueSelectionOrder: function(index) {
        if (!this.data.blueSelected[index]) return '';
        var order = 0;
        for (var i = 0; i <= index; i++) {
          if (this.data.blueSelected[i]) order++;
        }
        return order;
      },
    
      // 检查是否是热号
      isHotRedBall: function(ball) {
        return this.data.hotRedBalls.indexOf(ball) > -1;
      },
    
      isHotBlueBall: function(ball) {
        return this.data.hotBlueBalls.indexOf(ball) > -1;
      },
    
      // 快捷操作
      generateRandom: function() {
        this.randomRed();
        this.randomBlue();
        
        wx.showToast({
          title: '已生成随机号码',
          icon: 'success'
        });
      },
    
      generateSmart: function() {
        // 智能选号：优先选择热号
        this.clearRed();
        this.clearBlue();
        
        var redSelected = new Array(33).fill(false);
        var blueSelected = new Array(16).fill(false);
        
        // 红球选择热号
        var hotRed = this.data.hotRedBalls.slice(0, 6);
        for (var i = 0; i < hotRed.length; i++) {
          redSelected[hotRed[i] - 1] = true;
        }
        
        // 蓝球选择热号
        var hotBlue = this.data.hotBlueBalls[Math.floor(Math.random() * this.data.hotBlueBalls.length)];
        blueSelected[hotBlue - 1] = true;
        
        this.setData({
          redSelected: redSelected,
          blueSelected: blueSelected
        });
        this.updateRedSelectedList();
        this.updateBlueSelectedList();
        this.updateCalculatedValues();
        
        wx.showToast({
          title: '已生成智能号码',
          icon: 'success'
        });
      },
    
      generatePattern: function() {
        // 规律选号：生成有规律的号码
        this.clearRed();
        this.clearBlue();
        
        var redSelected = new Array(33).fill(false);
        var blueSelected = new Array(16).fill(false);
        
        // 红球：等差数列
        var start = Math.floor(Math.random() * 10) + 1;
        var pattern = [start, start + 5, start + 10, start + 15, start + 20, start + 25];
        for (var i = 0; i < pattern.length; i++) {
          if (pattern[i] <= 33) {
            redSelected[pattern[i] - 1] = true;
          }
        }
        
        // 蓝球：间隔选号
        var blueStart = Math.floor(Math.random() * 8) + 1;
        blueSelected[blueStart - 1] = true;
        
        this.setData({
          redSelected: redSelected,
          blueSelected: blueSelected
        });
        this.updateRedSelectedList();
        this.updateBlueSelectedList();
        this.updateCalculatedValues();
        
        wx.showToast({
          title: '已生成规律号码',
          icon: 'success'
        });
      },
    
      generateDouble: function() {
        // 复式选号：选择更多号码
        this.clearRed();
        this.clearBlue();
        
        var redSelected = new Array(33).fill(false);
        var blueSelected = new Array(16).fill(false);
        
        // 红球选7-8个号码
        var redCount = Math.floor(Math.random() * 2) + 7;
        var redNums = [];
        while (redNums.length < redCount) {
          var num = Math.floor(Math.random() * 33) + 1;
          if (redNums.indexOf(num) === -1) {
            redNums.push(num);
            redSelected[num - 1] = true;
          }
        }
        
        // 蓝球选2-3个号码
        var blueCount = Math.floor(Math.random() * 2) + 2;
        var blueNums = [];
        while (blueNums.length < blueCount) {
          var num = Math.floor(Math.random() * 16) + 1;
          if (blueNums.indexOf(num) === -1) {
            blueNums.push(num);
            blueSelected[num - 1] = true;
          }
        }
        
        this.setData({
          redSelected: redSelected,
          blueSelected: blueSelected
        });
        this.updateRedSelectedList();
        this.updateBlueSelectedList();
        this.updateCalculatedValues();
        
        wx.showToast({
          title: '已生成复式号码',
          icon: 'success'
        });
      },
    
      generateBatch: function() {
        // 批量生成多注号码
        var batchCount = 10;
        var results = [];
        
        for (var i = 0; i < batchCount; i++) {
          var redNums = [];
          var blueNum = 0;
          
          // 生成红球6个不重复号码
          while (redNums.length < 6) {
            var num = Math.floor(Math.random() * 33) + 1;
            if (redNums.indexOf(num) === -1) {
              redNums.push(num);
            }
          }
          redNums.sort(function(a, b) { return a - b; });
          
          // 生成蓝球1个号码
          blueNum = Math.floor(Math.random() * 16) + 1;
          
          results.push({
            redNumbers: redNums,
            blueNumber: blueNum,
            sum: this.calculateSum(redNums),
            oddEvenRatio: this.calculateOddEvenRatio(redNums),
            sizeRatio: this.calculateSizeRatio(redNums),
            acValue: this.calculateACValue(redNums),
            consecutiveCount: this.calculateConsecutiveCount(redNums),
            span: this.calculateSpan(redNums)
          });
        }
        
        var allResults = this.data.allResults.concat(results);
        var filteredResults = this.applyFiltersToResults(allResults);
        
        this.setData({
          allResults: allResults,
          filteredResults: filteredResults,
          currentPage: 1
        });
        this.updateCalculatedValues();
        
        wx.showToast({
          title: '已生成' + batchCount + '注号码',
          icon: 'success'
        });
      },
    
      // 清空选择
      clearSelection: function() {
        this.setData({
          redSelected: new Array(33).fill(false),
          blueSelected: new Array(16).fill(false),
          redSelectedList: [],
          blueSelectedList: []
        });
        this.updateCalculatedValues();
        
        wx.showToast({
          title: '选择已清空',
          icon: 'success'
        });
      },
    
      // 添加到结果
      addToResult: function() {
        if (this.data.redSelectedCount < 6 || this.data.blueSelectedCount < 1) {
          wx.showToast({
            title: '请选择红球6个和蓝球1个号码',
            icon: 'none'
          });
          return;
        }
        
        var redNums = this.data.redSelectedList.slice().sort(function(a, b) { return a - b; });
        var blueNum = this.data.blueSelectedList[0]; // 蓝球只取第一个选中的
        
        var result = {
          redNumbers: redNums,
          blueNumber: blueNum,
          sum: this.calculateSum(redNums),
          oddEvenRatio: this.calculateOddEvenRatio(redNums),
          sizeRatio: this.calculateSizeRatio(redNums),
          acValue: this.calculateACValue(redNums),
          consecutiveCount: this.calculateConsecutiveCount(redNums),
          span: this.calculateSpan(redNums),
          isSpecial: this.isSpecialCombination(redNums, blueNum)
        };
        
        var allResults = this.data.allResults.concat([result]);
        var filteredResults = this.applyFiltersToResults(allResults);
        
        this.setData({
          allResults: allResults,
          filteredResults: filteredResults,
          currentPage: 1
        });
        this.updateCalculatedValues();
        
        wx.showToast({
          title: '号码已添加到结果',
          icon: 'success'
        });
      },
    
      // 计算和值
      calculateSum: function(numbers) {
        var sum = 0;
        for (var i = 0; i < numbers.length; i++) {
          sum += numbers[i];
        }
        return sum;
      },
    
      // 计算奇偶比
      calculateOddEvenRatio: function(numbers) {
        var oddCount = 0;
        for (var i = 0; i < numbers.length; i++) {
          if (numbers[i] % 2 === 1) oddCount++;
        }
        return oddCount + ':' + (numbers.length - oddCount);
      },
    
      // 计算大小比（以17为界）
      calculateSizeRatio: function(numbers) {
        var largeCount = 0;
        for (var i = 0; i < numbers.length; i++) {
          if (numbers[i] > 17) largeCount++;
        }
        return largeCount + ':' + (numbers.length - largeCount);
      },
    
      // 计算AC值
      calculateACValue: function(numbers) {
        if (numbers.length < 2) return 0;
        
        var diffs = [];
        for (var i = 0; i < numbers.length; i++) {
          for (var j = i + 1; j < numbers.length; j++) {
            var diff = Math.abs(numbers[i] - numbers[j]);
            if (diffs.indexOf(diff) === -1) {
              diffs.push(diff);
            }
          }
        }
        
        return diffs.length - (numbers.length - 1);
      },
    
      // 计算连号数量
      calculateConsecutiveCount: function(numbers) {
        var sorted = numbers.slice().sort(function(a, b) { return a - b; });
        var count = 0;
        
        for (var i = 0; i < sorted.length - 1; i++) {
          if (sorted[i + 1] - sorted[i] === 1) {
            count++;
          }
        }
        
        return count;
      },
    
      // 计算跨度
      calculateSpan: function(numbers) {
        var sorted = numbers.slice().sort(function(a, b) { return a - b; });
        return sorted[sorted.length - 1] - sorted[0];
      },
    
      // 判断是否特殊组合
      isSpecialCombination: function(redNumbers, blueNumber) {
        var sum = this.calculateSum(redNumbers);
        return sum > 100 && sum < 120;
      },
    
      // 筛选功能
      setRedOddEven: function(e) {
        var ratio = e.currentTarget.dataset.ratio;
        var filters = this.data.filters;
        filters.redOddEven = filters.redOddEven === ratio ? null : ratio;
        
        this.setData({ filters: filters });
        this.updateCalculatedValues();
        this.updateFilterTags();
      },
    
      setRedSizeRatio: function(e) {
        var ratio = e.currentTarget.dataset.ratio;
        var filters = this.data.filters;
        filters.redSizeRatio = filters.redSizeRatio === ratio ? null : ratio;
        
        this.setData({ filters: filters });
        this.updateCalculatedValues();
        this.updateFilterTags();
      },
    
      setRedSumRange: function(e) {
        var index = parseInt(e.currentTarget.dataset.index);
        var value = parseInt(e.detail.value) || 0;
        var filters = this.data.filters;
        
        if (index === 0) {
          filters.redSumRange[0] = Math.max(21, Math.min(filters.redSumRange[1], value));
        } else {
          filters.redSumRange[1] = Math.min(183, Math.max(filters.redSumRange[0], value));
        }
        
        this.setData({ filters: filters });
        this.updateFilterTags();
      },
    
      setRedConsecutive: function(e) {
        var value = e.currentTarget.dataset.value;
        var filters = this.data.filters;
        filters.redConsecutive = filters.redConsecutive === value ? null : value;
        
        this.setData({ filters: filters });
        this.updateCalculatedValues();
        this.updateFilterTags();
      },
    
      setAcValue: function(e) {
        var value = e.currentTarget.dataset.value;
        var filters = this.data.filters;
        filters.acValue = filters.acValue === value ? null : value;
        
        this.setData({ filters: filters });
        this.updateCalculatedValues();
        this.updateFilterTags();
      },
    
      increaseZone: function(e) {
        var zone = parseInt(e.currentTarget.dataset.zone);
        var filters = this.data.filters;
        var currentCount = filters.zoneCounts[zone];
        
        if (currentCount < 6) {
          filters.zoneCounts[zone] = currentCount + 1;
          this.setData({ filters: filters });
          this.updateFilterTags();
        }
      },
    
      decreaseZone: function(e) {
        var zone = parseInt(e.currentTarget.dataset.zone);
        var filters = this.data.filters;
        var currentCount = filters.zoneCounts[zone];
        
        if (currentCount > 0) {
          filters.zoneCounts[zone] = currentCount - 1;
          this.setData({ filters: filters });
          this.updateFilterTags();
        }
      },
    
      getZoneCount: function(zone) {
        return this.data.filters.zoneCounts[zone];
      },
    
      // 计算激活的筛选条件数量
      calculateActiveFilters: function() {
        var filters = this.data.filters;
        var count = 0;
        
        if (filters.redOddEven) count++;
        if (filters.redSizeRatio) count++;
        if (filters.redConsecutive) count++;
        if (filters.acValue) count++;
        
        // 检查区间筛选
        var zoneTotal = 0;
        for (var i = 0; i < filters.zoneCounts.length; i++) {
          zoneTotal += filters.zoneCounts[i];
        }
        if (zoneTotal > 0) count++;
        
        return count;
      },
    
      // 应用筛选条件到结果
      applyFiltersToResults: function(results) {
        var self = this;
        var filtered = [];
        
        for (var i = 0; i < results.length; i++) {
          var result = results[i];
          var shouldInclude = true;
          
          // 红球奇偶比筛选
          if (shouldInclude && self.data.filters.redOddEven) {
            var oddCount = 0;
            for (var j = 0; j < result.redNumbers.length; j++) {
              if (result.redNumbers[j] % 2 === 1) oddCount++;
            }
            var ratio = oddCount + ':' + (6 - oddCount);
            if (ratio !== self.data.filters.redOddEven) {
              shouldInclude = false;
            }
          }
          
          // 红球大小比筛选
          if (shouldInclude && self.data.filters.redSizeRatio) {
            var largeCount = 0;
            for (var j = 0; j < result.redNumbers.length; j++) {
              if (result.redNumbers[j] > 17) largeCount++;
            }
            var ratio = largeCount + ':' + (6 - largeCount);
            if (ratio !== self.data.filters.redSizeRatio) {
              shouldInclude = false;
            }
          }
          
          // 和值范围筛选
          if (shouldInclude) {
            var sum = result.sum;
            if (sum < self.data.filters.redSumRange[0] || sum > self.data.filters.redSumRange[1]) {
              shouldInclude = false;
            }
          }
          
          // 连号筛选
          if (shouldInclude && self.data.filters.redConsecutive) {
            if (self.data.filters.redConsecutive === 'has' && result.consecutiveCount === 0) {
              shouldInclude = false;
            }
            if (self.data.filters.redConsecutive === 'none' && result.consecutiveCount > 0) {
              shouldInclude = false;
            }
          }
          
          // AC值筛选
          if (shouldInclude && self.data.filters.acValue) {
            if (result.acValue !== self.data.filters.acValue) {
              shouldInclude = false;
            }
          }
          
          // 区间分布筛选
          if (shouldInclude) {
            var zoneCounts = [0,0,0,0,0,0];
            for (var j = 0; j < result.redNumbers.length; j++) {
              var num = result.redNumbers[j];
              var zone = Math.floor((num - 1) / 6);
              if (zone < 6) zoneCounts[zone]++;
            }
            
            for (var j = 0; j < 6; j++) {
              if (self.data.filters.zoneCounts[j] > 0 && zoneCounts[j] !== self.data.filters.zoneCounts[j]) {
                shouldInclude = false;
                break;
              }
            }
          }
          
          if (shouldInclude) {
            filtered.push(result);
          }
        }
        
        return filtered;
      },
    
      // 更新筛选标签
      updateFilterTags: function() {
        var filters = this.data.filters;
        var tags = [];
        
        if (filters.redOddEven) {
          tags.push({ key: 'redOddEven', text: '奇偶比:' + filters.redOddEven });
        }
        
        if (filters.redSizeRatio) {
          tags.push({ key: 'redSizeRatio', text: '大小比:' + filters.redSizeRatio });
        }
        
        if (filters.redConsecutive) {
          tags.push({ key: 'redConsecutive', text: filters.redConsecutive === 'has' ? '有连号' : '无连号' });
        }
        
        if (filters.acValue) {
          tags.push({ key: 'acValue', text: 'AC值:' + filters.acValue });
        }
        
        // 区间筛选标签
        var zoneTotal = 0;
        for (var i = 0; i < filters.zoneCounts.length; i++) {
          zoneTotal += filters.zoneCounts[i];
        }
        if (zoneTotal > 0) {
          tags.push({ key: 'zoneCounts', text: '区间筛选:' + zoneTotal + '个条件' });
        }
        
        this.setData({ activeFilterTags: tags });
      },
    
      removeFilterTag: function(e) {
        var key = e.currentTarget.dataset.key;
        var filters = this.data.filters;
        
        switch(key) {
          case 'redOddEven':
            filters.redOddEven = null;
            break;
          case 'redSizeRatio':
            filters.redSizeRatio = null;
            break;
          case 'redConsecutive':
            filters.redConsecutive = null;
            break;
          case 'acValue':
            filters.acValue = null;
            break;
          case 'zoneCounts':
            filters.zoneCounts = [0,0,0,0,0,0];
            break;
        }
        
        this.setData({ filters: filters });
        this.updateCalculatedValues();
        this.updateFilterTags();
      },
    
      clearAllFilterTags: function() {
        this.resetFilters();
      },
    
      // 重置筛选
      resetFilters: function() {
        this.setData({
          filters: {
            redOddEven: null,
            redSizeRatio: null,
            redSumRange: [21, 183],
            redConsecutive: null,
            acValue: null,
            zoneCounts: [0,0,0,0,0,0]
          },
          filteredResults: this.data.allResults,
          filterStats: null,
          currentPage: 1
        });
        this.updateCalculatedValues();
        this.updateFilterTags();
        
        wx.showToast({
          title: '筛选条件已重置',
          icon: 'success'
        });
      },
    
      // 预览筛选结果
      previewFilter: function() {
        var filteredResults = this.applyFiltersToResults(this.data.allResults);
        var beforeCount = this.data.allResults.length;
        var afterCount = filteredResults.length;
        var rate = beforeCount > 0 ? Math.round((afterCount / beforeCount) * 100) : 0;
        
        this.setData({
          filterStats: {
            before: beforeCount,
            after: afterCount,
            rate: rate
          }
        });
        
        wx.showModal({
          title: '筛选预览',
          content: '筛选前: ' + beforeCount + '注\n筛选后: ' + afterCount + '注\n保留率: ' + rate + '%',
          showCancel: false
        });
      },
    
      // 应用筛选
      applyFilters: function() {
        var filteredResults = this.applyFiltersToResults(this.data.allResults);
        this.setData({ 
          filteredResults: filteredResults,
          currentPage: 1
        });
        this.updateCalculatedValues();
        
        wx.showToast({
          title: '筛选完成，保留' + filteredResults.length + '注',
          icon: 'success'
        });
      },
    
      // 计算保留率
      calculateFilterRate: function() {
        if (this.data.allResults.length === 0) return 0;
        return Math.round((this.data.filteredResults.length / this.data.allResults.length) * 100);
      },
    
      // 获取当前页结果
      getCurrentPageResults: function() {
        var start = (this.data.currentPage - 1) * this.data.pageSize;
        var end = start + this.data.pageSize;
        return (this.data.filteredResults || []).slice(start, end);
      },
    
      // 分页控制
      prevPage: function() {
        if (this.data.currentPage > 1) {
          this.setData({ currentPage: this.data.currentPage - 1 });
          this.updateCalculatedValues();
        }
      },
    
      nextPage: function() {
        if (this.data.currentPage < this.data.totalPages) {
          this.setData({ currentPage: this.data.currentPage + 1 });
          this.updateCalculatedValues();
        }
      },
    
      // 结果操作
      clearResults: function() {
        this.setData({
          allResults: [],
          filteredResults: [],
          currentPage: 1
        });
        this.updateCalculatedValues();
        
        wx.showToast({
          title: '结果已清空',
          icon: 'success'
        });
      },
    
      exportResults: function() {
        if ((this.data.filteredResults || []).length === 0) {
          wx.showToast({ title: '没有可导出的结果', icon: 'none' });
          return;
        }
        
        var content = '';
        for (var i = 0; i < this.data.filteredResults.length; i++) {
          var result = this.data.filteredResults[i];
          content += result.redNumbers.join(' ') + ' + ' + result.blueNumber + '\n';
        }
        
        wx.setClipboardData({
          data: content,
          success: function() {
            wx.showToast({ title: '结果已复制到剪贴板', icon: 'success' });
          }
        });
      },
    
      saveResults: function() {
        if ((this.data.filteredResults || []).length === 0) {
          wx.showToast({ title: '没有可保存的结果', icon: 'none' });
          return;
        }
        
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      },
    
      // 清空所有筛选
      clearAllFilters: function() {
        this.resetFilters();
      },
    
      // 加载状态控制
      setLoading: function(isLoading) {
        this.setData({ isLoading: isLoading });
      },
    
      // 热号检查函数
      isHotRedBall: function(ball) {
        return this.data.hotRedBalls.indexOf(ball) > -1;
      },
    
      isHotBlueBall: function(ball) {
        return this.data.hotBlueBalls.indexOf(ball) > -1;
      },
    
      // 批量操作
      batchGenerate: function(count) {
        this.setLoading(true);
        
        setTimeout(function() {
          this.generateBatch(count || 10);
          this.setLoading(false);
        }.bind(this), 500);
      },
    
      // 快速选号模式
      quickSelectMode: function(mode) {
        switch(mode) {
          case 'all_even':
            this.selectAllEven();
            break;
          case 'all_odd':
            this.selectAllOdd();
            break;
          case 'small_numbers':
            this.selectSmallNumbers();
            break;
          case 'large_numbers':
            this.selectLargeNumbers();
            break;
          default:
            this.generateRandom();
        }
      },
    
      // 选择全偶数
      selectAllEven: function() {
        this.clearRed();
        var redSelected = new Array(33).fill(false);
        var count = 0;
        
        for (var i = 1; i <= 33 && count < 6; i++) {
          if (i % 2 === 0) {
            redSelected[i - 1] = true;
            count++;
          }
        }
        
        this.setData({ redSelected: redSelected });
        this.updateRedSelectedList();
        this.updateCalculatedValues();
      },
    
      // 选择全奇数
      selectAllOdd: function() {
        this.clearRed();
        var redSelected = new Array(33).fill(false);
        var count = 0;
        
        for (var i = 1; i <= 33 && count < 6; i++) {
          if (i % 2 === 1) {
            redSelected[i - 1] = true;
            count++;
          }
        }
        
        this.setData({ redSelected: redSelected });
        this.updateRedSelectedList();
        this.updateCalculatedValues();
      },
    
      // 选择小号码
      selectSmallNumbers: function() {
        this.clearRed();
        var redSelected = new Array(33).fill(false);
        
        for (var i = 0; i < 6; i++) {
          redSelected[i] = true;
        }
        
        this.setData({ redSelected: redSelected });
        this.updateRedSelectedList();
        this.updateCalculatedValues();
      },
    
      // 选择大号码
      selectLargeNumbers: function() {
        this.clearRed();
        var redSelected = new Array(33).fill(false);
        
        for (var i = 27; i < 33; i++) {
          redSelected[i] = true;
        }
        
        this.setData({ redSelected: redSelected });
        this.updateRedSelectedList();
        this.updateCalculatedValues();
      }

  }
})