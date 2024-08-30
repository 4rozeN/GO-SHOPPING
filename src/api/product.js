import request from '../utils/request'

export const getProducts = (obj) => {
  const { sortType, sortPrice, categoryId, goodsName, page } = obj
  return request.get('/goods/list', {
    params: {
      // all-按综合搜索(默认)，sales-按销量，price-按价格
      sortType,
      // 0-价格从低到高，1-价格从高到低
      sortPrice,
      // 分类id，示例值：0
      categoryId,
      // 商品名称，示例值：酒
      goodsName,
      // 页码，示例值：1
      page
    }
  })
}
