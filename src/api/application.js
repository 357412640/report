import axios from '@/axios/api.request'

// 通用接口单独使用时接口路径
export const getData = (params) => {
  return axios.request({
    url: '/bi/data/get',
    method: 'get',
    params
  })
}

// 启动排名
export const startupCount = (params) => {
  return axios.request({
    url: '/bi/app/show',
    method: 'get',
    params
  })
}

// 应用版本分布
export const appVersionCount = (params) => {
  return axios.request({
    url: '/bi/app/version',
    method: 'get',
    params
  })
}

// 启动趋势
export const startupModel = params => {
  return axios.request({
    url: 'bi/app/startup',
    method: 'get',
    params
  })
}

