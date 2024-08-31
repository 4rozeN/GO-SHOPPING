import { getCartList } from '@/api/cart'

export default {
  namespaced: true,
  state () {
    return {
      // 提供一个数组用于存储购物车列表
      cartList: []
    }
  },
  mutations: {
    // 提供方法可以设置购物车列表
    setCartList (state, newCartList) {
      state.cartList = newCartList
    }
  },
  actions: {
    // 异步获取购物车列表
    async getCartAction (context) {
      const { data } = await getCartList()

      // 由于后台返回数据中不包括是否选中的状态，所以本地自己维护，给每一项添加上被选中的状态
      data.list.forEach(element => {
        element.isChecked = true
      })
      context.commit('setCartList', data.list)
    }
  },
  getters: {}
}
