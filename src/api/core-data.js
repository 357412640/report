import axios from '@/axios/api.request'
// 电视激活===
// 新增数据
export const activityNew = (params) => {
  return axios.request({
    url: '/bi/activity/new',
    method: 'get',
    params
  })
}

// 累计数据
export const activityTotal = (params) => {
  return axios.request({
    url: '/bi/activity/total',
    method: 'get',
    params
  })
}

// 通用接口screeningCondition组件内使用
export const getData = (params) => {
  return axios.request({
    url: '/bi/data/list',
    method: 'get',
    params
  })
}


// 使用行为===
// 次均开机时长
export const useLongavg = (params) => {
  return axios.request({
    url: '/bi/bootup/longavg',
    method: 'get',
    params
  })
}
// 单次时长分布
export const useLongdis = (params) => {
  return axios.request({
    url: '/bi/bootup/longdis',
    method: 'get',
    params
  })
}
// 开机时段
export const useTime = (params) => {
  return axios.request({
    url: '/bi/bootup/time',
    method: 'get',
    params
  })
}

// 系统分析===
// 版本分布
export const osVersion = (params) => {
  return axios.request({
    url: '/bi/os/version',
    method: 'get',
    params
  })
}
export const platformVersion = (params) => {
  return axios.request({
    url: '/bi/os/platform',
    method: 'get',
    params
  })
}

// 活跃用户===
// 活跃用户
export const activeUsers = (params) => {
  return axios.request({
    url: '/bi/active/cnt',
    method: 'get',
    params
  })
}