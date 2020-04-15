import React, {Component} from 'react';
import PropTypes from 'prop-types';

class BtnTab extends Component {
  render() {
    const {list, func, cur} = this.props
    const renderBtn = list.map((ele, index) => 
        <div className={cur === ele.key ? 'common-tab current-tab' : 'common-tab'} onClick={() => func(ele.key)} key={index}>
          {ele.name}
        </div>
      );
    return <div className='common-flex common-btn-box'>{renderBtn}</div>;
  }
}

BtnTab.propTypes = {
  list: PropTypes.array,
  func: PropTypes.func,
};

export default BtnTab;
