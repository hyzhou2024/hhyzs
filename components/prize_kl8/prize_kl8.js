Component({
    properties: {
        prize: {
            type: Object
        },
        showDetail: {
            type: Boolean
        }
    },
    data: {
        selectType: 10,
        typeContentList: [ {
            name: "选十",
            type: 10
        }, {
            name: "选九",
            type: 9
        }, {
            name: "选八",
            type: 8
        }, {
            name: "选七",
            type: 7
        }, {
            name: "选六",
            type: 6
        }, {
            name: "选五",
            type: 5
        }, {
            name: "选四",
            type: 4
        }, {
            name: "选三",
            type: 3
        }, {
            name: "选二",
            type: 2
        }, {
            name: "选一",
            type: 1
        } ]
    },
    methods: {
        showDetail: function() {
            this.setData({
                showDetail: !this.data.showDetail
            });
        },
        selectGameType: function(e) {
            var t = e.currentTarget.dataset.type;
            this.data.selectType != t && this.setData({
                selectType: t
            });
        }
    }
});