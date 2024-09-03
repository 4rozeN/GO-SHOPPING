import addressData from '@/json/addressTree.json'
import { Toast } from 'vant'

export default {
  data () {
    return {
      idsObj: {}, // 存放将标准地址code转换为ids对象
      regionCode: '' // 存放将ids对象转换为标准地址的code
    }
  },
  methods: {
    // 将 ids 对象转换为标准的 regionCode
    getRegionCode (provinceId, cityId, countyId) {
      try {
        // 格式化参数，确保都为String类型
        provinceId = Number(provinceId)
        cityId = Number(cityId)
        countyId = Number(countyId)
        const { list } = addressData.data

        const province = list[provinceId]
        if (!province) Toast('不支持的省份名')

        const city = province.city[cityId]
        if (!city) Toast('不支持的城市名')

        const county = city.region[countyId]
        if (!county) Toast('不支持的地区名')

        const provinceIndex = Object.keys(list).indexOf(provinceId.toString()) + 11
        const cityIndex = Object.keys(province.city).indexOf(cityId.toString()) + 1
        const countyIndex = Object.keys(city.region).indexOf(countyId.toString()) + 1

        const regionCode = `${provinceIndex.toString().padStart(2, '0')}${cityIndex.toString().padStart(2, '0')}${countyIndex.toString().padStart(2, '0')}`

        return regionCode
      } catch (error) {
        console.log(error)
      }
    },

    // 将标准的 regionCode 转换为 provinceId, cityId, countyId 对象
    getIdsFromRegionCode (regionCode) {
      try {
        // 格式化参数，确保都为String类型
        regionCode = regionCode.toString()
        const { list } = addressData.data

        // 提取省、市、区的编码
        const provinceCode = regionCode.slice(0, 2)
        const cityCode = regionCode.slice(2, 4)
        const countyCode = regionCode.slice(4, 6)

        // 查找省份
        const provinceIndex = parseInt(provinceCode) - 11 // 省份索引
        const provinceId = Object.keys(list)[provinceIndex]

        if (!provinceId) Toast('不支持的省份名')

        const province = list[provinceId]

        // 查找城市
        const cityIndex = parseInt(cityCode) - 1 // 城市索引
        const cityId = Object.keys(province.city)[cityIndex]

        if (!cityId) Toast('不支持的城市名')

        const city = province.city[cityId]

        // 查找区县
        const countyIndex = parseInt(countyCode) - 1 // 区县索引
        const countyId = Object.keys(city.region)[countyIndex]

        if (!countyId) Toast('不支持的地区名')

        return {
          provinceId: parseInt(provinceId),
          cityId: parseInt(cityId),
          countyId: parseInt(countyId)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
