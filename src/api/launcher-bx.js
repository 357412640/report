import axios from '@/axios/api.request'

// 活跃设备
export const getActiveDevice = (params) => {
  return axios.request({
    url: '/bi/fridge/activeDevice',
    method: 'get',
    params
  })
}      
// 冰箱激活
export const activeCount = (params) => {
  return axios.request({
    url: '/bi/fridge/activeCount',
    method: 'get',
    params
  })
}
export const activeTotal = (params) => {
  return axios.request({
    url: '/bi/fridge/activeTotalCount',
    method: 'get',
    params
  })
}
// 应用启动趋势
export const startTrend = (params) => {
  return axios.request({
    url: '/bi/fridge/startTrend',
    method: 'get',
    params
  })
}
// 应用启动排名
export const startRank = (params) => {
  return axios.request({
    url: '/bi/fridge/startRank',
    method: 'get',
    params
  })
}
