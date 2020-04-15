import React, {Component} from 'react';
import {Table, Popover, notification, Select, Icon} from 'antd';
import {BtnTag, SvgIcon} from '_c';
import {MyLineChart} from '_c/echarts';
import exportExcel from '@/utils/exportExcel';
import {deepCopy} from '@/utils/deepcopy';
import {useLongavg, useLongdis, useTime} from '@/api/core-data';
import ScreeningCondition from '_c/screeningCondition';
import './index.scss';
import 'echarts/lib/chart/pie';

const {Option} = Select;

const list = [
  {key: 'useLongavg', name: '次均开机时长'},
  {key: 'useLongdis', name: '单次时长分布'},
  {key: 'useTime', name: '开机时段'},
];

const libs = {
  time_single: '次均开机时长',
  count_mac: '开机设备数',
  count_bootup: '开机次数'
};

const columnLibs = {
  useLongavg: [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      align: 'center'
    },
    {
      title: '次均开机时长',
      dataIndex: 'time_single',
      key: 'time_single',
      align: 'center'
    }
  ],
  useLongdis: [
    {
      title: '开机时段',
      dataIndex: 'date',
      key: 'date',
      align: 'center'
    },
    {
      title: '开机用户数',
      dataIndex: 'count_mac',
      key: 'count_mac',
      align: 'center'
    }
  ],
  useTime: [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      align: 'center'
    },
    {
      title: '开机设备数',
      dataIndex: 'count_mac',
      key: 'count_mac',
      align: 'center'
    },
    {
      title: '开机次数',
      dataIndex: 'count_bootup',
      key: 'count_bootup',
      align: 'center'
    },
  ],
};

const getNewArr = data => {
  return Object.keys (data).reduce ((acc, cur) => acc.concat (data[cur]), []);
};

const PopoverContent= (
  <div>
    <p>均次开机时长：单次开机时长均值。</p>
    <p>单次时长分布：开机时长落在时间切片中的次数。</p>
    <p>开机时段：开机动作发生在每个时间区间内的设备数/次数。</p>
  </div>
)

let currentTabkey

const charLabel = {
  normal: {
    show: true
  }
}

class TVuse extends Component {
  constructor () {
    super ();
    this.state = {
      curTab: 'useLongavg',
      loading: false,
      isTable: false,
      chartData: {},
      columns: [],
      dataSource: [],
      defaultData: {},
      onEvents: {
        updateAxisPointer: this.onChartUpdateAxisPointer,
        mouseover: this.onMouseOver
      },
      pieChartData: {

      },
      pieShow: false,
      showNumber: false
    };
    this.isFetching = false;
    this.params = {group: 'day'}
    this.pieIndex = -1
    this.pieStyle = {
      left: '220px'
    }
  }

  componentDidMount () {
    currentTabkey = 'useLongavg'
    this.getBootMountData ()
  }

  getBootMountData = async () => {
    const fetchFun = currentTabkey === 'useLongavg'
      ? useLongavg
      : currentTabkey === 'useLongdis' ? useLongdis : useTime
    console.log('当前key', currentTabkey)
    // 清空上次请求数据
    this.setState ({chartData: {}})
    // 如果本次请求是开机时段，删除group条件
    const params = deepCopy(this.params)
    currentTabkey !== 'useLongavg' && delete params.group
    try {
      this.isFetching = true;
      this.setState ({loading: true});
      const res = await fetchFun (params);
      let data = res.data
      if (data.errno === 10000) {
        let newData = data.data
        // 过滤数据，如果是次均开机时长useLongavg， 只用time_single的数据
        if (currentTabkey === 'useLongavg') {
          for (let key in newData){
            delete newData[key].time_mac
            delete newData[key].time_sum
          }
        }
        // 转换数据
        this.convertData (newData);
        this.isFetching = false;
        this.setState ({loading: false});
      } else {
        throw data.errmsg;
      }
    } catch (e) {
      console.log (e);
      notification.error ({description: e});
      this.isFetching = false;
      this.setState ({loading: false});
    }
  };

