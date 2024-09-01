<template>
  <!-- 可编辑也可以作为添加地址的页面 -->
  <div class="address-list">
    <van-nav-bar fixed title="地址编辑" left-arrow @click-left="$router.go(-1)" />

    <div class="address-edit">
      <van-address-edit
        :address-info="addressInfo"
        :area-list="areaList"
        show-delete
        :show-set-default="this.adsId != -1 ? true : false"
        show-search-result
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        :detail-maxlength="20"
        @save="onSave"
        @delete="onDelete"
        @change-default="onChangeDefault"
      />
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { mapActions, mapGetters } from 'vuex'
import { areaList } from '@vant/area-data' // 引入vant官方的地区数据

export default {
  name: 'AddressEdit',
  data () {
    return {
      adsId: 0, // 地址id
      addressInfo: {}, // 初始地址详情对象，若是新建地址则为空对象
      areaList: areaList, // 地区列表
      searchResult: [], // 详细地址搜索结果
      checkDefault: false // 默认地址的标识，数据内的isDefault会随着设置按钮而改变，此字段标识数据原始状态
    }
  },
  computed: {
    ...mapGetters('AddressMap', ['nameToCode', 'codeToName']),
    // 获取要进行编辑的地址id，如果为空则赋值为-1表示为新建地址
    getAdsId () {
      return this.$route.query.adsid || -1
    }
  },
  async created () {
    // 构建映射表
    await this.buildReverseMaps()

    // 获取要进行编辑的地址id，如果为空则赋值为-1表示为新建地址
    this.adsId = this.getAdsId
    // console.log('adsId:', this.adsId)

    // 如果adsId不等于-1，则进行地址详情的拉取
    if (this.adsId !== -1) {
      // 说明是编辑地址，则需要拉取地址详情
      const { data: { detail } } = await this.getAddressDetail(this.adsId)
      this.addressInfo = {
        id: detail.address_id,
        name: detail.name,
        tel: detail.phone,
        province: this.codeToName(detail.province_id) || '',
        city: this.codeToName(detail.city_id) || '',
        county: this.codeToName(detail.county_id) || '',
        addressDetail: detail.detail,
        areaCode: String(detail.region_id),
        isDefault: this.isDefault
      }
      // 从Vuex得到默认地址的id
      const defaultAddressId = this.$store.state.Address.defaultAddressId
      // 比对当前地址是否为默认地址
      if (Number(defaultAddressId) === Number(detail.address_id)) {
        console.log('当前地址为默认地址')
        this.addressInfo.isDefault = true // 设置默认按钮为打开状态
        this.checkDefault = true // 为真说明该地址获取的时候就是默认地址
      } else {
        // 说明当前地址不是默认地址
        console.log('当前地址不是默认地址')
        this.addressInfo.isDefault = false // 设置默认按钮为关闭状态
        this.checkDefault = false // 为假说明该地址获取的时候不是默认地址
      }
    } else {
      // 说明是新建地址，不做操作
    }
  },
  methods: {
    ...mapActions('Address', ['getAddressDetail', 'addAddress', 'updateAddress']),
    ...mapActions('AddressMap', ['buildReverseMaps']),

    // 保存地址
    async onSave (content) {
      // 判断是新建地址还是编辑地址
      if (this.adsId === -1) {
        // 新建地址
        content.country = '中国'
        this.addressInfo = content

        // 使用映射表进行地区数据处理
        const region = [
          {
            value: Number(this.nameToCode(content.province)) || '',
            label: content.province
          },
          {
            value: Number(this.nameToCode(content.city)) || '',
            label: content.city
          },
          {
            value: Number(this.nameToCode(content.county)) || '',
            label: content.county
          }
        ]

        // 封装数据对象
        const dataObj = {
          name: this.addressInfo.name,
          phone: this.addressInfo.tel,
          region: region,
          detail: this.addressInfo.addressDetail
        }

        // 调用接口进行地址的保存
        await this.addAddress(dataObj)
        Toast('保存成功')
        this.$router.replace({ path: '/address/manage' }) // 保存成功后返回地址列表页面
      } else {
        // 编辑地址
        // console.log('编辑地址的content:', content)
        this.addressInfo = content
        // 封装对象，用于发送请求
        const dataObj = {
          address_id: this.addressInfo.id,
          form: {
            name: this.addressInfo.name,
            phone: this.addressInfo.tel,
            region: [
              {
                label: this.addressInfo.province,
                value: Number(this.nameToCode(this.addressInfo.province)) || ''
              },
              {
                label: this.addressInfo.city,
                value: Number(this.nameToCode(this.addressInfo.city)) || ''
              },
              {
                label: this.addressInfo.county,
                value: Number(this.nameToCode(this.addressInfo.county)) || ''
              }
            ],
            detail: this.addressInfo.addressDetail
          }
        }
        // console.log('dataObj:', dataObj)
        await this.updateAddress(dataObj)
        Toast('保存成功')

        // 处理默认地址的标识问题
        if (this.checkDefault) { // 为真说明当前编辑的是默认地址
          console.log('当前是默认地址，content:', content)
          console.log('当前是默认地址，this.adressInfo:', this.addressInfo)

          if (content.isDefault !== this.checkDefault) {
            // 说明用户取消了这个默认地址，需要将Vuex的默认地址id赋值为-1
            this.$store.commit('Address/setDefaultAddressId', -1)
          }
          // 否则什么也不做
        } else {
          // 说明当前编辑的不是默认地址
          console.log('当前不是默认地址，content:', content)
          console.log('当前不是默认地址，this.adressInfo:', this.addressInfo)

          if (content.isDefault !== this.checkDefault) {
            // 说明用户将当前不是默认地址的地址设置为默认地址
            this.$store.commit('Address/setDefaultAddressId', this.addressInfo.id)
          }
          // 否则什么也不做
        }

        // 处理完成后跳转会地址列表页
        this.$router.replace({ path: '/address/manage' })
      }
    },
    async onDelete () {
      // 判断是否删除的是默认地址，如果是，则将Vuex的默认地址id赋值为-1
      if (this.checkDefault) {
        this.$store.commit('Address/setDefaultAddressId', -1)
        console.log('删除默认地址, Vuex的默认地址id:', this.$store.state.Address.defaultAddressId)
      }
      await this.$store.dispatch('Address/deleteAddress', this.addressInfo.id)
      Toast('删除成功')
      setTimeout(() => {
        this.$router.replace('/address/manage')
      }, 1000)
    },
    // 设置默认地址
    onChangeDefault (val) {
      // console.log(val)
      // 只有编辑才可以设置默认地址
      this.addressInfo.isDefault = val
      console.log('设置默认地址的按钮被触发, this.addressInfo.isDefault:', this.addressInfo.isDefault)
    }
  }
}
</script>

<style scoped lang="less">
.address-list {
  padding-top: 60px; /* 增加与导航栏等高的内边距，避免内容被导航栏覆盖 */
}

.address-edit {
  padding: 10px 16px; /* 给地址编辑区域增加一些内边距，使内容不贴边 */
  background-color: #fff; /* 设置背景色为白色 */
}
</style>
