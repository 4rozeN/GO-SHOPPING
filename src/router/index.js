import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Search from '@/views/search'
import Layout from '@/views/layout'
import myorder from '@/views/myorder'
import Pay from '@/views/pay'
import ProductDetail from '@/views/productdetail'
import Home from '@/views/layout/home'
import Category from '@/views/layout/category'
import Cart from '@/views/layout/cart'
import User from '@/views/layout/user'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      { path: '/home', component: Home },
      { path: '/category', component: Category },
      { path: '/cart', component: Cart },
      { path: '/user', component: User }
    ]
  },
  { path: '/login', component: Login },
  { path: '/search', component: Search },
  { path: '/myorder', component: myorder },
  { path: '/pay', component: Pay },
  // 配置动态商品id，用于确认将来是哪个商品详情页
  { path: '/productdetail/:id', component: ProductDetail }
]

const router = new VueRouter({
  routes
})

export default router
