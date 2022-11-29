interface selWeek {
  k: number
  v: string
}
interface selLev {
  lev: number
  v: string
}
interface selStatus {
  selWeek: selWeek
  selLev: selLev
}

interface doItem {
  status?: string
  content: string
  hm?: string
  week?: string
  level?: number
  times?: string
}

declare module '*.vue'