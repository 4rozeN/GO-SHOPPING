<template>
  <!-- 可编辑也可以作为添加地址的页面 -->
  <div class="address-list">
    <van-nav-bar fixed title="地址编辑" left-arrow @click-left="$router.go(-1)" />

    <div class="address-edit">
      <van-address-edit
        :area-list="areaList"
        show-postal
        show-delete
        show-set-default
        show-search-result
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="onDelete"
        @change-detail="onChangeDetail"
      />
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { mapActions } from 'vuex'
import { areaList } from '@vant/area-data' // 引入vant官方的地区数据

export default {
  name: 'AddressEdit',
  data () {
    return {
      adsId: 0, // 地址id
      addressInfo: {}, // 初始地址详情对象，若是新建地址则为空对象
      areaList: areaList, // 地区列表
      searchResult: [], // 详细地址搜索结果
      isDefault: false, // 是否为默认地址

      // 提供三个map对象，用于存储省市区的映射关系，节省性能
      provinceMap: {},
      cityMap: {},
      countyMap: {}
    }
  },
  computed: {
  },
  async created () {
    // console.log(this.areaList)

    // 构建映射表，节省性能
    this.buildReverseMaps()

    // 获取要进行编辑的地址id，如果为空则赋值为-1表示为新建地址
    this.adsId = this.$route.params.id || -1
    // console.log(this.adsId)

    // 如果adsId不等于-1，则进行地址详情的拉取
    if (this.adsId !== -1) {
      // 说明是编辑地址，则需要拉取地址详情
      this.addressInfo = this.getAddressDetail(this.adsId)
      console.log(this.addressInfo)
      // TODO
    } else {
      // 说明是新建地址，不做操作
    }
  },
  methods: {
    ...mapActions('Address', ['getAddressDetail', 'addAddress']),

    // 构建映射表，节省性能
    buildReverseMaps () {
      // 构建省份映射表
      this.provinceMap = this.buildReverseMap(this.areaList.province_list)
      // 构建城市映射表
      this.cityMap = this.buildReverseMap(this.areaList.city_list)
      // 构建区县映射表
      this.countyMap = this.buildReverseMap(this.areaList.county_list)
    },
    // 构建反向映射表，用于快速查找
    buildReverseMap (list) {
      const map = {}
      Object.keys(list).forEach(key => {
        map[list[key]] = key
      })
      return map
    },
    // 保存地址
    async onSave (content) {
      // 判断是新建地址还是编辑地址
      if (this.adsId === -1) {
        // 新建地址
        content.country = '中国'
        this.addressInfo = content
        // console.log(this.addressInfo.name)

        // 使用映射表进行地区数据处理
        const region = [
          {
            value: Number(this.provinceMap[content.province]) || '',
            label: content.province
          },
          {
            value: Number(this.cityMap[content.city]) || '',
            label: content.city
          },
          {
            value: Number(this.countyMap[content.county]) || '',
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
        console.log('Save', dataObj)
        // 调用接口进行地址的保存
        await this.addAddress(dataObj)
        Toast('保存成功')
        this.$router.replace({ path: '/address/manage' }) // 保存成功后返回地址列表页面
      } else {
        // 编辑地址
      }
    },
    onDelete () {
      Toast('delete')
    },
    // 详细地址搜索结果
    onChangeDetail (val) {
      if (val) {
        this.searchResult = [
          {
            name: '黄龙万科中心',
            address: '杭州市西湖区'
          }
        ]
      } else {
        this.searchResult = []
      }
    }
  }
}
</script>

<style scoped lang="less">
.address-list {
  padding-top: 60px;  // 增加与导航栏等高的内边距，避免内容被导航栏覆盖
}

.address-edit {
  padding: 10px 16px; // 给地址编辑区域增加一些内边距，使内容不贴边
  background-color: #fff; // 设置背景色为白色
}
</style>
