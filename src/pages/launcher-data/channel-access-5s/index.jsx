import React, {Component} from 'react'
import './index.scss'
import ScreeningCondition from '_c/screeningCondition'
import {notification, Popover, Select, Table, Icon} from 'antd'
import {BtnTag, SvgIcon} from '_c'
import {MyLineChart} from '_c/echarts'
import exportExcel from '@/utils/exportExcel'
import {deepCopy} from '@/utils/deepcopy'
import {channelView5s, indChannelView5s} from '@/api/launcher-data'
import {getData} from '@/api/application'


const {Option} = Select
const list = [
  {key: 'over', name: '访问概览'},
  {key: 'only', name: '独立频道访问'}
]

const libs = {
  view_count: '频道访问次数',
  mac_count: '频道访问人数',
  view_rate: '访问率'
}

const columnLibs = {
  over: [
    {
      title: '频道',
      dataIndex: 'channel',
      key: 'channel',
    },
    {
      title: '频道访问次数',
      dataIndex: 'count',
      key: 'count',
    }
  ],
  only: [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '频道访问次数',
      dataIndex: 'view_count',
      key: 'view_count',
    },
    {
      title: '频道访问人数',
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

const PopoverContent= (
  <div>
    <p>访问率=频道展示人数/独立开机人数；独立开机人数按开机上报事件统计</p>
  </div>
)

class channelAccess5s extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formCustom: {},
      curTab: 'over',
      loading: false,
      isTable: false,
      chartData: {},
      columns: [],
      dataSource: [],
      group: 'day',
      currentTabkey: 'over',
      channelList: [],
      search_channel: '',
      search_channel_id: '',
      showNumber: false
    }
    this.isFetching = false
  }

  componentDidMount() {
    this.getChannelList()
    let parmas = defaultPickerDate
    this.getBootMountData(parmas)
    this.setState({
      formCustom: parmas
    })
  }
  getChannelList = async () => {
    try {
      let params = {
        type: 'channel'
      }
      let res = await getData(params)
      let data = res.data
      if (data.errno === 10000) {
        let channelList = data.data.channel
        let search_channel = channelList[0]
        let search_channel_id = channelList[0].id
        this.setState({
          channelList,
          search_channel,
          search_channel_id
        })
      } else {
        throw data.errmsg
      }
    } catch (e) {
      console.log(e)
      notification.error({description: e})
      this.isFetching = false
      this.setState({loading: false})
    }
  }

  getBootMountData = async (formCustom) => {
    let params = formCustom ? formCustom : {}
    console.log(params)
    params.group = this.state.group
    let currentTabkeyFlag = this.state.currentTabkey === 'over'
    if (!currentTabkeyFlag) {
      params.search_channel = JSON.stringify(this.state.search_channel)
    }
    const fetchFun = currentTabkeyFlag
      ? channelView5s
      : indChannelView5s
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

  getSeries = data => {
    const newSeries = []
    const newArr = getNewArr(data)
    Object.keys(newArr.length && newArr[0]).forEach(ele => {
      // 独立开机人数 不在图表中展示
      if (ele !== 'boot_count') {
        const line = {}

        line.name = this.state.currentTabkey === 'over' ? '频道访问次数' : libs[ele]
        line.type = this.state.currentTabkey === 'over' ? 'bar' : 'line'
        // 访问率展示在次纵坐标
        if (ele === 'view_rate') {
          line.yAxisIndex = 1
          line.data = newArr.reduce((acc, cur) => acc.concat(cur[ele] === 0 ? 0 : (cur[ele] * 100).toFixed(2)), [])
        } else {
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

  convertData = data => {
    this.convertTableData(data)
    this.convertChartData(data)
  }

  convertTableData = data => {
    data = deepCopy(data)
    let param = this.state.currentTabkey === 'over' ? 'channel' : 'date'
    const dateKey = Object.keys(data)
    const newColumn = columnLibs[this.state.currentTabkey]
    const newDataSource = getNewArr(data).reduce((acc, cur, index) => {
      cur.align = 'center'
      cur.key = index
      cur[param] = dateKey[index]
      if (~cur.view_rate) {
        cur.view_rate = cur.view_rate === 0 ? 0 : `${(cur.view_rate * 100).toFixed(2)}%`
      }
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
    chartData.yAxis = this.state.currentTabkey === 'over' ? {
      type: 'value',
      name: '访问次数/次'
      // nameRotate: 90,
      // nameLocation: 'center',
      // nameGap: 30,
    } : [
      {
        type: 'value',
        name: ''
      },
      {
        type: 'value',
        name: '',
        // max: 100,
        axisLabel: {
          formatter: '{value}.00 %'
        }
      }
    ]
    chartData.legend = {}
    chartData.grid = {left: '5%', right: '5%',}
    // chartData.color = ['#3ac0fc', '#2418ff', '#ea312a']
    chartData.tooltip = {
      trigger: 'axis',
    }
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
    // console.log(params)
    defaultPickerDate = Object.assign({}, defaultPickerDate, params)
  }

  submit = (formCustom) => {
    // console.log(this.getDefaultPicker())
    this.setState({
      formCustom
    }, () => {
      this.getBootMountData(this.state.formCustom)
    })

  }
  changeChannel = (id) => {
    let channelList = this.state.channelList
    for (let i = 0; i < channelList.length; i++) {
      let search_channel = channelList[i]
      if (id === search_channel.id) {
        this.setState({
          search_channel
        }, () => {
          this.getBootMountData(this.state.formCustom)
        })
      }
    }
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
      channelList,
      currentTabkey,
      search_channel_id,
      showNumber
    } = this.state
    const currentName = list.find(ele => ele.key === curTab).name
    return (
      <div className="main-page-box channel-access">
        <header className="header-box">
          <div className="title-box">
            <span className="title">5S停留频道访问
              <Popover placement="rightTop" title='访问率计算：' content={PopoverContent} overlayClassName='help-popover'>
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
          {currentTabkey !== 'over' && channelList.length && <div><div className="sel-box">
            选择频道&nbsp;&nbsp;
            <Select defaultValue={search_channel_id} style={{width: 100}} onChange={this.changeChannel.bind(this)}>
              {
                channelList.map((channel, index) => {
                  return (<Option value={channel.id} key={index}>{channel.name}</Option>)
                })
              }
            </Select>
          </div>
          <div className="sel-box">
            按&nbsp;&nbsp;
            <Select defaultValue="day" style={{width: 100}} onChange={this.changeSelect.bind(this)}>
              <Option value="day">天</Option>
              <Option value="week">周</Option>
              <Option value="month">月</Option>
            </Select>
            &nbsp;&nbsp;查看
          </div></div>}
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

export default channelAccess5s

