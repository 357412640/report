import React, {Component} from 'react'
import {Route, Redirect, withRouter} from 'react-router-dom'
import DocumentTitle from 'react-document-title'
import routesConfig from './config'
import queryString from 'query-string'
import {connect} from 'react-redux'
import saveUser from '@/store/actions/user'
import {getUserInfo} from '@/api/user'
import * as AllComponents from '@/pages'


class CRouter extends Component {
  requireAuth = (permission, component) => {
    if ((permission.is_inactivity && permission.is_inactivity === 1) || (!permission.menu || (permission.menu.length === 0 && (permission.is_inactivity && permission.is_inactivity === 0)))) {
      return <Redirect to={'/401'}/>
    }
    // 当前权限为admin时候，放行所有，否则只能放行key的值相同的组件
    if (permission.is_admin && permission.is_admin === 1 || this.props.location.pathname === '/home') {
      return component
    }
    if (!permission.menu || !permission.menu.includes(component.key)) return <Redirect to={'/404'}/>
    return component
  }
  requireLogin = (component) => {
    // 如果store中有值，则判断权限，否则调用权限接口获取权限并判断
    if (!Object.keys(this.props.auth).length) {
      this.getPermission(component)
    } else {
      return this.requireAuth(this.props.auth, component)
    }
    return component
  }

  getPermission = async component => {
    try {
      const res = await getUserInfo()
      if (res.data.errno === 10000) {
        // 基本信息存入store中, 并返回校验
        this.props.dispatch(saveUser.saveAuth(res.data.data))
        return this.requireAuth(res.data, component)
      } else {
        throw res.data.errmsg
      }
    } catch (e) {
      console.log(e)
      this.props.history.push('/login')
    }
  }

  render() {
    return (
      Object.keys(routesConfig).map(key =>
        routesConfig[key].map(r => {
          const route = r => {
            const Component = AllComponents[r.component];
            return (
              <Route
                key={r.key}
                exact
                path={r.path}
                render={props => {
                  const reg = /\?\S*/g
                  // 匹配?及其以后字符串
                  const queryParams = window.location.hash.match(reg)
                  // 去除?的参数
                  const {params} = props.match
                  Object.keys(params).forEach(key => {
                    params[key] = params[key] && params[key].replace(/\:/, '')
                  })
                  props.match.params = {...params}
                  const merge = {...props, query: queryParams ? queryString.parse(queryParams[0]) : {}}
                  // 重新包装组件
                  const wrappedComponent = (
                    <DocumentTitle title={r.title || r.meta.title} key={r.key}>
                      <Component {...merge} />
                    </DocumentTitle>
                  )
                  return this.requireLogin(wrappedComponent)
                }}
              />
            )
          }
          return r.component ? route(r) : r.subs.map(r => route(r))
        })
      )
    )
  }
}

const mapStateToProps = (state) => {
  return ({
    auth: state.userManage.userData
  })
}

export default connect(mapStateToProps)(withRouter(CRouter))
