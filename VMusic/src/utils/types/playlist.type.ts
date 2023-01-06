export interface playlistDetailInt {
  adType: number
  commentCount: number
  coverImgUrl: string
  createTime: number
  creator: any
  description: string
  id: number
  name: string
  playCount: number
  shareCount: number
  subscribed: boolean
  subscribedCount: number
  subscribers: Array<any>
  tags: Array<string>
  tracks: Array<object>
  trackIds: trackIds[]
  updateTime: number
}

export interface trackIds {
  id: number
  uid: number
}

export interface audioItem {
  id: number
  url: string
  name: string
  queueIndex?: number
  al?: any
  ar?: any
}

export interface commentItem {
  beReplied: any[]
  commentId: number
  content: string
  liked: boolean
  likedCount: number
  timeStr: string
  user: any
}

export interface playMethod {
  name?: string
  icon?: string
  type: number
  end: () => void
}
