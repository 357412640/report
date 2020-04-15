import axios from '@/axios/api.request'
import defaultAxios from 'axios'
// 获取角色信息，包括 角色权限 和 关联用户
export const getRoleDetail = (id) => {
  let params = {
    id
  }
  return axios.request({
    url: '/platform/role/detail',
    params,
    method: 'get'
  })
}

// 删除角色
export const deleteRole = (id) => {
  let data = {
    id
  }
  return axios.request({
    url: '/platform/role/delete',
    data,
    method: 'post'
  })
}

// 获取角色列表
export const getRoleList = (params) => {
  // {name, page, page_size}

  return axios.request({
    url: '/platform/role/list',
    params,
    method: 'get'
  })
}

// 创建角色
export const createRole = (data) => {
  // { name, menu }
  return axios.request({
    url: '/platform/role/create',
    data,
    method: 'post'
  })
}
// 修改角色
export const updataRole = (data) => {
  //{ name, menu, id }
  return axios.request({
    url: '/platform/role/update',
    data,
    method: 'post'
  })
}

// 获取用户列表
export const getUserList = (params) => {
  // { username, email, status, newPage, page_size }
  return axios.request({
    url: '/platform/user/list',
    params,
    method: 'get'
  })
}

// 获取用户详情
export const getUserDetail = (id) => {
  const params = {
    id
  }
  return axios.request({
    url: '/platform/user/detail',
    params,
    method: 'get'
  })
}

// 保存用户 关联角色
export const saveUser = (data, that) => {
  // { id, is_inactivity, role_ids }
  return axios.request({
    url: '/platform/user/save',
    data,
    method: 'post',
    cancelToken: new defaultAxios.CancelToken(function executor(c) { // 设置 cancel token
      that.requireCancel = c
    })
  })
}

// 例子请求
export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}
