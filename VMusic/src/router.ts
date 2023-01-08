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
      {
        path: '/blocks',
        alias: '/',
        component: () => import('@/views/home/blocks.vue')
      }
    ]
  },
  {
    path: '/playlists/:id',
    component: () => import('@/views/playlists/index.vue')
  },
  {
    path: '/song/detail/:id',
    component: () => import('@/views/song/detail.vue')
  },
  {
    path: '/mv',
    component: () => import('@/views/Mv.vue')
  },
  {
    path: '/station',
    component: () => import('@/views/Station.vue')
  }
]

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
