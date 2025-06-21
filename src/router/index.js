import { createWebHistory, createRouter } from 'vue-router'

import Add from '../views/Add.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'
import Plant from '../views/Plant.vue'
import View from '../views/View.vue'
import isAuthenticated from './isAuthenticated'
import Update from '../views/Update.vue'

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/view/:editing?', name: 'View', component: View, props: true },
  { path: '/add', name: 'Add', component: Add },
  { path: '/plant/:id', name: 'Plant', component: Plant },
  { 
    path: '/update/:_id/:name/:species/:description', 
    name: 'Update', 
    component: Update, 
    props: true 
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
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