  convertData = data => {
    this.convertTableData (data);
    this.convertChartData (data);
  };

  convertTableData = data => {
    data = deepCopy (data);
    const dateKey = Object.keys (data);
    const newColumn = columnLibs[currentTabkey];
    const newDataSource = getNewArr (data).reduce ((acc, cur, index) => {
      cur.align = 'center';
      cur.key = index;
      cur.date = dateKey[index];
      return acc.concat (cur);
    }, []);
    this.setState ({
      columns: newColumn,
      dataSource: newDataSource,
    });
  };

  convertChartData = data => {
    data = deepCopy (data);
    const chartData = {};
    let defaultData = {}
    chartData.xAxis = {
      type: 'category'
    };
    chartData.yAxis = {
      type: 'value',
      name: currentTabkey === 'useLongavg'
        ? 'min'
        : currentTabkey === 'useLongdis' ? '开机次数/次' : '数量',
      // nameRotate: 90,
      // nameLocation: 'center',
      // nameGap: 30,
    };
    chartData.grid = {left: '5%', right: '5%'};
    // chartData.color = ['#3ac0fc', '#2418ff', '#ea312a'];
    chartData.tooltip = {
      trigger: 'axis'
    };
    if(currentTabkey === 'useLongdis') {
      let keyArr = Object.keys(data)
      let newData = {}
      // console.log(data)
      // 重构数据，每6个为一组， 如果有第49个数据，单独为24+
      for (let i = 0; i < 9; i++) {
        if (i === 8) {
          if (keyArr.length > 48) {
            newData['24+'] = {}
            newData['24+'].count = data[keyArr[49]].count
          }
        } else {
          let itemArr =  keyArr.slice(i * 6, (i + 1) * 6)
          let key = i * 3 + '~' + (i + 1) * 3
          let item = {}
          let deItem = {}
          itemArr.forEach((key, index) => {
            deItem[key] = data[key].count
            item['count' + index] = data[key].count
          })
          newData[key] = item
          defaultData[key] = deItem
        }
      }
      chartData.xAxis.data = Object.keys (newData)
      chartData.series = this.getSource (newData);
      chartData.tooltip.showContent = false
      // console.log(chartData)
    } else {
      chartData.legend = {};
      chartData.xAxis.data = Object.keys (data)
      chartData.series = this.getSeries (data);
    }

    this.setState ({
      chartData,
      defaultData
    });
  };

  getSeries = data => {
    const newSeries = [];
    const newArr = getNewArr (data);
    Object.keys (newArr.length && newArr[0]).forEach (ele => {
      const line = {};
      line.data = newArr.reduce ((acc, cur) => acc.concat (cur[ele]), []);
      line.name = libs[ele];
      line.type = 'line';
      if (this.state.showNumber) {
        line.label = charLabel
      }
      newSeries.push (line);
    });
    return newSeries;
  };
  getSource = data => {
    const newSeries = [];
    const newArr = getNewArr (data);
    Object.keys (newArr.length && newArr[0]).forEach (ele => {
      const line = {};
      line.data = newArr.reduce ((acc, cur) => acc.concat (cur[ele]), []);
      line.name = ele;
      line.type = 'bar';
      line.stack = '总量'
      if (this.state.showNumber) {
        line.label = charLabel
      }
      newSeries.push (line);
    });
    return newSeries;
  }

  renderBtn = key => {
    if (this.isFetching) return;
    if (currentTabkey !== key) {
      this.setState ({curTab: key});
      currentTabkey = key;
      this.getBootMountData ();
    }
  };

  toExportExcel = currentName => {
    exportExcel (this.state.dataSource, currentName, this.state.columns);
  };

  ObtainFilter = (data) => {
    console.log('筛选条件', data)
    this.params = {...deepCopy(data)}
    this.getBootMountData();
  }

