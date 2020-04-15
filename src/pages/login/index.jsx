import React, { Component } from "react"
import { Form, Icon, Input, Button, notification } from 'antd'
import { login } from '@/api/user'
import './login.scss'


class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getLogin(values)
      }
    })
  }

  getLogin = async ({username, password}) => {
      try {
        const res = await login({username, password})
        if (res.data.errno === 10000) {
            this.props.history.push({ pathname: '/home' })
        } else {
            throw res.data.errmsg
        }
      } catch(e) {
          console.log('登录出错', e)
        notification.error({description: e})
      }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login-wrapper">
        <div className="login-box">
          <Form onSubmit={this.handleSubmit} className="login-form">
          <h4 className='form-header'>国美域账号登录</h4>
            <Form.Item>
              {getFieldDecorator("username", {
                rules: [
                  { required: true, message: "请输入用户名!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="请输入用户名"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [
                  { required: true, message: "请输入密码!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="请输入密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >登录</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Home)

export default WrappedNormalLoginForm
