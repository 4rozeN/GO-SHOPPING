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
      isDefault: false // 是否为默认地址，新建不可设置默认地址，只有编辑可以
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
    console.log('adsId:', this.adsId)

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
      console.log('addressInfo:', this.addressInfo)
      this.isDefault = detail.isDefault || false // 记录是否为默认地址
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
        console.log('编辑地址的content:', content)
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
        console.log('dataObj:', dataObj)
        // 发送请求
        await this.updateAddress(dataObj)
        // 成功后返回地址列表
        if (this.isDefault) {
          // 如果设置了当前地址为默认地址，则将Vuex的默认地址进行更新
          this.$store.commit('Address/setDefaultAddressId', this.addressInfo.id)
          Toast('保存成功')
          this.$router.replace({ path: '/address/manage' }) // 保存成功后返回地址列表页面
        } else {
          // 没有设置默认地址，则直接返回地址列表页面
          Toast('保存成功')
          this.$router.replace({ path: '/address/manage' }) // 保存成功后返回地址列表页面
        }
      }
    },
    onDelete () {
      Toast('删除成功')
    },
    // 切换默认地址
    onChangeDefault (val) {
      // console.log(val)
      // 只有编辑才可以设置默认地址
      this.isDefault = val
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
