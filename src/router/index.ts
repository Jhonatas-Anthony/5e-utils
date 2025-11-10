
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../layout/DefaultLayout.vue'),
      children: [],
    },
    {
      path: '/spells',
      name: 'spells',
      component: () => import('../layout/DefaultLayout.vue'),
      children: [
        {
          path: 'create',
          name: 'spell-create',
          component: () => import('../modules/spell/pages/SpellCreator.vue')
        }
      ],
    }
  ],
})

export default router
