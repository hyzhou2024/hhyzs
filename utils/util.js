const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
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
module.exports = {
  formatTime,
  selNumAuto
}
