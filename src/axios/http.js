import axios from 'axios'
import qs from 'qs'

class HttpRequest {
  // 以下为自己封装的简易调用方式
  get (apiName, params, header) {
    return this.Request(apiName, params, 'get', header)
  }
  send (apiName, params, header) {
    return this.Request(apiName, params, 'post', header)
  }
  Request (apiName, opts = {}, method = 'post', header) {
    const instance = axios.create()
    this.interceptor(instance, apiName)
    if (!apiName) {
      throw new Error('apiName is not defined!')
    }

    if (opts && typeof opts === 'object' && method === 'get') {
      opts = { params: opts }
    }
    if (opts && typeof opts === 'object' && method === 'post') {
      opts = { data: opts }
    }
    const { data, params, ...rest } = opts
    const headers = header ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/x-www-form-urlencoded', charset: 'UTF-8' }
    return instance.request({
      baseURL: '/',
      url: apiName,
      method: method,
      data: data ? (header ? data : qs.stringify(data)) : null,
      headers,
      params,
      ...rest
    })
  }
  interceptor (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      if (res.status === 200) {
        return res.data
      } else {
        return false
      }
    }, error => {
      return Promise.reject(error.response.statusText)
    })
  }
}
export default new HttpRequest()
