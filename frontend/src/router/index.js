import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/HomePage/Home.vue'
import Authentication from '../components/Authentication/Auth_page.vue'
import Dashboard from '@/components/Dashboard/Dashboard_Page.vue'
import Gameplay from '@/components/Gameplay/Gameplay_page.vue'
import store from '@/store/store' 

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/Login_or_Register',
    name: 'Auth_page',
    component: Authentication,
  },
  {
    path: '/Dashboard',
    name: 'DashboardPage',
    component: Dashboard,
    meta: { requiresAuth: true } 
  },
  {
    path: '/game/:gameId',
    name: 'Gameplay_page',
    component: Gameplay
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.user) {

    next({ name: 'Auth_page' })
  } else {
    next()
  }
})

export default router
