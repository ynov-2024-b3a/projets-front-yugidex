import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/card/:name',
      name: 'cardDetails',
      component: () => import('../views/CardDetailsView.vue'),
      props: true,
    },
  ],
})

export default router
