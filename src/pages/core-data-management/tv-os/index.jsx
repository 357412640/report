import React, {Component} from 'react'
import './index.scss'
import ScreeningCondition from '_c/screeningCondition'
import {osVersion, platformVersion} from '@/api/core-data'
import {getData} from '@/api/application'
import {notification, Popover, Select, Table, Modal, Col, Row, Icon} from 'antd'
import {BtnTag, SvgIcon} from '_c'
import {MyLineChart} from '_c/echarts'
import exportExcel from '@/utils/exportExcel'
import {deepCopy} from '@/utils/deepcopy'
import  'echarts/lib/chart/bar'

const {Option} = Select
const list = [
  {key: 'counts', name: '型号版本分布'},
  {key: 'os', name: '平台版本分布'}
]

const columnLibs = {
  counts: [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      align: 'center'
    }
  ],
  os: [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
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

class TVos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formCustom: {},
      curTab: 'counts',
      loading: false,
      isTable: false,
      chartData: {},
      columns: [],
      dataSource: [],
      search_model: '',
      appList: [],
      group: 'day',
      showNumber: false,
      searchType: '选择机型'
    }
    this.isFetching = false
  }

  componentDidMount() {
    currentTabkey = 'counts'
    this.getOsData(currentTabkey)
  }
  getOsData = () => {
    const type = currentTabkey === 'counts'
      ? 'model' : 'platform'
    let appParams = {
      type
    }
    getData(appParams).then(res => {
      const data = res.data
      if (data.errno === 10000) {
        this.setState({
          appList: data.data[appParams.type]
        }, () => {
          let params = defaultPickerDate
          // this.getBootMountData()
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

  getBootMountData = formCustom => {
    const fetchFun = currentTabkey === 'counts'
      ? osVersion : platformVersion
    const type = currentTabkey === 'counts'
      ? 'search_model' : 'search_platform'
    let params = formCustom ? formCustom : {}
    for (let i = 0; i < this.state.appList.length; i++) {
      let model = this.state.appList[i]
      if (model.id === this.state.search_model) {
        params[type] = model
        break
      }
    }
    params.group = this.state.group
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
      }).catch(e => {
        console.log(e)
        notification.error({description: e})
        this.isFetching = false
        this.setState({loading: false})
      })
    })
  }

  convertData = data => {
    this.convertTableData(data)
    this.convertChartData(data)
  }

  convertTableData = data => {
    data = deepCopy(data)
    const dateKey = Object.keys(data)
    const newColumn = deepCopy(columnLibs[currentTabkey])
    let column = data[dateKey[0]]
    Object.keys(column).forEach(key => {
      let item = {
        align: 'center'
      }
      item.title = key
      item.dataIndex = key
      item.key = key
      newColumn.push(item)
    })
    console.log(newColumn)
    const newDataSource = getNewArr(data).reduce((acc, cur, index) => {
      cur.key = index
      cur.date = dateKey[index]
      return acc.concat(cur)
    }, [])
    // console.log(newDataSource)
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
      name: '设备数',
    }
    chartData.legend = {}
    chartData.grid = {left: '5%', right: '5%',}
    // chartData.color = ['#3ac0fc']
    chartData.tooltip = {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    }
    this.setState({
      chartData,
    })
    console.log(chartData)
  }

  getSeries = data => {
    const newSeries = []
    const newArr = getNewArr(data)
    Object.keys(newArr.length && newArr[0]).forEach(ele => {
      const line = {}
      line.data = newArr.reduce((acc, cur) => acc.concat(cur[ele]), [])
      line.name = ele
      line.type = 'bar'
      line.stack = '总量'
      if (this.state.showNumber) {
        line.label = charLabel
      }
      newSeries.push(line)
    })
    return newSeries
  }

  renderBtn = key => {
    if (this.isFetching) return
    if (currentTabkey !== key) {
      this.setState({curTab: key, chartData: {}})
      currentTabkey = key
      const searchType = currentTabkey === 'counts'
        ? '选择机型' : '选择平台'
      this.setState({
        searchType,
        appList: [],
        search_model: ''
      }, () => {
        this.getOsData(currentTabkey)
      })
    }
  }

  toExportExcel = currentName => {
    exportExcel(this.state.dataSource, currentName, this.state.columns)
  }

  changeSelect = (search_model) => {
    this.setState({
      search_model
    }, () => {
      this.getBootMountData(this.state.formCustom)
    })
    // console.log(search_model)
  }

  changeGroup = group => {
    this.setState({
      group
    }, () => {
      this.getBootMountData(this.state.formCustom)
    })
  }

  // 获取日历默认一周时间
  getDefaultPicker(params) {
    // console.log(params)
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
      appList,
      search_model,
      showNumber,
      searchType
    } = this.state
    const currentName = list.find(ele => ele.key === curTab).name
    return (
      <div className="main-page-box tvos-box common-title">
        <header className="header-box">
          <div className="title-box">
            <span className="title">系统版本</span>
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
          <Row>
            <Col span={5} style={{minWidth: 280}}>
              <div className="sel-box" >
                <span>{searchType}&nbsp;&nbsp;</span>
                <Select showSearch optionFilterProp='children' value={search_model} style={{minWidth: 200}} onChange={this.changeSelect.bind(this)}>
                  {appList.map(app => (
                    <Option key={app.id} value={app.id}>{app.name}</Option>
                  ))}
                </Select>
              </div>
            </Col>
            <Col span={4} style={{minWidth: 260}}>
              <div className="sel-box">
                按&nbsp;&nbsp;
                <Select defaultValue="day" style={{width: 100}} onChange={this.changeGroup.bind(this)}>
                  <Option value="day">天</Option>
                  <Option value="week">周</Option>
                  <Option value="month">月</Option>
                </Select>&nbsp;&nbsp;查看
              </div>
            </Col>
          </Row>
          <div className="sheet">
            {!isTable
              ? (search_model && <MyLineChart params={{type: 'line', data: chartData}} loading={loading}/>)
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

export default TVos