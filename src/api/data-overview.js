import axios from '@/axios/api.request'
import axioso from 'axios'

// 设备数据 电视
export const generalBasic = (params) => {
  return axioso.request({
    url: '/bi/general/basic',
    method: 'get',
    params
  })
}

// 周活月活
export const activeWM = (params) => {
  return axioso.request({
    url: '/bi/general/active',
    method: 'get',
    params
  })
}

// 设备数据 冰箱
export const generalBasicFridge = (params) => {
  return axioso.request({
    url: '/bi/fridge/general?flag=basic',
    method: 'get',
    params
  })
}

// 今日实时======
// 活跃设备两日对比 电视
export const activeGeneral = (params) => {
  return axioso.request({
    url: '/bi/active/general',
    method: 'get',
    params
  })
}

// 活跃设备两日对比 冰箱
export const activeGeneralFridge = (params) => {
  return axioso.request({
    url: '/bi/fridge/general?flag=active',
    method: 'get',
    params
  })
}

// 开机次数两日对比
export const bootupGeneral = (params) => {
  return axioso.request({
    url: '/bi/bootup/general',
    method: 'get',
    params
  })
}

// 七日趋势 ======
// 活跃设备 电视
export const activeCnt = (params) => {
  return axioso.request({
    url: '/bi/active/cnt',
    method: 'get',
    params
  })
}

// 活跃设备
export const activeCntAll = (params) => {
  return axioso.request({
    url: '/bi/general/trend',
    method: 'get',
    params
  })
}

// 电视型号新增激活
export const activityTopModel = (params) => {
  return axioso.request({
    url: '/bi/activity/topmodel',
    method: 'get',
    params
  })
}

// 冰箱型号新增激活
export const activityTopModelFridge = (params) => {
  return axioso.request({
    url: '/bi/fridge/general?flag=model',
    method: 'get',
    params
  })
}

export const bootupCnt = (params) => {
  return axioso.request({
    url: '/bi/bootup/cnt',
    method: 'get',
    params
  })
}

export const bootupLong = (params) => {
  return axioso.request({
    url: '/bi/bootup/long',
    method: 'get',
    params
  })
}

// 启动趋势 电视
export const startupModelTv = params => {
  return axioso.request({
    url: 'bi/app/startup?source=general',
    method: 'get',
    params
  })
}

// 启动趋势 冰箱
export const startupModelFridge = params => {
  return axioso.request({
    url: 'bi/fridge/general?flag=startup',
    method: 'get',
    params
  })
}