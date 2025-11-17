module.exports = {
    formatNum: function(t) {
        var r = "", e = 0;
        if (-1 == t.indexOf(".")) {
            for (var n = t.length - 1; n >= 0; n--) r = e % 3 == 0 && 0 != e ? t.charAt(n) + "," + r : t.charAt(n) + r, 
            e++;
            t = r + ".00";
        } else {
            for (n = t.indexOf(".") - 1; n >= 0; n--) r = e % 3 == 0 && 0 != e ? t.charAt(n) + "," + r : t.charAt(n) + r, 
            e++;
            t = r + (t + "00").substr((t + "00").indexOf("."), 3);
        }
    },
    formatMoney: function(t) {
        return (t = parseInt(t)) > 1e8 ? (t = t.toString()).substr(0, t.length - 8) + "." + t.substr(t.length - 8, 1) + "亿" : t > 1e4 ? (t = t.toString()).substr(0, t.length - 4) + "." + t.substr(t.length - 4, 1) + "万" : t;
    }
};