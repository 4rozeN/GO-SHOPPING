import { getInfo, setInfo } from '@/utils/storage'

export default {
  namespaced: true,
  state () {
    return {
      // 个人权证
      userInfo: getInfo()
    }
  },
  mutations: {
    setUserInfo (state, obj) {
      state.userInfo = obj
      setInfo(obj)
    }
  },
  actions: {
    // logout操作
    logout (context) {
      // 清空用户信息
      context.commit('setUserInfo', {})
      // 清空其他命名空间的状态
      context.commit('Cart/setCartList', [], { root: true })
      context.commit('Address/CLEAR_ADDRESS_ID', null, { root: true })
      context.commit('Address/CLEAR_SELECTED_ADDRESS_ID', null, { root: true })
    }
  },
  getters: {}
}
