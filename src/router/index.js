import { createWebHistory, createRouter } from 'vue-router'

import Add from '../views/Add.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'
import Plant from '../views/Plant.vue'
import View from '../views/View.vue'
import isAuthenticated from './isAuthenticated'

const routes = [
    { path: '/login', component: Login },
    { path: '/view', component: View },
    { path: '/add', component: Add },
    { 
      path: '/plant/:id', 
      component: Plant, 
    },
    { path: '/:pathMatch(.*)*', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/view', '/plant/:id']
  const privatePages = ['/add']

  if( !isAuthenticated() && privatePages.includes(to.path) ) {
    return next('/login')
  }
  next()
})

export default router