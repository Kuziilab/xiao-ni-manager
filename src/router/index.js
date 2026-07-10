import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/warehouse',
    name: 'warehouse',
    component: () => import('../views/WarehouseView.vue'),
    meta: { tab: 0, title: '仓库' }
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import('../views/NotesView.vue'),
    meta: { tab: 1, title: '记事' }
  },
  {
    path: '/accounting',
    name: 'accounting',
    component: () => import('../views/AccountingView.vue'),
    meta: { tab: 2, title: '记账' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { tab: 3, title: '我' }
  },
  { path: '/:pathMatch(.*)*', redirect: '/warehouse' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
