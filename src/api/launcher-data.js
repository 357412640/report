import axios from '@/axios/api.request'

// 下拉页面点击
export const pageClick = (params) => {
  return axios.request({
    url: '/bi/desktop/pageclick',
    method: 'get',
    params
  })
}

// 下拉页面访问 pageView
export const pageView = (params) => {
  return axios.request({
    url: '/bi/desktop/pageView',
    method: 'get',
    params
  })
}

// 频道访问概览 channelView
export const channelView = (params) => {
  return axios.request({
    url: '/bi/desktop/channelView',
    method: 'get',
    params
  })
}

// 独立频道访问 indChannelView
export const indChannelView = (params) => {
  return axios.request({
    url: '/bi/desktop/indChannelView',
    method: 'get',
    params
  })
}

// 频道访问概览5s channelView5s
export const channelView5s = (params) => {
  return axios.request({
    url: '/bi/desktop/channelView5s',
    method: 'get',
    params
  })
}

// 独立频道访问5s indChannelView5s
export const indChannelView5s = (params) => {
  return axios.request({
    url: '/bi/desktop/indChannelView5s',
    method: 'get',
    params
  })
}

// 资源点击 resourceclick
export const resourceclick = (params) => {
  return axios.request({
    url: '/bi/desktop/resourceclick',
    method: 'get',
    params
  })
}

// 专题详情 topicDetail
export const topicDetailData = (params) => {
  return axios.request({
    url: '/bi/desktop/topicDetail',
    method: 'get',
    params
  })
}