import React, {PureComponent} from 'react';
import {Spin} from 'antd';
import Chart from '../component';
import lineOption from './lineOptions';
   /**
   *  onEvents 图表事假，详情见echart 官网 , 实例见使用行为——单次时长分布
   * */
const chartOptionMap = {
  line: lineOption,
};

class BaseCharts extends PureComponent {
  updateOption = () => {
    const {params} = this.props;
    return (
      (Object.keys (params.data).length && params.data) ||
      chartOptionMap[params.type] ()
    );
  };

  render () {
    const loading =this.props.loading;
    return (
      <div className="base-charts-wrapper">
        <section
          style={{minHeight: '400px', width: '100%'}}
        >
          {
            <Spin spinning={loading}>
              <Chart
                option={this.updateOption ()}
                style={{width: '100%', height: '100%', minHeight: '400px'}}
                onEvents={this.props.onEvents}
              />
            </Spin>
          }
        </section>
      </div>
    );
  }
}

export default BaseCharts;
