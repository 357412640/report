import React, { Component } from "react";
import PropTypes from "prop-types";
import BackLast from './back-btn-group'
import "./error.scss";

class error404 extends Component {
  render() {
    return (
      <div className="error-page">
        <div className="content-con">
          <img src={this.props.src} alt={this.props.code} />
          <div className="text-con">
            <h4>{this.props.code}</h4>
            <h5>{this.props.desc}</h5>
          </div>
          <BackLast></BackLast>
        </div>
      </div>
    );
  }
}

error404.propTypes = {
  src: PropTypes.string,
  code: PropTypes.string,
  desc: PropTypes.string
};

error404.defaultProps = {
  src: require("@/assets/images/err-page/error-404.svg"),
  code: "404",
  desc: "Oh~~您的页面好像飞走了~"
};

export default error404;
