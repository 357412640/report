import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button } from "antd";

class backtolast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      second: 5
    };
  }
  componentWillMount() {
    if (this.props.location.pathname === "/404") {
      this.timer = setInterval(() => {
        if (this.state.second === 0) this.backPrev();
        else {
          this.setState({
            second: this.state.second - 1
          });
        }
      }, 1000);
    }
  }

  backHome = () => {
    this.props.history.push("/home");
  };

  backPrev = () => {
    this.props.history.goBack();
  };
  render() {
    return (
      this.props.location.pathname === '/404' &&
      <div className="back-btn-group">
        <Button size="large" type="text" onClick={this.backHome}>
          返回首页
        </Button>
        <Button size="large" type="text" onClick={this.backPrev}>
          返回上一页({this.state.second}s)
        </Button>
      </div>
    );
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
}

export default withRouter(backtolast);
