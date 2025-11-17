
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../layout/DefaultLayout.vue'),
      children: [
        {
          path: '',
          component: () => import('../modules/dashboard/pages/DashboardPage.vue')
        }
      ],
    },
    {
      path: '/create',
      name: 'criation',
      component: () => import('../layout/DefaultLayout.vue'),
      children: [
        {
          path: 'spells',
          name: 'spell-create',
          component: () => import('../modules/creation/pages/SpellCreator.vue')
        }, 
        {
          path: 'items',
          name: 'item-create',
          component: () => import('../modules/creation/pages/ItemCreator.vue')
        }
      ],
    }
  ],
})

export default router
