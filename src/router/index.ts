import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import viewerCounter from '../pages/widgets/viewer-counter/viewerCounter.vue'
import viewerCounter2 from '../pages/widgets/viewer-counter/viewerCounterStyle1.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Widget Studio • Главная',
    meta: { title: 'Widget Studio • Главная' },
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/about',
    name: 'Widget Studio • О проекте',
    meta: { title: 'Widget Studio • О проекте' },
    component: () => import('../pages/About.vue')
  },
  {
    path: '/widget/viewercounter',
    name: 'Widget Studio • Счетчик зрителей',
    meta: { title: 'Widget Studio • Счетчик зрителей' },
    component: viewerCounter
  },
  {
    path: '/widget/viewercounter-settings',
    name: 'Widget Studio • Настройки счетчика зрителей',
    meta: { title: 'Widget Studio • Настройки счетчика зрителей' },
    component: () => import('../pages/widgets/viewer-counter/viewerSettings.vue')
  },
   {
    path: '/widget/viewercounter2',
    name: 'Widget Studio • Счетчик зрителей 2',
    meta: { title: 'Widget Studio • Счетчик зрителей 2' },
    component: viewerCounter2
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const defaultTitle = 'Widget Studio'

router.afterEach((to) => {
  if (typeof document === 'undefined') return
  const title = to.meta.title || to.name || defaultTitle
  document.title = typeof title === 'string' ? title : defaultTitle
})

export default router
