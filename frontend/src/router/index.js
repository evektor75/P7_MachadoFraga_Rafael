import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/',
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
    path:'/feed/modifypost',
    name: 'modifyPost',
    component: () => import(/* webpackChunkName: "about" */ '../views/Modify.vue')
  },
  {
    path:'/user',
    name: 'modifyUser',
    component: () => import(/* webpackChunkName: "about" */ '../views/modifyUser.vue')

  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
