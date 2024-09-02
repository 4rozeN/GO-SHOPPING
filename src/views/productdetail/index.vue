<template>
  <div class="prodetail">
    <van-nav-bar fixed title="商品详情页" left-arrow @click-left="$router.go(-1)" />

    <van-swipe :autoplay="3000" @change="onChange">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img :src="image.external_url" />
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }} / {{ images.length }}</div>
      </template>
    </van-swipe>

    <!-- 商品说明 -->
    <div class="info">
      <div class="title">
        <div class="price">
          <span class="now">￥{{ goodsDetailObj.goods_price_min }}</span>
          <span class="oldprice">￥{{ goodsDetailObj.goods_price_max }}</span>
        </div>
        <div class="sellcount">已售{{ goodsDetailObj.goods_sales }}件</div>
      </div>
      <div class="msg text-ellipsis-2">
        {{ goodsDetailObj.goods_name }}
      </div>

      <div class="service">
        <div class="left-words">
          <span><van-icon name="passed" />七天无理由退货</span>
          <span><van-icon name="passed" />48小时发货</span>
        </div>
        <div class="right-icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 商品评价 -->
    <div class="comment">
      <div class="comment-title">
        <div class="left">商品评价 ({{ goodsCommentArray.length }}条)</div>
        <div class="right" @click="$router.push(`/evaluation/${detailId}`)">查看更多 <van-icon name="arrow" /> </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="(item, index) in goodsCommentArray" :key="item.comment_id">
          <div class="top" v-if="index < 3">
            <img :src="item.user.avatar_url ? item.user.avatar_url : defaultAvatar" alt="">
            <div class="name">{{item.user.nick_name}}</div>
            <van-rate :size="16" :value="item.score" color="#ffd21e" void-icon="star" void-color="#eee"/>
          </div>
          <div class="content" v-if="index < 3">
            {{item.content}}
          </div>
          <div class="time" v-if="index < 3">
            {{item.create_time}}
          </div>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="desc" v-for="pic in imgSrcArray" :key="pic">
      <img :src="pic" alt="">
    </div>

    <!-- 底部 -->
    <div class="footer">
      <div class="icon-home">
        <van-icon name="wap-home-o" />
        <span @click="$router.push('/home')">首页</span>
      </div>
      <div class="icon-cart">
        <van-icon :badge="cartTotal || ''" name="shopping-cart-o" />
        <span @click="$router.push('/cart')">购物车</span>
      </div>
      <div class="btn-add" @click="add">加入购物车</div>
      <div class="btn-buy" @click="buyNow">立刻购买</div>
    </div>

    <!-- 弹层 -->
    <van-action-sheet v-model="showPannel" :title="mode === 'cart' ? '加入购物车' : '立刻购买'">
      <div class="product">
        <div class="product-title">
          <div class="left">
            <img :src="goodsDetailObj.goods_image" alt="">
          </div>
          <div class="right">
            <div class="price">
              <span>¥</span>
              <span class="nowprice">{{ goodsDetailObj.goods_price_min }}</span>
            </div>
            <div class="count">
              <span>库存</span>
              <span>{{ goodsDetailObj.stock_total }}</span>
            </div>
          </div>
        </div>
        <div class="num-box">
          <span>数量</span>
          <CountBox v-model="addCount"></CountBox>
        </div>
        <!-- 有库存才显示可购买 -->
        <div class="showbtn" v-if="goodsDetailObj.stock_total > 0">
          <div class="btn" v-if="this.mode === 'cart'" @click="addCart">加入购物车</div>
          <div class="btn now" v-else @click="goBuyNow">立刻购买</div>
        </div>
        <div class="btn-none" v-else>该商品已抢完</div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { getGoodsDetail, getGoodsCommentDetail } from '@/api/goodsDetail'
