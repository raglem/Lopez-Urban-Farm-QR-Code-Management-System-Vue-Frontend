import { createWebHistory, createRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

import Account from '../views/Account.vue'
import Add from '../views/Add.vue'
import EditGarden from '../views/EditGarden.vue'
import FetchedPlant from '../views/FetchedPlant.vue'
import Garden from '../views/Garden.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'
import Update from '../views/Update.vue'
import View from '../views/View.vue'
import Quiz from '../views/Quiz.vue'

const publicRoutes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/view', name: 'View', component: View, props: true },
  { path: '/quiz', name: 'Quiz', component: Quiz },
  { path: '/garden/:_id', name: 'Garden', component: Garden, props: true },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  { path: '/plant/:_id', name: 'FetchedPlant', component: FetchedPlant, props: true },
]

const privateRoutes = [
  { path: '/add', name: 'Add', component: Add },
  { path: '/update/:_id', name: 'Update', component: Update, props: true },
  { path: '/account', name: 'Account', component: Account },
  { path: '/garden/edit/:_id', name: 'Editgarden', component: EditGarden, props: true },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const routes = [
  ...publicRoutes,
  ...privateRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const store = useUserStore()
  const isAuthenticated = store.checkAuthentication()

  if( !isAuthenticated && privateRoutes.some(route => route.name === to.name) ) {
    return next('/login')
  }
  next()
})

export default router