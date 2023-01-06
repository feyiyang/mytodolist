export function longFmt(val: number): string {
  let res = ''
  const seconds = Math.floor(val / 1000)
  let minStr: string = seconds > 60 ? Math.floor(seconds / 60).toString() : '00'
  let secondStr: string = (seconds % 60) + ''
  res = subVal(minStr) + ':' + subVal(secondStr)
  return res
}
function subVal(v: string): string {
  return '00'.substring(v.length) + v
}