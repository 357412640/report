import React, {Component} from 'react'
import './index.scss'
import ScreeningCondition from '_c/screeningCondition'
import {notification, Popover, Select, Table, Icon} from 'antd'
import {BtnTag, SvgIcon} from '_c'
import {MyLineChart} from '_c/echarts'
import exportExcel from '@/utils/exportExcel'
import {deepCopy} from '@/utils/deepcopy'
import {pageView, pageClick} from '@/api/launcher-data'


const {Option} = Select
const list = [
  {key: 'page', name: '页面访问'},
  {key: 'click', name: '页面点击'}
]

const libs = {
  page: {
    view_count: '页面访问次数',
    mac_count: '页面访问人数',
    view_rate: '访问率'
  },
  click: {}

}

const columnLibs = {
  page: [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '页面访问次数',
      dataIndex: 'view_count',
      key: 'view_count',
    },
    {
      title: '页面访问人数',
      dataIndex: 'mac_count',
      key: 'mac_count',
    },
    {
      title: '独立开机人数',
      dataIndex: 'boot_count',
      key: 'boot_count',
    },
    {
      title: '访问率',
      dataIndex: 'view_rate',
      key: 'view_rate',
    },

  ],
  click: [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: '资源名称',
      dataIndex: 'item_name',
      key: 'item_name'
    },
    {
      title: '点击次数',
      dataIndex: 'click_time_count',
      key: 'click_time_count'
    },
    {
      title: '点击人数',
      dataIndex: 'click_people_count',
      key: 'click_people_count'
    },
    {
      title: '页面访问次数',
      dataIndex: 'page_view_count',
      key: 'page_view_count'
    },
    {
      title: '点击率',
      dataIndex: 'click_rate',
      key: 'click_rate'
    }
  ]
}

const getNewArr = data => {
  return Object.keys(data).reduce((acc, cur) => acc.concat(data[cur]), [])
}

let defaultPickerDate = {}

const charLabel = {
  normal: {
    show: true
  }
}

class dropdownPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formCustom: {},
      curTab: 'page',
      loading: false,
      isTable: false,
      chartData: {},
      columns: [],
      dataSource: [],
      group: 'day',
      currentTabkey: 'page',
      search_type: 'viewCount',
      trendData: {
        click_time_count: {},
        click_people_count: {}
      },
      defaultData: {},
      keyArrs: [],
      showNumber: false
    }
    this.isFetching = false
  }

  componentDidMount() {
    let parmas = defaultPickerDate
    this.getBootMountData(parmas)
    this.setState({
      formCustom: parmas
    })
  }

  getBootMountData = async (formCustom) => {
    let params = formCustom ? formCustom : {}
    params.group = this.state.group
    const fetchFun = this.state.currentTabkey === 'page'
      ? pageView
      : pageClick
    try {
      this.isFetching = true
      this.setState({loading: true}, () => {
        fetchFun(params).then(res => {
          let data = res.data
          let list = {}
          let defaultData
          if (data.errno === 10000) {
            // console.log(data)
            if (this.state.currentTabkey === 'click') {
              let trendData = {}
              let click_time_count = {}
              let click_people_count = {}
              let totalData = defaultData = data.data.result || []
              let keyArrs = data.data.item_name_list
              let keyArr = Object.keys(totalData)

              for (let i = 0; i < keyArr.length; i++) {
                let day = keyArr[i]
                click_time_count[day] = {}
                click_people_count[day] = {}
                totalData[day].forEach(item => {
                  click_time_count[day][item.item_name] = item.click_time_count
                  click_people_count[day][item.item_name] = item.click_people_count
                })
              }
              trendData = {
                click_time_count,
                click_people_count
              }
              list = this.state.search_type === 'viewCount' ? trendData.click_time_count : trendData.click_people_count
              this.setState({trendData, keyArrs})
              this.convertData(list, defaultData)
            } else {
              // 转换数据
              this.convertData(data.data)
            }
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
    } catch (e) {
      console.log(e)
      notification.error({description: e})
      this.isFetching = false
      this.setState({loading: false})
    }
  }

  getSeries = data => {
    const newSeries = []
    const newArr = getNewArr(data)
    let currentTabkey = this.state.currentTabkey === 'page'
    let keyArrs = []
    if (currentTabkey) {
      keyArrs = Object.keys(newArr.length && newArr[0] || [])
    } else {
      keyArrs = this.state.keyArrs || []
    }
    keyArrs.forEach(ele => {
      // 独立开机人数 不在图表中展示
      if (ele !== 'boot_count') {
        const line = {}
        line.type = currentTabkey ? 'line' : 'bar'
        if (currentTabkey) {
          line.type = 'line'
          if (ele === 'view_rate') {
            line.yAxisIndex = 1
            line.data = newArr.reduce((acc, cur) => acc.concat(cur[ele] === 0 ? 0 : (cur[ele] * 100).toFixed(2)), [])
            line.name = libs[this.state.currentTabkey][ele]
          } else {
            line.name = libs[this.state.currentTabkey][ele]
            line.data = newArr.reduce((acc, cur) => acc.concat(cur[ele]), [])
          }
        } else {
          line.type = 'bar'
          line.name = ele
          line.data = newArr.reduce((acc, cur) => acc.concat(cur[ele]), [])
        }
        if (this.state.showNumber) {
          line.label = charLabel
        }
        newSeries.push(line)
      }
    })
    return newSeries
  }

  convertData = (data, defaultData = data) => {
    this.convertTableData(defaultData)
    this.convertChartData(data)
  }

  convertTableData = data => {
    data = deepCopy(data)
    const dateKey = Object.keys(data)
    const newColumn = columnLibs[this.state.currentTabkey]
    let newDataSource = []
    if (this.state.currentTabkey === 'page') {
      newDataSource = getNewArr(data).reduce((acc, cur, index) => {
        cur.align = 'center'
        cur.key = index
        cur.date = dateKey[index]
        if (~cur.view_rate) {
          cur.view_rate = cur.view_rate === 0 ? 0 : `${(cur.view_rate * 100).toFixed(2)}%`
        }
        return acc.concat(cur)
      }, [])
    } else {
      let i = 0
      dateKey.forEach(date => {
        if (data[date].length) {
          for (let j = 0; j < data[date].length; j++) {
            let newItem = {
              date,
              key: i,
              ...data[date][j]
            }
            newItem.click_rate = newItem.click_rate === 0 ? 0 : `${(newItem.click_rate * 100).toFixed(2)}%`
            newDataSource.push(newItem)
            i++
          }
        }
      })
    }

    this.setState({
      columns: newColumn,
      dataSource: newDataSource,
    })
  }

  convertChartData = data => {
    data = deepCopy(data)
    const chartData = {}
    chartData.xAxis = {
      type: 'category',
      data: Object.keys(data),
    }
    chartData.series = this.getSeries(data)
    chartData.yAxis = this.state.currentTabkey === 'page' ? [
      {
        type: 'value',
        name: '',
        // nameRotate: 90,
        // nameLocation: 'center',
        // nameGap: 30,
      },
      {
        type: 'value',
        name: '',
        // max: 100,
        axisLabel: {
          formatter: '{value}.00 %'
        }
      }
    ] : {
      type: 'value',
      name: '',
      // nameRotate: 90,
      // nameLocation: 'center',
      // nameGap: 30,
    }
    chartData.legend = {}
    chartData.grid = {left: '5%', right: '5%',}
    // chartData.color = ['#3ac0fc', '#2418ff', '#ea312a']
    chartData.tooltip = {
      trigger: 'axis',
    }
    console.log(chartData)
    this.setState({
      chartData
    })
  }

  renderBtn = key => {
    if (this.isFetching) return
    if (this.state.currentTabkey !== key) {
      this.setState({curTab: key, chartData: {}})
      this.state.currentTabkey = key
      this.getBootMountData(this.state.formCustom)
    }
  }

  toExportExcel = currentName => {
    exportExcel(this.state.dataSource, currentName, this.state.columns)
  }

  changeSelect(group) {
    this.setState({
      group
    }, () => {
      this.getBootMountData(this.state.formCustom)
    })
  }

  // 获取日历默认一周时间
  getDefaultPicker(params) {
    console.log(params)
    defaultPickerDate = params

  }

  submit = (formCustom) => {
    console.log(this.getDefaultPicker())
    this.setState({
      formCustom
    }, () => {
      this.getBootMountData(this.state.formCustom)
    })

  }

  changeType = search_type => {
    this.setState({
      search_type
    }, () => {
      let list = this.state.search_type === 'viewCount' ? this.state.trendData.click_time_count : this.state.trendData.click_people_count
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
      currentTabkey,
      search_type,
      showNumber
    } = this.state
    const currentName = list.find(ele => ele.key === curTab).name
    return (
      <div className="main-page-box dropdown-page">
        <header className="header-box">
          <div className="title-box">
            <span className="title">下拉页面</span>
            <div className="screenBtn">
              {/* screeningType: 一级下拉框列表类型 onSubmit: 返回搜索条件 */}
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
            按&nbsp;&nbsp;
            <Select defaultValue="day" style={{width: 100}} onChange={this.changeSelect.bind(this)}>
              <Option value="day">天</Option>
              <Option value="week">周</Option>
              <Option value="month">月</Option>
            </Select>
            &nbsp;&nbsp;查看
          </div>
          <div className="sheet">
            {!isTable
              ? <div>
                {currentTabkey === 'click' &&
                <div className="sel-startup">
                  <span style={{display: 'inline-block', width: 70}}></span>
                  <Select value={search_type}
                          onChange={this.changeType.bind(this)}>
                    <Option key='viewCount' value='viewCount'>点击次数</Option>
                    <Option key='macCount' value='macCount'>点击人数</Option>
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

export default dropdownPage

