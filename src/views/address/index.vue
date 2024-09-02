<template>
  <div class="address-list">
    <van-nav-bar fixed title="地址列表" left-arrow @click-left="goWhere" />
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
        @select="onSelect"
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
import { Dialog } from 'vant'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import addressCTN from '@/mixins/addressCTN'
import { getAddressList, getDefaultAddressId, getAddressDetail } from '@/api/address'

export default {
  name: 'AddressList',
  mixins: [addressCTN],
  data () {
    return {
      // 中间变量，用于暂时存放默认地址id
      zeroId: 0,
      // 默认选中的地址id
      chosenAddressId: 0,
      // 地址列表
      list: [],
      // 禁用状态的地址列表（超出快递范围）
      disabledList: []
    }
  },
  computed: {
    ...mapGetters('Address', ['getDefaultAddressId']),
    disabledText () {
      return this.disabledList.length > 0 ? '以下地址超出配送范围' : ''
    }
  },
  async created () {
    // console.log(this.getFrom)
    // 获取默认地址id
    try {
      const res = await this.myDefaultAddressId() // 获取默认地址id
      this.chosenAddressId = res.data.defaultId
      this.zeroId = this.chosenAddressId
      console.log('拉取默认地址id：', this.chosenAddressId)
    } catch (error) {
      // 失败说明没有默认地址
      this.chosenAddressId = this.list[0].id
      console.log('获取默认地址id失败：', error)
    }

    // 获取地址列表
    try {
      this.list = await this.myAdressList()
      // console.log('首次拉取到的this.list:', this.list)
      // 没有默认地址则给this.list的每一个对象添加isDefault属性，值为false
      this.list.forEach(item => {
        item.isDefault = false
      })
      // 给默认地址添加isDefault属性，值为true
      this.list.forEach(item => {
        // console.log('kkitem:', item)
        if (Number(item.address_id) === Number(this.chosenAddressId)) {
          // console.log('找到默认地址：', item)
          item.isDefault = true
        }
      })
      console.log('根据是否有默认地址，给this.list添加isDefault属性后的this.list：', this.list)
      // 格式化地区信息，通过Code得到Name
      this.list.forEach(item => {
        item.region = this.getRegionStrByCode(String(item.region_id))
      })
      // 格式化list，使其中的键名符合vant的Address数据结构，便于渲染展示
      this.list.forEach(item => {
        item = this.formatStructure(item)
        // console.log('item:', item)
      })
    } catch (error) {
      this.list = []
      console.log('获取地址列表失败：', error)
    }
  },
  methods: {
    ...mapActions('Address', ['getAddressList']),
    ...mapMutations('Address', ['SET_ADDRESS_ID', 'SET_SELECTED_ADDRESS_ID']),
    // 得到地址列表
    async myAdressList () {
      const { data: { list } } = await getAddressList()
      return list
    },
    // 格式化从后端得到的数据，将其符合vant的Address数据结构
    formatStructure (item) {
      // 改变item对象的键名
      item.id = item.address_id
      item.tel = item.phone
      item.address = item.region + item.detail

      // 删除旧的键名
      delete item.address_id
      delete item.phone
      delete item.region
      delete item.detail
    },
    // 得到默认地址id
    async myDefaultAddressId () {
      const defaultAddressId = await getDefaultAddressId()
      return defaultAddressId
    },
    // 得到地址详情
    async myAddressDetail (addressId) {
      const { data: { detail } } = await getAddressDetail(addressId)
      return detail
    },
    onSelect (item) {
      console.log('选中了item：', item)
      // this.$router.replace(`/pay?adsid=${item.id}`)
      Dialog.alert({
        title: '选择确认',
        message: '您确定选择这个地址吗？',
        showCancelButton: true
      }).then(() => {
        // on close
        // 设置选中地址id
        this.SET_SELECTED_ADDRESS_ID(item.id)
        this.$router.replace({
          name: 'Pay', // 使用replace带参数必须使用name，路由配置也必须存在name
          query: {
            ...this.$route.query,
            adsid: item.id
          }
        })
      }).catch(() => {
        // 点击取消后将chosenAddressId赋值为默认地址id
        this.chosenAddressId = this.zeroId
      })
    },
    onAdd () {
      this.$router.replace({
        name: 'AddressE',
        query: {
          ...this.$route.query
        }
      })
    },
    onEdit (item) {
      // 设置要进行传递的地址id
      this.SET_ADDRESS_ID(item.id)
      console.log('跳转到编辑：', item)
      this.$router.replace({
        name: 'AddressE',
        query: {
          ...this.$route.query
        }
      })
    },
    goWhere () {
      // console.log('params:', this.$route.params.whoami)
      // 判断有没有传参数
      if (this.getFrom) {
        if (this.getFrom === 'pay') {
          console.log('跳转到支付页面')
          this.$router.replace({
            name: 'Pay',
            query: {
              ...this.$route.query
            }
          })
        } else if (this.getFrom === 'I') {
          // 未来添加返回个人页面
          // this.$router.replace({
          //   name: 'Cart',
          //   query: {
          //     ...this.$route.query
          //   }
          // })
        }
      } else {
        this.$router.go(-1)
      }
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
