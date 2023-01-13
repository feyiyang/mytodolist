export function longFmt(val: number, unit = 'ms'): string {
  let res = ''
  const seconds = Math.floor(unit === 'ms' ? val / 1000 : val)
  const minStr: string =
    seconds >= 60 ? Math.floor(seconds / 60).toString() : '00'
  const secondStr: string = (seconds % 60) + ''
  res = padLeftZero(minStr) + ':' + padLeftZero(secondStr)
  return res
}

export function countFormat(num: number | string): string {
  let res: string = num + ''
  if (res.length > 8) {
    res = res.replace(/\d{8}$/, '亿')
  } else if (res.length > 4) {
    res = res.replace(/\d{4}$/, '万')
  }
  return res
}

export function dateFormat(date: Date, fmt: string): string {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  let tt: any = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in tt) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str: string = tt[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}

var padLeftZero = function (str: string) {
  // return ('00' + str).substr(str.length)
  return '00'.substring(str.length) + str
}
