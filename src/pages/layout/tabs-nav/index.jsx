import React, { Component } from "react"
import { Icon, Menu, Dropdown } from "antd"
import { connect } from "react-redux"
import { Link, withRouter } from "react-router-dom"
import deleteNav from "@/store/actions/tagsnav"
import RoutesConfig from "@/router/config"
import "./index.scss"

class tabsNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tagBodyLeft: 0
    }
    this.scrollOuter = React.createRef()
    this.scrollBody = React.createRef()
    this.handleScroll = this.handleScroll.bind(this)
    this.closeCurrent = this.closeCurrent.bind(this)
    this.getkey = this.getmetakey()
  }

  findCurrentRouter (pathname = window.location.pathname) {
    let router = RoutesConfig.menus.find(item => {
        return item.path === pathname
    })
    if (!router) {
      RoutesConfig.menus.find(item => {
          if (item.subs && item.subs.length !== 0) {
              return router = item.subs.find(sub => {
                  return sub.path === pathname
              })
          }
      })
  }
    return router || this.findCurrentRouter(this.getkey.meta.lightMenu)
  }

  closeAll = () => {
      this.props.dispatch(deleteNav.closeAll())
      this.props.history.push('/home')
  }

  closeOthers = () => {
    const currentRou = this.findCurrentRouter()
    this.props.dispatch(deleteNav.closeOthers(currentRou))
  }

  menu = () => (
    <Menu>
      <Menu.Item onClick={this.closeAll}>关闭所有</Menu.Item>
      <Menu.Item onClick={this.closeOthers}>关闭其他</Menu.Item>
    </Menu>
  )

  closeCurrent(item) {
    // 判断当前tab是否是最后一个tag， 否直接关闭，是最后一个关闭当前的同时，将路由跳转到前一个tab
    const nextRouter =
      this.props.location.pathname === item.path
        ? this.props.list[0].path
        : this.props.location.pathname
    this.props.history.push(nextRouter)
    this.props.dispatch(deleteNav.deleteNav(item))
  }

  handleScroll(offset) {
    const outerWidth = this.scrollOuter.current.offsetWidth
    const bodyWidth = this.scrollBody.current.offsetWidth
    if (offset > 0) {
      this.setState({
        tagBodyLeft: Math.min(0, this.state.tagBodyLeft + offset)
      })
    } else {
      if (outerWidth < bodyWidth) {
        if (this.state.tagBodyLeft < -(bodyWidth - outerWidth)) {
          this.setState({ tagBodyLeft: this.state.tagBodyLeft })
        } else {
          this.setState({
            tagBodyLeft: Math.max(
              this.state.tagBodyLeft + offset,
              outerWidth - bodyWidth
            )
          })
        }
      } else {
        this.setState({ tagBodyLeft: 0 })
      }
    }
  }

  getmetakey() {
    return RoutesConfig.others.find(item => {
      return this.props.location.pathname.replace(/\/:\S+$/, '') === item.path.replace(/\/:\S+$/, '')
    })
  }

  render() {
    this.getkey = this.getmetakey()
    return (
      <div className="tabs-nav common-flex">
        <Icon
          type="left"
          className="nav-icon"
          onClick={() => this.handleScroll(240)}
        />
        <div className="tags-box" ref={this.scrollOuter}>
          <div
            className="tags"
            ref={this.scrollBody}
            style={{ left: this.state.tagBodyLeft + "px" }}
          >
            {this.props.list.map((item, index) => {
              return (
                <div className="tag-item" key={index}>
                  <Link to={(item.route || item.path) + (item.query || "")}>
                    <span
                      className="tag-item-icon"
                      style={{
                        backgroundColor:
                          this.props.location.pathname === item.path ||
                          (this.getkey &&
                            item.path === this.getkey.meta.lightMenu)
                            ? "#1890ff"
                            : ""
                      }}
                    />
                    <span>{item.meta.title}</span>
                  </Link>
                  {item.path !== "/home" && (
                    <Icon
                      type="close"
                      className="common-margin-left-10 icon-close"
                      onClick={() => {
                        this.closeCurrent(item)
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
        <div className="common-flex">
          <Icon
            type="right"
            className="nav-icon"
            onClick={() => this.handleScroll(-240)}
          />
          <Dropdown overlay={this.menu} placement="bottomRight">
            <Icon type="close-circle" className="nav-icon nav-icon-close" />
          </Dropdown>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.tagNav.tabsList
  }
}

export default connect(mapStateToProps)(withRouter(tabsNav))
