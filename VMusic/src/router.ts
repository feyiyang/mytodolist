import {
  Router,
  RouteRecordRaw,
  createRouter,
  createWebHashHistory
} from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    alias: '/',
    component: () => import('@/views/home/index.vue'),
    children: [
      // 首页-精选
      {
        path: '/blocks',
        alias: '/',
        name: 'homePage',
        component: () => import('@/views/home/blocks.vue')
      },
      // 首页-排行榜
      {
        path: '/toplists',
        name: 'topsPage',
        component: () => import('@/views/toplists/index.vue')
      },
      // 歌单详情
      {
        path: '/playlists/:id',
        name: 'playListDetail',
        component: () => import('@/views/playlists/index.vue')
      }
    ]
  },
  // 歌曲详情
  {
    path: '/song/detail/:id',
    name: 'songDetail',
    component: () => import('@/views/song/detail.vue')
  },
  {
    path: '/mv',
    name: 'mvPage',
    component: () => import('@/views/Mv.vue')
  },
  {
    path: '/station',
    name: 'stationPage',
    component: () => import('@/views/Station.vue')
  }
]

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
