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
      path: '/pattern/:id',
      name: 'pattern',
      component: () => import('../views/PatternView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top on navigation
    return { top: 0 }
  },
})

export default router
