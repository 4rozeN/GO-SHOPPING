<template>
  <div class="order-review">
    <van-nav-bar
      fixed
      :title="'订单评价'"
      left-arrow
      @click-left="onLeftClick"
      @click-right="onRightClick"
      :right-text="rightButtonText"
      style="background-color: #f8f8f8; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"
    />

    <div class="content">
      <van-card
        :num="currentGoods.total_num"
        :price="currentGoods.total_pay_price"
        :title="currentGoods.goods_name"
        :thumb="currentGoods.goods_image"
        class="goods-card"
      >
        <div slot="footer" class="review-section">
          <div class="rating-section">
            <div class="section-title">商品评价</div>
            <van-rate v-model="currentGoods.rating" />
          </div>

          <div class="comment-section">
            <div class="section-title">评价内容:</div>
            <van-field
              v-model="currentGoods.comment"
              placeholder="写下你的评价..."
              type="textarea"
              rows="6"
              autosize
              maxlength="200"
              show-word-limit
              clearable
              class="comment-field"
            />
          </div>
          <!-- 真实图片上传功能暂时关闭 -->
          <!-- <div class="uploader-section">
            <div class="section-title">上传图片:</div>
            <van-uploader
              v-model="currentGoods.images"
              multiple
              :after-read="onImageUpload"
              :max-count="5"
              class="image-uploader"
            />
          </div> -->

          <!-- 新增 Base64 图片上传实现 -->
          <input type="file" @change="onImageChange" />
          <div v-if="currentGoods.images.length">
            <div v-for="(image, index) in currentGoods.images" :key="index">
              <img :src="image" alt="Uploaded Image" style="max-width: 100%; height: auto;" />
            </div>
          </div>
        </div>
      </van-card>
    </div>

    <van-button
      type="primary"
      block
      @click="saveDraft"
      class="submit-button"
    >
      保存草稿
    </van-button>
  </div>
</template>

<script>
import { getOrderDetail, submitComment } from '@/api/order'
// import { uploadImage } from '@/api/user'

