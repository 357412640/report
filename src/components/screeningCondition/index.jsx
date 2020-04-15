import React, {Component} from 'react'
import {Button, DatePicker, Select, Form, Icon, Modal, Row, Col, Tooltip} from 'antd'
import moment from 'moment';
import './index.scss'
import {getData} from '@/api/core-data'

const {RangePicker} = DatePicker
const {Option} = Select

// 计算默认一周日期
const getDays = (day = 1) => {
  return day * 24 * 60 * 60 * 1000
}
const dateFormat = 'YYYY-MM-DD'
const date = new Date().getTime()
const endTime = new Date(date - getDays())
// console.log(endTime)
let endYear = endTime.getFullYear()
let endMonth = endTime.getMonth() + 1
let endDay = endTime.getDate()
if (endMonth >= 1 && endMonth < 10) {
  endMonth = '0' + endMonth
}
if (endDay >= 1 && endDay < 10) {
  endDay = '0' + endDay
}

const startTime = new Date(date - getDays(7))
let startYear = startTime.getFullYear()
let startMonth = startTime.getMonth() + 1
let startDay = startTime.getDate()
if (startMonth >= 1 && startMonth < 10) {
  startMonth = '0' + startMonth
}
if (startDay >= 1 && startDay < 10) {
  startDay = '0' + startDay
}
const startDate = startYear + '-' + startMonth + '-' + startDay
const endDate = endYear + '-' + endMonth + '-' + endDay


const defaultScreeningList = {
  TV: [
    {
      title: '全部',
      value: ''
    },
    {
      title: '电视型号',
      value: 'model'
    },
    {
      title: 'OS版本号',
      value: 'os_version'
    },
    {
      title: '设备分组',
      value: 'group'
    },
    {
      title: '地域',
      value: 'district'
    },
    {
      title: '电视平台',
      value: 'platform'
    },
    {
      title: '电视品牌',
      value: 'brand'
    }
  ],
  BX: [
    {
      title: '全部',
      value: ''
    },
    {
      title: '冰箱型号',
      value: 'fridge_model'
    },
    {
      title: 'OS版本号',
      value: 'os_version'
    },
    {
      title: '设备分组',
      value: 'group'
    },
    {
      title: '地域',
      value: 'district'
    }
  ]
}

let screeningList = {}
class ScreeningCondition extends Component {
  constructor(props) {
    super(props)

    this.state = {
      screenChild: [], // 选中的二级数据
      isShow: false,
      screenBtnType: 'down', // 筛选按钮图标
      screenDefaultData: {}, // 通用数据全量
      subScreenTitle: '', // 二级选择器title
      // 保存当前确定的搜索条件
      defaultSearchInfo: [
        {
          // 一级选择器数据
          selectDefault: '',
          // 二级选择器数据
          subSelectDefault: []
        }
      ],
      // 当前选中的搜索条件
      // selectSearchInfo: [
      //   {
      //     // 一级选择器默认数据
      //     selectDefault: '',
      //     // 二级选择器默认数据
      //     subSelectDefault: []
      //   }
      // ],
      // 一级选择器默认数据
      selectDefault: '',
      // 二级选择器默认数据
      subSelectDefault: [],
      saveSelect: '',
      saveSubSelect: [],
      subAll: false,
      startDate: startDate.split('-').join(''),
      endDate: endDate.split('-').join(''),
      screenCon: '',
      moment: [moment(startDate, dateFormat), moment(endDate, dateFormat)],
      clearFlag: false
    }
  }

