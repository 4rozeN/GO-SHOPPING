import { getAddressList, updateAddress, deleteAddress, getAddressDetail, addAddress } from '@/api/address'
// import {Toast} from 'vant'

export default {
  namespaced: true,
  state () {
    return {
      AddressList: []
    }
  },
  mutations: {
    // 编辑地址
    editAddress (state, newAddress) {
      this.AddressList = newAddress
    }
  },
  actions: {
    // 获取地址列表
    async getAddressList () {
      const { data } = await getAddressList()
      return data
    },

    // 获取某个地址的详情
    async getAddressDetail (context, addressId) {
      const { data } = await getAddressDetail(addressId)
      return data
    },

    // 添加地址
    async addAddress (context, dataObj) {
      console.log('vuex_dataObj:', dataObj)
      const res = await addAddress(dataObj)
      if (res.status === 200) {
        // 成功后，重新通过上面的actions方法拉取地址列表
        context.dispatch('getAddressList')
      }
    },

    // 更新地址
    async updateAddress (context, dataObj) {
      // 发送更新请求
      await updateAddress(dataObj)

      // 更新之后，重新拉取地址列表
      this.getAddressList()
    },

    // 删除地址
    async deleteAddress (context, addressId) {
      // 发送删除请求
      await deleteAddress(addressId)

      // 删除成功后，重新拉取地址列表
      this.getAddressList()
    }
  },
  getters: {}
}
