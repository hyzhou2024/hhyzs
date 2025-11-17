

const host = 'https://www.yidingniu.net.cn';//测试服
const getfirstcity = 'https://gpi.ydniu.com/graphql';//一等奖分布



function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatOpenNumber(openNumber,typeId){
    var sb = "";
    if(typeId == 4){
        openNumber.split(",").forEach(function (a) {
                sb += "<b class='zc'>{0}</b>".format(a);
            });
    }else {
        if (openNumber.indexOf("+") > 1) {
            var list = openNumber.split("+");
            if (list[0].length > 0 && list[0].indexOf(",") > 0)
            {
                list[0].split(",").forEach(function (a) {
                    sb += "<b class='hq'>{0}</b>".format(a);
                });
            }
            if (list[1].length > 0 && list[1].indexOf(",") > 0)
            {
                list[1].split(",").forEach(function (a) {
                    sb += "<b class='lq'>{0}</b>".format(a);
                });
            }
            else
            {
                sb += "<b class='lq'>{0}</b>".format(list[1]);
            }
        }
        else
        {
            openNumber.split(",").forEach(function (a) {
                sb += "<b class='hq'>{0}</b>".format(a);
            });
        }
    }
        return sb;
}

function getOpenNumber(openNumber, source, lotCode){
    var arr  = {
        hq : [],
        lq : []
    }

    if(source == "chart"){
      var list = openNumber.split(",");
      if(list != null && list.length == 7){
        if(lotCode == "ssq"){
          for (var i = 0; i < 6; i++) {
              arr.hq.push(list[i]);
          }
          arr.lq.push(list[6]);
        }
        else if(lotCode == "dlt"){
          for (var i = 0; i < 5; i++) {
            arr.hq.push(list[i]);
          }
          arr.lq.push(list[5]);
          arr.lq.push(list[6]);
        }
      }
    }
    else{
      if (openNumber.indexOf("+") > 1) {
        var list = openNumber.split("+");
        if (list[0].length > 0 && list[0].indexOf(",") > 0) {
          arr.hq = list[0].split(",");
        }
        if (list[1].length > 0 && list[1].indexOf(",") > 0) {
          arr.lq = list[1].split(",");
        }
        else {
          arr.lq.push(list[1]);
        }
      }
      else {
        arr.hq = openNumber.split(",");
      }
    }
    return arr;
}

function makeArray(num,val){
  var arr = []
  for(var i = 0; i < num ; i++){
    arr.push(typeof val !== 'undefined' ? val : i)
  }
  return arr
}




// 筛选红球篮球号码近期表现----start
function getNearCycle(hots) {
  var arr = { hq: [], lq: [] }
  var openNum_hq = wx.getStorageSync("redvalue") ? wx.getStorageSync("redvalue") : wx.getStorageSync("openNum_hq");
  var openNum_lq = wx.getStorageSync("bluevalue") ? wx.getStorageSync("bluevalue") : wx.getStorageSync("openNum_lq");
  var hots_1 = hots[0];
  var hots_2 = hots[1];
  if (openNum_hq.length != 0) {
    openNum_hq.forEach((val) => {
      arr.hq.push(hots_1[parseInt(val) - 1]);
    });
  }
  if (openNum_lq.length != 0) {
    openNum_lq.forEach((val) => {
      arr.lq.push(hots_2[parseInt(val) - 1]);
    });
  }
  return arr;
}

// 机选
function selNumAuto(sum, n, items) {
  var arr = [];
  var new_random = '';
  while (true) {
    var isExists = false;
    var random = parseInt(1 + sum * (Math.random()))
    for (var i = 0; i < arr.length; i++) {
      if (random == arr[i]) {
        isExists = true;
        break;
      }
    }
    if (!isExists) {
      new_random = random < 10 ? "0" + random : random;
      arr.push(new_random);
    }
    if (arr.length === n)
      break;
  }
  arr.forEach((val, idx) => {
    var index = parseInt(arr[idx]) - 1;
    if (n === 6) {
      items[index].red_checked = true;
    } else {
      items[index].blue_checked = true;
    }
  })
  arr.sort(function (a, b) {
    return a - b;
  });
  return arr;
}
const getfirstnumber = (lotteryId, issueName) => `query{
  xcx_province_sales(lotteryId:${lotteryId},issueName:"${issueName}") {
    lotteryId
    issue
    province
    sales
    first_prize
  }
}`

function requstGet(url,data){
  return requst(url,'GET',data)
}

function requstPost(url,data){
  return requst(url,'POST',data)
}

const config = {
  service: {
    // host,
    // loginUrl: `${host}/xcxlogin`, // 登录
    // meUrl: `${host}/xcxme`,//用户信息
    otherUrl: `${host}/graphql`//其他接口
  }
}
module.exports = config;

//域名版本配置
const setting = {
  domain: 'https://www.yidingniu.net.cn',
  code: "ssqcpzs",
  version: "v1.0.0"
}

module.exports = {
  setting, makeArray, getNearCycle,  formatTime, formatOpenNumber, getOpenNumber, getfirstnumber, config, getfirstcity, selNumAuto,
  get:requstGet,post:requstPost
}