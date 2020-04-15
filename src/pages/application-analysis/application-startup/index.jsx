import React, {Component} from 'react'
import './index.scss'
import ScreeningCondition from '_c/screeningCondition'
import {startupCount, getData, startupModel} from '@/api/application'
import {notification, Popover, Select, Table, Modal, message, Icon} from 'antd'
import {BtnTag, SvgIcon} from '_c'
import {MyLineChart} from '_c/echarts'
import exportExcel from '@/utils/exportExcel'
import {deepCopy} from '@/utils/deepcopy'
import 'echarts/lib/chart/bar'

const {Option} = Select
const list = [
  {key: 'trend', name: '启动趋势'},
  {key: 'counts', name: '启动排名'}
]

const columnLibs = {
  counts: [
    {
      title: '应用',
      dataIndex: 'app',
      key: 'app',
      align: 'center'
    },
    {
      title: '启动次数',
      dataIndex: 'count',
      key: 'count',
      align: 'center'
    }
  ],
  trend: [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      align: 'center'
    },
    {
      title: '应用',
      dataIndex: 'app',
      key: 'app',
      align: 'center'
    },
    {
      title: '启动次数',
      dataIndex: 'count',
      key: 'count',
      align: 'center'
    },
    {
      title: '启动设备数',
      dataIndex: 'count_mac',
      key: 'count_mac',
      align: 'center'
    }
  ]
}

const getNewArr = data => {
  return Object.keys(data).reduce((acc, cur) => acc.concat(data[cur]), [])
}

let currentTabkey

let defaultPickerDate = {}


