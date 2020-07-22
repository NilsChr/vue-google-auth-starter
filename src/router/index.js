import Vue from 'vue/dist/vue.js'
import Router from 'vue-router'
import auth from '@/auth'

import Auth from '@/views/Auth'
import Dashboard from '@/views/Dashboard'

Vue.use(Router)

var routes = [
  { path: '/auth', name: 'auth', component: Auth, meta: { guestOnly: true } },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requireAuth: true } },
  { path: '*', redirect: '/auth' }
]

export const router = new Router({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  let currentUser = auth.user()
  let requireAuth = to.matched.some(record => record.meta.requireAuth)
  let guestOnly = to.matched.some(record => record.meta.guestOnly)

  if (requireAuth && !currentUser) next('auth')
  else if (guestOnly && currentUser) next('dashboard')
  else next()
})