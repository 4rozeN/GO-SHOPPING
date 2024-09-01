import { areaList } from '@vant/area-data'

export default {
  namespaced: true,
  state () {
    return {
      // regionCode存放计算后的地址名称对象
      regionName: {
        province: '',
        city: '',
        county: ''
      },
      // 代码到名称的映射
      codeToNameMap: {
        provinceMap: {},
        cityMap: {},
        countyMap: {}
      },
      // 名称到代码的映射
      nameToCodeMap: {
        provinceMap: {},
        cityMap: {},
        countyMap: {}
      }
    }
  },
  getters: {
    // 根据名称获取代码
    nameToCode: (state) => (name) => {
      return (
        state.nameToCodeMap.provinceMap[name] ||
        state.nameToCodeMap.cityMap[name] ||
        state.nameToCodeMap.countyMap[name] ||
        null
      )
    },
    // 根据代码获取名称
    codeToName: (state) => (code) => {
      return (
        state.codeToNameMap.provinceMap[code] ||
        state.codeToNameMap.cityMap[code] ||
        state.codeToNameMap.countyMap[code] ||
        null
      )
    },
    // 获取计算后的地址名称
    getFullAddressInfo: (state) => {
      return state.regionName
    }
  },
  mutations: {
    SET_CODE_TO_NAME_MAP (state, { map, type }) {
      state.codeToNameMap[type] = map
    },
    SET_NAME_TO_CODE_MAP (state, { map, type }) {
      state.nameToCodeMap[type] = map
    },
    SET_REGION_NAME (state, regionName) {
      state.regionName = regionName
    }
  },
  actions: {
    // 构建映射表
    buildReverseMaps ({ commit }) {
      const provinceCodeToNameMap = buildCodeToNameMap(areaList.province_list)
      const cityCodeToNameMap = buildCodeToNameMap(areaList.city_list)
      const countyCodeToNameMap = buildCodeToNameMap(areaList.county_list)

      const provinceNameToCodeMap = buildNameToCodeMap(areaList.province_list)
      const cityNameToCodeMap = buildNameToCodeMap(areaList.city_list)
      const countyNameToCodeMap = buildNameToCodeMap(areaList.county_list)

      commit('SET_CODE_TO_NAME_MAP', { map: provinceCodeToNameMap, type: 'provinceMap' })
      commit('SET_CODE_TO_NAME_MAP', { map: cityCodeToNameMap, type: 'cityMap' })
      commit('SET_CODE_TO_NAME_MAP', { map: countyCodeToNameMap, type: 'countyMap' })

      commit('SET_NAME_TO_CODE_MAP', { map: provinceNameToCodeMap, type: 'provinceMap' })
      commit('SET_NAME_TO_CODE_MAP', { map: cityNameToCodeMap, type: 'cityMap' })
      commit('SET_NAME_TO_CODE_MAP', { map: countyNameToCodeMap, type: 'countyMap' })
    },
    // 根据地址代码获取完整的地址名称
    async fetchFullAddressName ({ commit, getters }, regionId) {
      const provinceCode = regionId.slice(0, 2) + '0000'
      const cityCode = regionId.slice(0, 4) + '00'
      const countyCode = regionId

      const provinceName = getters.codeToName(provinceCode) || ''
      const cityName = getters.codeToName(cityCode) || ''
      const countyName = getters.codeToName(countyCode) || ''

      const regionName = { province: provinceName, city: cityName, county: countyName }
      commit('SET_REGION_NAME', regionName)

      return regionName
    }
  }
}

// 构建代码到名称的映射
function buildCodeToNameMap (list) {
  const map = {}
  Object.keys(list).forEach(code => {
    map[code] = list[code] // 代码作为键，名称作为值
  })
  return map
}

// 构建名称到代码的映射
function buildNameToCodeMap (list) {
  const map = {}
  Object.keys(list).forEach(code => {
    map[list[code]] = code // 名称作为键，代码作为值
  })
  return map
}
