export const weeksarr: selWeek[] = [
  { k: 1, v: '一'},
  { k: 2, v: '二'},
  { k: 3, v: '三'},
  { k: 4, v: '四'},
  { k: 5, v: '五'},
  { k: 6, v: '六'},
  { k: 7, v: '日'},
  { k: 8, v: '某天'}
]
export const levelsarr: selLev[] = [
  { lev: 1, v: '紧要' },
  { lev: 2, v: '重要' },
  { lev: 3, v: '次要' },
  { lev: 4, v: '常要' }
]
export function dateFormat(date = new Date(), fmt: string): string {
  const o: Record<string, any> = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'w': '星期' + '日一二三四五六'.charAt(date.getDay())
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}