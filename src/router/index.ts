import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'indexPage',
      component: () => import('../views/indexPage.vue'),
      redirect: '/mainPage',
      children: [
        {
          path: '/mainPage',
          name: 'mainPage',
          component: () => import('../views/mainPage.vue')
        },
        {
          path: '/personalPage',
          name: 'personalPage',
          component: () => import('../views/personalPage.vue')
        },
        {
          path: '/detailPage/:authorId/:id',
          name: 'detailPage',
          props: true,
          component: () => import('../components/question_detail/detail.vue')
        },
        {
          path: '/writeArticlePage',
          name: 'writeArticlePage',
          component: () => import('../views/writeArticlePage.vue')
        },
        {
          path: '/search',
          name: 'searchPage',
          component: () => import('../components/main_left/searchPage.vue')
        }
      ]
    },
    {
      path: '/sign',
      name: 'signPage',
      component: () => import('../views/signPage.vue')
    }
  ]
})

export default router
