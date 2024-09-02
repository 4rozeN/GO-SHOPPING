const modeLS = 'modeLocalSorage'
const cartIdsLS = 'cartIdsLocalSorage'

export default {
  namespaced: true,
  state () {
    return {
      mode: localStorage.getItem(modeLS) || '',
      cartIds: localStorage.getItem(cartIdsLS) || ''
    }
  },
  mutations: {
    setMode (state, mode) {
      state.mode = mode
      localStorage.setItem(modeLS, mode)
    },
    setCartIds (state, cartIds) {
      state.cartIds = cartIds
      localStorage.setItem(cartIdsLS, cartIds)
    }
  },
  actions: {},
  getters: {
    getMode (state) {
      return state.mode || localStorage.getItem(modeLS)
    },
    getCartIds (state) {
      return state.cartIds || localStorage.getItem(cartIdsLS)
    }
  }
}
