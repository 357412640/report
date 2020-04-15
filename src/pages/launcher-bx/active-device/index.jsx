import React, {Component} from 'react'
import './index.scss'
import ScreeningCondition from '_c/screeningCondition'
import {getActiveDevice} from '@/api/launcher-bx'
import {notification, Popover, Select, Table, Icon, Modal, message, Empty} from 'antd'
import {BtnTag, SvgIcon} from '_c'
import {MyLineChart} from '_c/echarts'
import exportExcel from '@/utils/exportExcel'
import {deepCopy} from '@/utils/deepcopy'
import {getData} from '@/api/application'

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
    }
  ]
}
const screeningType = 'BX'

let currentTabkey
const getNewArr = data => {
  return Object.keys(data).reduce((acc, cur) => acc.concat(data[cur]), [])
}

let defaultPickerDate = {}

const PopoverContent= (
  <div>
    <p>活跃设备：有过任意item点击事件上报的设备。</p>
  </div>
)

const charLabel = {
  normal: {
    show: true
  }
}

class activeDevice extends Component {
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
      group_type: 'null',
      group_values: [],
      bxList: [],
      subAll: false,
      hasData: false,
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
    params.group_type = this.state.group_type
    params.group_values = this.getSearchModel()
    const fetchFun = getActiveDevice
    try {
      this.isFetching = true
      this.setState({loading: true, hasData: true}, () => {
        // console.log(params)
        fetchFun(params).then(res => {
          let data = res.data
          if (data.errno === 10000) {
            // 转换数据
            this.convertData(data.data.data)
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
    if (data) {
      data = deepCopy(data)
      const dateKey = Object.keys(data)
      const newColumn = deepCopy(columnLibs[currentTabkey])
      if (this.state.group_type === 'null') {
        newColumn.push({
          title: '活跃用户',
          dataIndex: 'count',
          key: 'count',
          align: 'center'
        })
      } else if (this.state.group_type === 'model') {
        for (let model in data[dateKey[0]].models) {
          newColumn.push({
            title: model,
            dataIndex: model,
            key: model,
            align: 'center'
          })
        }
        console.log(newColumn)
      }
      const newDataSource = getNewArr(data).reduce((acc, cur, index) => {
        cur.align = 'center'
        cur.key = index
        cur.date = dateKey[index]
        if (this.state.group_type === 'model') {
          for (let model in cur.models) {
            cur[model] = cur.models[model].count
          }
        }
        return acc.concat(cur)
      }, [])
      console.log(newDataSource)
      this.setState({
        columns: newColumn,
        dataSource: newDataSource,
      })
    } else {
      this.setState({
        columns: [],
        dataSource: [],
      })
    }

  }

  convertChartData = data => {
    const chartData = {}
    let hasData = false
    if (data) {
      hasData = true
      data = deepCopy(data)
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
    }
    this.setState({
      chartData,
      hasData
    })

  }

  getSeries = data => {
    const newSeries = []
    const newArr = getNewArr(data)
    if (this.state.group_type === 'null') {
      Object.keys(newArr.length && newArr[0]).forEach(ele => {
        const line = {}
        line.data = newArr.reduce((acc, cur) => acc.concat(cur[ele]), [])
        line.type = 'line'
        line.name = '活跃用户'
        if (this.state.showNumber) {
          line.label = charLabel
        }
        newSeries.push(line)
      })
    } else if (this.state.group_type === 'model') {
      Object.keys(newArr.length && newArr[0].models).forEach(ele => {
        const line = {}
        line.data = newArr.reduce((acc, cur) => acc.concat(cur.models[ele].count), [])
        line.type = 'line'
        line.name = ele;
        if (this.state.showNumber) {
          line.label = charLabel
        }
        newSeries.push(line)
      })
    }
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
  changeType(group_type) {
    this.setState({
      group_type
    }, () => {
      this.getBootMountData(this.state.formCustom)
      if (group_type !== 'null') {
        // 获取冰箱类型
        this.getBxModel()
      }
    })
  }
  changeGroupType(group_values, value) {
    // 二级勾选条件
    let index = group_values.indexOf('all')
    // console.log(index)
    if (~index && !this.state.subAll) { // 如果当前勾选的是不限，subSelect = ['all']
      this.setState({
        group_values: ['all'],
        subAll: true
      })
    } else if (~index && this.state.subAll) { // 如果在不限被勾选时选择其他条件，删除不限选项
      group_values.splice(index, 1)
      this.setState({
        group_values,
        subAll: false
      })
    } else {
      if (group_values.length > 5) {
        message.warning('最多只能选择5个型号')
      } else {
        this.setState({
          group_values,
          subAll: false
        })
      }
    }
  }
  blurSelect = value => {
    this.getBootMountData(this.state.formCustom)
  }
  onDeselect = (value) => {
    let groupValues = this.state.group_values
    for (let i = 0; i < groupValues.length; i++) {
      let app = groupValues[i]
      if (value === app) {
        groupValues.splice(i, 1)
        break
      }
    }
    this.setState({
      group_values: groupValues
    }, () => {
      this.getBootMountData(this.state.formCustom)
    })
  }

  // 获取冰箱型号
  async getBxModel () {
    let appParams = {
      type: 'fridge_model'
    }
    await getData(appParams).then(res => {
      const data = res.data
      if (data.errno === 10000) {
        this.setState({
          bxList: data.data[appParams.type] || []
        }, () => {
          let params = defaultPickerDate
          // this.getBootMountData()
          this.setState({
            formCustom: params
          })
        })
      } else {
        Modal.warning({
          title: '冰箱型号列表获取失败',
          content: `原因：${data.errmsg}`
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }
  getSearchModel = () => {
    let {bxList, group_values} = this.state
    if (!group_values.length) return ''
    let list = []
    for (let i = 0; i < group_values.length; i++) {
      let item = group_values[i]
      for (let j = 0; j < bxList.length; j++) {
        let group = bxList[j]
        if (item === group.id) {
          list.push(group)
          break
        }
      }
    }
    return JSON.stringify(list)
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
      group_type,
      bxList,
      group_values,
      hasData,
      showNumber
    } = this.state
    const currentName = list.find(ele => ele.key === curTab).name
    return (
      <div className="main-page-box active-box">
        <header className="header-box">
          <div className="title-box">
            <span className="title">活跃设备
              <Popover placement="rightTop" title='数据指标定义：' content={PopoverContent} overlayClassName='help-popover'>
                <Icon type="question-circle" theme="filled" className='help-icon'/>
              </Popover>
            </span>
            <div className="screenBtn">
              {/* screeningType: 一级下拉框列表类型 onSubmit: 返回搜索条件 */}
              <ScreeningCondition onSubmit={this.submit.bind(this)} getDefaultPicker={this.getDefaultPicker.bind(this)}
                                  screeningType={screeningType}/>
            </div>
          </div>
          <div className="common-flex">
            <BtnTag list={list} func={this.renderBtn} cur={this.state.curTab}/>
            <div className="icon-btn-box">
              {isTable
                ?
                <Popover
                  content="点击查看图表"
                  trigger="hover"
                  onClick={() => {this.setState({isTable: false})}}>
                  <Icon type="line-chart" className='common-icon-btn'/>
                </Popover>
                :
                <span>
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
            维度&nbsp;&nbsp;
            <Select defaultValue="null" style={{width: 100}} onChange={this.changeType.bind(this)}>
              <Option value="null">总体</Option>
              <Option value="model">冰箱型号</Option>
            </Select>
            { group_type !== 'null' &&
              <Select mode="multiple" value={group_values} optionFilterProp='children' style={{minWidth: 200, marginLeft: 20, maxWidth:700}}
                      onBlur={this.blurSelect.bind(this)} onChange={this.changeGroupType.bind(this)}
                      onDeselect={this.onDeselect.bind(this)}>
                <Option key='all' value='all'>全部</Option>
                {bxList.map(item => (
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                ))}
              </Select>
            }
          </div>
          <div className="sel-box">
            &nbsp;&nbsp;&nbsp;&nbsp;按&nbsp;&nbsp;
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
              (hasData ?
                <div className='chart-box'>
                  <MyLineChart params={{type: 'line', data: chartData}} loading={loading}/>
                </div>
                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)
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

export default activeDevice

