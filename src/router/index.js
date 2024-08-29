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
import store from '@/store'

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

// 定义数组存储需要登录才能访问的路由
const authNeedRouters = ['/myorder', '/pay', '/productdetail/:id']

// 创建全局路由前置守卫
router.beforeEach((to, from, next) => {
  // 判断to的path是否存在登录的路由数组中
  if (!authNeedRouters.includes(to.path)) {
    // 不需要登录，直接进入
    next()
  } else {
    // 判断是否有token（实际上需要调用后端接口校验token）
    const token = store.state.User.userInfo.token
    if (token) {
      // 有token，可以进入
      next()
    } else {
      // 没有token，跳转到登录页
      next('/login')
    }
  }
})

export default router
