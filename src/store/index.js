import Vue from 'vue'
import Vuex from 'vuex'
import User from '@/store/modules/user'
import Cart from '@/store/modules/cart'
import Address from '@/store/modules/address'
import Order from '@/store/modules/order'

Vue.use(Vuex)

export default new Vuex.Store({
  state () {
    return {
    }
  },
  // getters用于获取state中的数据
  getters: {
    token (state) {
      return state.User.userInfo.token
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    User,
    Cart,
    Address,
    Order
  }
})
