<template>
  <!-- 可编辑也可以作为添加地址的页面 -->
  <div class="address-list">
    <van-nav-bar fixed title="地址编辑" left-arrow @click-left="goAddressM" />

    <div class="address-edit">
      <van-address-edit
        :address-info="addressInfo"
        :area-list="areaList"
        show-delete
        :show-set-default="editAddressId ? true : false"
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
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { areaList } from '@vant/area-data' // 引入vant官方的地区数据
import { getAddressDetail, getDefaultAddressId, addAddress, updateAddress, setDefaultAddress, deleteAddress } from '@/api/address'
import addressCTN from '@/mixins/addressCTN'

export default {
  name: 'AddressEdit',
  mixins: [addressCTN],
  data () {
    return {
      ifDefaultId: 0, // 获取到的默认地址id
      addressInfo: {}, // 初始地址详情对象，若是新建地址则为空对象
      areaList: areaList, // 地区列表
      searchResult: [], // 详细地址搜索结果
      checkDefault: false // 默认地址的标识，数据内的isDefault会随着设置按钮而改变，此字段标识数据原始状态
    }
  },
  computed: {
    // 获取要进行编辑的地址id
    editAddressId () {
      return this.getAddressId()
    }
  },
  async created () {
    // 通过isEdit判断操作类型，渲染数据
    if (this.editAddressId !== 0) {
      console.log('this.editAddressId:', this.editAddressId)
      // 为真，说明是编辑操作，需要获取当前操作的地址信息
      try {
        // 获取当前操作的地址详情
        const { data: { detail } } = await getAddressDetail(this.editAddressId)
        this.addressInfo = detail
      } catch (error) {
        console.log(error)
      }
      try {
        // 获取用户默认地址id
        this.ifDefaultId = await getDefaultAddressId()
      } catch (error) {
        this.addressInfo.isDefault = false
        console.log('用户默认地址为空')
      }
      // 判断是否为默认地址
      if (this.addressInfo.address_id === this.ifDefaultId) {
        // 补全缺少的isDefault属性，并设置为true
        this.addressInfo.isDefault = true
      } else { this.addressInfo.isDefault = false }
      // 通过Code得到地址Name
      this.addressInfo.region_id = String(this.addressInfo.region_id)
      // console.log('this.addressInfo.region_id:', this.addressInfo.region_id)
      this.addressInfo.region = this.getRegionStrByCode(this.addressInfo.region_id)
      // 格式化地址详情使其便于组件渲染
      this.formatStructure(this.addressInfo)
      // console.log('格式化后的this.addressInfo:', this.addressInfo)
    } else {
      // 说明是新增操作，啥也不做
    }
  },
  methods: {
    ...mapActions('Address', ['getAddressDetail', 'addAddress', 'updateAddress']),
    ...mapMutations('Address', ['CLEAR_ADDRESS_ID']),
    ...mapGetters('Address', ['getAddressId']),
    // 添加测试地址数据（可传入name参数）
    async addOneTrue (content) {
      // 此处添加一个固定的有效数据 （根据后端接口）
      const dataObj = {
        form: {
          name: content.name,
          phone: '13800138000',
          region: [{ value: 1, label: '北京市' }, { value: 2, label: '北京市' }, { value: 3, label: '东城区' }],
          detail: '这是有效的测试地址...'
        }
      }
      try {
        await addAddress(dataObj)
      } catch (error) {
        console.log('添加后端有效地址错误：', error)
      }
    },
    async addOneAdress (addressObj) {
      // 新增地址（根据vant地区库数据封装）
      // 通过areaCode得到省市区三个Code
      console.log('新增地址:', addressObj)
      const { provinceCode, cityCode, countyCode } = this.getThreeCodeByRegionCode(addressObj.areaCode)
      // 封装接口需要的参数对象
      const dataObj = {
        form: {
          name: addressObj.name,
          phone: addressObj.tel,
          region: [
            { value: Number(provinceCode), label: addressObj.province },
            { value: Number(cityCode), label: addressObj.city },
            { value: Number(countyCode), label: addressObj.county }
          ],
          detail: addressObj.addressDetail
        }
      }
      console.log('dataObj:', dataObj)
      try {
        await addAddress(dataObj)
        Toast('保存成功')
        console.log('新增地址成功')
      } catch (error) {
        console.log(error)
      }
    },
    async updateOneAdress (addressObj) {
      // 通过areaCode得到省市区三个Code
      const { provinceCode, cityCode, countyCode } = this.getThreeCodeByRegionCode(addressObj.areaCode)
      // 封装接口需要的参数对象
      const dataObj = {
        addressId: String(addressObj.id),
        form: {
          name: addressObj.name,
          phone: addressObj.tel,
          region: [
            { value: provinceCode, label: addressObj.province },
            { value: cityCode, label: addressObj.city },
            { value: countyCode, label: addressObj.county }
          ],
          detail: addressObj.addressDetail
        }
      }
      // console.log('dataObj:', dataObj)
      // 先判断是否设置了isDefault属性
      if (addressObj.isDefault) {
        try {
          await setDefaultAddress(addressObj.id)
          console.log('设置默认地址成功：', addressObj.id)
        } catch (error) {
          console.log(error)
        }
      }
      try {
        await updateAddress(dataObj)
        Toast('修改成功')
        console.log('更新地址成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 保存按钮的点击事件
    async onSave (content) {
      // console.log(content)
      // 判断是新建地址还是编辑地址
      if (this.editAddressId === 0) {
        // 新建地址
        // this.addOneAdress(content)
        this.addOneTrue(content) // 测试用
      } else {
        // 编辑地址
        this.updateOneAdress(content)
      }
    },
    // 删除按钮的点击事件
    async onDelete (content) {
      console.log('删除地址:', content)
      await deleteAddress(content.id)
      Toast('删除成功')
      // 刷新页面
      this.$router.replace({
        name: 'AddressM',
        query: {
          ...this.$route.query
        }
      })
    },
    formatStructure (item) {
      // 改变item对象的键名
      item.id = item.address_id
      // item.name = item.name
      item.tel = item.phone
      item.province = item.province_id
      item.city = item.city_id
      item.county = item.region_id
      item.addressDetail = item.detail
      item.areaCode = item.region_id

      // 删除旧的键名
      delete item.address_id
      delete item.phone
      delete item.province_id
      delete item.city_id
      delete item.region_id
      delete item.detail
    },
    goAddressM () {
      this.$router.replace({
        name: 'AddressM',
        query: {
          adsid: this.adsId,
          ...this.$route.query
        }
      })
    },
    // 设置默认地址
    onChangeDefault (val) {
      // console.log(val)
      // 只有编辑才可以设置默认地址
      this.addressInfo.isDefault = val
      console.log('设置默认地址的按钮被触发, this.addressInfo.isDefault:', this.addressInfo.isDefault)
    }
  },
  destroyed () {
    // 清除编辑地址的id
    this.CLEAR_ADDRESS_ID()
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
