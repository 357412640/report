import fetch from '@/axios/http'

export const fetchRoleList = (data) => fetch.get('/platform/role/list', data)
export const fetchRoleCreate = (data) => fetch.send('/platform/role/create', data)
export const fetchRoleUpdate = (data) => fetch.send('/platform/role/update', data)
export const fetchRoleDelete = (data) => fetch.send('/platform/role/delete', data)
export const fetchRoleDetail = (data) => fetch.get('/platform/role/detail', data)