<template>
  <div class="pay">
    <van-nav-bar fixed title="订单结算台" left-arrow @click-left="$router.go(-1)" />

    <!-- 地址相关 -->
    <div class="address">

      <div class="left-icon">
        <van-icon name="logistics" />
      </div>

      <div class="info" v-if="addressList.length > 0">
        <div class="info-content">
          <span class="name">{{ chosenAddress.name }} </span>
          <span class="mobile">{{ chosenAddress.phone }}</span>
        </div>
        <div class="info-address">
          {{ regionName.province }} {{ regionName.city }} {{ regionName.county }} {{ chosenAddress.detail }}
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
        <div class="goods-item" v-for="item in cartList" :key="item.id">
            <div class="left">
              <img :src="item.goods.goods_image" alt="" />
            </div>
            <div class="right">
              <p class="tit text-ellipsis-2">
                 {{ item.goods.goods_name }}
              </p>
              <p class="info">
                <span class="count">共{{ item.goods_num }}件</span>
                <span class="price">¥{{item.goods.goods_price_min * item.goods_num}}</span>
              </p>
            </div>
        </div>
      </div>

      <div class="flow-num-box">
        <span>共 {{selectedCartCount()}} 件商品，合计：</span>
        <span class="money">￥{{selectedPrice()}}</span>
      </div>

      <div class="pay-detail">
        <div class="pay-cell">
          <span>订单总金额：</span>
          <span class="red">￥{{selectedPrice()}}</span>
        </div>

        <div class="pay-cell">
          <span>优惠券：</span>
          <span>无优惠券可用</span>
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
          <span><van-icon name="balance-o" />余额支付（可用 ¥ 999919.00 元）</span>
          <!-- <span>请先选择配送地址</span> -->
          <span class="red"><van-icon name="passed" /></span>
        </div>
      </div>

      <!-- 买家留言 -->
      <div class="buytips">
        <textarea placeholder="选填：买家留言（50字内）" name="" id="" cols="30" rows="10"></textarea>
      </div>
    </div>

    <!-- 底部提交 -->
    <div class="footer-fixed">
      <div class="left">实付款：<span>￥{{selectedPrice()}}</span></div>
      <div class="tipsbtn" @click="$router.push('/order/confirm')">提交订单</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PayIndex',
  async created () {
    console.log('params:', this.$route.params.adsid)
    // 构建地区映射表
    await this.buildReverseMaps()

    // 处理购物车详情展示
    // 拉取购物车列表
    await this.getCartAction()
    this.cartList = this.selectedCartList()
    console.log('购物车列表：', this.cartList)

    // 获取地址列表
    const { list } = await this.getAddressList()
    this.addressList = list
    console.log('地址列表：', this.addressList)

    // 从Vuex中获取默认地址的id
    const defaultAddressId = this.getDefaultAddressId()
    console.log('默认地址id：', defaultAddressId)

    if (this.addressList.length > 0) {
      // 如果有地址查询参数?adsid，则说明进行了地址切换
      console.log('地址切换参数：', this.getadsid)
      if (this.getadsid) {
        // chosenAddress被赋值为切换的id的地址
        const address = this.addressList.find(item => String(item.address_id) === String(this.getadsid))
        this.chosenAddress = address
        console.log('切换后的地址：', this.chosenAddress)
      } else {
        // 如果没有地址切换参数，则说明没有切换地址
        if (Number(defaultAddressId) !== -1) {
          // 遍历比对列表每一项的id是否与defaultAddressId相等，找到后返回索引（强等于比较，注意类型）
          const defaultIndex = this.addressList.findIndex((item) => String(item.address_id) === String(defaultAddressId))
          // console.log('默认地址索引：', defaultIndex)
          if (Number(defaultIndex) !== -1) {
            // 找到后将数组数据转对象赋值给chosenAddress属性
            this.chosenAddress = this.addressList[defaultIndex]

            // 处理地址Code转为Name
            const regionId = String(this.chosenAddress.region_id)
            // 调用 getFullAddressInfo 方法
            this.regionName = await this.fetchFullAddressName(regionId)
          } else {
            console.log('未找到有效的默认地址索引')
          }
        } else {
          // Vuex没有默认地址，则默认选中第一个地址
          // 设置chosenAddress属性为addressList的第一个地址
          this.chosenAddress = this.addressList[0]
          const regionId = String(this.chosenAddress.region_id)
          this.regionName = await this.fetchFullAddressName(regionId)
          console.log('无默认地址，展示数据chosenAddress：', this.chosenAddress)
        }
      }
    }
  },
  data () {
    return {
      addressList: [], // 地址列表
      chosenAddress: {}, // 被选择进行展示的地址
      regionName: {}, // 将地址Code转为Name
      cartList: [] // 购物车列表
    }
  },
  computed: {
    getadsid () {
      return this.$route.params.adsid
    }
  },
  methods: {
    ...mapActions('Address', ['getAddressList', 'getAddressDetail']),
    ...mapGetters('Address', ['getDefaultAddressId']),
    ...mapActions('AddressMap', ['buildReverseMaps', 'fetchFullAddressName']),
    ...mapActions('Cart', ['getCartAction']),
    ...mapGetters('Cart', ['selectedCartList', 'selectedCartCount', 'selectedPrice']),
    goAddress () {
      this.$router.push('/address/manage')
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
