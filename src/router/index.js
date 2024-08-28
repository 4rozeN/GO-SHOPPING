import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Search from '@/views/search'
import Layout from '@/views/layout'
import myorder from '@/views/myorder'
import Pay from '@/views/pay'
import ProductDetail from '@/views/productdetail'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/search', component: Search },
  { path: '/', component: Layout },
  { path: '/myorder', component: myorder },
  { path: '/pay', component: Pay },
  // 配置动态商品id，用于确认将来是哪个商品详情页
  { path: '/productdetail/:id', component: ProductDetail }
]

const router = new VueRouter({
  routes
})

export default router