export default {
  name: 'OrderReview',
  data () {
    return {
      goods: [],
      currentIndex: 0
    }
  },
  computed: {
    getOrderId () {
      return this.$route.query.orderId
    },
    currentGoods () {
      return this.goods[this.currentIndex] || { images: [] }
    },
    rightButtonText () {
      return this.isLastItem ? '提交' : '下一件'
    },
    isLastItem () {
      return this.currentIndex === this.goods.length - 1
    }
  },
  async created () {
    const response = await getOrderDetail(this.getOrderId)
    const storedDraft = this.loadDraft()
    this.goods = response.data.order.goods.map(item => ({
      ...item,
      rating: storedDraft[item.goods_id]?.rating || 0,
      comment: storedDraft[item.goods_id]?.comment || '',
      images: []
    }))
  },
  methods: {
    onLeftClick () {
      if (this.currentIndex === 0) {
        this.$router.go(-1)
      } else {
        this.currentIndex -= 1
      }
    },
    onRightClick () {
      if (this.isLastItem) {
        this.submitReview()
      } else {
        this.currentIndex += 1
      }
    },
    // 将得到的图片文件对象转换为 Base64 字符串
    onImageChange (event) {
      const files = event.target.files
      if (files.length) {
        const file = files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
          this.currentGoods.images.push(reader.result)
        }
        reader.readAsDataURL(file) // 将文件读取为 Base64 字符串
      }
    },
    // 后端接口可用时，可打开注释
    // async onImageUpload (file) {
    //   try {
    //     const formData = new FormData()
    //     formData.append('file', file.file)
    //     console.log(formData.get('file'))
    //     const response = await uploadImage(formData)
    //     if (response.status === 200) {
    //       this.currentGoods.images.push({
    //         url: response.data.fileInfo.preview_url
    //       })
    //     }
    //   } catch (error) {
    //     this.$toast.fail('图片上传失败')
    //     console.error(error)
    //   }
    // },
    saveDraft () {
      const draft = this.goods.reduce((acc, item) => {
        acc[item.goods_id] = {
          rating: item.rating,
          comment: item.comment
        }
        return acc
      }, {})
      localStorage.setItem(`order_${this.getOrderId}_draft`, JSON.stringify(draft))
      this.$toast.success('草稿已保存')
    },
    loadDraft () {
      const draft = localStorage.getItem(`order_${this.getOrderId}_draft`)
      return draft ? JSON.parse(draft) : {}
    },
    async submitReview () {
      try {
        // 接口要求参数为dataObject，这里将评价信息封装为对象
        const reviews = {}
        reviews.orderId = this.getOrderId
        reviews.form = []
        // 将goods_id，order_id，score，content，imageList，uploaded等信息封装为对象放入reviews.form数组中
        this.goods.forEach(item => {
          const review = {}
          review.goods_id = item.goods_id
          review.order_id = item.order_id
          review.score = item.rating
          review.content = item.comment
          review.imageList = item.images.map(image => image.url)
          review.uploaded = true
          reviews.form.push(review)
        })
        // 调用评价接口
        await submitComment(reviews)
        this.$toast.success('评价提交成功')
        this.$router.go(-1)
        localStorage.removeItem(`order_${this.getOrderId}_draft`)
      } catch (error) {
        this.$toast.fail(error)
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>
.order-review {
  padding-top: 20px; /* 调整与导航栏的距离，防止被遮挡 */
  padding-bottom: 110px; /* 为底部保存草稿按钮腾出空间 */
  background-color: #f2f2f2; /* 页面背景颜色 */
}

.content {
  padding: 1px; /* 内容区域的内边距 */
}

.review-item {
  margin-bottom: 20px; /* 每个评价项的底部间距 */
  background-color: #fff; /* 评价项背景颜色 */
  border-radius: 8px; /* 评价项的圆角 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 评价项的阴影 */
}

.goods-card {
  margin: 15px 0; /* 商品信息卡片的上下外边距 */
  padding: 30px 5px; /* 商品信息卡片的内边距 */
  border-radius: 8px; /* 商品信息卡片的圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 商品信息卡片的阴影 */
}

.review-section {
  padding-top: 10px; /* 评价部分的上内边距 */
  text-align: left; /* 内容左对齐 */
}

.rating-section,
.comment-section,
.uploader-section {
  margin-bottom: 15px; /* 各部分之间的底部间距 */
  text-align: left; /* 内容左对齐 */
}

.section-title {
  font-size: 14px; /* 标题字体大小 */
  color: #333; /* 标题颜色 */
  margin-bottom: 15px; /* 标题底部间距 */
}

.comment-field {
  background-color: #F2F2F2; /* 评价内容输入框的背景颜色 */
  padding: 10px; /* 评价内容输入框的内边距 */
  border-radius: 4px; /* 评价内容输入框的圆角 */
  border: 1px solid #e8e8e8; /* 评价内容输入框的边框 */
}

.image-uploader .van-uploader__wrapper {
  background-color: #f9f9f9; /* 图片上传组件的背景颜色 */
  padding: 10px; /* 图片上传组件的内边距 */
  border-radius: 4px; /* 图片上传组件的圆角 */
  border: 1px solid #e8e8e8; /* 图片上传组件的边框 */
}

.submit-button {
  position: fixed; /* 固定在页面底部 */
  bottom: 20px; /* 调整距离底部的距离 */
  left: 50%; /* 左侧对齐到页面中间 */
  transform: translateX(-50%); /* 水平居中 */
  width: calc(100% - 40px); /* 按钮宽度相对于屏幕宽度调整 */
  max-width: 400px; /* 给按钮设置一个最大宽度 */
  padding: 15px 20px; /* 调整按钮的内边距 */
  border: none; /* 去掉按钮的边框 */
  border-radius: 12px; /* 调整按钮的圆角 */
  z-index: 100; /* 按钮的堆叠顺序，确保在其他内容之上 */
  background-color: #ff6f61; /* 保存草稿按钮的背景颜色 */
  color: #fff; /* 保存草稿按钮的字体颜色 */
}

</style>
