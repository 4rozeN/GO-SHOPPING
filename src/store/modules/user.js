export default {
  namespaced: true,
  state () {
    return {
      // 个人权证
      userInfo: {
        token: '',
        userId: ''
      }
    }
  },
  mutations: {
    setUserInfo (state, obj) {
      state.userInfo = obj
    }
  },
  actions: {},
  getters: {}
}
