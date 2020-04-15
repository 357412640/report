import React, { Component } from "react";
import RoutesConfig from "@/router/config";
import { Menu } from "antd";
import { Link, withRouter } from "react-router-dom";
import addTabs from "@/store/actions/tagsnav";
import { connect } from "react-redux";
import "./index.scss";

const { SubMenu } = Menu;

class sidemenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultOpenKey: []
    };
    this.sidemenu = React.createRef();
    this.rootSubmenuKeys = [];
    this.isClickMenu = false;
    this.addTag = this.addTag.bind(this);
    this.initDefaultOpenKey = this.initDefaultOpenKey.bind(this);
    this.initRootSubmenuKeys = this.initRootSubmenuKeys.bind(this);
    this.getkey = this.getmetakey.bind(this)();
  }

  componentWillMount() {
    this.setState({
      defaultOpenKey: this.initDefaultOpenKey()
        ? [this.initDefaultOpenKey().path]
        : []
    });
    this.initRootSubmenuKeys();
  }

  // 初始化默认展开key
  initDefaultOpenKey(subkey = this.props.location.pathname) {
     return RoutesConfig.menus.find(ele => {
      if (ele.subs && ele.subs.length !== 0) {
        return (
          ele.subs.find(subs => {
            return subkey === subs.path;
          }) !== undefined
        );
      } else {
        return subkey === ele.path;
      }
    });
  }

  // rootSubmenuKeys初始化
  initRootSubmenuKeys() {
    RoutesConfig.menus.forEach(item => {
      this.rootSubmenuKeys.push(item.path);
    });
  }

  getmetakey() {
    return RoutesConfig.others.find(item => {
      return this.props.location.pathname === item.path;
    });
  }

  addTag(current) {
    // 触发store更新
    this.props.dispatch(addTabs.addNav(current));
    this.isClickMenu = true;
  }

  checkHasSubMenu(subList) {
    return subList.find(sub => {
      return (
        Object.keys(this.props.auth).length &&
        (this.props.auth.is_admin === 1 ||
          this.props.auth.menu.includes(sub.key))
      );
    });
  }

  // 打开当前时候关闭其他菜单
  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.defaultOpenKey.indexOf(key) === -1
    );
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ defaultOpenKey: openKeys });
    } else {
      this.setState({
        defaultOpenKey: latestOpenKey ? (latestOpenKey !== 'home' ? [latestOpenKey] : openKeys) : []
      });
    }
    this.isClickMenu = true;
  };

  renderPage = () => {
    const selKey =
      (this.getkey && this.getkey.meta.lightMenu) ||
      this.props.location.pathname;
      const openKey = this.isClickMenu
      ? this.state.defaultOpenKey
      : ([this.initDefaultOpenKey() && this.initDefaultOpenKey().path]) && [this.initDefaultOpenKey(selKey) && this.initDefaultOpenKey(selKey).path] ;
    this.isClickMenu = false;
    return (
      // 此处缺少菜单权限控制
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selKey]}
        openKeys={openKey}
        onOpenChange={this.onOpenChange}
        className='side-menu-list scrollbar'
      >
        {RoutesConfig.menus.map(item => {
          if (item.component) {
            return (
              !item.meta.hideInMenu &&
              (Object.keys(this.props.auth).length &&
                (this.props.auth.is_admin === 1 ||
                  this.props.auth.menu.includes(item.key) || item.key === 'home')) && (
                <Menu.Item
                  key={item.path}
                  onClick={() => {
                    this.addTag(item);
                  }}
                >
                  <Link to={(item.route || item.path) + (item.query || "")}>
                    <span className="nav-text">
                      {item.title || item.meta.title}
                    </span>
                  </Link>
                </Menu.Item>
              )
            );
          } else {
            return (
              this.checkHasSubMenu(item.subs) && (
                <SubMenu key={item.path} title={item.title || item.meta.title}>
                  {item.subs.map(sub => {
                    return (
                      !sub.meta.hideInMenu &&
                      (Object.keys(this.props.auth).length &&
                        (this.props.auth.is_admin === 1 ||
                          this.props.auth.menu.includes(sub.key))) && (
                        <Menu.Item
                          key={sub.path}
                          onClick={() => {
                            this.addTag(sub);
                          }}
                        >
                          <Link to={(sub.route || sub.path) + (sub.query || "")}>
                            <span className="nav-text">{sub.meta.title}</span>
                          </Link>
                        </Menu.Item>
                      )
                    );
                  })}
                </SubMenu>
              )
            );
          }
        })}
      </Menu>
    );
  };

  render() {
    this.getkey = this.getmetakey.bind(this)();
    const newRender = this.renderPage();
    return newRender;
  }
}

const mapStateToProps = state => {
  return {
    auth: state.userManage.userData
  };
};

export default connect(mapStateToProps)(withRouter(sidemenu));
