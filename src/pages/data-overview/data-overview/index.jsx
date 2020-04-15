import React, {Component} from 'react'
import './index.scss'
import {Icon, Popover, Modal, Spin, Tooltip} from 'antd'
import {MyLineChart} from '_c/echarts'
import {deepCopy} from '@/utils/deepcopy'
import {SvgIcon, BtnTag} from '_c'

import { connect } from "react-redux";
import addTabs from "@/store/actions/tagsnav";
import { withRouter } from "react-router-dom";
import RoutesConfig from "@/router/config";

import {
  generalBasic,
  activeGeneral,
  bootupGeneral,

  activityTopModel,
  bootupCnt,
  bootupLong,

  generalBasicFridge,
  activeGeneralFridge,

  activityTopModelFridge,
  startupModelTv,
  startupModelFridge,

  activeWM,
  activeCntAll
} from '@/api/data-overview'

import {bootMount} from '@/api/boot-tv'

let echarOpertion = {
  title: {
    text: '',
    textStyle: {
      fontSize: '16',
      fontWeight: 'normal',
      color: '#5A6274'
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '30',
    right: '50',
    bottom: '3%',
    top: '70',
    containLabel: true,
  },
  legend: {
    top: '38',
    data: []
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value',
    scale: true
  },
  series: []
}

const charLabel = {
  normal: {
    show: true
  }
}

const list = [
  {key: 'tab1', name: '电视'},
  {key: 'tab2', name: '冰箱'}
]

class dataOverview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabn: 'tab1',
      tab1: 'tabc selected',
      tab2: 'tabc',
      curTab: 'tab1',
      device: '电视',
      generalBasic: {},
      activeWM: {
        'this_week_active': 0,
        'this_week_active_link': 0,
        'last_week_active': 0,
        'last_week_active_link': 0,
        'this_month_active': 0,
        'this_month_active_link': 0,
        'last_month_active': 0,
        'last_month_active_link': 0
      },
      todayData: {
        device: {},
        count: {},
        deviceLoading: true,
        countLoading: true
      },
      sevenData: {
        count: {},
        model: {},
        count_mac: {},
        count_bootup: {},
        time_sum: {},
        time_mac: {},
        boot_count: {},
        startup_model: {},
        countLoading: true,
        modelLoading: true,
        count_Loading: true,
        time_Loading: true,
        boot_Loading: true,
        startup_model_Loading: true
      },
      todayAndYesterday: this.getTodayDate(),
      nowWeek: this.getNowWeek(),
      preWeek: this.getPreWeek(),
      nowMonth: this.getNowMonth(),
      preMonth: this.getPreMonth(),
      // 显示数字
      activeNumber: false,
      openNumber: false,
      sevenActiveNumber: false,
      sevenAddNumber: false,
      sevenOpenNumber: false,
      sevenOpenPersonNumber: false,
      sevenOpenTimeNumber: false,
      sevenOpenPerTimeNumber: false,
      todayCount: 0,
      yesterdayCount: 0,
      todayCountBu: 0,
      yesterdayCountBu: 0,

      saNum: 0,
      saAll: 0,
      saAvg: 0,
      with_compare: 0,
      link_compare: 0,
      atmData: [
        {'name': '', 'count': 0},
        {'name': '', 'count': 0},
        {'name': '', 'count': 0}
      ],

      this_week_active_show: true,
      last_week_active_show: true,
      this_month_active_show: true,
      last_month_active_show: true
    }
  }

  jumpToDetail = (params) => {
    let path = '';
    let paramc = {};
    let tabs = this.state.tabn
    let current = {}
    switch (params) {
      case 1001: // 【昨日】新增电视激活数
        paramc = {curTab: 'new'}
        if (tabs === 'tab1') {
          current = RoutesConfig['menus'][2]['subs'][1]
          path = '/core_data/active';
        } else {
          current = RoutesConfig['menus'][5]['subs'][1]
          path = '/launcher_bx/active_bx';
        }
        break;
      case 1002: // 【昨日】累计电视激活数
        paramc = {curTab: 'total'}
        if (tabs === 'tab1') {
          current = RoutesConfig['menus'][2]['subs'][1]
          path = '/core_data/active';
        } else {
          current = RoutesConfig['menus'][5]['subs'][1]
          path = '/launcher_bx/active_bx';
        }
        break;
      case 2001: // 当周周活
        if (tabs === 'tab1') {
          current = RoutesConfig['menus'][2]['subs'][4]
          path = '/core_data/active_user';
        } else {
          current = RoutesConfig['menus'][5]['subs'][0]
          path = '/launcher_bx/active_device';
        }
        break;
      case 2002: // 上周周活
        if (tabs === 'tab1') {
          current = RoutesConfig['menus'][2]['subs'][4]
          path = '/core_data/active_user';
        } else {
          current = RoutesConfig['menus'][5]['subs'][0]
          path = '/launcher_bx/active_device';
        }
        break;
      case 2003: // 当月月活
        if (tabs === 'tab1') {
          current = RoutesConfig['menus'][2]['subs'][4]
          path = '/core_data/active_user';
        } else {
          current = RoutesConfig['menus'][5]['subs'][0]
          path = '/launcher_bx/active_device';
        }
        break;
      case 2004: // 上月月活
        if (tabs === 'tab1') {
          current = RoutesConfig['menus'][2]['subs'][4]
          path = '/core_data/active_user';
        } else {
          current = RoutesConfig['menus'][5]['subs'][0]
          path = '/launcher_bx/active_device';
        }
        break;
      case 3001: // 【实时】活跃设备
        if (tabs === 'tab1') {
          current = RoutesConfig['menus'][2]['subs'][4]
          path = '/core_data/active_user';
        } else {
          current = RoutesConfig['menus'][5]['subs'][0]
          path = '/launcher_bx/active_device';
        }
        break;
      case 3002: // 【实时】开机次数
        current = RoutesConfig['menus'][2]['subs'][0]
        paramc = {curTab: 'mount'}
        path = '/core_data/boot';
        break;
      case 4001: // 7日趋势 活跃设备
        if (tabs === 'tab1') {
          current = RoutesConfig['menus'][2]['subs'][4]
          path = '/core_data/active_user';
        } else {
          current = RoutesConfig['menus'][5]['subs'][0]
          path = '/launcher_bx/active_device';
        }
        break;
      case 4002: // 7日趋势 按型号新增激活
        paramc = {curTab: 'new'}
        if (tabs === 'tab1') {
          current = RoutesConfig['menus'][2]['subs'][1]
          path = '/core_data/active';
        } else {
          current = RoutesConfig['menus'][5]['subs'][1]
          path = '/launcher_bx/active_bx';
        }
        break;
      case 4003: // 7日趋势 开机设备数
        current = RoutesConfig['menus'][2]['subs'][0]
        paramc = {curTab: 'mount'}
        path = '/core_data/boot';
        break;
      case 4004: // 7日趋势 人均开机次数
        current = RoutesConfig['menus'][2]['subs'][0]
        paramc = {curTab: 'mount'}
        path = '/core_data/boot';
        break;
      case 4005: // 7日趋势 开机时长
        current = RoutesConfig['menus'][2]['subs'][0]
        paramc = {curTab: 'totalTime'}
        path = '/core_data/boot';
        break;
      case 4006: // 7日趋势 人均开机时长
        current = RoutesConfig['menus'][2]['subs'][0]
        paramc = {curTab: 'totalTime'}
        path = '/core_data/boot';
        break;
      case 4007: // 7日趋势 开机次数
        current = RoutesConfig['menus'][2]['subs'][0]
        paramc = {curTab: 'mount'}
        path = '/core_data/boot';
        break;
      case 4008: // 7日趋势 应用启动
        if (tabs === 'tab1') {
          current = RoutesConfig['menus'][3]['subs'][0]
          path = '/application_analysis/application_startup';
        } else {
          current = RoutesConfig['menus'][5]['subs'][2]
          path = '/launcher_bx/app_startup';
        }
        break;
      default:
        break;
    }

    if (path !== '') {
      // let current = {
      //   key: 'sys_user',
      //   path: '/sys/user',
      //   meta: {
      //     title: '用户管理',
      //   },
      //   component: 'userList'
      // }
      this.props.dispatch(addTabs.addNav(current))
      let sdata = {pathname: path, state: paramc}
      this.props.history.push(sdata)
    } else {
      alert('没有详情');
    }
  }

  getTodayDate = () => {
    let today = new Date()
    let yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    let year = today.getFullYear()
    let month = today.getMonth() + 1
    let day = today.getDate()
    let yesYear = yesterday.getFullYear()
    let yesMonth = yesterday.getMonth() + 1
    let yesDay = yesterday.getDate()

    let beforeday = new Date(yesterday.getTime() - 24 * 60 * 60 * 1000)
    let beforYear = beforeday.getFullYear()
    let beforMonth = beforeday.getMonth() + 1
    let beforDay = beforeday.getDate()

    let sevenday = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    let sevenYear = sevenday.getFullYear()
    let sevenMonth = sevenday.getMonth() + 1
    let sevenDay = sevenday.getDate()
    
    return {
      today: year + '-' + month + '-' + day,
      yesterday: yesYear + '-' + yesMonth + '-' + yesDay,
      beforday: beforYear + '-' + beforMonth + '-' + beforDay,
      sevenday: sevenYear + '-' + sevenMonth + '-' + sevenDay,
    }
  }

  // 本月
  getNowMonth = () => {
    let date = new Date()

    let year = date.getFullYear()
    let month = date.getMonth() + 1

    if (month.toString().length === 1) {
      month = '0' + month
    }

    console.log('本月: ' + year + '-' + month)
    return year + '-' + month
  }

  // 上月
  getPreMonth = () => {
    let lastMonthDate = new Date();
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    let year = lastMonthDate.getFullYear();
    let month = lastMonthDate.getMonth() + 1;

    if (month.toString().length === 1) {
      month = '0' + month
    }

    console.log('上月： ' + year + '-' + month)
    
    return year + '-' + month
  }

  // 当前周范围
  getNowWeek = () => {
    let now = new Date()
    
    let weekFirstDay = new Date(now - (now.getDay() - 1) * 86400000)
    let firstMonth = Number(weekFirstDay.getMonth()) + 1
    let weekLastDay = new Date((weekFirstDay / 1000 + 6 * 86400) * 1000)
    let lastMonth = Number(weekLastDay.getMonth()) + 1
    let currentWeek = weekFirstDay.getFullYear() + '-' + firstMonth + '-' + weekFirstDay.getDate() + '~' + weekLastDay.getFullYear() + '-' + lastMonth + '-' + weekLastDay.getDate()

    console.log('current:' + currentWeek)

    return currentWeek
  }

  // 上一周范围
  getPreWeek = () => {
    let now = new Date()

    let weekFirstDay = new Date(now - (now.getDay() - 1 + 7) * 86400000)
    let firstMonth = Number(weekFirstDay.getMonth()) + 1
    let weekLastDay = new Date((weekFirstDay / 1000 + 6 * 86400) * 1000)
    let lastMonth = Number(weekLastDay.getMonth()) + 1
    let preWeek = weekFirstDay.getFullYear() + '-' + firstMonth + '-' + weekFirstDay.getDate() + '~' + weekLastDay.getFullYear() + '-' + lastMonth + '-' + weekLastDay.getDate()

    console.log('pre:' + preWeek)

    return preWeek
  }

  componentDidMount() {
    this.getGeneralBasic()
    this.getActiveGeneral()
    this.getBootupGeneral()
    this.getActiveCnt()
    this.getActivityTopModel()
    this.getBootupCnt()
    this.getBootupLong()
    this.getBootMount()
    this.getStartupModel()

    this.getActiveWMtwa('TV')
    this.getActiveWMlwa('TV')
    this.getActiveWMtma('TV')
    this.getActiveWMlma('TV')
  }

  // generalBasic, activeGeneral, bootupGeneral, activeCnt, activityTopModel, bootupCnt, bootupLong
  // 设备数据
  getGeneralBasic = () => {
    generalBasic().then(res => {
      let data = res.data
      if (data.errno === 10000) {
        this.setState({
          generalBasic: data.data
        }, () => {
          console.log(this.state.generalBasic)
        })
      } else {
        Modal.warning({
          title: '设备数据获取失败',
          content: `原因：${data.errmsg}`
        })
      }
    })
  }

  // 周活月活 本周活跃
  getActiveWMtwa = (device='TV') => {
    this.setState({
      this_week_active_show: true
    })

    activeWM({'device': device, 'flag':'this_week_active'}).then(res => {
      let data = res.data
      if (data.errno === 10000) {
        let activeWM = this.state.activeWM
        activeWM.this_week_active = data.data.count
        activeWM.this_week_active_link = data.data.link

        this.setState({
          activeWM: activeWM,
          this_week_active_show: false
        }, () => {
          console.log(this.state.activeWM)
        })
      } else {
        Modal.warning({
          title: '周活月活获取失败',
          content: `原因：${data.errmsg}`
        })
      }
    })
  }

  // 周活月活 上周活跃
  getActiveWMlwa = (device='TV') => {
    this.setState({
      last_week_active_show: true
    })

    activeWM({'device': device, 'flag':'last_week_active'}).then(res => {      
      let data = res.data
      if (data.errno === 10000) {
        let activeWM = this.state.activeWM
        activeWM.last_week_active = data.data.count
        activeWM.last_week_active_link = data.data.link

        this.setState({
          last_week_active_show: false,
          activeWM: activeWM
        }, () => {
          console.log(this.state.activeWM)
        })
      } else {
        Modal.warning({
          title: '周活月活获取失败',
          content: `原因：${data.errmsg}`
        })
      }
    })
  }

  // 周活月活 本月活跃
  getActiveWMtma = (device='TV') => {
    this.setState({
      this_month_active_show: true
    })

    activeWM({'device': device, 'flag':'this_month_active'}).then(res => {
      let data = res.data
      if (data.errno === 10000) {
        let activeWM = this.state.activeWM
        activeWM.this_month_active = data.data.count
        activeWM.this_month_active_link = data.data.link

        this.setState({
          this_month_active_show: false,
          activeWM: activeWM
        }, () => {
          console.log(this.state.activeWM)
        })
      } else {
        Modal.warning({
          title: '周活月活获取失败',
          content: `原因：${data.errmsg}`
        })
      }
    })
  }

  // 周活月活 上月活跃
  getActiveWMlma = (device='TV') => {
    this.setState({
      last_month_active_show: true
    })

    activeWM({'device': device, 'flag':'last_month_active'}).then(res => {
      let data = res.data
      if (data.errno === 10000) {
        let activeWM = this.state.activeWM
        activeWM.last_month_active = data.data.count
        activeWM.last_month_active_link = data.data.link

        this.setState({
          last_month_active_show: false,
          activeWM: activeWM
        }, () => {
          console.log(this.state.activeWM)
        })
      } else {
        Modal.warning({
          title: '周活月活获取失败',
          content: `原因：${data.errmsg}`
        })
      }
    })
  }

  getGeneralBasicFridge = () => {
    generalBasicFridge().then(res => {
      let data = res.data
      if (data.errno === 10000) {
        this.setState({
          generalBasic: data.data
        }, () => {
          console.log(this.state.generalBasic)
        })
      } else {
        Modal.warning({
          title: '设备数据获取失败',
          content: `原因：${data.errmsg}`
        })
      }
    })
  }

  // 今日实时===
  // 活跃设备
  getActiveGeneral = () => {
    this.setState({
      todayData: {
        device: {},
        count: {},
        deviceLoading: true,
        countLoading: true
      },
      todayCount: 0,
      yesterdayCount: 0
    })

    let option = deepCopy(echarOpertion)
    let todayAndYesterday = this.state.todayAndYesterday
    // option.title.text = '【实时】活跃设备'
    option.legend.data = [this.state.todayAndYesterday.today, this.state.todayAndYesterday.yesterday]
    option.yAxis.name = '今天对比昨天'

    activeGeneral().then(res => {
      let re = res.data
      if (re.errno === 10000) {
        let data = re.data.data
        let xArr = option.xAxis.data = Object.keys(data)
        option.series = Object.keys(todayAndYesterday).map((ele) => {
          let item = {}
          item.name = todayAndYesterday[ele]
          item.type = 'line'
          if (ele === 'today') {
            item.areaStyle = {
              color: 'rgba(115,190,229, 0.4)'
            }
          } else {
            item.lineStyle = {
              normal: {
                type: 'dotted'
              }
            }
            item.color = 'rgba(115,190,229,1)'
          }

          item.data = xArr.map(i => {
            return data[i][ele]
          })

          return item
        })
        console.log(option)
        let state = Object.assign({}, this.state.todayData, {device: option, deviceLoading: false})
        this.setState({
          todayCount: re.data.today_total,
          yesterdayCount: re.data.yesterday_total,
          todayData: state
        })
      } else {
        Modal.warning({
          title: '【实时】活跃设备获取失败',
          content: `原因：${re.errmsg}`
        })
      }
    })
  }

  // 活跃设备冰箱
  getActiveGeneralFridge = () => {
    this.setState({
      todayData: {
        device: {},
        count: {},
        deviceLoading: true,
        countLoading: true
      },
      todayCount: 0,
      yesterdayCount: 0
    })

    let option = deepCopy(echarOpertion)
    let todayAndYesterday = this.state.todayAndYesterday
    // option.title.text = '【实时】活跃设备'
    option.legend.data = [this.state.todayAndYesterday.today, this.state.todayAndYesterday.yesterday]
    option.yAxis.name = '今天对比昨天'

    activeGeneralFridge().then(res => {
      let re = res.data
      if (re.errno === 10000) {
        let data = re.data.data
        let xArr = option.xAxis.data = Object.keys(data)

        option.series = Object.keys(todayAndYesterday).map((ele) => {
          let item = {}
          item.name = todayAndYesterday[ele]
          item.type = 'line'
          if (ele === 'today') {
            item.areaStyle = {
              color: 'rgba(115,190,229, 0.4)'
            }
          } else {
            item.lineStyle = {
              normal: {
                type: 'dotted'
              }
            }
            item.color = 'rgba(115,190,229,1)'
          }
          item.data = xArr.map(i => {
            return data[i][ele]
          })
          return item
        })
        console.log(option)
        let state = Object.assign({}, this.state.todayData, {device: option, deviceLoading: false})
        this.setState({
          todayCount: re.data.today_total,
          yesterdayCount: re.data.yesterday_total,
          todayData: state
        })
      } else {
        Modal.warning({
          title: '【实时】活跃设备获取失败',
          content: `原因：${re.errmsg}`
        })
      }
    })
  }

  // 开机次数
  getBootupGeneral = () => {
    let option = deepCopy(echarOpertion)
    let todayAndYesterday = this.state.todayAndYesterday
    // option.title.text = '【实时】开机次数'
    option.legend.data = [this.state.todayAndYesterday.today, this.state.todayAndYesterday.yesterday]
    option.yAxis.name = '今天对比昨天'

    bootupGeneral().then(res => {
      let todayCountBu = 0
      let yesterdayCountBu = 0
      let re = res.data
      if (re.errno === 10000) {
        // console.log(re.data)
        let data = re.data
        let xArr = option.xAxis.data = Object.keys(data)
        // console.log(xArr)
        option.series = Object.keys(todayAndYesterday).map((ele) => {
          let item = {}
          item.name = todayAndYesterday[ele]
          item.type = 'line'
          if (ele === 'today') {
            item.areaStyle = {
              color: 'rgba(115,190,229, 0.4)'
            }
          } else {
            item.lineStyle = {
              normal: {
                type: 'dotted'
              }
            }
            item.color = 'rgba(115,190,229,1)'
          }
          item.data = xArr.map(i => {
            if (ele === 'today') {
              todayCountBu += data[i][ele]
            } else {
              if (data[i][ele] !== undefined) {
                yesterdayCountBu += data[i][ele]
              }
              console.log(data[i][ele] + ': __ :' + yesterdayCountBu);
            }

            return data[i][ele]
          })
          return item
        })
        // console.log(option)
        let state = Object.assign({}, this.state.todayData, {count: option, countLoading: false})
        this.setState({
          todayCountBu: todayCountBu,
          yesterdayCountBu: yesterdayCountBu,
          todayData: state
        })
      } else {
        Modal.warning({
          title: '设备数据获取失败',
          content: `原因：${re.errmsg}`
        })
      }
    })
  }

  // 7日趋势===
  // 活跃设备
  getActiveCnt = () => {
    let option = deepCopy(echarOpertion)
    // option.title.text = '活跃设备'
    // option.legend.data = []
    option.yAxis.name = '设备/台'
    activeCntAll({device: 'TV'}).then(res => {
      let saNum = 0
      let saAll = 0
      let re = res.data
      if (re.errno === 10000) {
        let data = re.data.trend
        let xArr = option.xAxis.data = Object.keys(data)
        // console.log(xArr)
        let item = {}
        item.name = '活跃设备'
        item.type = 'line'
        item.data = xArr.map(i => {
          saAll += data[i].count
          saNum = data[i].count
          return data[i].count
        })

        option.series.push(item)
        let state = Object.assign({}, this.state.sevenData, {count: option, countLoading: false})
        this.setState({
          saNum: saNum,
          saAll: re.data.total,
          with_compare: re.data.with_compare.toFixed(2),
          link_compare: re.data.link_compare.toFixed(2),
          saAvg: re.data.avg,
          sevenData: state
        })
      } else {
        Modal.warning({
          title: '【实时】开机次数获取失败',
          content: `原因：${re.errmsg}`
        })
      }
    })
  }

  // 活跃设备 冰箱
  getActiveCntFridge = () => {
    let option = deepCopy(echarOpertion)
    // option.title.text = '活跃设备'
    // option.legend.data = []
    option.yAxis.name = '设备/台'
    activeCntAll({device: 'FRIDGE'}).then(res => {
      let saNum = 0
      let saAll = 0
      let re = res.data
      if (re.errno === 10000) {
        let data = re.data.trend
        let xArr = option.xAxis.data = Object.keys(data)
        // console.log(xArr)
        let item = {}
        item.name = '活跃设备'
        item.type = 'line'
        item.data = xArr.map(i => {
          saAll += data[i].count
          saNum = data[i].count
          return data[i].count
        })

        option.series.push(item)
        let state = Object.assign({}, this.state.sevenData, {count: option, countLoading: false})
        this.setState({
          saNum: saNum,
          saAll: re.data.total,
          with_compare: re.data.with_compare.toFixed(2),
          link_compare: re.data.link_compare.toFixed(2),
          saAvg: re.data.avg,
          sevenData: state
        })
      } else {
        Modal.warning({
          title: '【实时】开机次数获取失败',
          content: `原因：${re.errmsg}`
        })
      }
    })
  }

  // 电视型号新增激活
  getActivityTopModel = () => {
    let option = deepCopy(echarOpertion)
    // option.title.text = '电视型号新增激活'
    option.yAxis.name = '设备/台'
    // option.legend.left = '180'
    // option.legend.right = '50'
    // option.legend.top = '95%'
    // option.grid.bottom = '22'
    option.legend.left = '100'
    // option.legend.right = '50'
    option.grid.top = '90'
    // option.legend.bottom = '36'

    activityTopModel().then(res => {
      let atmData = []
      let tmpCount = 0
      let re = res.data
      if (re.errno === 10000) {
        let data = re.data
        let xArr = option.xAxis.data = Object.keys(data)
        let newSeries = []
        Object.keys(xArr.length && data[xArr[0]]).forEach(ele => {
          option.legend.data.push(ele)
          const line = {}
          line.data = xArr.map(item => {
            tmpCount += data[item][ele]

            return data[item][ele]
          })

          let tmpData = {
            'name': ele,
            'count': tmpCount
          }

          atmData.push(tmpData)

          line.name = ele
          line.type = 'line'
          newSeries.push(line)
        })
        option.series = newSeries
        let state = Object.assign({}, this.state.sevenData, {model: option, modelLoading: false})
        this.setState({
          atmData: atmData,
          sevenData: state
        })
      } else {
        Modal.warning({
          title: '【实时】开机次数获取失败',
          content: `原因：${re.errmsg}`
        })
      }
    })
  }

  // 型号新增激活 冰箱
  getActivityTopModelFridge = () => {
    let option = deepCopy(echarOpertion)
    // option.title.text = '按型号新增激活'
    option.yAxis.name = '设备/台'
    // option.legend.left = '180'
    // option.legend.right = '50'
    // option.legend.top = '18'
    // option.legend.top = '95%'
    // option.grid.bottom = '22'
    option.legend.left = '100'
    option.grid.top = '90'

    activityTopModelFridge().then(res => {
      let atmData = []
      let tmpCount = 0
      let re = res.data
      if (re.errno === 10000) {
        let data = re.data
        let xArr = option.xAxis.data = Object.keys(data)
        let newSeries = []
        Object.keys(xArr.length && data[xArr[0]]).forEach(ele => {
          option.legend.data.push(ele)
          const line = {}
          line.data = xArr.map(item => {
            tmpCount += data[item][ele]

            return data[item][ele]
          })

          let tmpData = {
            'name': ele,
            'count': tmpCount
          }

          atmData.push(tmpData)

          line.name = ele
          line.type = 'line'
          newSeries.push(line)
        })
        option.series = newSeries
        let state = Object.assign({}, this.state.sevenData, {model: option, modelLoading: false})
        this.setState({
          atmData: atmData,
          sevenData: state
        })

      } else {
        Modal.warning({
          title: '【实时】开机次数获取失败',
          content: `原因：${re.errmsg}`
        })
      }
    })
  }

  // 开机设备数、人均开机次数
  getBootupCnt = () => {
    let count_mac_option = deepCopy(echarOpertion)
    let count_bootup_option = deepCopy(echarOpertion)
    // count_mac_option.title.text = '开机设备数'
    count_mac_option.yAxis.name = '设备/台'

    // count_bootup_option.title.text = '人均开机次数'
    count_bootup_option.yAxis.name = '次数/次'

    bootupCnt().then(res => {
      let re = res.data
      if (re.errno === 10000) {
        let data = re.data
        let xArr = count_mac_option.xAxis.data = count_bootup_option.xAxis.data = Object.keys(data)
        // console.log(xArr)
        let count_mac = {}

        // count_mac.name = '开机设备数'
        count_mac.data = xArr.map(i => {
          return data[i].count_mac
        })
        // console.log(count_mac)
        count_mac_option.series.push(count_mac)

        let count_bootup = {}
        // count_bootup.name = '人均开机次数'
        count_bootup.type = count_mac.type = 'line'

        count_bootup.data = xArr.map(i => {
          if (data[i].count_bootup === 0) {
            return 0
          }
          return (data[i].count_bootup / data[i].count_mac).toFixed(2)
        })
        console.log(count_bootup)
        count_bootup_option.series.push(count_bootup)
        let state = Object.assign({}, this.state.sevenData, {
          count_mac: count_mac_option,
          count_bootup: count_bootup_option,
          count_Loading: false
        })
        this.setState({
          sevenData: state
        })
      } else {
        Modal.warning({
          title: '开机设备数获取失败',
          content: `原因：${re.errmsg}`
        })
      }
    })
  }

  // 开机时长、人均开机时长
  getBootupLong = () => {
    let time_sum_option = deepCopy(echarOpertion)
    let time_mac_option = deepCopy(echarOpertion)
    // time_sum_option.title.text = '开机时长'
    time_sum_option.yAxis.name = '时长/分钟'

    // time_mac_option.title.text = '人均开机时长'
    time_mac_option.yAxis.name = '时长/分钟'
    bootupLong().then(res => {
      let re = res.data
      if (re.errno === 10000) {
        let data = re.data
        let xArr = time_sum_option.xAxis.data = time_mac_option.xAxis.data = Object.keys(data)
        // console.log(xArr)
        let time_sum = {}

        time_sum.name = '开机时长'
        time_sum.data = xArr.map(i => {
          return data[i].time_sum
        })
        // console.log(count_mac)
        time_sum_option.series.push(time_sum)

        let time_mac = {}
        time_mac.name = '人均开机时长'
        time_mac.type = time_sum.type = 'line'

        time_mac.data = xArr.map(i => {
          return data[i].time_mac
        })
        // console.log(option)
        time_mac_option.series.push(time_mac)
        let state = Object.assign({}, this.state.sevenData, {
          time_sum: time_sum_option,
          time_mac: time_mac_option,
          time_Loading: false
        })
        this.setState({
          sevenData: state
        })
      } else {
        Modal.warning({
          title: '【实时】开机次数获取失败',
          content: `原因：${re.errmsg}`
        })
      }
    })
  }

  // 开机次数
  getBootMount = () => {
    let option = deepCopy(echarOpertion)
    // option.title.text = '开机次数'
    // option.legend.data = []
    option.yAxis.name = '次数/次'
    bootMount().then(res => {
      if (res.errno === 10000) {
        let data = res.data
        let xArr = option.xAxis.data = Object.keys(data)
        // console.log(xArr)
        let item = {}
        item.name = '开机数'
        item.type = 'line'
        item.data = xArr.map(i => {
          return data[i].count_bootup
        })

        option.series.push(item)
        let state = Object.assign({}, this.state.sevenData, {boot_count: option, boot_Loading: false})
        this.setState({
          sevenData: state
        })
      } else {
        Modal.warning({
          title: '开机次数获取失败',
          content: `原因：${res.errmsg}`
        })
      }
    })
  }

  // 应用启动
  getStartupModel = () => {
    let option = deepCopy(echarOpertion)
    // option.title.text = '应用启动'
    option.yAxis.name = '次数/次'
    option.legend.left = '180'
    option.legend.right = '50'
    option.legend.top = '18'
    startupModelTv().then(res => {
      let re = res.data
      if (re.errno === 10000) {
        let data = re.data.data
        let showApp = re.data.showapp
        let xArr = option.xAxis.data = Object.keys(data)
        let newSeries = []
        showApp.forEach(ele => {
          option.legend.data.push(ele)
          const line = {}
          line.data = xArr.map(item => {
            return data[item][ele] = data[item][ele].count
          })
          line.name = ele
          line.type = 'line'
          newSeries.push(line)
        })
        option.series = newSeries
        console.log(option)
        let state = Object.assign({}, this.state.sevenData, {startup_model: option, startup_model_Loading: false})
        this.setState({
          sevenData: state
        })

      } else {
        Modal.warning({
          title: '应用启动获取失败',
          content: `原因：${re.errmsg}`
        })
      }
    })
  }

  // 应用启动 冰箱
  getStartupModelFridge = () => {
    let option = deepCopy(echarOpertion)
    // option.title.text = '应用启动'
    option.yAxis.name = '次数/次'
    option.legend.left = '180'
    option.legend.right = '50'
    option.legend.top = '18'
    startupModelFridge().then(res => {
      let re = res.data
      if (re.errno === 10000) {
        let data = re.data.data
        let showApp = re.data.showapp
        let xArr = option.xAxis.data = Object.keys(data)
        let newSeries = []
        showApp.forEach(ele => {
          option.legend.data.push(ele)
          const line = {}
          line.data = xArr.map(item => {
            if (data[item][ele]) {
              return data[item][ele] = data[item][ele].count
            } else {
              return data[item][ele] = 0
            }
          })
          line.name = ele
          line.type = 'line'
          newSeries.push(line)
        })
        option.series = newSeries
        console.log(option)
        let state = Object.assign({}, this.state.sevenData, {startup_model: option, startup_model_Loading: false})
        this.setState({
          sevenData: state
        })

      } else {
        Modal.warning({
          title: '应用启动获取失败',
          content: `原因：${re.errmsg}`
        })
      }
    })
  }

  // 显示或隐藏图标数字
  showNumber(type, flag) {
    let chartData
    let series
    if (type === 'activeNumber') {
      chartData = deepCopy(this.state.todayData.device)
      series = chartData.series
      if (flag) { // 显示
        chartData.series = series.map(item => {
          item.label = charLabel
          return item
        })
        this.setState({
          todayData: Object.assign({}, this.state.todayData, {device: chartData}),
          activeNumber: true
        })
      } else { // 隐藏
        chartData.series = series.map(item => {
          delete item.label
          return item
        })
        this.setState({
          todayData: Object.assign({}, this.state.todayData, {device: chartData}),
          activeNumber: false
        })
      }
    } else if (type === 'openNumber') {
      chartData = deepCopy(this.state.todayData.count)
      series = chartData.series
      if (flag) { // 显示
        chartData.series = series.map(item => {
          item.label = charLabel
          return item
        })
        this.setState({
          todayData: Object.assign({}, this.state.todayData, {count: chartData}),
          openNumber: true
        })
      } else { // 隐藏
        chartData.series = series.map(item => {
          delete item.label
          return item
        })
        this.setState({
          todayData: Object.assign({}, this.state.todayData, {count: chartData}),
          openNumber: false
        })
      }
    } else if (type === 'sevenActiveNumber') {
      chartData = deepCopy(this.state.sevenData.count)
      series = chartData.series
      if (flag) { // 显示
        chartData.series = series.map(item => {
          item.label = charLabel
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {count: chartData}),
          sevenActiveNumber: true
        })
      } else { // 隐藏
        chartData.series = series.map(item => {
          delete item.label
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {count: chartData}),
          sevenActiveNumber: false
        })
      }
    } else if (type === 'sevenAddNumber') {
      chartData = deepCopy(this.state.sevenData.model)
      series = chartData.series
      if (flag) { // 显示
        chartData.series = series.map(item => {
          item.label = charLabel
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {model: chartData}),
          sevenAddNumber: true
        })
      } else { // 隐藏
        chartData.series = series.map(item => {
          delete item.label
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {model: chartData}),
          sevenAddNumber: false
        })
      }
    } else if (type === 'sevenOpenNumber') {
      chartData = deepCopy(this.state.sevenData.count_mac)
      series = chartData.series
      if (flag) { // 显示
        chartData.series = series.map(item => {
          item.label = charLabel
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {count_mac: chartData}),
          sevenOpenNumber: true
        })
      } else { // 隐藏
        chartData.series = series.map(item => {
          delete item.label
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {count_mac: chartData}),
          sevenOpenNumber: false
        })
      }
    } else if (type === 'sevenOpenPersonNumber') {
      chartData = deepCopy(this.state.sevenData.count_bootup)
      series = chartData.series
      if (flag) { // 显示
        chartData.series = series.map(item => {
          item.label = charLabel
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {count_bootup: chartData}),
          sevenOpenPersonNumber: true
        })
      } else { // 隐藏
        chartData.series = series.map(item => {
          delete item.label
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {count_bootup: chartData}),
          sevenOpenPersonNumber: false
        })
      }
    } else if (type === 'sevenOpenTimeNumber') {
      chartData = deepCopy(this.state.sevenData.time_sum)
      series = chartData.series
      if (flag) { // 显示
        chartData.series = series.map(item => {
          item.label = charLabel
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {time_sum: chartData}),
          sevenOpenTimeNumber: true
        })
      } else { // 隐藏
        chartData.series = series.map(item => {
          delete item.label
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {time_sum: chartData}),
          sevenOpenTimeNumber: false
        })
      }
    } else if (type === 'sevenOpenPerTimeNumber') {
      chartData = deepCopy(this.state.sevenData.time_mac)
      series = chartData.series
      if (flag) { // 显示
        chartData.series = series.map(item => {
          item.label = charLabel
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {time_mac: chartData}),
          sevenOpenPerTimeNumber: true
        })
      } else { // 隐藏
        chartData.series = series.map(item => {
          delete item.label
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {time_mac: chartData}),
          sevenOpenPerTimeNumber: false
        })
      }
    } else if (type === 'sevenCountBootup') {
      chartData = deepCopy(this.state.sevenData.boot_count)
      series = chartData.series
      if (flag) { // 显示
        chartData.series = series.map(item => {
          item.label = charLabel
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {boot_count: chartData}),
          sevenCountBootup: true
        })
      } else { // 隐藏
        chartData.series = series.map(item => {
          delete item.label
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {boot_count: chartData}),
          sevenCountBootup: false
        })
      }
    } else if (type === 'sevenStartupModel') {
      chartData = deepCopy(this.state.sevenData.startup_model)
      series = chartData.series
      if (flag) { // 显示
        chartData.series = series.map(item => {
          item.label = charLabel
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {startup_model: chartData}),
          sevenStartupModel: true
        })
      } else { // 隐藏
        chartData.series = series.map(item => {
          delete item.label
          return item
        })
        this.setState({
          sevenData: Object.assign({}, this.state.sevenData, {startup_model: chartData}),
          sevenStartupModel: false
        })
      }
    }
  }

  render() {
    const {
      generalBasic,
      todayAndYesterday,
      todayData,
      sevenData,
      activeNumber,
      openNumber,
      sevenActiveNumber,
      sevenAddNumber,
      sevenOpenNumber,
      sevenOpenPersonNumber,
      sevenOpenTimeNumber,
      sevenOpenPerTimeNumber,
      sevenCountBootup,
      sevenStartupModel,
    } = this.state

    return (
      <div className="main-page-box overview-box common-title">
        <div className='tabs'>
          {/* <span className={this.state.tab1} onClick={this.selTab1}>电视</span>
          <span className={this.state.tab2} onClick={this.selTab2}>冰箱</span> */}
          <BtnTag list={list} func={this.renderBtn} cur={this.state.tabn}/>
        </div>

        <header className="header-box">
          <div className="title-box">
            <span className="title">数据概览</span>
          </div>
        </header>

        {/* 设备数据 */}
        <div>
          <div className='m15'>
            <span className='icon-box'>
              设备数据
              <Popover placement="rightTop" title='数据指标定义：' content={this.modelChange('model')}
                       overlayClassName='help-popover'>
                <Icon type="question-circle" theme="filled" className='help-icon'/>
              </Popover>
            </span>
          </div>
          <div className='flex-box'>
              <div key='lab1' className='flex-item'>
                <p title='点击跳转详情' className='model-title' onClick={() => this.jumpToDetail(1001)}>【昨日】新增{this.state.device}激活数</p>
                <div className='model-content'>
                  <p className='model-date'>{todayAndYesterday.yesterday}</p>
                  <div className='model-left'>
                    <p className='model-count'>{generalBasic['activity_new']}
                    <span className='model-unit'>(台)</span>
                    </p>
                  </div>
                  <div className='model-right'>
                    {generalBasic['activity_new_link'] < 0 ?
                      <Tooltip title={"对比" + todayAndYesterday.beforday + "下降" + Math.abs(generalBasic['activity_new_link']) + "%"}>
                        <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-down'>{generalBasic['activity_new_link']}%</span></p>
                      </Tooltip>
                    :
                      <Tooltip title={"对比" + todayAndYesterday.beforday + "上升" + generalBasic['activity_new_link'] + "%"}>
                        <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-up'>+{generalBasic['activity_new_link']}%</span></p>
                      </Tooltip>
                    }
                  </div>
                </div>
              </div>
              <div key='lab2' className='flex-item'>
                <p title='点击跳转详情' className='model-title' onClick={() => this.jumpToDetail(1002)}>【昨日】累计{this.state.device}激活数</p>
                <div className='model-content'>
                  <p className='model-date'>{todayAndYesterday.yesterday}</p>
                  <div className='model-left'>
                    <p className='model-count'>
                      {generalBasic['activity_all']}
                      <span className='model-unit'>(台)</span>
                    </p>
                  </div>
                  <div className='model-right'>
                    {generalBasic['activity_all_link'] < 0 ?
                      <Tooltip title={"对比" + todayAndYesterday.beforday + "下降" + Math.abs(generalBasic['activity_all_link']) + "%"}>
                        <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-down'>{generalBasic['activity_all_link']}%</span></p>
                      </Tooltip>
                    :
                      <Tooltip title={"对比" + todayAndYesterday.beforday + "上升" + generalBasic['activity_all_link'] + "%"}>
                        <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-up'>+{generalBasic['activity_all_link']}%</span></p>
                      </Tooltip>
                    }
                  </div>
                </div>
              </div>
              <div key='lab3' className='flex-item'>
                <p title='' className='model-title'>【昨日】累计联网半小时{this.state.device}数</p>
                <div className='model-content'>
                  <p className='model-date'>{todayAndYesterday.yesterday}</p>
                  <div className='model-left'>
                    <p className='model-count'>
                      {generalBasic['activity_all_half']}
                      <span className='model-unit'>(台)</span>
                    </p>
                  </div>
                  <div className='model-right'>
                    {generalBasic['activity_all_half_link'] < 0 ?
                      <Tooltip title={"对比" + todayAndYesterday.beforday + "下降" + Math.abs(generalBasic['activity_all_half_link']) + "%"}>
                        <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-down'>{generalBasic['activity_all_half_link']}%</span></p>
                      </Tooltip>
                    :
                      <Tooltip title={"对比" + todayAndYesterday.beforday + "上升" + generalBasic['activity_all_half_link'] + "%"}>
                        <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-up'>+{generalBasic['activity_all_half_link']}%</span></p>
                      </Tooltip>
                    }
                  </div>
                </div>
              </div>
              <div key='lab4' className='flex-item'>
                <p title='' className='model-title'>【昨日】累计报备{this.state.device}数</p>
                <div className='model-content'>
                  <p className='model-date'>{todayAndYesterday.yesterday}</p>
                  <div className='model-left'>
                    <p className='model-count'>
                      {generalBasic['device_record']}
                      <span className='model-unit'>(台)</span>
                    </p>
                  </div>
                  <div className='model-right'>
                    {generalBasic['device_record_link'] < 0 ?
                      <Tooltip title={"对比" + todayAndYesterday.beforday + "下降" + Math.abs(generalBasic['device_record_link']) + "%"}>
                        <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-down'>{generalBasic['device_record_link']}%</span></p>
                      </Tooltip>
                    :
                      <Tooltip title={"对比" + todayAndYesterday.beforday + "上升" + generalBasic['device_record_link'] + "%"}>
                        <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-up'>+{generalBasic['device_record_link']}%</span></p>
                      </Tooltip>
                    }
                  </div>
                </div>
              </div>
          </div>

          <div className='flex-box'>
              <div key='lab1' className='flex-item'>
              <Spin spinning={this.state.this_week_active_show}>
                <p title='点击跳转详情' className='model-title' onClick={() => this.jumpToDetail(2001)}>当周周活</p>
                <div className='model-content'>
                  <p className='model-date'>{this.state.nowWeek}</p>
                  <div className='model-left'>
                    <p className='model-count'>
                      {this.state.activeWM['this_week_active']}
                      <span className='model-unit'>(台)</span>
                    </p>
                  </div>
                  <div className='model-right'>
                    {this.state.activeWM['this_week_active_link'] < 0 ?
                      <Tooltip title={"对比上周下降" + Math.abs(this.state.activeWM['this_week_active_link']) + "%"}>
                        <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-down'>{this.state.activeWM['this_week_active_link']}%</span></p>
                      </Tooltip>
                    :
                      <Tooltip title={"对比上周上升" + this.state.activeWM['this_week_active_link'] + "%"}>
                        <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-up'>+{this.state.activeWM['this_week_active_link']}%</span></p>
                      </Tooltip>
                    }
                  </div>
                </div>
              </Spin>
              </div>

              <div key='lab2' className='flex-item'>
                <Spin spinning={this.state.last_week_active_show}>
                  <p title='点击跳转详情' className='model-title' onClick={() => this.jumpToDetail(2002)}>上周周活</p>
                  <div className='model-content'>
                    <p className='model-date'>{this.state.preWeek}</p>
                    <div className='model-left'>
                      <p className='model-count'>
                        {this.state.activeWM['last_week_active']}
                        <span className='model-unit'>(台)</span>
                      </p>
                    </div>
                    <div className='model-right'>
                      {this.state.activeWM['last_week_active_link'] < 0 ?
                        <Tooltip title={"对比上上周下降" + Math.abs(this.state.activeWM['last_week_active_link']) + "%"}>
                          <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-down'>{this.state.activeWM['last_week_active_link']}%</span></p>
                        </Tooltip>
                      :
                        <Tooltip title={"对比上上周上升" + this.state.activeWM['last_week_active_link'] + "%"}>
                          <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-up'>+{this.state.activeWM['last_week_active_link']}%</span></p>
                        </Tooltip>
                      }
                    </div>
                  </div>
                </Spin>
              </div>
              <div key='lab3' className='flex-item'>
                <Spin spinning={this.state.this_month_active_show}>
                  <p title='点击跳转详情' className='model-title' onClick={() => this.jumpToDetail(2003)}>当月月活</p>
                  <div className='model-content'>
                    <p className='model-date'>{this.state.nowMonth}</p>
                    <div className='model-left'>  
                      <p className='model-count'>
                        {this.state.activeWM['this_month_active']}
                        <span className='model-unit'>(台)</span>
                      </p>
                    </div>
                    <div className='model-right'>
                      {this.state.activeWM['this_month_active_link'] < 0 ?
                        <Tooltip title={"对比上月下降" + Math.abs(this.state.activeWM['this_month_active_link']) + "%"}>
                          <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-down'>{this.state.activeWM['this_month_active_link']}%</span></p>
                        </Tooltip>
                      :
                        <Tooltip title={"对比上月上升" + this.state.activeWM['this_month_active_link'] + "%"}>
                          <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-up'>+{this.state.activeWM['this_month_active_link']}%</span></p>
                        </Tooltip>
                      }
                    </div>
                  </div>
                </Spin>
              </div>
              <div key='lab4' className='flex-item'>
                <Spin spinning={this.state.last_month_active_show}>
                  <p title='点击跳转详情' className='model-title' onClick={() => this.jumpToDetail(2004)}>上月月活</p>
                  <div className='model-content'>
                    <p className='model-date'>{this.state.preMonth}</p>
                    <div className='model-left'>
                      <p className='model-count'>{this.state.activeWM['last_month_active']}<span className='model-unit'>(台)</span>
                      </p>
                    </div>
                    <div className='model-right'>
                      {this.state.activeWM['last_month_active_link'] < 0 ?
                        <Tooltip title={"对比上上月下降" + Math.abs(this.state.activeWM['last_month_active_link']) + "%"}>
                          <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-down'>{this.state.activeWM['last_month_active_link']}%</span></p>
                        </Tooltip>
                      :
                        <Tooltip title={"对比上上月上升" + this.state.activeWM['last_month_active_link'] + "%"}>
                          <p className='model-link'><span className='model-hbw'>环比</span> <span className='model-up'>+{this.state.activeWM['last_month_active_link']}%</span></p>
                        </Tooltip>
                      }
                    </div>
                  </div>
                </Spin>
              </div>
          </div>
        </div>

        {/* 今日实时 */}
        <div>
          <div className='m15'>
            <span className='icon-box'>
              今日实时
              <Popover placement="rightTop" title='数据指标定义：' content={this.modelChange('today')}
                       overlayClassName='help-popover'>
                <Icon type="question-circle" theme="filled" className='help-icon'/>
              </Popover>
            </span>
          </div>

          <div className='today-now'>
            {/* 活跃设备 */}
            <div className='child-box'>
              <div className="icon-btn-box">
                {!activeNumber ?
                  <Popover
                    content="显示数据"
                    trigger="hover">
                    <span style={{width: '30px', height: '30px', display:'inline-block', marginLeft: '5px'}}>
                      <SvgIcon iconClass="number" color="#999" propClass="number-icon common-icon-btn"
                               click={() => this.showNumber('activeNumber', true)}/>
                    </span>
                  </Popover> :
                  <Popover
                    content="隐藏数据"
                    trigger="hover"
                    onClick={() => this.showNumber('activeNumber', false)}>
                    <Icon type="stop" className='common-icon-btn'/>
                  </Popover>}
              </div>
              <div className='model-content-today-now'>
                <div title='点击跳转详情' className='model-title' onClick={() => this.jumpToDetail(3001)}>【实时】活跃设备</div>
                <p style={{paddingLeft: '40px', fontSize: '12px', paddingBottom: '5px'}}>合计（台）：</p>
                <div>
                  <div className='model-left-today-now'>
                    <p className='model-date'>今天：{this.state.todayCount}</p>
                  </div>
                  <div className='model-right-today-now'>
                    <p className='model-date'>昨天：{this.state.yesterdayCount}</p>
                  </div>
                </div>
              </div>
              <MyLineChart params={{type: 'line', data: todayData.device}} loading={todayData.deviceLoading}/>
            </div>

            {/* 开机次数 */}
            { this.state.tabn == 'tab1' ?
            <div className='child-box'>
              <div className="icon-btn-box">
                {!openNumber ?
                  <Popover
                    content="显示数据"
                    trigger="hover">
                    <span style={{width: '30px', height: '30px', display:'inline-block', marginLeft: '5px'}}>
                      <SvgIcon iconClass="number" color="#999" propClass="number-icon common-icon-btn"
                               click={() => this.showNumber('openNumber', true)}/>
                    </span>
                  </Popover> :
                  <Popover
                    content="隐藏数据"
                    trigger="hover"
                    onClick={() => this.showNumber('openNumber', false)}>
                    <Icon type="stop" className='common-icon-btn'/>
                  </Popover>}
              </div>
              <div className='model-content-today-now'>
                <div title='点击跳转详情' className='model-title' onClick={() => this.jumpToDetail(3002)}>【实时】开机次数</div>
                <p style={{paddingLeft: '40px', fontSize: '12px', paddingBottom: '5px'}}>合计（台）：</p>
                <div className='model-left-today-now'>
                  <p className='model-link'>今天：{this.state.todayCountBu}</p>
                </div>
                <div className='model-right-today-now'>
                  <p className='model-link'>昨天：{this.state.yesterdayCountBu}</p>
                </div>
              </div>
              <MyLineChart params={{type: 'line', data: todayData.count}} loading={todayData.countLoading}/>
            </div>
            : <div className='child-box'></div>
            }
          </div>

        </div>

        {/* 7日趋势（不含当日） */}
        <div>
          <div className='m15'>
            <span className='icon-box'>
              7日趋势<span style={{color: '#bbb'}}>&nbsp;&nbsp;(不含当日)</span>
              <Popover placement="rightTop" title='数据指标定义：' content={this.modelChange('sevenDay')}
                       overlayClassName='help-popover'>
                <Icon type="question-circle" theme="filled" className='help-icon'/>
              </Popover>
            </span>
          </div>
        </div>
        <div className='seven-today'>
          {/* 活跃设备 */}
          <div className='child-box'>
            <div className="icon-btn-box">
              {!sevenActiveNumber ?
                <Popover
                  content="显示数据"
                  trigger="hover">
                  <span style={{width: '30px', height: '30px', display:'inline-block', marginLeft: '5px'}}>
                    <SvgIcon iconClass="number" color="#999" propClass="number-icon common-icon-btn"
                             click={() => this.showNumber('sevenActiveNumber', true)}/>
                  </span>
                </Popover> :
                <Popover
                  content="隐藏数据"
                  trigger="hover"
                  onClick={() => this.showNumber('sevenActiveNumber', false)}>
                  <Icon type="stop" className='common-icon-btn'/>
                </Popover>}
            </div>
            <div className='model-content-today-now'>
              <div title='点击跳转详情' className='model-title' onClick={() => this.jumpToDetail(4001)}>活跃设备</div>

              <div className='model-left-sa'>
                <p className='model-date'>{todayAndYesterday.yesterday}</p>
                <p className='model-count-sa'>{this.state.saNum}<span className='model-unit'>(台)</span></p>
              </div>

              <div className='model-center-sa'>
                <p className='model-link' style={{paddingBottom: '6px'}}>
                  <span className='model-hbw'>环比</span>
                  {this.state.with_compare < 0 ?
                  <Tooltip title={"对比" + todayAndYesterday.beforday + "下降" + Math.abs(this.state.with_compare) + "%"}>
                  <span className='model-down-today-now'>
                    {/* <div className="container-down"></div> */}
                    -{Math.abs(this.state.with_compare)}%
                  </span>
                  </Tooltip>
                  :
                  <Tooltip title={"对比" + todayAndYesterday.beforday + "上升" + Math.abs(this.state.with_compare) + "%"}>
                  <span className='model-up-today-now'>
                  {/* <div className="container-up"></div> */}
                    +{this.state.with_compare}%
                  </span>
                  </Tooltip>
                  }
                </p>
                <p className='model-link'><span className='model-hbw'>同比</span>
                  {this.state.link_compare < 0 ?
                  <Tooltip title={"对比" + todayAndYesterday.sevenday + "下降" + Math.abs(this.state.link_compare) + "%"}>
                  <span className='model-down-today-now'>
                    {/* <div className="container-down"></div> */}
                    -{Math.abs(this.state.link_compare)}%
                  </span>
                  </Tooltip>
                  :
                  <Tooltip title={"对比" + todayAndYesterday.sevenday + "上升" + Math.abs(this.state.link_compare) + "%"}>
                  <span className='model-up-today-now'>
                  {/* <div className="container-up"></div> */}
                    +{this.state.link_compare}%
                  </span>
                  </Tooltip>
                  }
                </p>
              </div>

              <div className='model-right-sa'>
                <p className='model-link' style={{paddingBottom: '6px'}}>
                  <span className='model-hbw'>合计</span>
                  <span className='model-word-m'>{this.state.saAll}</span>
                  <span className='model-unit' style={{float: 'right', paddingTop: '6px', paddingRight: '24px'}}>(台)</span>
                </p>
                <p className='model-link'>
                  <span className='model-hbw'>均值</span>
                  <span className='model-word-m'>{this.state.saAvg}</span>
                  <span className='model-unit' style={{float: 'right', paddingTop: '6px', paddingRight: '24px'}}>(台)</span>
                </p>
              </div>

            </div>
            <MyLineChart params={{type: 'line', data: sevenData.count}} loading={sevenData.countLoading}/>
          </div>

          {/* 电视型号新增激活 */}
          <div className='child-box'>
            <div className="icon-btn-box">
              {!sevenAddNumber ?
                <Popover
                  content="显示数据"
                  trigger="hover">
                  <span style={{width: '30px', height: '30px', display:'inline-block', marginLeft: '5px'}}>
                    <SvgIcon iconClass="number" color="#999" propClass="number-icon common-icon-btn"
                             click={() => this.showNumber('sevenAddNumber', true)}/>
                  </span>
                </Popover> :
                <Popover
                  content="隐藏数据"
                  trigger="hover"
                  onClick={() => this.showNumber('sevenAddNumber', false)}>
                  <Icon type="stop" className='common-icon-btn'/>
                </Popover>}
            </div>
            <div className='model-content-gtv'>
              <div title='点击跳转详情' className='model-title' onClick={() => this.jumpToDetail(4002)}>{this.state.device}型号新增激活</div>
              <div className='model-content-g'>
                <div className='model-count'>7日合计</div>
                <div className='model-g'>
                  <p className='model-weight-blue'></p>{this.state.atmData[0]['name']}
                  <p className='model-count'><span className='model-word-b'>{this.state.atmData[0]['count']}</span> <span className='model-unit'>(台)</span></p>
                </div>
                {this.state.atmData[1] ?
                  <div className='model-g'>
                    <p className='model-weight-green'></p>{this.state.atmData[1]['name']}
                    <p className='model-count'><span className='model-word-b'>{this.state.atmData[1]['count']}</span> <span className='model-unit'>(台)</span></p>
                  </div>
                :
                  null
                }
                {this.state.atmData[2] ?
                  <div className='model-g'>
                    <p className='model-weight-yellow'></p>{this.state.atmData[2]['name']}
                    <p className='model-count'><span className='model-word-b'>{this.state.atmData[2]['count']}</span> <span className='model-unit'>(台)</span></p>
                  </div>
                :
                  null
                }
              </div>
            </div>
            <MyLineChart params={{type: 'line', data: sevenData.model}} loading={sevenData.modelLoading}/>
          </div>

          {/* 开机设备数 */}
          { this.state.tabn === 'tab1' ?
          <div className='child-box'>
            <div className="icon-btn-box">
              {!sevenOpenNumber ?
                <Popover
                  content="显示数据"
                  trigger="hover">
                  <span style={{width: '30px', height: '30px', display:'inline-block', marginLeft: '5px'}}>
                    <SvgIcon iconClass="number" color="#999" propClass="number-icon common-icon-btn"
                             click={() => this.showNumber('sevenOpenNumber', true)}/>
                  </span>
                </Popover> :
                <Popover
                  content="隐藏数据"
                  trigger="hover"
                  onClick={() => this.showNumber('sevenOpenNumber', false)}>
                  <Icon type="stop" className='common-icon-btn'/>
                </Popover>}
            </div>
            <div title='点击跳转详情' className='model-title-s' onClick={() => this.jumpToDetail(4003)}>开机设备数</div>
            <MyLineChart params={{type: 'line', data: sevenData.count_mac}} loading={sevenData.count_Loading}/>
          </div> : null }

          {/* 人均开机次数 */}
          { this.state.tabn === 'tab1' ?
          <div className='child-box'>
            <div className="icon-btn-box">
              {!sevenOpenPersonNumber ?
                <Popover
                  content="显示数据"
                  trigger="hover">
                  <span style={{width: '30px', height: '30px', display:'inline-block', marginLeft: '5px'}}>
                    <SvgIcon iconClass="number" color="#999" propClass="number-icon common-icon-btn"
                             click={() => this.showNumber('sevenOpenPersonNumber', true)}/>
                  </span>
                </Popover> :
                <Popover
                  content="隐藏数据"
                  trigger="hover"
                  onClick={() => this.showNumber('sevenOpenPersonNumber', false)}>
                  <Icon type="stop" className='common-icon-btn'/>
                </Popover>}
            </div>
            <div title='点击跳转详情' className='model-title-s' onClick={() => this.jumpToDetail(4004)}>人均开机次数</div>
            <MyLineChart params={{type: 'line', data: sevenData.count_bootup}} loading={sevenData.count_Loading}/>
          </div> : null }

          {/* 开机时长 */}
          { this.state.tabn === 'tab1' ?
          <div className='child-box'>
            <div className="icon-btn-box">
              {!sevenOpenTimeNumber ?
                <Popover
                  content="显示数据"
                  trigger="hover">
                  <span style={{width: '30px', height: '30px', display:'inline-block', marginLeft: '5px'}}>
                    <SvgIcon iconClass="number" color="#999" propClass="number-icon common-icon-btn"
                             click={() => this.showNumber('sevenOpenTimeNumber', true)}/>
                  </span>
                </Popover> :
                <Popover
                  content="隐藏数据"
                  trigger="hover"
                  onClick={() => this.showNumber('sevenOpenTimeNumber', false)}>
                  <Icon type="stop" className='common-icon-btn'/>
                </Popover>}
            </div>
            <div title='点击跳转详情' className='model-title-s' onClick={() => this.jumpToDetail(4005)}>开机时长</div>
            <MyLineChart params={{type: 'line', data: sevenData.time_sum}} loading={sevenData.time_Loading}/>
          </div> : null }

          {/* 人均开机时长 */}
          { this.state.tabn === 'tab1' ?
          <div className='child-box'>
            <div className="icon-btn-box">
              {!sevenOpenPerTimeNumber ?
                <Popover
                  content="显示数据"
                  trigger="hover">
                  <span style={{width: '30px', height: '30px', display:'inline-block', marginLeft: '5px'}}>
                    <SvgIcon iconClass="number" color="#999" propClass="number-icon common-icon-btn"
                             click={() => this.showNumber('sevenOpenPerTimeNumber', true)}/>
                  </span>
                </Popover> :
                <Popover
                  content="隐藏数据"
                  trigger="hover"
                  onClick={() => this.showNumber('sevenOpenPerTimeNumber', false)}>
                  <Icon type="stop" className='common-icon-btn'/>
                </Popover>}
            </div>
            <div title='点击跳转详情' className='model-title-s' onClick={() => this.jumpToDetail(4006)}>人均开机时长</div>
            <MyLineChart params={{type: 'line', data: sevenData.time_mac}} loading={sevenData.time_Loading}/>
          </div> : null }

          {/* 开机次数 */}
          { this.state.tabn === 'tab1' ?
          <div className='child-box'>
            <div className="icon-btn-box">
              {!sevenCountBootup ?
                <Popover
                  content="显示数据"
                  trigger="hover">
                  <span style={{width: '30px', height: '30px', display:'inline-block', marginLeft: '5px'}}>
                    <SvgIcon iconClass="number" color="#999" propClass="number-icon common-icon-btn"
                             click={() => this.showNumber('sevenCountBootup', true)}/>
                  </span>
                </Popover> :
                <Popover
                  content="隐藏数据"
                  trigger="hover"
                  onClick={() => this.showNumber('sevenCountBootup', false)}>
                  <Icon type="stop" className='common-icon-btn'/>
                </Popover>}
            </div>
            <div title='点击跳转详情' className='model-title-s' onClick={() => this.jumpToDetail(4007)}>开机次数</div>
            <MyLineChart params={{type: 'line', data: sevenData.boot_count}} loading={sevenData.boot_Loading}/>
          </div> : null }

          {/* 应用启动 */}
          <div className='child-box'>
            <div className="icon-btn-box">
              {!sevenStartupModel ?
                <Popover
                  content="显示数据"
                  trigger="hover">
                  <span style={{width: '30px', height: '30px', display:'inline-block', marginLeft: '5px'}}>
                    <SvgIcon iconClass="number" color="#999" propClass="number-icon common-icon-btn"
                             click={() => this.showNumber('sevenStartupModel', true)}/>
                  </span>
                </Popover> :
                <Popover
                  content="隐藏数据"
                  trigger="hover"
                  onClick={() => this.showNumber('sevenStartupModel', false)}>
                  <Icon type="stop" className='common-icon-btn'/>
                </Popover>}
            </div>
            <div title='点击跳转详情' className='model-title-s' onClick={() => this.jumpToDetail(4008)}>应用启动</div>
            <MyLineChart params={{type: 'line', data: sevenData.startup_model}} loading={sevenData.startup_model_Loading}/>
          </div>
          { this.state.tabn == 'tab1' ? null : <div className='child-box'></div> }
        </div>
      </div>
    )
  }

  renderBtn = key => {
    if (this.isFetching) return
    if (this.state.tabn !== key) {
      if (key === 'tab2') {
        this.selTab2()
      } else {
        this.selTab1()
      }
    }
  }

  // 切换电视tab
  selTab1 = () => {
      this.setState({
        tabn: 'tab1',
        tab1: 'tabc selected',
        tab2: 'tabc',
        device: '电视',
        activeWM: {
          'this_week_active': 0,
          'last_week_active': 0,
          'this_month_active': 0,
          'last_month_active': 0
        },
        sevenData: {
          count: {},
          model: {},
          count_mac: {},
          count_bootup: {},
          time_sum: {},
          time_mac: {},
          boot_count: {},
          startup_model: {},
          countLoading: true,
          modelLoading: true,
          count_Loading: true,
          time_Loading: true,
          boot_Loading: true,
          startup_model_Loading: true
        },
        saNum: 0,
        saAll: 0,
        with_compare: 0,
        link_compare: 0,
        saAvg: 0,
        atmData: [
          {'name': '', 'count': 0},
          {'name': '', 'count': 0},
          {'name': '', 'count': 0}
        ]
      })

      this.getGeneralBasic()
      this.getActiveGeneral()
      this.getActiveCnt()
      this.getActivityTopModel()
      this.getStartupModel()

      this.getActiveWMtwa('TV')
      this.getActiveWMlwa('TV')
      this.getActiveWMtma('TV')
      this.getActiveWMlma('TV')

      this.getBootupGeneral()
      this.getActiveCnt()
      this.getBootupCnt()
      this.getBootupLong()
      this.getBootMount()      
  }

  // 切换冰箱tab
  selTab2 = () => {
      this.setState({
        tabn: 'tab2',
        tab1: 'tabc',
        tab2: 'tabc selected',
        device: '冰箱',
        activeWM: {
          'this_week_active': 0,
          'last_week_active': 0,
          'this_month_active': 0,
          'last_month_active': 0
        },
        sevenData: {
          count: {},
          model: {},
          count_mac: {},
          count_bootup: {},
          time_sum: {},
          time_mac: {},
          boot_count: {},
          startup_model: {},
          countLoading: true,
          modelLoading: true,
          count_Loading: true,
          time_Loading: true,
          boot_Loading: true,
          startup_model_Loading: true
        },
        saNum: 0,
        saAll: 0,
        with_compare: 0,
        link_compare: 0,
        saAvg: 0,
        atmData: [
          {'name': '', 'count': 0},
          {'name': '', 'count': 0},
          {'name': '', 'count': 0}
        ]
      })

      this.getGeneralBasicFridge()
      this.getActiveGeneralFridge()
      this.getActiveCntFridge()
      this.getActivityTopModelFridge()
      this.getStartupModelFridge()

      this.getActiveWMtwa('FRIDGE')
      this.getActiveWMlwa('FRIDGE')
      this.getActiveWMtma('FRIDGE')
      this.getActiveWMlma('FRIDGE')
  }

  modelChange = (type) => {
      switch (type) {
          case 'model':
              return (
                <div>
                  <p>{this.state.device}激活：历史有过任意上报的{this.state.device}。</p>
                  <p>联网半小时：累计联网时长超过半小时的{this.state.device}。</p>
                  <p>报备{this.state.device}：在服务器端报备过的{this.state.device}。</p>
                </div>
              )
              break;
          case 'today':
              return (
                <div>
                  <p>活跃设备：有过任意上报的设备。分小时统计，每小时内排重，不同时段不排重。</p>
                  <p>开机次数：每小时{this.state.device}开机的次数。</p>
                </div>
              )
              break;
          case 'sevenDay':
              return (
                <div>
                  <p>活跃设备：有过任意上报的设备。按日统计排重。</p>
                  <p>新增激活：按日统计，首次有任意事件上报的设备。按型号分类，只展示截止日排名前5的型号。</p>
                  <p>开机设备数：当日有过开机事件上报的去重设备数。</p>
                  <p>人均开机次数：当日总开机次数除以开机设备数。</p>
                  <p>开机时长：当日所有设备开机总时长。</p>
                  <p>人均日开机时长：按日统计，平均每台设备每日开机时长。</p>
                </div>
              )
              break;
          default:
              break;
      }
  }
}

const mapStateToProps = state => {
  return {
    auth: state.userManage.userData
  };
};

// export default dataOverview
export default connect(mapStateToProps)(withRouter(dataOverview));