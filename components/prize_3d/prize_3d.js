Component({
    properties: {
        prize: {
            type: Object
        },
        showDetail: {
            type: Boolean
        }
    },
    data: {},
    methods: {
        showDetail: function() {
            this.setData({
                showDetail: !this.data.showDetail
            });
        }
    }
});