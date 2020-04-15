import React, { Component } from "react";
import { Layout, notification } from "antd";
import MenuSelf from "./menu";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { logout } from "@/api/user";
import removeAuth from "@/store/actions/user";
import { SvgIcon } from "_c";

const { Sider } = Layout;

class wholeMenu extends Component {
  getLogout = async () => {
    // 调用推出接口，跳转到登录页，清除本地store
    try {
      await logout();
      this.props.history.push({ pathname: "/login" });
      this.props.dispatch(removeAuth.removeAuth());
    } catch (e) {
      console.log("退出失败", e);
      notification.error({ description: e });
    }
  };
  render() {
    return (
      <Sider className="sidemenu" ref={this.sidemenu}>
        <header className="header-box">
          <h2 className="header-title">自研BI平台</h2>
          <img
            src={require("@/assets/images/default_head.png")}
            alt="用户头像"
            className="header-img"
          />
          <p className="header-name">{this.props.auth.username}</p>
        </header>
        <MenuSelf />
        <footer className="footer-exit" onClick={this.getLogout}>
          <SvgIcon iconClass="power" color="#fff" propClass="power-icon" />
          <span>注销登录</span>
        </footer>
      </Sider>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.userManage.userData
  };
};

export default connect(mapStateToProps)(withRouter(wholeMenu));
