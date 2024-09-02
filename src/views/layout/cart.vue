<template>
  <div class="cart">
    <van-nav-bar title="购物车" fixed />
    <!-- 判断登录，且购物车列表不为空才渲染 -->
    <div v-if="isLogin && cartList.length > 0">
      <!-- 购物车开头 -->
      <div class="cart-title">
        <span class="all">共<i>{{ countCartTotal }}</i>件商品</span>
        <span class="edit" @click="isEdit = !isEdit">
          <van-icon name="edit" />
          编辑
        </span>
      </div>

      <!-- 购物车列表 -->
      <div class="cart-list">
        <div class="cart-item" v-for="item in cartList" :key="item.goods_id">
          <van-checkbox @click="toggleChecked(item.goods_id)" :value="item.isChecked"></van-checkbox>
          <div class="show">
            <img :src="item.goods.goods_image" alt="">
          </div>
          <div class="info"  @click="$router.push(`/productdetail/${item.goods_id}`)">
            <span class="tit text-ellipsis-2">{{ item.goods.goods_name }}</span>
            <span class="bottom">
              <div class="price">¥ <span>{{ item.goods.goods_price_min }}</span></div>
              <CountBox @input="changeCount(item.goods_id, $event, item.goods_sku_id)" :value="item.goods_num"></CountBox>
            </span>
          </div>
        </div>
      </div>

      <div class="footer-fixed">
        <div  class="all-check">
          <van-checkbox @click="allToggle" :value="isAllChecked" icon-size="18"></van-checkbox>
          全选
        </div>

        <div class="all-total">
          <div class="price">
            <span>合计：</span>
            <span>¥ <i class="totalPrice">{{selectedPrice}}</i></span>
          </div>
          <div v-if="!isEdit" class="goPay" @click="goPay" :class="{disabled: selectedCartCount === 0}">结算({{selectedCartCount}})</div>
          <div v-else @click="delSelectedCart" class="delete" :class="{disabled: selectedCartCount === 0}">删除</div>
        </div>
      </div>
    </div>
    <!-- 未登录或购物车列表为空时渲染提示页面 -->
    <van-empty v-else description="空空如也，快去逛逛吧~">
      <van-button round type="danger" class="bottom-button" @click="$router.push('/home')">去逛逛</van-button>
    </van-empty>

  </div>
</template>

<script>
import CountBox from '@/components/CountBox'
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'CartPage',
  computed: {
    ...mapState('Cart', ['cartList']),
    ...mapGetters('Cart',
      [
        'countCartTotal',
        'selectedCartList',
        'selectedCartCount',
        'selectedPrice',
        'isAllChecked',
        'selectedGoodsId'
      ]),
    isLogin () {
      return this.$store.getters.token
    }
  },
  created () {
    // const test = this.countCartTotal
    // console.log(test)
    // 判断是否登录
    if (this.isLogin) {
      // 获取购物车数据
      this.$store.dispatch('Cart/getCartAction')
    }
  },
  data () {
    return {
      isEdit: false
    }
  },
  methods: {
    ...mapMutations('Address', ['CLEAR_SELECTED_ADDRESS_ID']),
    toggleChecked (goodsId) {
      this.$store.commit('Cart/toggleChecked', goodsId)
    },
    allToggle () {
      this.$store.commit('Cart/allToggle', !this.isAllChecked)
    },
    changeCount (goodsId, e, goodsSkuId) {
      const obj = {
        goodsId: goodsId,
        goodsNum: e,
        goodsSkuId: goodsSkuId
      }
      this.$store.commit('Cart/changeCount', obj)
    },
    async goPay () {
      // 先触发购物车与后台数据的同步
      await this.$store.dispatch('Cart/syncCartAction')

      // 判断是否选中了商品，否则无事发生
      this.CLEAR_SELECTED_ADDRESS_ID()
      if (this.selectedCartCount > 0) {
        // 说明有选中商品
        this.$router.push({
          path: '/pay',
          query: {
            mode: 'cart',
            goodsId: this.selectedGoodsId,
            // 将选中的商品id拼接成字符串，如：cartIds=40971,40998
            cartIds: this.selectedCartList.map(item => item.id).join(',')
          }
        })
      }
    },
    delSelectedCart () {
      // 删除选中的购物车商品
      this.$store.dispatch('Cart/delSelCartA')
      // 删除完成之后退出编辑状态
      this.isEdit = false
      // 删除之后重新拉取购物车列表数据
      this.$store.dispatch('Cart/getCartAction')
    }
  },
  components: {
    CountBox
  },
  watch: {
    isEdit (val) {
      if (val) {
        // 说明进入编辑状态
        this.$store.commit('Cart/allToggle', false)
      } else {
        // 说明退出编辑状态
        this.$store.commit('Cart/allToggle', true)
      }
    }
  },
  destroyed () {
    // 页面销毁时，立刻调用syncCartAction进行数据同步
    this.$store.dispatch('Cart/syncCartAction')
  }
}
</script>

<style lang="less" scoped>
// 主题 padding
.cart {
  padding-top: 46px;
  padding-bottom: 100px;
  background-color: #f5f5f5;
  min-height: 100vh;
  .cart-title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    font-size: 14px;
    .all {
      i {
        font-style: normal;
        margin: 0 2px;
        color: #fa2209;
        font-size: 16px;
      }
    }
    .edit {
      .van-icon {
        font-size: 18px;
      }
    }
  }

  .cart-item {
    margin: 0 10px 10px 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border-radius: 5px;

    .show img {
      width: 100px;
      height: 100px;
    }
    .info {
      width: 210px;
      padding: 10px 5px;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .bottom {
        display: flex;
        justify-content: space-between;
        .price {
          display: flex;
          align-items: flex-end;
          color: #fa2209;
          font-size: 12px;
          span {
            font-size: 16px;
          }
        }
        .count-box {
          display: flex;
          width: 110px;
          .add,
          .minus {
            width: 30px;
            height: 30px;
            outline: none;
            border: none;
          }
          .inp {
            width: 40px;
            height: 30px;
            outline: none;
            border: none;
            background-color: #efefef;
            text-align: center;
            margin: 0 5px;
          }
        }
      }
    }
  }
}

.footer-fixed {
  position: fixed;
  left: 0;
  bottom: 50px;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  .all-check {
    display: flex;
    align-items: center;
    .van-checkbox {
      margin-right: 5px;
    }
  }

  .all-total {
    display: flex;
    line-height: 36px;
    .price {
      font-size: 14px;
      margin-right: 10px;
      .totalPrice {
        color: #fa2209;
        font-size: 18px;
        font-style: normal;
      }
    }

    .goPay, .delete {
      min-width: 100px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background-color: #fa2f21;
      color: #fff;
      border-radius: 18px;
      &.disabled {
        background-color: #ff9779;
      }
    }
  }

}

.bottom-button {
    width: 160px;
    height: 40px;
}
</style>
