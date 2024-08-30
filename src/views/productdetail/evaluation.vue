<template>
  <div class="goodsEvaluation">
    <van-nav-bar fixed title="商品评价页" left-arrow @click-left="$router.go(-1)" />

    <div class="comment-list">
      <div class="comment-item" v-for="item in goodsCommentArray" :key="item.comment_id">
        <div class="top">
          <img :src="item.user.avatar_url || defaultAvatar" alt="">
          <div class="name">{{item.user.nick_name}}</div>
          <van-rate :size="16" :value="item.score" color="#ffd21e" void-icon="star" void-color="#eee"/>
        </div>
        <div class="content">
          {{item.content}}
        </div>
        <div class="time">
          {{item.create_time}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getGoodsCommentDetail } from '@/api/goodsDetail'
export default {
  name: 'GoodsEvaluation',
  computed: {
    detailId () {
      return this.$route.params.id
    }
  },
  async created () {
    try {
      const goodsId = this.detailId
      const commentRes = await getGoodsCommentDetail({
        scoreType: -1, // 全部评价
        goodsId
      })
      this.goodsCommentArray = commentRes.data.list.data
      console.log(this.goodsCommentArray)
    } catch (error) {
      console.error('Failed to fetch goods comments:', error)
      // 可以在这里添加更多的错误处理逻辑，比如显示错误提示
    }
  },
  data () {
    return {
      defaultAvatar: 'https://ali-4rozen-oss.oss-cn-guangzhou.aliyuncs.com/coding/202408301648039.png',
      goodsCommentArray: [] // 商品评价
    }
  }
}
</script>

<style lang="less" scoped>
.goodsEvaluation {
  padding-top: 46px;
  background-color: #f7f7f7;
  min-height: 100vh;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }

  .comment-list {
    padding: 10px 15px;
  }

  .comment-item {
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    font-size: 14px;
    line-height: 22px;

    .top {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
        object-fit: cover;
        border: 1px solid #eaeaea;
      }

      .name {
        font-weight: 600;
        color: #333;
        flex-grow: 1;
      }

      .van-rate {
        margin-left: auto;
      }
    }

    .content {
      color: #555;
      margin-bottom: 10px;
      white-space: normal;
      word-wrap: break-word;
    }

    .time {
      font-size: 12px;
      color: #999;
      text-align: right;
    }
  }
}
</style>
