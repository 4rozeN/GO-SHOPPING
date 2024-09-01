import { getAddressList, updateAddress, deleteAddress, getAddressDetail, addAddress, setDefaultAddress } from '@/api/address'
// import {Toast} from 'vant'

export default {
  namespaced: true,
  state () {
    return {
      AddressList: [],
      // 初始化时从 localStorage 中获取默认地址 ID
      defaultAddressId: localStorage.getItem('defaultAddressId') || ''
    }
  },
  mutations: {
    // 编辑地址
    editAddress (state, newAddress) {
      this.AddressList = newAddress
    },
    // 更新默认地址的 ID 并保存到 localStorage
    setDefaultAddressId (state, addressId) {
      state.defaultAddressId = addressId
      localStorage.setItem('defaultAddressId', addressId) // 保存到 localStorage
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
      if (!addressId) {
        throw new Error('Address ID is required')
      }
      console.log('getAddressDetail被调用，addressId：', addressId)
      const data = await getAddressDetail(addressId)
      console.log('getAddressDetail返回的数据：', data)
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

    // 设置默认地址(无用的接口，设置后拉取列表，其中不包含默认地址是否设置的状态)
    async setDefaultAddress (context, addressId) {
      // 发送请求
      await setDefaultAddress(addressId)

      // 成功后，重新拉取地址列表
      getAddressList()
    },

    // 更新地址
    async updateAddress (context, dataObj) {
      // 发送更新请求
      await updateAddress(dataObj)

      // 更新之后，重新拉取地址列表
      getAddressList()
    },

    // 删除地址
    async deleteAddress (context, addressId) {
      // 发送删除请求
      await deleteAddress(addressId)

      // 删除成功后，重新拉取地址列表
      this.getAddressList()
    }
  },
  getters: {
    // 获取默认地址 ID（优先从 Vuex 中获取，否则从 localStorage 中获取）
    getDefaultAddressId: (state) =>
      state.defaultAddressId || localStorage.getItem('defaultAddressId')
  }
}
