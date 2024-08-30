<template>
  <div class="search">
    <van-nav-bar fixed title="商品列表" left-arrow @click-left="$router.go(-1)" />

    <van-search
      readonly
      shape="round"
      background="#ffffff"
      :value="querySearch"
      show-action
      @click="$router.push('/search')"
    >
      <template #action>
        <van-icon class="tool" name="apps-o" />
      </template>
    </van-search>

    <!-- 排序选项按钮 -->
  <div class="sort-btns">
    <div
      class="sort-item"
      :class="{ active: currentSortType === 'all' }"
      @click="sortGoods('all')">综合</div>
    <div
      class="sort-item"
      :class="{ active: currentSortType === 'sales' }"
      @click="sortGoods('sales')">销量</div>
    <div
      class="sort-item"
      :class="{ active: currentSortType === 'price' }"
      @click="sortGoods('price')">价格</div>
  </div>

    <div class="goods-list">
      <GoodsItem v-for="item in productList" :key="item.goods_id" :goods="item"></GoodsItem>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { getProducts } from '@/api/product'
export default {
  name: 'SearchIndex',
  components: {
    GoodsItem
  },
  computed: {
    // 从router的query中拿到查询参数
    querySearch () {
      // console.log(this.$route.query.search)
      // 如果查询参数不存在就返回一个空字符串
      return this.$route.query.search || ''
    },
    queryCategory () {
      return this.$route.query.categoryId || ''
    }
  },
  async created () {
    // 获取商品列表数据
    const res = await getProducts({
      categoryId: this.queryCategory,
      goodsName: this.querySearch
      // page: this.page
    })
    this.productList = res.data.list.data
    // console.log(res.data.list)
    // console.log(this.querySearch)
  },
  data () {
    return {
      currentSortType: 'all',
      productList: [],
      page: 1
    }
  },
  methods: {
    // 排序商品
    async sortGoods (sortType) {
      // console.log(sortType)
      this.currentSortType = sortType // 更新当前选中的排序类型
      const res = await getProducts({
        categoryId: this.queryCategory,
        goodsName: this.querySearch,
        sortType: sortType
      })
      this.productList = res.data.list.data
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .tool {
    font-size: 24px;
    height: 40px;
    line-height: 40px;
  }

  .sort-btns {
    display: flex;
    height: 36px;
    line-height: 36px;
    .sort-item {
      text-align: center;
      flex: 1;
      font-size: 16px;
    }
    .active { color: #ee0a24 }
  }
}

// 商品样式
.goods-list {
  background-color: #f6f6f6;
}
</style>
