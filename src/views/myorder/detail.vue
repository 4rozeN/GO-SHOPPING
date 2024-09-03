<template>
  <div class="order-detail-container">
    <van-nav-bar
      fixed
      title="订单详情页"
      left-arrow
      @click-left="$router.go(-1)"
      style="background-color: #f8f8f8; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"
    />

    <div class="goods-info" v-for="item in order.goods" :key="item.goods_id">
      <van-card
        :num="item.total_num"
        :price="item.total_pay_price"
        :title="item.goods_name"
        :thumb="item.goods_image"
        class="goods-card"
      >
      </van-card>
    </div>

    <div class="order-info">
      <p>订单信息</p>
      <br>
      <div class="info-item" v-for="info in orderInfo" :key="info.label">
        <p class="label">
          <van-icon :name="info.icon" />
          {{ info.label }}
        </p>
        <p class="value">{{ info.value }}</p>
      </div>
    </div>

    <div class="address-info">
      <p>地址信息</p>
      <br>
      <div class="info-item" v-for="address in addressInfo" :key="address.label">
        <p class="label">
          <van-icon :name="address.icon" />
          {{ address.label }}
        </p>
        <p class="value">{{ address.value }}</p>
      </div>
    </div>

    <van-steps direction="vertical" :active="0">
      <van-step>
        <h3>{{ order.state_text }}</h3>
        <p>{{ order.pay_time }}</p>
      </van-step>
      <van-step>
        <h3>支付成功</h3>
        <p>{{ order.pay_time }}</p>
      </van-step>
      <van-step>
        <h3>提交订单</h3>
        <p>{{ order.create_time }}</p>
      </van-step>
    </van-steps>

    <div class="footer">
      <!-- 添加返回首页按钮 -->
      <button class="footer-home">首页</button>
      <!-- 底部导航提供三个按钮：1. 申请售后或确认收货（根据订单状态而定） 2. 评价（根据订单状态而定） 3. 再次购买-->
      <button class="footer-button secondary">申请售后</button>
      <button class="footer-button secondary">订单评价</button>
      <button class="footer-button primary">再次购买</button>
    </div>
  </div>
</template>

<script>
import { getOrderDetail } from '@/api/order'
export default {
  name: 'OrderDetail',
  data () {
    return {
      countPrice: 0,
      countNum: 0,
      order: {}
    }
  },
  async created () {
    await this.getOrderDetail()
    this.countGoodsNum()
    this.countOrderPrice()
    this.getPayStatus()
  },
  computed: {
    getOrderID () {
      return this.$route.query.orderId
    },
    orderInfo () {
      return [
        { icon: 'orders-o', label: '订单号:', value: this.order.order_no },
        { icon: 'balance-o', label: '订单总价:', value: `¥${this.countPrice}` },
        { icon: 'bill-o', label: '支付金额:', value: `¥${this.countPrice}` },
        { icon: 'passed', label: '支付状态:', value: this.getPayStatus(this.order.pay_status) },
        { icon: 'clock-o', label: '支付时间:', value: this.order.pay_time },
        { icon: 'notes-o', label: '订单状态:', value: this.order.state_text }
      ]
    },
    addressInfo () {
      return [
        { icon: 'user-o', label: '收件人:', value: this.order.address.name },
        { icon: 'phone-o', label: '联系电话:', value: this.order.address.phone },
        { icon: 'location-o', label: '收货地址:', value: `${this.order.address.region.province} ${this.order.address.region.city} ${this.order.address.region.region} ${this.order.address.detail}` }
      ]
    }
  },
  methods: {
    countGoodsNum () {
      this.order.goods.forEach(el => {
        el.total_num && (this.countNum += el.total_num)
      })
    },
    countOrderPrice () {
      // 累加this.goodsList的goods_price_min
      let price = 0
      this.order.goods.forEach(item => {
        price += Number(item.total_pay_price) * item.total_num
      })
      this.countPrice = price.toFixed(2)
    },
    getPayStatus (status) {
      switch (status) {
        case 10:
          return '未支付'
        case 20:
          return '已支付'
        default:
          return '未知状态'
      }
    },
    async getOrderDetail () {
      try {
        const res = await getOrderDetail(this.getOrderID)
        this.order = res.data.order
      } catch (err) { console.log(err) }
    }
  }
}
</script>

<style lang="less" scoped>
.order-detail-container {
  max-width: 800px;
  margin: 50px auto;
  padding-bottom: 60px;
  border-radius: 10px;
  background-color: #f8f8f8;
}

.goods-info {
  margin-bottom: 10px;
}

.goods-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.goods-card .van-card__title,
.goods-card .van-card__price,
.goods-card .van-card__num {
  font-size: 14px; /* 调整Card内主要文字的大小 */
  color: #333;
}

.goods-card .van-card__thumb img {
  width: 80px; /* 调整图片大小 */
  height: 80px;
  object-fit: cover;
}

.order-info, .address-info {
  padding: 15px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-bottom: 10px;
  color: #333;
  font-size: 18px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.label {
  width: 30%;
  color: #888; /* 提示信息颜色稍浅 */
  font-size: 16px;
  font-weight: normal; /* 取消加粗 */
}

.value {
  width: 65%;
  color: #0a0a0a; /* 动态数据颜色较深 */
  font-size: 16px;
  text-align: right;
}

p van-icon {
  margin-right: 8px;
  color: #999;
}

.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: flex-end; /* 按钮右对齐 */
  align-items: center;
  padding: 10px 20px; /* 调整间距 */
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  border-top: 1px solid #eaeaea;
  z-index: 1000; /* 确保底部导航位于页面内容之上 */
}

/* 新增的返回首页按钮样式 */
.footer-home {
  margin-right: auto; /* 将按钮推到最左边 */
  font-size: 12px; /* 字体较小 */
  color: #333; /* 深灰色字体 */
  background: none; /* 去除按钮背景 */
  border: none; /* 去除按钮边框 */
  text-decoration: none; /* 移除下划线 */
  cursor: pointer;
  padding: 0;
}

.footer-button {
  margin: 0 5px;
  padding: 5px 10px; /* 缩小按钮尺寸 */
  font-size: 14px;
  text-align: center;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.footer-button.secondary {
  background-color: #f0f0f0;
  color: #333;
}

.footer-button.primary {
  background-color: #FF3E47;
  color: #fff;
}
</style>
