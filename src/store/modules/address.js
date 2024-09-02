export default {
  namespaced: true,
  state () {
    return {
      // 存放要进行编辑的地址id
      addressId: localStorage.getItem('addressId') ? parseInt(localStorage.getItem('addressId')) : 0,
      // 存放选中的地址id
      selectedAddressId: localStorage.getItem('selectedAddressId') ? parseInt(localStorage.getItem('selectedAddressId')) : 0
    }
  },
  mutations: {
    // 设置要进行编辑的地址id
    SET_ADDRESS_ID (state, id) {
      state.addressId = id
      localStorage.setItem('addressId', id)
    },
    // 提供方法将编辑id清除
    CLEAR_ADDRESS_ID (state) {
      state.addressId = 0
      localStorage.removeItem('addressId')
    },
    // 设置选中的地址id
    SET_SELECTED_ADDRESS_ID (state, id) {
      state.selectedAddressId = id
      localStorage.setItem('selectedAddressId', id)
    },
    // 提供方法将选中id清除
    CLEAR_SELECTED_ADDRESS_ID (state) {
      state.selectedAddressId = 0
      localStorage.removeItem('selectedAddressId')
    }
  },
  actions: {},
  getters: {
    // 获取要进行编辑的地址id
    getAddressId (state) {
      return state.addressId || 0
    },
    // 获取选中的地址id
    getSelection (state) {
      return state.selectedAddressId || 0
    }
  }
}
