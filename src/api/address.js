import request from '@/utils/request'

// 获取地址列表
export const getAddressList = () => {
  return request.get('/address/list')
}

// 获取某个地址的详情
export const getAddressDetail = (addressId) => {
  return request.get('/address/detail', {
    params: {
      addressId: addressId
    }
  })
}

// 获取默认地址id
export const getDefaultAddressId = () => {
  return request.get('/address/defaultId')
}

// 添加收货地址
export const addAddress = (dataObj) => {
  console.log('api_dataObj', dataObj)
  // 直接使用dataObj中的数据
  return request.post('/address/add', {
    form: dataObj.form
  })
}

// 更新收货地址
export const updateAddress = (dataObj) => {
  // 直接使用dataObj中的数据
  return request.post('/address/edit', {
    addressId: dataObj.addressId,
    form: dataObj.form
  })
}

// 设置默认地址
export const setDefaultAddress = (addressId) => {
  return request.post('/address/setDefault', { addressId })
}

// 删除收货地址
export const deleteAddress = (addressId) => {
  return request.post('/address/remove', { addressId })
}
