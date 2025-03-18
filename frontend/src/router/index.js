import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Authentication from '../components/authentication/Auth_page.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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

  ],
})

export default router
