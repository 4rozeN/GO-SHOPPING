import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout'
import Cart from '@/views/layout/cart'
import User from '@/views/layout/user'
import Home from '@/views/layout/home'
import Category from '@/views/layout/category'
import store from '@/store'
// 下面是按需加载的组件
const Login = () => import('@/views/login')
const Search = () => import('@/views/search')
const SearchList = () => import('@/views/searchlist')
const myorder = () => import('@/views/myorder')
const Pay = () => import('@/views/pay')
const ProductDetail = () => import('@/views/productdetail')
const GoodsEvaluation = () => import('@/views/productdetail/evaluation')
const Address = () => import('@/views/address/index.vue')
const AddressEdit = () => import('@/views/address/edit.vue')
const OrderDetail = () => import('@/views/myorder/detail.vue')
const OrderReview = () => import('@/views/myorder/review.vue')
const ImageCrop = () => import('@/views/imagecrop/ImgUpload.vue')
// const AddressManage = () => import('@/views/address/manage.vue')
const NotFound = () => import('@/views/404')

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
  { path: '/searchlist', component: SearchList },
  { path: '/myorder', component: myorder },
  { path: '/myorder/detail', component: OrderDetail },
  { path: '/myorder/review', component: OrderReview },
  { path: '/pay', component: Pay, name: 'Pay' },
  // 配置动态商品id，用于确认将来是哪个商品详情页
  { path: '/productdetail/:id', component: ProductDetail },
  { path: '/evaluation/:id', component: GoodsEvaluation },
  { path: '/address/manage', component: Address, name: 'AddressM' },
  { path: '/address/edit', component: AddressEdit, name: 'AddressE' },
  { path: '/imgcrop', component: ImageCrop },

  // 404页面
  { path: '*', component: NotFound }
]

const router = new VueRouter({
  routes
})

// 定义数组存储需要登录才能访问的路由
const authNeedRouters = ['/myorder', '/pay', '/address', '/address/edit', '/address/manage']

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
