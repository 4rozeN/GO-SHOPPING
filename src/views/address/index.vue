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
        :switchable="true"
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AddressList',
  data () {
    return {
      // 默认选中的地址id
      chosenAddressId: '',
      // 地址列表
      list: [],
      // 禁用状态的地址列表（超出快递范围）
      disabledList: []
    }
  },
  computed: {
    ...mapGetters('AddressMap', ['codeToName']),
    ...mapGetters('Address', ['getDefaultAddressId']),
    disabledText () {
      return this.disabledList.length > 0 ? '以下地址超出配送范围' : ''
    }
  },
  async created () {
    try {
      // 构建地区映射表
      await this.buildReverseMaps()

      // 获取地址列表
      const response = await this.getAddressList()
      // console.log('获取地址列表成功：', response)
      const addressData = response.list || []
      // console.log('地址数据：', addressData)

      // 格式化地址列表数据
      this.list = addressData
        .filter((item) => !item.is_disabled) // 过滤掉禁用的地址
        .map((item) => ({
          id: item.address_id,
          name: item.name,
          tel: item.phone,
          address: this.formatAddress(item),
          isDefault: item.is_default || false
        }))

      // 从Vuex中获取默认地址的id
      const defaultAddressId = this.getDefaultAddressId
      if (defaultAddressId) {
        // 转换defaultAddressId类型为数字，避免强等于无法得到正确结果
        // 遍历比对列表每一项的id是否与Vuex中默认地址的id相同，找到后返回索引
        const defaultIndex = this.list.findIndex((item) => Number(item.id) === Number(defaultAddressId))
        if (defaultIndex) {
          // 找到后
          this.list[defaultIndex].isDefault = true
          this.chosenAddressId = defaultAddressId
        } else {
          // 没找到，则默认选中第一个地址
          this.chosenAddressId = this.list[0].id || ''
        }
      } else {
        // Vuex没有默认地址，则默认选中第一个地址
        this.chosenAddressId = this.list[0].id || ''
      }
      // 设置禁用的地址列表
      this.disabledList = addressData
        .filter((item) => item.is_disabled)
        .map((item) => ({
          id: item.address_id,
          name: item.name,
          tel: item.phone,
          address: this.formatAddress(item),
          isDefault: item.is_default || false
        }))
      // 遍历寻找是否有被设置为默认的地址的id
      const hasDefault = this.list.some((item) => item.isDefault)
      if (!hasDefault) {
        Toast('小主还没有默认地址哦\n快来设置一个吧❤️')
      } else {
        // 说明有默认地址，将其设置为选中项
        const defaultItem = this.list.find((item) => item.isDefault)
        this.chosenAddressId = defaultItem.id || ''
      }
    } catch (error) {
      // console.error('获取地址列表失败：', error)
      Toast.fail('获取地址列表失败')
    }
  },
  methods: {
    ...mapActions('Address', ['getAddressList']),
    ...mapActions('AddressMap', ['buildReverseMaps']),
    // 格式化地址：
    formatAddress (item) {
      const provinceName = this.codeToName(item.province_id) || ''
      const cityName = this.codeToName(item.city_id) || ''
      const countyName = this.codeToName(item.county_id) || ''
      const detailAddress = item.detail || ''
      const result = `${provinceName}${cityName}${countyName}${detailAddress}`
      // console.log('codeToname：', this.codeToName(item.province_id))
      return result
    },
    onAdd () {
      this.$router.push('/address/edit?adsid=')
    },
    onEdit (item) {
      console.log('跳转到编辑：', item)
      this.$router.push(`/address/edit?adsid=${item.id}`)
    }
  }
}
</script>

<style scoped lang="less">
.custom-nav-bar {
  background-color: #ffffff; // 导航栏背景色
  height: 50px; // 设置导航栏的高度
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); // 添加阴影效果
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
  padding: 10px 16px; // 内边距，使内容不贴边
  border: 1px solid #ddd; // 边框颜色
  border-radius: 4px; // 圆角边框
  background-color: #fff; // 背景色

  .van-cell__title, .van-cell__label {
    white-space: normal; // 允许内容换行
    word-wrap: break-word; // 自动换行
    word-break: break-all; // 长单词换行
  }
}

/* 禁用状态的地址项样式 */
.van-address-list__item--disabled {
  background-color: #f5f5f5; // 禁用项的背景色
  color: #999; // 禁用项的文字颜色
}
</style>