import { mapGetters, mapActions } from 'vuex'
import CountBox from '@/components/CountBox.vue'
export default {
  name: 'ProDetail',
  components: {
    CountBox
  },
  computed: {
    ...mapGetters('Cart', ['countCartTotal']),
    ...mapActions('Cart', ['getCartAction']),
    detailId () {
      return this.$route.params.id
    }
  },
  async created () {
    // 获取商品详情-说明部分
    const goodsId = this.detailId
    const res = await getGoodsDetail(goodsId)
    // console.log(res)
    this.goodsDetailObj = res.data.detail
    // console.log(this.goodsDetailObj)
    this.goodsSkuId = this.goodsDetailObj.skuList[0].goods_sku_id // 得到商品规格id
    this.images = this.goodsDetailObj.goods_images // 得到商品轮播图

    // 获取商品详情-评价部分
    const commentRes = await getGoodsCommentDetail({
      scoreType: 10, // 默认抓取好评
      goodsId: goodsId,
      page: 1
    })
    this.goodsCommentArray = commentRes.data.list.data

    // 正则匹配得到商品详细介绍长图
    const htmlString = this.goodsDetailObj.content
    const srcArray = []
    const regex = /<img\s+[^>]*src="([^"]*)"/g

    let match
    while ((match = regex.exec(htmlString)) !== null) {
      srcArray.push(match[1]) // 将匹配到的 src URL 添加到数组中
    }
    this.imgSrcArray = srcArray
    // console.log(this.imgSrcArray) // 输出结果数组

    // 异步获取购物车列表
    await this.getCartAction
    // 获取购物车商品总数
    this.cartTotal = this.countCartTotal
    // console.log(this.cartTotal)
  },
  data () {
    return {
      addCount: 1, // 加入购物车的商品数量
      showPannel: false,
      mode: 'cart', // 购物车或立即购买
      imgSrcRegex: /<img[^>]+src="([^">]+)"/g, // 匹配接口数据html中的src图
      imgSrcArray: [], // 商品详细介绍长图
      goodsDetailObj: {}, // 商品说明
      goodsCommentArray: {}, // 商品评价
      goodsSkuId: 0, // 商品规格id
      images: [], // 商品轮播介绍图
      current: 0, // 轮播图当前索引
      cartTotal: 0, // 购物车内商品总数
      defaultAvatar: 'https://ali-4rozen-oss.oss-cn-guangzhou.aliyuncs.com/coding/202408301648039.png'
    }
  },
  methods: {
    // 轮播图切换
    onChange (index) {
      this.current = index
    },
    // 设置弹层按钮为加入购物车
    add () {
      this.showPannel = true
      this.mode = 'cart'
    },
    // 设置弹层按钮为立即购买
    buyNow () {
      this.showPannel = true
      this.mode = 'buy'
    },
    // 加入购物车判断登录状态
    async addCart () {
      // console.log(this.$store.getters.token)
      if (!this.$store.getters.token) {
        // 说明没有token，没有token就需要提示登录
        this.$dialog.confirm({
          message: '当前操作需要登录后才能进行哦',
          confirmButtonText: '去登录',
          cancelButtonText: '再逛逛'
        })
          .then(() => {
            // 说明点击了去登录，需要带上backUrl
            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath // 带上当前页面的全路径（包括查询参数）
              }
            })
          })
          .catch(() => {
            // 说明点击了再逛逛，不做任何操作
          })
      }

      // 说明有token，可以直接加入购物车
      const obj = {
        goodsId: this.detailId,
        goodsNum: this.addCount,
        goodsSkuId: this.goodsSkuId
      }
      this.$store.dispatch('Cart/addCartAction', obj)
      // 获取购物车商品总数
      this.cartTotal = this.countCartTotal
      this.$toast('加入购物车成功！')
      this.showPannel = false // 关闭弹层
    },
    goBuyNow () {
      this.mode = 'buyNow'
      this.$store.commit('Order/setMode', 'buyNow')
      this.$router.push({
        path: '/pay',
        query: {
          mode: localStorage.getItem('modeLS'),
          goodsId: this.detailId,
          goodsSkuId: this.goodsSkuId,
          goodsNum: this.addCount
        }
      })
    }
  },
  watch: {
    // 监听 countCartTotal 的变化，自动更新 cartTotal
    countCartTotal (newVal) {
      this.cartTotal = newVal
    }
  }
}
</script>

<style lang="less" scoped>
.prodetail {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  img {
    display: block;
    width: 100%;
  }
  .custom-indicator {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 5px 10px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }
  .desc {
    width: 100%;
    overflow: scroll;
    ::v-deep img {
      display: block;
      width: 100%!important;
    }
  }
  .info {
    padding: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    .now {
      color: #fa2209;
      font-size: 20px;
    }
    .oldprice {
      color: #959595;
      font-size: 16px;
      text-decoration: line-through;
      margin-left: 5px;
    }
    .sellcount {
      color: #959595;
      font-size: 16px;
      position: relative;
      top: 4px;
    }
  }
  .msg {
    font-size: 16px;
    line-height: 24px;
    margin-top: 5px;
  }
  .service {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    margin-top: 10px;
    font-size: 16px;
    background-color: #fafafa;
    .left-words {
      span {
        margin-right: 10px;
      }
      .van-icon {
        margin-right: 4px;
        color: #fa2209;
      }
    }
  }

  .comment {
    padding: 10px;
  }
  .comment-title {
    display: flex;
    justify-content: space-between;
    .right {
      color: #959595;
    }
  }

  .comment-item {
    font-size: 16px;
    line-height: 30px;
    .top {
      height: 30px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      img {
        width: 20px;
        height: 20px;
      }
      .name {
        margin: 0 10px;
      }
    }
    .content {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%; /* 或者你希望的宽度 */
    }
    .time {
      color: #999;
    }
  }

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .icon-home, .icon-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      .van-icon {
        font-size: 24px;
      }
    }
    .btn-add,
    .btn-buy {
      height: 36px;
      line-height: 36px;
      width: 120px;
      border-radius: 18px;
      background-color: #ffa900;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    .btn-buy {
      background-color: #fe5630;
    }
  }
}

.tips {
  padding: 10px;
}

// 弹层样式
.product {
  .product-title {
    display: flex;
    .left {
      img {
        width: 90px;
        height: 90px;
      }
      margin: 10px;
    }
    .right {
      flex: 1;
      padding: 10px;
      .price {
        font-size: 14px;
        color: #fe560a;
        .nowprice {
          font-size: 24px;
          margin: 0 5px;
        }
      }
    }
  }

  .num-box {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
  }

  .btn, .btn-none {
    height: 40px;
    line-height: 40px;
    margin: 20px;
    border-radius: 20px;
    text-align: center;
    color: rgb(255, 255, 255);
    background-color: rgb(255, 148, 2);
  }
  .btn.now {
    background-color: #fe5630;
  }
  .btn-none {
    background-color: #cccccc;
  }
}
</style>
