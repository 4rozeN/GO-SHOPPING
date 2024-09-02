<template>
  <div class="pay">
    <van-nav-bar fixed title="订单结算台" left-arrow @click-left="$router.go(-1)" />

    <!-- 地址相关 -->
    <div class="address">

      <div class="left-icon">
        <van-icon name="logistics" />
      </div>

      <div class="info" v-if="chosenAddress">
        <div class="info-content">
          <span class="name">{{ chosenAddress.name }} </span>
          <span class="mobile">{{ chosenAddress.phone }}</span>
        </div>
        <div class="info-address">
          {{ chosenAddress.detail }}
        </div>
      </div>

      <div class="info" v-else>
        还没有地址哦，点击右侧按钮添加吧
      </div>

      <div class="right-icon" @click="goAddress">
        <van-icon name="arrow" />
      </div>
    </div>

    <!-- 订单明细 -->
    <div class="pay-list">
      <div class="list">
        <div class="goods-item" v-for="item in goodsList" :key="item.goods_id">
            <div class="left">
              <img :src="item.goods_image" alt="" />
            </div>
            <div class="right">
              <p class="tit text-ellipsis-2">
                 {{ item.goods_name }}
              </p>
              <p class="info">
                <span class="count">共{{ item.total_num }}件</span>
                <span class="price">¥{{(item.total_price)}}</span>
              </p>
            </div>
        </div>
      </div>

      <div class="flow-num-box">
        <span>共 {{goodsNumCount}} 件商品，合计：</span>
        <span class="money">￥{{goodsTotalPrice}}</span>
      </div>

      <div class="pay-detail">
        <div class="pay-cell">
          <span>订单总金额：</span>
          <span class="red">￥{{goodsTotalPrice}}</span>
        </div>

        <div class="pay-cell">
          <span>优惠券：</span>
          <span>{{personal.couponId ? '优惠券可用' : '无优惠券可用'}}</span>
        </div>

        <div class="pay-cell">
          <span>配送费用：</span>
          <span v-if="false">请先选择配送地址</span>
          <span v-else class="red">+￥0.00</span>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="pay-way">
        <span class="tit">支付方式</span>
        <div class="pay-cell">
          <span><van-icon name="balance-o" />余额支付（可用 ¥ {{personal.balance}} 元）</span>
          <!-- <span>请先选择配送地址</span> -->
          <span class="red"><van-icon name="passed" /></span>
        </div>
      </div>

      <!-- 买家留言 -->
      <div class="buytips">
        <textarea v-model="remark" placeholder="选填：买家留言（50字内）" name="" id="" cols="30" rows="10"></textarea>
      </div>
    </div>

    <!-- 底部提交 -->
    <div class="footer-fixed">
      <div class="left">实付款：<span>￥{{goodsTotalPrice}}</span></div>
      <div class="tipsbtn" @click="orderConfirm">提交订单</div>
    </div>
  </div>
</template>

<script>
import addressCTN from '@/mixins/addressCTN' // 将地区Code转为Name，需要传入regionCode
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { checkOrder } from '@/api/order'
import { getDefaultAddressId, getAddressList, getAddressDetail } from '@/api/address'

