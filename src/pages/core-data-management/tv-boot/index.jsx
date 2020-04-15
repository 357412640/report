import React, {Component} from 'react';
import {Table, Popover, notification, Select, Icon} from 'antd';
import {BtnTag, SvgIcon} from '_c';
import {MyLineChart} from '_c/echarts';
import exportExcel from '@/utils/exportExcel';
import {deepCopy} from '@/utils/deepcopy';
import {bootMount, bootLong, bootTime} from '@/api/boot-tv';
import Filter from '_c/screeningCondition';
import './tv-boot.scss';

const {Option} = Select;

const list = [
  {key: 'mount', name: '开机数'},
  // {key: 'timePeriods', name: '开机时段'},
  {key: 'totalTime', name: '开机时长'},
];

const libs = {
  count_bootup: '开机次数',
  count_mac: '开机用户数',
  time_sum: '开机时长',
  time_mac: '人均开机时长',
};

const columnLibs = {
  mount: [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      align: 'center'
    },
    {
      title: '开机次数',
      dataIndex: 'count_bootup',
      key: 'count_bootup',
      align: 'center'
    },
    {
      title: '开机用户数',
      dataIndex: 'count_mac',
      key: 'count_mac',
      align: 'center'
    },
  ],
  timePeriods: [
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
    },
  ],
  totalTime: [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      align: 'center'
    },
    {
      title: '开机时长',
      dataIndex: 'time_sum',
      key: 'time_sum',
      align: 'center'
    },
    {
      title: '人均开机时长',
      dataIndex: 'time_mac',
      key: 'time_mac',
      align: 'center'
    },
  ],
};

const getNewArr = data => {
  return Object.keys(data).reduce((acc, cur) => acc.concat(data[cur]), []);
};

// 初始数据
const summaryData = {
  // 开机数：开机总次数、均开机次数、均开机设备数、人均开机次数
  upCount: {
    totalCount: '',
    perCount: '',
    perDevice: '',
    perUp: ''
  },
  // 开机时长：开机总时长、均开机时长、人均开机时长
  upTime: {
    totalTime: '',
    perTime: '',
    perUpTime: ''
  }
}

const charLabel = {
  normal: {
    show: true
  }
}

class TVbootIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curTab: 'mount',
      loading: false,
      isTable: false,
      chartData: {},
      columns: [],
      dataSource: [],
      // 汇总数据
      summaryData,
      showNumber: false
    };
    this.currentTabkey = 'mount';
    this.isFetching = false;
    this.params = {group: 'day', name: '日'}
  }

  componentDidMount() {
    // 数据概览跳转
    if (undefined !== this.props.location.state) {
      let curTab = this.props.location.state.curTab
      console.log(curTab);
      if (curTab) {
        this.setState({
          curTab: curTab,
        })
  
        this.currentTabkey = curTab
      }
    }

    this.getBootMountData();
  }

  getSeries = data => {
    const newSeries = [];
    const newArr = getNewArr(data);

    // 计算汇总数据
    // 获取 天/周/月 数
    let currentCount = newArr.length || 1

    // 开机数
    let arrCount, arrMac, totalCount, totalMac, perCount, perDevice, perUp
    // 开机时长
    let arrTime, arrTimeMac, totalTime, totalTimeMac, perTime, perUpTime

    Object.keys(newArr.length && newArr[0]).forEach(ele => {
      const line = {};
      line.data = newArr.reduce((acc, cur) => acc.concat(cur[ele]), []);
      line.name = libs[ele];
      line.type = 'line';
      if (this.state.showNumber) {
        line.label = charLabel
      }
      newSeries.push(line);

      // 开机数
      if (this.currentTabkey === 'mount') {
        if (ele === 'count_bootup') {
          arrCount = line.data
          totalCount = arrCount.reduce((acc, cur) => acc + cur)
        } else if (ele === 'count_mac') {
          arrMac = line.data
          totalMac = arrMac.reduce((acc, cur) => acc + cur)
        }

      } else { // 开机时长
        if (ele === 'time_sum') {
          arrTime = line.data
          totalTime = arrTime.reduce((acc, cur) => acc + cur)
        } else if (ele === 'time_mac') {
          arrTimeMac = line.data
          totalTimeMac = arrTimeMac.reduce((acc, cur) => acc + cur)
        }
      }
    });

    if (this.currentTabkey === 'mount') {
      let totalPerDayCount = 0
      for (let i = 0; i < currentCount; i++) {
        let count = arrCount[i]
        let mac = arrMac[i]
        let perDayCount = mac === 0 ? 0 : count / mac
        totalPerDayCount += perDayCount
      }

      perCount = (totalCount / currentCount).toFixed(2)
      perDevice = (totalMac / currentCount).toFixed(2)
      perUp = (totalPerDayCount / currentCount).toFixed(2)
      let upCount = {
        totalCount,
        perCount,
        perDevice,
        perUp
      }
      let summaryData = Object.assign({}, this.state.summaryData, {upCount})

      this.setState({
        summaryData
      })
    } else {
      perTime = (totalTime / currentCount).toFixed(2)
      perUpTime = (totalTimeMac / currentCount).toFixed(2)
      let upTime = {
        totalTime,
        perTime,
        perUpTime,
      }
      let summaryData = Object.assign({}, this.state.summaryData, {upTime})
      this.setState({
        summaryData
      })
    }
    return newSeries;
  };

  getBootMountData = async () => {
    const fetchFun = this.currentTabkey === 'mount'
      ? bootMount
      : this.currentTabkey === 'timePeriods' ? bootTime : bootLong;
    console.log('当前key', this.currentTabkey)
    // 清空上次请求数据
    this.setState({chartData: {}, summaryData: summaryData})
    // 如果本次请求是开机时段，删除group条件
    const data = deepCopy(this.params)
    this.currentTabkey === 'timePeriods' && delete data.group
    try {
      this.isFetching = true;
      this.setState({loading: true});
      const res = await fetchFun(data);
      if (res.errno === 10000) {
        let newData = res.data
        // 过滤数据，如果是次均开机时长useLongavg， 只用time_single的数据
        if (this.currentTabkey === 'totalTime') {
          for (let key in newData) {
            delete newData[key].time_single
          }
        }
        // 转换数据
        this.convertData(res.data);
        this.isFetching = false;
        this.setState({loading: false});
      } else {
        throw res.errmsg;
      }
    } catch (e) {
      console.log(e);
      notification.error({description: e});
      this.isFetching = false;
      this.setState({loading: false});
    }
  };

  convertData = data => {
    this.convertTableData(data);
    this.convertChartData(data);
  };

  convertTableData = data => {
    data = deepCopy(data);
    const dateKey = Object.keys(data);
    const newColumn = columnLibs[this.currentTabkey];
    const newDataSource = getNewArr(data).reduce((acc, cur, index) => {
      cur.align = 'center'
      cur.key = index;
      cur.date = dateKey[index];
      return acc.concat(cur);
    }, []);
    this.setState({
      columns: newColumn,
      dataSource: newDataSource,
    });
  };

  convertChartData = data => {
    data = deepCopy(data);
    const chartData = {};
    chartData.xAxis = {
      type: 'category',
      data: Object.keys(data),
    };
    chartData.series = this.getSeries(data);
    chartData.yAxis = {
      type: 'value',
      name: this.currentTabkey === 'mount'
        ? '总数'
        : this.currentTabkey === 'timePeriods' ? '用户数' : '时长/分钟',
      // nameRotate: 90,
      // nameLocation: 'center',
      // nameGap: 30,
    };
    chartData.legend = {};
    chartData.grid = {left: '5%', right: '5%'};
    // chartData.color = ['#3ac0fc', '#2418ff', '#ea312a'];
    chartData.tooltip = {
      trigger: 'axis',
    };
    this.setState({
      chartData,
    });
  };

  renderBtn = key => {
    if (this.isFetching) return;
    if (this.currentTabkey !== key) {
      this.setState({curTab: key});
      this.currentTabkey = key;
      this.getBootMountData();
    }
  };

  toExportExcel = currentName => {
    exportExcel(this.state.dataSource, currentName, this.state.columns);
  };

  ObtainFilter = (data) => {
    console.log('筛选条件', data)
    this.params = {...deepCopy(data)}
    this.getBootMountData();
  }

  changeGroup = (value) => {
    this.params.group = value
    switch (value) {
      case 'day':
        this.params.name = '日'
        break
      case 'week':
        this.params.name = '周'
        break
      case 'month':
        this.params.name = '月'

    }
    this.getBootMountData()
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
    } = this.state;
    const currentName = list.find(ele => ele.key === curTab).name;
    return (
      <div className="main-page-box">
        <div className='filter-box'>
          <h3>电视开机</h3>
          {/* screeningType: 一级下拉框列表类型 onSubmit: 返回搜索条件 */}
          <Filter onSubmit={this.ObtainFilter} getDefaultPicker={(date) => {
            this.params = {...this.params, ...date}
          }}/>
        </div>
        <header className="common-flex header-box">
          <BtnTag list={list} func={this.renderBtn} cur={this.state.curTab}/>
          <div className="icon-btn-box">
            {isTable
              ? <Popover
                content="点击查看图表"
                trigger="hover"
                onClick={() => {
                  this.setState({isTable: false});
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
        </header>
        <section className="common-table-box">
          {curTab !== 'timePeriods' &&
          <div className="sel-box">
            按&nbsp;&nbsp;<Select defaultValue="day" style={{width: 100}} onChange={value => {
            this.changeGroup(value)
          }}>
            <Option value="day">天</Option>
            <Option value="week">周</Option>
            <Option value="month">月</Option>
          </Select>&nbsp;&nbsp;查看
          </div>}
          <div className="sheet">
            {!isTable
              ?
              <div className='chart-box'>
                <MyLineChart params={{type: 'line', data: chartData}} loading={loading}/>
                <Popover className='summary-box' placement="rightTop" title='汇总：' content={<div >
                  {
                    (curTab === 'mount' &&
                      <div>
                        {/*<p style={{fontSize: '20px'}}>汇总：</p>*/}
                        <p>开机总次数：{summaryData.upCount.totalCount || '--'}</p>
                        <p>{this.params.name}均开机次数：{summaryData.upCount.perCount || '--'}</p>
                        <p>{this.params.name}均开机设备数：{summaryData.upCount.perDevice || '--'}</p>
                        <p>{this.params.name}人均开机次数：{summaryData.upCount.perUp || '--'}</p>
                      </div>) || (curTab === 'totalTime' &&
                      <div>
                        {/*<p style={{fontSize: '20px'}}>汇总：</p>*/}
                        <p>开机总时长：{summaryData.upTime.totalTime || '--'}                    </p>
                        <p>{this.params.name}均开机时长：{summaryData.upTime.perTime || '--'}</p>
                        <p>{this.params.name}人均开机时长：{summaryData.upTime.perUpTime || '--'}</p>
                      </div>)
                  }
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
    );
  }
}

export default TVbootIndex;
