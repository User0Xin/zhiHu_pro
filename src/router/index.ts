import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'mainPage',
      component: () => import('../views/mainPage.vue')
    },
    {
      path: '/personalPage',
      name: 'personalPage',
      component: () => import('../views/personalPage.vue')
    }
  ]
})

export default router
