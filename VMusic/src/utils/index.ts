export function longFmt(val: number, unit = 'ms'): string {
  let res = ''
  const seconds = Math.floor(unit === 'ms' ? val / 1000 : val)
  const minStr: string =
    seconds >= 60 ? Math.floor(seconds / 60).toString() : '00'
  const secondStr: string = (seconds % 60) + ''
  res = subVal(minStr) + ':' + subVal(secondStr)
  return res
}
function subVal(v: string): string {
  return '00'.substring(v.length) + v
}
