import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import(/* webpackChunkName: "about" */ '../views/Signup.vue')
  },
  {
    path: '/feed',
    name: 'feed',
    component : () => import(/* webpackChunkName: "about" */ '../views/Feed.vue')
  },
  {
    path:'/user',
    name: 'modifyUser',
    component: () => import(/* webpackChunkName: "about" */ '../views/modifyUser.vue')

  },
  {
    path: '/allUsers',
    name: 'allUsers',
    component: () => import(/* webpackChunkName: "about" */ '../views/allUsers.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
