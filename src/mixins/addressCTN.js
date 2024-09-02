import { areaList } from '@vant/area-data'

export default {
  data () {
    return {
      address: {}
    }
  },
  methods: {
    // 通过regionCode(必须为String类型)得到全部的省市区信息：Code => Name
    getRegionStrByCode (regionCode) {
      const { provinceCode, cityCode, countyCode } = this.getThreeCodeByRegionCode(regionCode)

      const provinceName = areaList.province_list[provinceCode] || ''
      const cityName = areaList.city_list[cityCode] || ''
      const countyName = areaList.county_list[countyCode] || ''

      return `${provinceName}${cityName}${countyName}`
    },
    // 提供方法分解regionCode，得到省市区三个code
    getThreeCodeByRegionCode (regionCode) {
      const provinceCode = regionCode.slice(0, 2) + '0000'
      const cityCode = regionCode.slice(0, 4) + '00'
      const countyCode = regionCode
      return {
        provinceCode,
        cityCode,
        countyCode
      }
    }
  }
}
