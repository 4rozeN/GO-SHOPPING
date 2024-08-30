<template>
  <div class="search">
    <van-nav-bar title="商品搜索" left-arrow @click-left="$router.go(-1)" />

    <van-search v-model="search" @search="goSearch(search)" show-action placeholder="请输入搜索关键词" clearable>
      <template #action>
        <div @click="goSearch(search)">搜索</div>
      </template>
    </van-search>

    <!-- 搜索历史 -->
    <div class="search-history" v-if=" historyList.length > 0" >
      <div class="title">
        <span>最近搜索</span>
        <van-icon name="delete-o" @click="clearHistory" size="16" />
      </div>
      <div class="list">
        <div class="list-item" v-for="item in historyList" :key="item" @click="goSearch(item)">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHistory, setHistory } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  data () {
    return {
      search: '',
      historyList: getHistory()
    }
  },
  methods: {
    goSearch (searchContent) {
      // 判断输入的搜索词是否已经在historyList中
      const index = this.historyList.indexOf(searchContent)
      if (index !== -1) {
        // 说明存在，则将其进行删除
        this.historyList.splice(index, 1) // splice语法：splice(index, howMany, item1, ....., itemX)
      }
      // 将搜索词添加到historyList的最前面
      this.historyList.unshift(searchContent)
      setHistory(this.historyList)
      // 跳转到搜索列表页面
      this.$router.push(`/searchlist?search=${searchContent}`)
    },
    clearHistory () {
      this.historyList = []
      setHistory([])
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  .searchBtn {
    background-color: #fa2209;
    color: #fff;
  }
  ::v-deep .van-search__action {
    background-color: #c21401;
    color: #fff;
    padding: 0 20px;
    border-radius: 0 5px 5px 0;
    margin-right: 10px;
  }
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
  }
  .list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 10px;
    gap: 5%;
  }
  .list-item {
    width: 25%;
    text-align: center;
    padding: 7px;
    line-height: 15px;
    border-radius: 50px;
    background: #fff;
    font-size: 13px;
    border: 1px solid #efefef;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  }
}
</style>
