import { createWebHistory, createRouter } from 'vue-router'

import View from '../views/View.vue'
import Add from '../views/Add.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
    { path: '/view', component: View },
    { path: '/add', component: Add },
    { path: '/:pathMatch(.*)*', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router