export default {
  name: 'PayIndex',
  mixins: [addressCTN],
  async created () {
    // console.log('params:', this.$route.params.adsid)
    if (this.getSelection()) {
      // console.log('有选择地址!')
      this.showToggleAddress()
    } else {
      // 没有手动切换过地址，则拉取地址列表得到地址进行展示
      try {
        const { data: { defaultId } } = await this.myDefaultAddressId() || 0
        this.myDefaultId = defaultId
        console.log('defaultId:', defaultId)
      } catch (error) {
        this.myDefaultId = 0
        console.log('没有默认地址Id', error)
      }
      if (this.myDefaultId) {
        // 说明有默认地址，拉取地址详情
        const res = await this.myAddressDetail(Number(this.myDefaultId))
        // 格式化地区信息
        res.detail = this.getRegionStrByCode(String(res.region_id)) + res.detail
        // 将得到的地址信息给本地进行渲染
        this.chosenAddress = res
        console.log('有默认地址，地址详情res：', res)
        console.log('格式化后的地址：', this.chosenAddress)
      } else {
        // 说明没有默认地址Id，展示地址列表的第一个数据
        const res = await this.myAddressListZero()
        // 格式化地区信息
        res.detail = this.getRegionStrByCode(String(res.region_id)) + res.detail
        // 将得到的地址信息给本地进行渲染
        this.chosenAddress = res
        console.log('没有默认地址，展示第一个地址：', res)
        console.log('格式化后的地址：', this.chosenAddress)
      }
    }
    // 提交订单
    try {
      await this.getOrderList()
    } catch (error) {
      console.log('提交订单失败', error)
    }
  },
  data () {
    return {
      myDefaultId: 0, // 默认地址Id
      remark: '', // 买家留言
      chosenAddress: {}, // 被选择进行展示的地址
      cartList: [], // 购物车列表
      goodsList: [], // 要进行渲染的商品列表
      personal: {}, // 个人信息
      setting: {} // 系统设置
    }
  },
  computed: {
    goodsTotalPrice () {
      // 累加this.goodsList的goods_price_min
      let price = 0
      this.goodsList.forEach(item => {
        price += Number(item.goods_price_min) * item.total_num
      })
      return price.toFixed(2)
    },
    goodsNumCount () {
      // 累加this.goodsList的total_num
      let count = 0
      this.goodsList.forEach(item => {
        count += item.total_num
      })
      return count
    },
    selectedA () {
      return this.chosenAddress
    },
    cartIds () {
      return this.$route.query.cartIds
    },
    getadsid () {
      return this.$route.params.adsid
    },
    getModeType () {
      return this.$route.query.mode
    },
    goodsId () {
      return this.$route.query.goodsId
    },
    goodsSkuId () {
      return this.$route.query.goodsSkuId
    },
    goodsNum () {
      return this.$route.query.goodsNum
    }
  },
  methods: {
    ...mapMutations('Address', ['CLEAR_SELECTED_ADDRESS_ID']),
    ...mapActions('Address', ['getAddressList']),
    ...mapGetters('Address', ['getDefaultAddressId', 'getSelection']),
    ...mapActions('Cart', ['getCartAction']),
    ...mapGetters('Cart', ['selectedCartList', 'selectedCartCount', 'selectedPrice']),
    ...mapGetters('Order', ['getMode', 'getCartIds']),
    // 展示切换选中的地址详情
    async showToggleAddress () {
      const resId = this.getSelection()
      // console.log('选择的地址Id:', resId)
      const resInfo = await this.myAddressDetail(resId)
      resInfo.detail = this.getRegionStrByCode(String(resInfo.region_id)) + resInfo.detail
      // console.log('选择的地址详情resInfo:', resInfo)
      this.chosenAddress = resInfo
    },
    // 得到默认地址id
    async myDefaultAddressId () {
      const defaultAddressId = await getDefaultAddressId()
      return defaultAddressId
    },
    // 得到地址列表的首位数据
    async myAddressListZero () {
      const { data: { list } } = await getAddressList()
      return list[0] // 里面是对象
    },
    // 得到地址详情
    async myAddressDetail (addressId) {
      const { data: { detail } } = await getAddressDetail(addressId)
      return detail
    },
    // 点击事件，跳转到地址管理页面
    goAddress () {
      // 跳转保留当前页面query参数
      this.$router.push({
        path: '/address/manage',
        query: {
          ...this.$route.query // 保留当前页面query参数
        },
        params: {
          // 声明我是谁
          whoami: 'pay'
        }
      })
    },
    // 提交订单
    async getOrderList () {
      if (this.getModeType === 'cart') {
        // console.log('getModeType === cart得到查询参数cartIds:', this.cartIds)
        // console.log('getModeType === cart得到查询参数goodsId:', this.goodsId)
        const { data } = await checkOrder(this.getModeType, {
          cartIds: this.cartIds
        })
        this.goodsList = data.order.goodsList
        this.personal = data.personal
        this.setting = data.setting
        // console.log('得到的商品列表:', this.goodsList)
      }
      if (this.getModeType === 'buyNow') {
        // console.log('getModeType === buyNow 得到查询参数goodsId:', this.goodsId)
        // console.log('getModeType === buyNow 得到查询参数goodsNum:', this.goodsNum)
        // console.log('getModeType === buyNow 得到查询参数goodsSkuId:', this.goodsSkuId)
        const { data } = await checkOrder(this.getModeType, {
          goodsId: this.goodsId,
          goodsNum: this.goodsNum,
          goodsSkuId: this.goodsSkuId
        })
        this.goodsList = data.order.goodsList
        this.personal = data.personal
        this.setting = data.setting
        // console.log('得到的商品列表:', this.goodsList)
      }
    },
    // 结算订单
    async orderConfirm () {
    }
  }
}
</script>

<style lang="less" scoped>
.pay {
  padding-top: 46px;
  padding-bottom: 46px;
  ::v-deep {
    .van-nav-bar__arrow {
      color: #333;
    }
  }
}
.address {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  font-size: 14px;
  color: #666;
  position: relative;
  background: url(@/assets/border-line.png) bottom repeat-x;
  background-size: 60px auto;
  .left-icon {
    margin-right: 20px;
  }
  .right-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-7px);
  }
}
.goods-item {
  height: 100px;
  margin-bottom: 6px;
  padding: 10px;
  background-color: #fff;
  display: flex;
  .left {
    width: 100px;
    img {
      display: block;
      width: 80px;
      margin: 10px auto;
    }
  }
  .right {
    flex: 1;
    font-size: 14px;
    line-height: 1.3;
    padding: 10px;
    padding-right: 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    color: #333;
    .info {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      .price {
        color: #fa2209;
      }
    }
  }
}

.flow-num-box {
  display: flex;
  justify-content: flex-end;
  padding: 10px 10px;
  font-size: 14px;
  border-bottom: 1px solid #efefef;
  .money {
    color: #fa2209;
  }
}

.pay-cell {
  font-size: 14px;
  padding: 10px 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  .red {
    color: #fa2209;
  }
}
.pay-detail {
  border-bottom: 1px solid #efefef;
}

.pay-way {
  font-size: 14px;
  padding: 10px 12px;
  border-bottom: 1px solid #efefef;
  color: #333;
  .tit {
    line-height: 30px;
  }
  .pay-cell {
    padding: 10px 0;
  }
  .van-icon {
    font-size: 20px;
    margin-right: 5px;
  }
}

.buytips {
  display: block;
  textarea {
    display: block;
    width: 100%;
    border: none;
    font-size: 14px;
    padding: 12px;
    height: 100px;
  }
}

.footer-fixed {
  position: fixed;
  background-color: #fff;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 46px;
  line-height: 46px;
  border-top: 1px solid #efefef;
  font-size: 14px;
  display: flex;
  .left {
    flex: 1;
    padding-left: 12px;
    color: #666;
    span {
      color:#fa2209;
    }
  }
  .tipsbtn {
    width: 121px;
    background: linear-gradient(90deg,#f9211c,#ff6335);
    color: #fff;
    text-align: center;
    line-height: 46px;
    display: block;
    font-size: 14px;
  }
}
</style>
