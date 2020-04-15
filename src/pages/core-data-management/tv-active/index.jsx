import React, {Component} from 'react'
import './index.scss'
import ScreeningCondition from '_c/screeningCondition'
import {activityNew, activityTotal} from '@/api/core-data'
import {notification, Popover, Select, Table, Icon, message, Modal} from 'antd'
import {BtnTag, SvgIcon} from '_c'
import {MyLineChart} from '_c/echarts'
import exportExcel from '@/utils/exportExcel'
import {deepCopy} from '@/utils/deepcopy'
import {getData} from '@/api/application'


const {Option} = Select
const list = [
  {key: 'new', name: '新增激活'},
  {key: 'total', name: '累计激活'}
]

const libs = {
  count: '数量'
}

const columnLibs = {
  new: [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      align: 'center'
    },
    {
      title: '新增数量',
      dataIndex: 'count',
      key: 'count',
      align: 'center'
    }
  ],
  total: [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      align: 'center'
    },
    {
      title: '累计数量',
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
    <p>电视激活：历史有过任意上报的电视。</p>
  </div>
)

const charLabel = {
  normal: {
    show: true
  }
}

class TVactiveIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formCustom: {},
      curTab: 'new',
      loading: false,
      isTable: false,
      chartData: {},
      columns: [],
      dataSource: [],
      group: 'day',
      showNumber: false,
      tvList: [],
      group_type: 'null',
      group_values: [],
      subAll: false
    } 
    this.isFetching = false
  }

  componentDidMount() {
    currentTabkey = 'new'

    if (undefined !== this.props.location.state) {
      // 数据概览跳转
      let curTab = this.props.location.state.curTab
      console.log(curTab);
      if (curTab) {
        this.setState({
          curTab: curTab
        })
        currentTabkey = curTab
      }
    }
    
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
    const fetchFun = currentTabkey === 'new'
      ? activityNew
      : activityTotal
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
    let newData
    let newColumn
    data = deepCopy(data)
    if (this.state.group_type === 'null') {
      newData = data
      newColumn = columnLibs[currentTabkey]
    } else {
      data = deepCopy(data)
      newColumn = [
        {
          title: '日期',
          dataIndex: 'date',
          key: 'date',
          align: 'center'
        }
      ]
      newData = data.data
      data.show_items.forEach(show_items => {
        newColumn.push({
          title: show_items,
          dataIndex: show_items,
          key: show_items,
          align: 'center'
        })
      })
    }
    const dateKey = Object.keys(newData)
    const newDataSource = getNewArr(newData).reduce((acc, cur, index) => {
      if (this.state.group_type !== 'null') {
        for (let show_items in cur) {
          cur[show_items] = cur[show_items].count
        }
      }
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
    let newData
    if (this.state.group_type === 'null') {
      newData = data
    } else {
      newData = data.data
    }
    const chartData = {}
    chartData.xAxis = {
      type: 'category',
      data: Object.keys(newData),
    }
    chartData.series = this.getSeries(newData)
    chartData.yAxis = {
      type: 'value',
      name: '用户数',
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
    this.setState({
      chartData,
    })
  }

  getSeries = data => {
    const newSeries = []
    const newArr = getNewArr(data)
    let key = 'count'
    if (this.state.group_type === 'null') {
      Object.keys(newArr.length && newArr[0]).forEach(ele => {
        const line = {}
        line.data = newArr.reduce((acc, cur) => acc.concat(cur[ele]), [])
        line.name = currentTabkey === 'new' ? '新增数量' : '累计数量'
        line.type = 'line'
        if (this.state.showNumber) {
          line.label = charLabel
        }
        newSeries.push(line)
      })
    } else {
      Object.keys(newArr.length && newArr[0]).forEach(ele => {
        const line = {}
        line.data = newArr.reduce((acc, cur) => acc.concat(cur[ele][key]), [])
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

  changeType(group_type) {
    this.setState({
      group_values: [],
      group_type
    }, () => {
      this.getBootMountData(this.state.formCustom)
      if (group_type !== 'null') {
        // 获取冰箱类型
        this.getTVModel(group_type)
      }
    })
  }
  // 获取冰箱型号
  async getTVModel (group_type) {
    let appParams = {
      type: group_type
    }
    await getData(appParams).then(res => {
      const data = res.data
      if (data.errno === 10000) {
        this.setState({
          tvList: data.data[appParams.type] || []
        })
      } else {
        Modal.warning({
          title: '列表获取失败',
          content: `原因：${data.errmsg}`
        })
      }
    }).catch(err => {
      console.log(err)
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
  getSearchModel = () => {
    let {tvList, group_values} = this.state
    if (!group_values.length) return ''
    let list = []
    for (let i = 0; i < group_values.length; i++) {
      let item = group_values[i]
      for (let j = 0; j < tvList.length; j++) {
        let group = tvList[j]
        if (item === group.id) {
          list.push(group)
          break
        }
      }
    }
    return JSON.stringify(list)
  }


  render() {
    const {
      loading,
      isTable,
      curTab,
      chartData,
      dataSource,
      columns,
      showNumber,
      group_type,
      tvList,
      group_values
    } = this.state
    const currentName = list.find(ele => ele.key === curTab).name
    return (
      <div className="main-page-box active-box">
        <header className="header-box">
          <div className="title-box">
            <span className="title">电视激活
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
            维度&nbsp;&nbsp;
            <Select defaultValue="null" style={{width: 100}} onChange={this.changeType.bind(this)}>
              <Option value="null">总体</Option>
              <Option value="model">电视型号</Option>
              <Option value="group">电视分组</Option>
            </Select>
            { group_type !== 'null' &&
            <Select mode="multiple" value={group_values} optionFilterProp='children' style={{minWidth: 200, marginLeft: 20, maxWidth:700}}
                    onBlur={this.blurSelect.bind(this)} onChange={this.changeGroupType.bind(this)}
                    onDeselect={this.onDeselect.bind(this)}>
              <Option key='all' value='all'>全部</Option>
              {tvList.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
            }
          </div>
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
              ? <MyLineChart params={{type: 'line', data: chartData}} loading={loading}/>
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

export default TVactiveIndex