const charLabel = {
  normal: {
    show: true
  }
}
class applicationStartup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formCustom: {},
      curTab: 'trend',
      loading: false,
      isTable: false,
      chartData: {},
      columns: [],
      dataSource: [],
      search_app: [],
      appList: [],
      trendData: {
        count: {},
        count_mac: {}
      },
      search_type: 'count',
      defaultData: {},
      showNumber: false
    }
    this.isFetching = false
  }

  componentDidMount() {
    currentTabkey = 'trend'
    let appParams = {
      type: 'app'
    }
    getData(appParams).then(res => {
      const data = res.data
      if (data.errno === 10000) {
        this.setState({
          appList: data.data.app
        }, () => {
          let params = defaultPickerDate
          this.getBootMountData(params)
          this.setState({
            formCustom: params
          })
        })
      } else {
        Modal.warning({
          title: '应用列表获取失败',
          content: `原因：${data.errmsg}`
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  getSearchApp = () => {
    let {appList, search_app} = this.state
    if (!search_app.length) return ''
    let list = []
    for (let i = 0; i < search_app.length; i++) {
      let item = search_app[i]
      for (let j = 0; j < appList.length; j++) {
        let app = appList[j]
        if (item === (app.name + app.name_cn)) {
          list.push(app)
          break
        }
      }
    }
    if (list.length) {
      return  JSON.stringify(list)
    } else {
      return ''
    }
  }

  getBootMountData = formCustom => {
    let params = formCustom ? formCustom : {}
    params.search_app = this.getSearchApp()
    // console.log(params.search_app)
    console.log(currentTabkey)
    const fetchFun = currentTabkey === 'trend'
      ? startupModel
      : startupCount
    this.isFetching = true
    this.setState({loading: true}, () => {
      // console.log(params)
      fetchFun(params).then(res => {
        let data = res.data
        let list = {}
        let defaultData
        if (data.errno === 10000) {
          // console.log(data)
          if (currentTabkey === 'trend') {
            let trendData = {}
            let count = {}
            let count_mac = {}
            let totalData = defaultData = data.data.data
            let keyArr = Object.keys(totalData)
            let showApp
            // 如果搜索为空，默认showapp内top5显示
            // if (!this.state.search_app.length) {
            showApp = data.data.showapp
            // } else {
            //   showApp = JSON.parse(params.search_app).reduce((acc, cur) => {
            //     return acc.concat(cur.name)
            //   }, [])
            // }
            for (let i = 0; i < keyArr.length; i++) {
              let day = keyArr[i]
              count[day] = {}
              count_mac[day] = {}
              showApp.forEach(item => {
                count[day][item] = totalData[day][item] ? totalData[day][item].count : 0
                count_mac[day][item] = totalData[day][item] ? totalData[day][item].count_mac : 0
              })
            }
            trendData = {
              count,
              count_mac
            }
            list = this.state.search_type === 'count' ? trendData.count : trendData.count_mac
            this.setState({trendData})
          } else {
            defaultData = data.data
            // 如果 search_app 为空， 则取top10
            if (!this.state.search_app.length) {
              let keyArr = Object.keys(data.data)
              for (let i = 0; i < 10; i++) {
                if (keyArr.length <= i) {
                  break
                }
                list[keyArr[i]] = data.data[keyArr[i]]
              }
            } else {
              list = data.data
            }

          }
          // 转换数据
          this.convertData(list, defaultData)
          this.isFetching = false
          this.setState({loading: false, defaultData})
        } else {
          throw data.errmsg
        }
      }).catch(e => {
        console.log(e)
        notification.error({description: e})
        this.isFetching = false
        this.setState({loading: false})
      })
    })
  }

  convertData = (data, defaultData) => {
    this.convertTableData(defaultData)
    this.convertChartData(data)
  }

  convertTableData = data => {
    data = deepCopy(data)
    // console.log(data)
    const dateKey = data && Object.keys(data)
    const newColumn = columnLibs[currentTabkey]
    let newDataSource = []
    if (currentTabkey === 'trend') {
      let i = 0
      let appArr = []
      dateKey.forEach(date => {
        // 选择应用为空时，每次数据不同，需要重新获取列表， 不为空时数据列表相同，只取一次
        if (!this.state.search_app.length || i === 0) {
          appArr = Object.keys(data[date])
          // console.log("删选列表为空")
        }
        appArr.map((app) => {
          let newItem = {
            app,
            date,
            key: i,
            ...data[date][app]
          }
          i++
          newDataSource.push(newItem)
        })
      })
    } else {
      newDataSource = getNewArr(data).reduce((acc, cur, index) => {
        cur.key = index
        cur.app = dateKey[index]
        return acc.concat(cur)
      }, [])
    }
    // console.log(newDataSource)
    this.setState({
      columns: newColumn,
      dataSource: newDataSource,
    })
  }

  getSeries = data => {
    const newSeries = []
    const newArr = getNewArr(data)
    Object.keys(newArr.length && newArr[0]).forEach(ele => {
      const line = {}
      line.data = newArr.reduce((acc, cur) => acc.concat(cur[ele]), [])
      if (currentTabkey === 'trend') {
        line.type = 'line'
        line.name = ele
      } else {
        line.name = '启动次数'
        line.type = 'bar'
      }
      if (this.state.showNumber) {
        line.label = charLabel
      }
      newSeries.push(line)
    })
    return newSeries
  }

  convertChartData = data => {
    data = deepCopy(data)
    const chartData = {}
    chartData.xAxis = {
      type: 'category',
      data: Object.keys(data),
    }
    chartData.series = this.getSeries(data)
    chartData.yAxis = {
      type: 'value',
      name: '',
      // nameRotate: 90,
      // nameLocation: 'center',
      // nameGap: 30,
    }
    chartData.legend = {}
    chartData.grid = {left: '5%', right: '5%',}
    // chartData.color = ['#3ac0fc']
    chartData.tooltip = {
      trigger: 'axis',
    }
    this.setState({
      chartData,
    })
  }

  renderBtn = key => {
    if (this.isFetching) return
    if (currentTabkey !== key) {
      this.setState({curTab: key, chartData: {}})
      currentTabkey = key
      this.getBootMountData(this.state.formCustom)
    }
  }

  toExportExcel = currentName => {
    exportExcel(this.state.dataSource, currentName, this.state.columns)
  }

  changeSelect = (search_app) => {
    console.log(search_app)
    if (search_app.length > 10) {
      message.warning('最多只能选择10个应用')
    } else {
      this.setState({
        search_app
      })
    }
    // console.log(search_app)
  }
  blurSelect = value => {
    this.getBootMountData(this.state.formCustom)
  }

  // 获取日历默认一周时间
  getDefaultPicker(params) {
    // console.log(params)
    defaultPickerDate = params
  }

  submit = (formCustom) => {
    // console.log(this.getDefaultPicker())
    this.setState({
      formCustom
    }, () => {
      this.getBootMountData(this.state.formCustom)
    })

  }

  onDeselect = (value) => {
    let searchApp = this.state.search_app
    for (let i = 0; i < searchApp.length; i++) {
      let app = searchApp[i]
      if (value === app) {
        searchApp.splice(i, 1)
        break
      }
    }
    this.setState({
      search_app: searchApp
    }, () => {
      this.getBootMountData(this.state.formCustom)
    })
  }
  changeType = search_type => {
    this.setState({
      search_type
    }, () => {
      let list = this.state.search_type === 'count' ? this.state.trendData.count : this.state.trendData.count_mac
      // 转换数据
      this.convertData(list, this.state.defaultData)
    })
  }

  // 显示或隐藏图标数字
  showNumber (flag) {
    let chartData = deepCopy(this.state.chartData)
    let series = chartData.series
    if (flag) { // 显示
      chartData.series = series.map(item => {
        item.label = charLabel
        return item
      })
      this.setState({
        chartData,
        showNumber: true
      })
    } else { // 隐藏
      chartData.series = series.map(item => {
        delete item.label
        return item
      })
      this.setState({
        chartData,
        showNumber: false
      })
    }
  }

  render() {
    const {
      loading,
      isTable,
      curTab,
      chartData,
      dataSource,
      columns,
      appList,
      search_app,
      search_type,
      showNumber
    } = this.state
    const currentName = list.find(ele => ele.key === curTab).name
    return (
      <div className="main-page-box startup-box common-title">
        <header className="header-box">
          <div className="title-box">
            <span className="title">应用启动</span>
            <div className="screenBtn">
              {/* screeningType: 一级下拉框列表 onSubmit: 返回搜索条件 */}
              <ScreeningCondition onSubmit={this.submit.bind(this)} getDefaultPicker={this.getDefaultPicker.bind(this)}/>
            </div>
          </div>
          <div className="common-flex">
            <BtnTag list={list} func={this.renderBtn} cur={this.state.curTab}/>
            <div className="icon-btn-box">
              {isTable
                ? <Popover
                  content="点击查看图表"
                  trigger="hover"
                  onClick={() => {
                    this.setState({isTable: false})
                  }}
                >
                  <span style={{opacity: 0}}>.</span>
                  <Icon type="line-chart" className='common-icon-btn'/>
                </Popover>
                : <span>
                  {!showNumber ?
                    <Popover
                      content="显示数据"
                      trigger="hover">
                    <span className='icon-style'>
                      <SvgIcon iconClass="number" color="#777" propClass="number-icon"
                               click={() => this.showNumber(true)}/>
                    </span>
                    </Popover> :
                    <Popover
                      content="隐藏数据"
                      trigger="hover"
                      onClick={() => this.showNumber(false)}>
                      <Icon type="stop" className='common-icon-btn'/>
                    </Popover>}
                  <Popover
                    content="点击查看表格"
                    trigger="hover"
                    onClick={() => {
                      this.setState({isTable: true})}}>
                    <Icon type="table"  className='common-icon-btn'/>
                  </Popover>
                </span>}
              <Popover
                content="点击导出excel"
                trigger="hover"
                onClick={() => this.toExportExcel(currentName)}
              >
                <span style={{opacity: 0}}>.</span>
                <Icon type="cloud-download" className='common-icon-btn'/>
              </Popover>
            </div>
          </div>
        </header>
        <section className="common-table-box">
          <div className="sel-box">
            <span style={{display: 'inline-block', width: 70}}>选择应用&nbsp;&nbsp;</span>
            <Select mode="multiple" value={search_app} style={{minWidth: 200, maxWidth: 700}}
                    onBlur={this.blurSelect.bind(this)} onChange={this.changeSelect.bind(this)}
                    onDeselect={this.onDeselect.bind(this)}>
              {appList.map(app => (
                <Option key={app.id} value={app.name + app.name_cn}>{app.name_cn || app.name}</Option>
              ))}
            </Select>
          </div>
          <div className="sheet">
            {!isTable
              ?
              <div>
                {currentTabkey === 'trend' &&
                <div className="sel-startup">
                  <span style={{display: 'inline-block', width: 70}}></span>
                  <Select value={search_type}
                          onChange={this.changeType.bind(this)}>
                    <Option key='count' value='count'>启动次数/次</Option>
                    <Option key='count_mac' value='count_mac'>启动设备数/台</Option>
                  </Select>
                </div>}
                <MyLineChart params={{type: 'line', data: chartData}} loading={loading}/>
              </div>
              : <Table
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                pagination={false}
              />}
          </div>
        </section>
      </div>

    )
  }
}

export default applicationStartup