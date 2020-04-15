import axios from '@/axios/api.request'

export const login = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return axios.request({
    url: '/platform/user/login',
    data,
    method: 'post'
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return axios.request({
    url: '/platform/showTree',
    method: 'get'
  })
}

export const logout = () => {
  return axios.request({
    url: '/platform/logout',
    method: 'post'
  })
}