  componentDidMount() {
    const screeningKeys = []
    screeningList = defaultScreeningList[this.props.screeningType] || defaultScreeningList.TV
      screeningList.forEach(item => {
      if (item.value) {
        screeningKeys.push(item.value)
      }
    })
    let params = {
      type: screeningKeys.join(',')
    }
    getData(params).then(res => {
      let data = res.data
      if (data.errno === 10000) {
        this.setState({
          screenDefaultData: data.data
        })
      } else {
        Modal.warning({
          title: '通用数据获取失败',
          content: `原因：${data.errmsg}`
        })
      }
    })
    this.getDefaultPicker([startDate, endDate])
  }
  getDefaultPicker (dateStr) {
    const start_date = dateStr[0].split('-').join('')
    const end_date = dateStr[1].split('-').join('')
    let params = {
      start_date,
      end_date
    }
    this.props.getDefaultPicker(params)
  }

  getScreening = () => {
    const children = []
    for (let i = 0; i < screeningList.length; i++) {
      let item = screeningList[i]
      children.push(
        <Option value={item.value} key={item.value}>{item.title}</Option>
      )
    }
    return children
  }
  // 初始化选择器
  initSelect = () => {
    const screen = []
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      }
    }
    const selectLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      }
    }
    for (let i = 0; i < this.state.defaultSearchInfo.length; i++) {
      screen.push(
        <Row key={i}>
          <Col span={6}>
            <Form.Item {...formItemLayout} label="筛选类型">
              <Select className="screening-select" value={this.state.saveSelect}
                      onChange={this.selectChange.bind(this)}>
                {this.getScreening()}
              </Select>
            </Form.Item>
          </Col>
          <Col span={17}>
            {/* 二级下拉框 */}
            {this.state.screenChild && this.state.screenChild.length !== 0 &&
            <Form.Item {...selectLayout} label={this.state.subScreenTitle}>
              <Select mode="multiple" className="multiple" value={this.state.saveSubSelect}
                      onChange={this.subSelectChange.bind(this)}>
                {this.showSubScreen()}
              </Select>
            </Form.Item>
            }
          </Col>
        </Row>
      )
    }
    return screen
  }

  // 显示二级列表
  showSubScreen = () => {
    if (this.state.screenChild.length) {
      const subScreen = []
      subScreen.push(<Option value='all' key='000'>不限</Option>)
      for (let i = 0; i < this.state.screenChild.length; i++) {
        let item = this.state.screenChild[i]
        subScreen.push(
          <Option value={item.name} key={item.id}>
            <Tooltip placement="left" title={item.name}>
              {item.name}
            </Tooltip>
          </Option>
        )
      }
      return subScreen
    }
  }

  screenClick = () => {
    if (this.state.screenBtnType === 'down') {
      // 回显搜索列表信息，如果以及
      if (this.state.selectDefault === '') {
        this.setState(
          {
            screenChild: []
          }
        )
      }
      this.setState(
        {
          isShow: true,
          screenBtnType: 'up',
          saveSelect: this.state.selectDefault,
          saveSubSelect: this.state.subSelectDefault
        }
      )
    } else {
      this.setState(
        {
          isShow: false,
          screenBtnType: 'down'
        }, () => {
          this.handleCancel()
          }
      )
    }
  }
  handleSubmit = () => {
    let saveSubSelect = []
    let subAll = false
    let index = this.state.saveSubSelect.indexOf('all')
    if (this.state.saveSubSelect.length) {
      saveSubSelect = this.state.saveSubSelect
      if (~index) {
        subAll = true
      }
    } else {
      saveSubSelect.push('all')
      subAll = true
    }
    this.setState(
      {
        isShow: false,
        screenBtnType: 'down',
        selectDefault: this.state.saveSelect,
        subSelectDefault: saveSubSelect
      },
      () => {
        let data = {}
        data.start_date = this.state.startDate
        data.end_date = this.state.endDate
        let subCon = []
        let screenCon = ''
        if (this.state.selectDefault) {
          // 筛选类型
          let query_type = data.query_type = this.state.selectDefault
          // 二级选择
          let subQuery = query_type + 's'
          data[subQuery] = []
          if (subAll) {
            subCon.push('不限')
          } else {
            if (!this.state.subAll) {
              let queryList = this.state.screenDefaultData[query_type]
              let subSelectDefault = this.state.subSelectDefault
              // 选中二级
              for (let i = 0; i < subSelectDefault.length; i++) {
                let select = subSelectDefault[i]
                // 一级选中全量
                for (let j = 0; j < queryList.length; j++) {
                  let query = queryList[j]
                  if (select === query.name) {
                    data[subQuery].push(query)
                    subCon.push(query.name)
                  }
                }
              }
              data[subQuery] = JSON.stringify(data[subQuery])
            }
          }
          screenCon = `${this.state.subScreenTitle}: ${subCon}`
        } else {
          if (!this.state.clearFlag) {
            screenCon = '全部'
          }

        }
        this.setState({
          screenCon
        })
        // console.log(screenCon)
        this.props.onSubmit(data)
      }
    )
  }
  handleCancel = () => {
    this.setState(
      {
        isShow: false,
        screenBtnType: 'down',
        clearFlag: false
      }
    )
  }

  selectChange = (value) => {
    // 如果当前选择全部，则清空二级选择内容及二级下拉列表
    if (value === '') {
      this.setState({
        screenChild: [],
        saveSelect: value,
        saveSubSelect: []
      })
      return
    }
    for (let i = 0; i < screeningList.length; i++) {
      let item = screeningList[i]
      if (item.value === value) {
        this.setState({
          subScreenTitle: item.title
        })
      }
    }
    // console.log(value)
    this.setState({
      screenChild: this.state.screenDefaultData[value],
      saveSelect: value,
      saveSubSelect: []
    })
  }
  subSelectChange = (value) => {
    // 二级勾选条件
    let index = value.indexOf('all')
    // console.log(index)
    if (~index && !this.state.subAll) { // 如果当前勾选的是不限，subSelect = ['all']
      this.setState({
        saveSubSelect: ['all'],
        subAll: true
      })
    } else if (~index && this.state.subAll) { // 如果在不限被勾选时选择其他条件，删除不限选项
      value.splice(index, 1)
      this.setState({
        saveSubSelect: value,
        subAll: false
      })
    } else {
      this.setState({
        saveSubSelect: value,
        subAll: false
      })
    }
  }

  // 日期变化
  pickerChange = (value, dateStr) => {
    this.setState(
      {
        startDate: dateStr[0].split('-').join(''),
        endDate: dateStr[1].split('-').join('')
      }, () => {
        this.handleSubmit()
      }
    )
  }

  // 清空搜索条件
  clearSearch () {
    let {saveSelect, saveSubSelect} = this.state
    saveSelect = ''
    saveSubSelect = []
    this.setState({
      saveSelect,
      saveSubSelect,
      clearFlag: true
    }, () => {
      this.handleSubmit()
    })
    // console.log(saveSelect, saveSubSelect)
  }

  submit = () => {
    this.setState({
      clearFlag: false
    }, () => {
      this.handleSubmit()
    })
  }

  render() {
    return (
      <div className="screening-box">
        <div>
          { this.state.screenCon !== '' &&
            <span className='screen-show'>
              <span className="screenCon">{this.state.screenCon}</span>
              <Icon onClick={this.clearSearch.bind(this)} type="close-circle" theme="filled" className='circle-icon' />
            </span>
          }

          <Button type="link" onClick={this.screenClick} className="screen-btn">
            <span>筛选</span>
            <Icon type={this.state.screenBtnType} className="screen-btn-icon"/>
          </Button>
          <RangePicker style={{width: 220}} defaultValue={this.state.moment} onChange={this.pickerChange.bind(this)}/>
        </div>
        {/* 筛选条件盒子 */}
        {this.state.isShow &&
        <div className="search-list">
          <Form>
            {this.initSelect()}
            <Form.Item wrapperCol={{span: 20, offset: 2}}>
              <Button type="primary" htmlType="submit" onClick={this.submit.bind(this)}>确定</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleCancel.bind(this)}>取消</Button>
            </Form.Item>
          </Form>
        </div>
        }
      </div>
    )
  }
}

export default ScreeningCondition
