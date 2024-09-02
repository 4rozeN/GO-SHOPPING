import { getCartList, updateCart, deleteSelected, addCart } from '@/api/cart'
import { Toast } from 'vant'

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
    },
    // 修改商品选中状态
    toggleChecked (state, id) {
      // 遍历购物车列表，找到对应id的商品，修改其选中状态
      state.cartList.forEach(item => {
        if (item.goods_id === id) {
          item.isChecked = !item.isChecked
        }
      })
    },
    // 全选和反选
    allToggle (state, flag) {
      // 遍历购物车列表，修改所有商品的选中状态
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    },
    // 改变商品数量
    changeCount (state, obj) {
      // 遍历购物车列表，找到对应id的商品，修改其数量
      const { goodsId, goodsNum, goodsSkuId } = obj
      state.cartList.forEach(item => {
        if (item.goods_id === goodsId && item.goods_sku_id === goodsSkuId) {
          item.goods_num = goodsNum
        }
      })
    }
  },
  actions: {
    // 添加商品到购物车
    async addCartAction (context, obj) {
      // 先判断是否已经存在该商品，如果存在，则只修改商品数量
      const { goodsId, goodsNum, goodsSkuId } = obj
      context.state.cartList.forEach(item => {
        if (item.goods_id === goodsId && item.goods_sku_id === goodsSkuId) {
          item.goods_num += goodsNum
        }
      })
      // 如果不存在，则添加到购物车列表
      await addCart(goodsId, goodsNum, goodsSkuId)
      await context.dispatch('getCartAction') // 重新拉取购物车信息
      Toast('添加成功')
    },

    // 异步获取购物车列表
    async getCartAction (context) {
      const { data } = await getCartList()

      // 由于后台返回数据中不包括是否选中的状态，所以本地自己维护，给每一项添加上被选中的状态
      data.list.forEach(element => {
        element.isChecked = true
      })
      context.commit('setCartList', data.list)
    },

    // 将本地购物车列表同步到服务器（结算或者离开购物车页面立刻同步）
    async syncCartAction (context) {
      // 接口只接受三个参数：goodsId、goodsNum、goodsSkuId，所以需要遍历本地购物车列表，将选中的商品拆分为三个参数
      const paramsObj = {}
      context.state.cartList.forEach(item => {
        if (item.isChecked) {
          paramsObj.goodsId = item.goods_id
          paramsObj.goodsNum = item.goods_num
          paramsObj.goodsSkuId = item.goods_sku_id
          updateCart(paramsObj)
        }
      })
      // console.log(paramsObj)
    },

    // 删除选中的商品
    async delSelCartA (context) {
      // 获取选中的商品id然后进行删除
      const ids = context.getters.selectedCartList.map(item => item.id)
      // console.log(ids)
      deleteSelected(ids)
      Toast('删除成功')

      // 删除后重新拉取购物车数据
      context.dispatch('getCartAction')
    }
  },
  getters: {
    // 求所有的商品累加总数
    countCartTotal (state) {
      return state.cartList.reduce((sum, item, index) => sum + item.goods_num, 0)
    },
    // 选中的商品项目
    selectedCartList (state) {
      // filter只会接收回调结果为true的元素，所以可以不用做其他判断
      return state.cartList.filter(item => item.isChecked)
    },
    // 选中的商品项目数量
    selectedCartCount (state, getters) { // 这里的getters可以获取到上面定义的getters
      return Array.isArray(getters.selectedCartList) ? getters.selectedCartList.reduce((sum, item, index) => sum + item.goods_num, 0) : 0
    },
    // 选中的商品总价
    selectedPrice (state, getters) {
      // toFixed(2) 保留两位小数
      return Array.isArray(getters.selectedCartList) ? getters.selectedCartList.reduce((sum, item, index) => sum + item.goods_num * item.goods.goods_price_min, 0).toFixed(2) : 0
    },
    // 是否全选
    isAllChecked (state) {
      // every返回true，说明数组中每一项都为true，否则为false
      return state.cartList.every(item => item.isChecked)
    },
    // 选中的商品id，return形式：101,102,103
    selectedGoodsId (state, getters) {
      return getters.selectedCartList.map(item => item.goods_id).join(',')
    }
  }
}
