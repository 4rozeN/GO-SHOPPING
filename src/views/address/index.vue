<template>
  <div class="address-list">
    <van-nav-bar fixed title="地址列表" left-arrow @click-left="$router.go(-1)" />
  <div v-if="list.length > 0">
    <!-- 用于区分的文字 -->
    <div class="address-list-header">
      <p class="header-text">请选择或管理收货地址</p>
    </div>

    <!-- 地址列表 -->
    <van-address-list
      v-model="chosenAddressId"
      :list="list"
      :disabled-list="disabledList"
      :disabled-text="disabledText"
      default-tag-text="默认"
      @add="onAdd"
      @edit="onEdit"
    />
  </div>
  <van-empty v-else description="空空如也">
      <van-button round type="danger" class="bottom-button" @click="onAdd">添加地址</van-button>
    </van-empty>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { mapActions } from 'vuex'

export default {
  name: 'AddressList',
  computed: {
    ...mapActions('Address', ['getAddressList']),
    // 禁用状态的文字
    disabledText () {
      return this.disabledList.length > 0 ? '以下地址超出配送范围' : ''
    }
  },
  async created () {
    // 获取地址列表
    const resList = await this.getAddressList
    // console.log(resList)
    this.list = resList.list
  },
  data () {
    return {
      // 默认选中的地址id
      chosenAddressId: '1',
      // 地址列表
      list: [],
      // 禁用状态的地址列表（超出快递范围）
      disabledList: []
    }
  },
  methods: {
    onAdd () {
      this.$router.push('/address/edit?adsid=')
    },
    onEdit (item, index) {
      this.$router.push(`/address/edit?adsid=${this.chosenAddressId}`)
      Toast('编辑地址:' + index)
    }
  }
}
</script>

<style scoped lang="less">
.custom-nav-bar {
  background-color: #ffffff;  // 导航栏背景色
  height: 50px;               // 设置导航栏的高度
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);  // 添加阴影效果
}

.address-list {
  padding-top: 60px; // 增加顶部内边距，以避免内容被导航栏遮挡
}

.address-list-header {
  padding: 10px 16px;
  background-color: #f8f8f8;
}

.header-text {
  font-size: 16px;
  color: #333;
  text-align: left;
  margin: 0;
}

/* 地址列表项样式 */
.van-address-list__item {
  margin-bottom: 10px; // 每一项之间的间距
  padding: 10px 16px;  // 内边距，使内容不贴边
  border: 1px solid #ddd; // 边框颜色
  border-radius: 4px; // 圆角边框
  background-color: #fff; // 背景色
}

/* 禁用状态的地址项样式 */
.van-address-list__item--disabled {
  background-color: #f5f5f5; // 禁用项的背景色
  color: #999; // 禁用项的文字颜色
}
</style>