  changeGroup = (value) => {
    this.params.group = value
    this.getBootMountData()
  }
  // 更新饼状体数据
  onChartUpdateAxisPointer = (event) => {
    if (currentTabkey !== 'useLongdis') return
    let index = event.dataIndex
    let pieShow = false
    if (index !== undefined) {
      pieShow = true
      this.setState({
        pieShow
      }, () => {
        if (this.pieIndex === index) {
          return
        } else {
          this.pieIndex = index
        }
        if (index < 4) {
          this.pieStyle = {
            right: '20px'
          }
        } else {
          this.pieStyle = {
            left: '220px'
          }
        }
        let deArr =  Object.keys(this.state.defaultData)
        let title = deArr[index] + '小时开机次数'
        let data = this.state.defaultData[deArr[index]]
        let dataArr = Object.keys(data)
        let pieChartData = {
          title: {
            text: ''
          },
          series : {
            type: 'pie',
            radius : '65%',
            center: ['50%', '50%'],
            data:[],
            label: {
              formatter: '{b}小时: {c}次'
            }
          }
        }
        pieChartData.title.text = title
        pieChartData.series.data = dataArr.map((key) => {
          let item = {}
          item.name = key
          item.value = data[key]
          return item
        })
        // console.log(pieChartData)
        this.setState({
          pieChartData
        })
      })
    } else {
      if (this.state.pieShow) {
        this.setState({
          pieShow
        })
      }
    }
  }
  onMouseOver = (e) => {
        // console.log(e.event.offsetX, e.event.offsetY)
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

  render () {
    const {
      loading,
      isTable,
      curTab,
      chartData,
      dataSource,
      columns,
      onEvents,
      pieChartData,
      pieShow,
      showNumber
    } = this.state;
    const currentName = list.find (ele => ele.key === curTab).name;
    return (
      <div className="main-page-box common-title">
        <div className="title-box">
          <span className="title">使用行为
            <Popover placement="rightTop" title='数据指标定义：' content={PopoverContent} overlayClassName='help-popover'>
                <Icon type="question-circle" theme="filled" className='help-icon'/>
              </Popover>
          </span>
          <div className="screenBtn">
            {/* screeningType: 一级下拉框列表类型 onSubmit: 返回搜索条件 */}
            <ScreeningCondition onSubmit={this.ObtainFilter} getDefaultPicker={(date) => {this.params = {...this.params, ...date}}} />
          </div>
        </div>
        <header className="common-flex header-box">
          <BtnTag list={list} func={this.renderBtn} cur={this.state.curTab} />
          <div className="icon-btn-box">
            {isTable
              ? <Popover
                content="点击查看图表"
                trigger="hover"
                onClick={() => {
                  this.setState ({isTable: false});
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
              onClick={() => this.toExportExcel (currentName)}
            >
              <span style={{opacity: 0}}>.</span>
              <Icon type="cloud-download" className='common-icon-btn'/>
            </Popover>
          </div>
        </header>
        <section className="common-table-box">
          {curTab === 'useLongavg' &&
          <div className="sel-box">
            按&nbsp;&nbsp;<Select defaultValue="day" style={{width: 100}} onChange={value => {this.changeGroup(value)}}>
            <Option value="day">天</Option>
            <Option value="week">周</Option>
            <Option value="month">月</Option>
          </Select>&nbsp;&nbsp;查看
          </div>}
          <div className="sheet">
            {!isTable
              ? <MyLineChart params={{type: 'line', data: chartData}} onEvents={onEvents} loading={loading} />
              : <Table
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                pagination={false}
              />}
          </div>
        </section>

        {pieShow && <div className="pie-chart-box" style={this.pieStyle}>
          <MyLineChart params={{type: 'line', data: pieChartData }} loading={false} />
        </div>}
      </div>
    );
  }
}

export default TVuse;
