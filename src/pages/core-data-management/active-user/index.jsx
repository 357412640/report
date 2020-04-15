import React, {Component} from 'react'
import './index.scss'
import ScreeningCondition from '_c/screeningCondition'
import {activeUsers} from '@/api/core-data'
import {notification, Popover, Select, Table, Icon} from 'antd'
import {BtnTag, SvgIcon} from '_c'
import {MyLineChart} from '_c/echarts'
import exportExcel from '@/utils/exportExcel'
import {deepCopy} from '@/utils/deepcopy'


const {Option} = Select
const list = [
  {key: 'active', name: '活跃用户'}
]

const libs = {
  count: '数量'
}

const columnLibs = {
  active: [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      align: 'center'
    },
    {
      title: '活跃用户',
      dataIndex: 'count',
      key: 'count',
      align: 'center'
    }
  ]
}

let currentTabkey

const getNewArr = data => {
  return Object.keys(data).reduce((acc, cur) => acc.concat(data[cur]), [])
}

let defaultPickerDate = {}

const PopoverContent= (
  <div>
    <p>活跃设备：统计期内，有过任意事件上报的设备。</p>
    <p>日活：活跃设备按日去重。</p>
    <p>周活：活跃设备按周去重。</p>
    <p>月活：活跃设备按月去重。</p>
  </div>
)

// 初始数据
const summaryData = {
  perCount: '',
  totalCount: ''
}

const charLabel = {
  normal: {
    show: true
  }
}

class activeUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formCustom: {},
      curTab: 'active',
      loading: false,
      isTable: false,
      chartData: {},
      columns: [],
      dataSource: [],
      group: 'day',
      summaryData,
      showNumber: false
    }
    this.isFetching = false
    this.params = {group: 'day', name: '日'}
  }

  componentDidMount() {
    currentTabkey = 'active'
    let parmas = defaultPickerDate
    this.getBootMountData(parmas)
    this.setState({
      formCustom: parmas
    })
  }

  getBootMountData = async (formCustom) => {
    let params = formCustom ? formCustom : {}
    params.group = this.state.group
    const fetchFun = activeUsers
    try {
      this.isFetching = true
      this.setState({loading: true}, () => {
        // console.log(params)
        fetchFun(params).then(res => {
          let data = res.data
          if (data.errno === 10000) {
            // 转换数据
            this.convertData(data.data)
            this.isFetching = false
            this.setState({loading: false})
          } else {
            throw data.errmsg
          }
        })
      })
    } catch (e) {
      console.log(e)
      notification.error({description: e})
      this.isFetching = false
      this.setState({loading: false})
    }
  }

  convertData = data => {
    this.convertTableData(data)
    this.convertChartData(data)
  }

  convertTableData = data => {
    data = deepCopy(data)
    const dateKey = Object.keys(data)
    const newColumn = columnLibs[currentTabkey]
    const newDataSource = getNewArr(data).reduce((acc, cur, index) => {
      cur.align = 'center'
      cur.key = index
      cur.date = dateKey[index]
      return acc.concat(cur)
    }, [])
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
    chartData.yAxis = {
      type: 'value',
      name: '总数',
      // nameRotate: 90,
      // nameLocation: 'center',
      // nameGap: 30,
    }
    chartData.legend = {}
    chartData.grid = {left: '5%', right: '5%',}
    chartData.tooltip = {
      trigger: 'axis',
    }
    this.setState({
      chartData,
    })
  }

  getSeries = data => {
    const newSeries = []
    const newArr = getNewArr(data)

    // 计算汇总数据
    // 获取 天/周/月 数
    let currentCount = newArr.length || 1

    // 开机数
    let arrCount, totalCount, perCount

    Object.keys(newArr.length && newArr[0]).forEach(ele => {
      const line = {}
      line.data = newArr.reduce((acc, cur) => acc.concat(cur[ele]), [])
      line.name = '活跃用户'
      line.type = 'line'
      if (this.state.showNumber) {
        line.label = charLabel
      }
      newSeries.push(line)


      arrCount = line.data
      totalCount = arrCount.reduce((acc, cur) => acc + cur)

      perCount = (totalCount / currentCount).toFixed(2)
      let summaryData = Object.assign({}, {perCount})
      this.setState({
        summaryData
      })
    })
    return newSeries
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

  changeSelect(group) {
    this.params.group = group
    switch (group) {
      case 'day':
        this.params.name = '日'
        break
      case 'week':
        this.params.name = '周'
        break
      case 'month':
        this.params.name = '月'

    }
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
      summaryData,
      showNumber
    } = this.state
    const currentName = list.find(ele => ele.key === curTab).name
    return (
      <div className="main-page-box active-box">
        <header className="header-box">
          <div className="title-box">
            <span className="title">活跃用户
              <Popover placement="rightTop" title='数据指标定义：' content={PopoverContent} overlayClassName='help-popover'>
                <Icon type="question-circle" theme="filled" className='help-icon'/>
              </Popover>
            </span>
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
              ?
              <div className='chart-box'>
                <MyLineChart params={{type: 'line', data: chartData}} loading={loading}/>
                <Popover className='summary-box' placement="rightTop" title='汇总：' content={<div >
                      <div>
                        <p>{this.params.name}均活跃用户：{summaryData.perCount || '--'}</p>
                      </div>
                </div>} overlayClassName='summary-popover'>
                  <Icon type="bars"/>
                </Popover>


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

export default activeUser

