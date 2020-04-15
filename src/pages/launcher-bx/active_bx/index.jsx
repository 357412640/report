import React, {Component} from 'react'
import './index.scss'
import ScreeningCondition from '_c/screeningCondition'
import {notification, Popover, Select, Table, Icon, Modal, message, Empty} from 'antd'
import {BtnTag, SvgIcon} from '_c'
import {MyLineChart} from '_c/echarts'
import exportExcel from '@/utils/exportExcel'
import {deepCopy} from '@/utils/deepcopy'
import {getData} from '@/api/application'
import {activeCount, activeTotal} from '@/api/launcher-bx'

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
    }
  ],
  total: [
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

const charLabel = {
  normal: {
    show: true
  }
}

class activeBx extends Component {
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
      group_type: 'null',
      group_values: [],
      bxList: [],
      subAll: false,
      showNumber: false
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
  getSeries = data => {
    const newSeries = []
    const newArr = getNewArr(data)
    let key = currentTabkey === 'new' ? 'count' : 'total_count'
    if (this.state.group_type === 'null') {
      const line = {}
      line.data = newArr.reduce((acc, cur) => acc.concat(cur[key]), [])
      line.name = currentTabkey === 'new' ? '新增数量' : '累计数量'
      line.type = 'line'
      if (this.state.showNumber) {
        line.label = charLabel
      }
      newSeries.push(line)
    } else if (this.state.group_type === 'model') {
      Object.keys(newArr.length && newArr[0].models).forEach(ele => {
        const line = {}
        line.data = newArr.reduce((acc, cur) => acc.concat(cur.models[ele][key]), [])
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

  getBootMountData = async (formCustom) => {
    let params = formCustom ? formCustom : {}
    params.group = this.state.group
    params.group_type = this.state.group_type
    params.group_values = this.getSearchModel()
    const fetchFun = currentTabkey === 'new' ? activeCount : activeTotal
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
        let item = currentTabkey === 'new' ? {
          title: '新增激活',
          dataIndex: 'count',
          key: 'count',
          align: 'center'
        } : {
          title: '累计激活',
          dataIndex: 'total_count',
          key: 'total_count',
          align: 'center'
        }
        newColumn.push(item)
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
        if (this.state.group_type === 'model') {
          for (let model in cur.models) {
            cur[model] = cur.models[model].count
          }
        }
        cur.align = 'center'
        cur.key = index
        cur.date = dateKey[index]
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
    }
    this.setState({
      chartData,
      hasData
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

  changeType(group_type) {
    this.setState({
      group_type,
      group_values: []
    }, () => {
      this.getBootMountData(this.state.formCustom)
      if (group_type !== 'null') {
        // 获取冰箱类型
        this.getBxModel()
      }
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
            <span className="title">冰箱激活
            </span>
            <div className="screenBtn">
              {/* screeningType: 一级下拉框类型 onSubmit: 返回搜索条件 */}
              <ScreeningCondition onSubmit={this.submit.bind(this)} getDefaultPicker={this.getDefaultPicker.bind(this)}
                                  screeningType={screeningType}/>
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
                  <MyLineChart params={{type: 'line', data: chartData}} loading={loading}/>
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

export default activeBx