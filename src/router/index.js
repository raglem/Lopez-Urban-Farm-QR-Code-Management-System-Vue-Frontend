import { createWebHistory, createRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

import Add from '../views/Add.vue'
import FetchedPlant from '../views/FetchedPlant.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'
import Plant from '../views/Plant.vue'
import Update from '../views/Update.vue'
import View from '../views/View.vue'

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/view', name: 'View', component: View, props: true },
  { path: '/add', name: 'Add', component: Add },
  { 
    path: '/plant/:_id/:name/:species/:description', 
    name: 'Plant', 
    component: Plant, 
    props: true,
  },
  { 
    path: '/plant/:_id', 
    name: 'FetchedPlant', 
    component: FetchedPlant, 
    props: true,
  },
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
  const store = useUserStore()
  const isAuthenticated = store.checkAuthentication()
  const publicPages = ['Login', 'View', 'Plant', 'Not Found']
  const privatePages = ['Add', 'Update']

  if( !isAuthenticated && privatePages.includes(to.name) ) {
    return next('/login')
  }
  next()
})

export default router