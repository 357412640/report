import React, {Component} from 'react'
import './index.scss'
import ScreeningCondition from '_c/screeningCondition'
import {notification, Popover, Select, Table, Icon} from 'antd'
import {BtnTag, SvgIcon} from '_c'
import exportExcel from '@/utils/exportExcel'
import {deepCopy} from '@/utils/deepcopy'
import {topicDetailData} from '@/api/launcher-data'
import {getData} from '@/api/application'

const {Option} = Select
const list = [
  {key: 'click', name: '专题详情'}
]

const libs = {
  count: '数量'
}

const columnLibs = {
  click: [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: '资源名称',
      dataIndex: 'item_name',
      key: 'item_name',
    },
    {
      title: '点击次数',
      dataIndex: 'click_number_count',
      key: 'click_number_count',
    },
    {
      title: '点击人数',
      dataIndex: 'click_people_count',
      key: 'click_people_count',
    }
  ]
}

let currentTabkey

const getNewArr = data => {
  return Object.keys(data).reduce((acc, cur) => acc.concat(data[cur]), [])
}

let defaultPickerDate = {}

class topicDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formCustom: {},
      curTab: 'click',
      loading: false,
      columns: [],
      dataSource: [],
      group: 'day',
      channelList: [],
      search_channel: '',
      search_channel_id: ''
    }
    this.isFetching = false
  }

  componentDidMount() {
    currentTabkey = 'click'
    let parmas = defaultPickerDate
    // this.getBootMountData(parmas)
    this.getChannelList()
    this.setState({
      formCustom: parmas
    })
  }

  getBootMountData = async (formCustom) => {
    let params = formCustom ? formCustom : {}
    params.group = this.state.group
    params.search_topic = JSON.stringify(this.state.search_channel)
    const fetchFun = topicDetailData

    if ('' === this.state.search_channel) {
        return
    }
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
  }

  convertTableData = data => {
    data = deepCopy(data)
    console.log(data)
    const dateKey = Object.keys(data)
    const newColumn = columnLibs[currentTabkey]
    const newDataSource = []
    let i = 0
    dateKey.forEach(date => {
      if (data[date].length) {
        for (let j = 0; j < data[date].length; j++) {
          let newItem = {
            date,
            key: i,
            ...data[date][j]
          }
          newDataSource.push(newItem)
          i++
        }
      }
    })
    console.log(newDataSource)
    this.setState({
      columns: newColumn,
      dataSource: newDataSource,
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

  getChannelList = async () => {
    try {
      let params = {
        type: 'topic'
      }
      let res = await getData(params)
      let data = res.data
      if (data.errno === 10000) {
        let channelList = data.data.topic
        let search_channel = channelList[0]
        let search_channel_id = channelList[0].id
        this.setState({
          channelList,
          // search_channel,
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

  changeChannel = (id) => {
    console.log(id);
    
    let channelList = this.state.channelList
    for (let i = 0; i < channelList.length; i++) {
      let search_channel = channelList[i]
      if (id === search_channel.topic_name) {
        this.setState({
          search_channel
        }, () => {
          this.getBootMountData(this.state.formCustom)
        })
      }
    }
  }

  render() {
    const {
      loading,
      curTab,
      dataSource,
      columns,
      channelList,
      search_channel_id
    } = this.state
    const currentName = list.find(ele => ele.key === curTab).name
    return (
      <div className="main-page-box dropdown-page">
        <header className="header-box">
          <div className="title-box">
            <span className="title">专题详情</span>
            <div className="screenBtn">
              {/* screeningType: 一级下拉框列表类型 onSubmit: 返回搜索条件 */}
              <ScreeningCondition onSubmit={this.submit.bind(this)} getDefaultPicker={this.getDefaultPicker.bind(this)}/>
            </div>
          </div>
          <div className="common-flex">
            <BtnTag list={list} func={this.renderBtn} cur={this.state.curTab}/>
            <div className="icon-btn-box">
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
        {/* <section className="common-table-box">
          <div className="sel-box">
            选择专题&nbsp;&nbsp;
            <Select defaultValue="day" style={{width: 100}} onChange={this.changeSelect.bind(this)}>
              <Option value="day">请选择</Option>
              <Option value="week">周</Option>
              <Option value="month">月</Option>
            </Select>
          </div>
        </section> */}
        <section className="common-table-box">
          <div className="sel-box">
            选择专题&nbsp;&nbsp;
            <Select showSearch value={this.state.search_channel.topic_name} style={{minWidth: 200}} onChange={this.changeChannel.bind(this)}>
              {channelList.map(app => (
                <Option key={app.topic_id} value={app.topic_name}>{app.topic_name}</Option>
              ))}
            </Select>

            &nbsp;&nbsp;按&nbsp;&nbsp;
            <Select defaultValue="day" style={{width: 100}} onChange={this.changeSelect.bind(this)}>
              <Option value="day">天</Option>
              <Option value="week">周</Option>
              <Option value="month">月</Option>
            </Select>
            &nbsp;&nbsp;查看
          </div>
          <div className="sheet">
            <Table
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                pagination={false}
              />
          </div>
        </section>
      </div>
    )
  }
}

export default topicDetail

