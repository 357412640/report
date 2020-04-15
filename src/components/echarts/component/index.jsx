import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

class MyEcharts extends React.Component {
  render() {
    return <ReactEchartsCore echarts={echarts} {...this.props} notMerge={true} theme='light' />;
  }
}

export default MyEcharts