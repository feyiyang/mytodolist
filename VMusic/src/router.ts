import { Router, RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    alias: '/',
    component: () => import('@/views/Home.vue')
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