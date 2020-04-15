import Mock from 'mockjs'
import { login, logout, getUserInfo } from './login'
import * as active from './active'
// import bootTv from './boot-tv'
// import * as role from './role'
// import * as app from './application'
import overview from './data-overview'
import launcherData from './launcher-data'

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 1000
})

// 登录相关和获取用户信息
Mock.mock(/\/platform\/user\/login/, login)
Mock.mock(/\/platform\/showTree/, getUserInfo)
Mock.mock(/\/platform\/logout/, logout)

// 激活
// Mock.mock(/\/bi\/activity\/new/, active.activityNew)
// Mock.mock(/\/bi\/activity\/total/, active.activityTotal)
// Mock.mock(/\/bi\/data\/list/, active.getData)
// 开机
// Mock.mock(/\/bi\/bootup\/cnt/, bootTv.bootUp)
// Mock.mock(/\/bi\/bootup\/long/, bootTv.bootUp)
// Mock.mock(/\/bi\/bootup\/time/, bootTv.bootTime)

// 用户管理
// 获取角色列表
// Mock.mock(/\/platform\/role\/list/, role.getRoleList)
// // 获取用户列表
// Mock.mock(/\/platform\/user\/list/, role.getUserList)
// // 获取用户信息
// Mock.mock(/\/platform\/user\/detail/, role.getUserDetail)
// // 保存用户权限
// Mock.mock(/\/platform\/user\/save/, role.saveUser)

// 启动排名
// Mock.mock(/\/bi\/app\/show/, app.startupCount)
// Mock.mock(/\/bi\/data\/get/, app.getData)

// 启动趋势
// Mock.mock(/\/bi\/app\/startup/, app.startupTrend)

// 数据概览
// Mock.mock(/\/bi\/general\/basic/, overview.generalBasic)
// Mock.mock(/\/bi\/active\/general/, overview.activeGeneral)
// Mock.mock(/\/bi\/bootup\/general/, overview.bootupGeneral)
// Mock.mock(/\/bi\/active\/cnt/, overview.activeCnt)
// Mock.mock(/\/bi\/activity\/topmodel/, overview.activityTopModel)
// Mock.mock(/\/bi\/bootup\/cnt/, overview.bootupCnt)
// Mock.mock(/\/bi\/bootup\/long/, overview.bootupLong)


// 活跃用户
// Mock.mock(/\/bi\/active\/cnt/, active.activeUser)

// launcher数据
// 下拉页面点击
// Mock.mock(/\/bi\/desktop\/pageclick/, launcherData.pageClick)
// // 下拉页面访问
// Mock.mock(/\/bi\/desktop\/pageView/, launcherData.pageView)
// // 频道访问概览
// Mock.mock(/\/bi\/desktop\/channelView/, launcherData.channelView)
// // 独立频道访问
// Mock.mock(/\/bi\/desktop\/indChannelView/, launcherData.indChannelView)
// // 资源点击
// Mock.mock(/\/bi\/desktop\/resourceclick/, launcherData.resourceClick)



export default Mock
