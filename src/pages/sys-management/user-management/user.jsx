import React, {Component} from 'react'
import {Table, Row, Col, Form, Button, Input, Radio, Modal, Spin, message} from 'antd'
import './index.scss'
import {getRoleList, getUserDetail, getUserList, saveUser} from '@/api/system-data'

let modelTitle = ''
let modelEmail = ''
class Role extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      status: 0,
      userName: '',
      email: '',
      searchInfo: {},
      columns: [
        {
          title: '用户名',
          dataIndex: 'username',
          key: 'username'
        },
        {
          title: '操作',
          dataIndex: 'address',
          key: 'address',
          align: 'right',
          render: (text, record, index) => {
            return (
              <Button onClick={() => {
                this.setUser(record)
              }}>关联角色</Button>
            )

          }
        }
      ],
      dataSource: [],
      visible: false,
      confirmLoading: false,
      spinLoading: true,
      indeterminate: true,
      checkAll: false,
      leftColumns: [
        {
          title: '所有角色',
          dataIndex: 'name',
          key: 'name'
        }
      ],
      allData: [],
      rightColumns: [
        {
          title: '已选角色',
          dataIndex: 'name',
          key: 'name'
        }
      ],
      rightData: [],
      pageInfo: {
        current: 1,
        total: 0,
        pageSize: 20
      },
      selectedRowKeys: [],
      modalRadio: 0,
      userId: ''
    }
  }

  radioChange = (res) => {
    let status = res.target.value
    this.setState({
      status
    })
  }

  userNameChange = (res) => {
    let userName = res.target.value.trim()
    this.setState({
      userName
    })
  }

  emailChange = (res) => {
    let email = res.target.value.trim()
    this.setState({
      email
    })
  }

  changePage = (page = 1) => {
    this.setState({
      loading: true
    })
    let searchInfo = this.state.searchInfo
    let params = {
      page: page,
      ...searchInfo
    }
    getUserList(params).then(res => {
      let data = res.data
      if (data.errno === 10000) {
        let list = data.data.list
        let pageInfo = {
          current: data.data.page,
          total: data.data.total,
          pageSize: data.data.page_size
        }
        list.forEach((item, index) => {
          item.key = index
        })
        this.setState({
          dataSource: list,
          pageInfo,
          loading: false
        })
      } else {
        Modal.warning({
          title: '用户列表获取失败',
          content: `原因：${data.errmsg}`,
        })
      }
    })
  }

  handleSubmit = () => {
    let searchInfo = {
      email: this.state.email,
      username: this.state.userName,
      status: this.state.status
    }
    // console.log(searchInfo)
    this.setState({
      searchInfo,
      loading: true
    }, () => {
      this.changePage()
    })

  }

  setUser = (record) => {
    modelTitle = record.username
    modelEmail = record.email || '--'
    this.setState({
      visible: true,
      spinLoading: true
    })
    getUserDetail(record.id).then(res => {
      let rightData = []
      let data = res.data
      if (data.errno === 10000) {
        let selectedRowKeys = data.data.role
        let allData = this.state.allData
        selectedRowKeys.forEach(id => {
          for (let i = 0; i < allData.length; i++) {
            let item = allData[i]
            if (item.id === id) {
              rightData.push(item)
              break
            }
          }
        })
        this.setState({
          visible: true,
          spinLoading: false,
          selectedRowKeys,
          rightData,
          userId: data.data.id
        })
      } else {
        Modal.warning({
          title: '用户详情获取失败',
          content: `原因：${data.errmsg}`,
        })
      }
    })

  }

  modalOk = () => {
    let params = {
      id: this.state.userId,
      is_inactivity: this.state.modalRadio,
      role_ids: this.state.rightData.map((item) => {
        return item.id || item
      }).toString()
    }
    // console.log(params)
    // modalRadio rightData
    this.setState({
      confirmLoading: true,
      spinLoading: true
    })
    saveUser(params, this).then(res => {
      // console.log(this)
      let data = res.data
      if (data.errno === 10000) {
        message.success('保存成功')
        this.setState({
          spinLoading: false
        })
      } else {
        Modal.warning({
          title: '用户关联失败',
          content: `原因：${data.errmsg}`,
        })
      }
      this.setState({
        visible: false,
        confirmLoading: false
      })
    })
  }

  modalCancel = () => {
    this.requireCancel && this.requireCancel()
    this.setState({
      visible: false
    })
  }

  modalRadioChange = (e) => {
    this.setState({
      modalRadio: e.target.value
    })
  }

  rowSelectionChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      rightData: selectedRows,
      selectedRowKeys
    })
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  }

  componentDidMount() {
    let role_page_size = 1000

    Promise.all([getRoleList({role_page_size}), getUserList()]).then(result => {
      const roleData = result[0].data
      const userData = result[1].data
      if (roleData.errno === 10000) {
        let list = roleData.data.list
        list.forEach((item, index) => {
          item.key = item.id
        })
        // console.log(list)
        this.setState({
          allData: list
        })
      } else {
        Modal.warning({
          title: '角色列表获取失败',
          content: `原因：${roleData.errmsg}`,
        })
      }
      if (userData.errno === 10000) {
        let data = userData.data
        let list = data.list
        let pageInfo = {
          current: data.page,
          total: data.total,
          pageSize: data.page_size
        }
        list.forEach((item, index) => {
          item.key = index
        })
        this.setState({
          dataSource: list,
          pageInfo,
          loading: false
        })
      } else {
        Modal.warning({
          title: '用户列表获取失败',
          content: `原因：${userData.errmsg}`,
        })
      }
      // console.log(result)
    })
  }

  render() {
    const {columns, dataSource, visible, confirmLoading, spinLoading, rightColumns, leftColumns, allData, rightData, pageInfo, status, loading, selectedRowKeys, modalRadio} = this.state
    const bodyStyle = {
      position: 'relative'
    }
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      }
    }
    const rowSelection = {
      onChange: this.rowSelectionChange,
      selectedRowKeys
    }
    const tableScroll = {
      y: 200
    }
    let pagination = {
      onChange: this.changePage,
      ...pageInfo
    }
    return (
      <div className="user-box">
        <div className="title-box">
          <span className="title">用户管理</span>
        </div>
        <Form {...formItemLayout} labelAlign="center">
          <Row>
            <Col span={5}>
              <Form.Item label="用户名">
                <Input onChange={this.userNameChange}/>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Email">
                <Input onChange={this.emailChange}/>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="是否启用">
                <Radio.Group onChange={this.radioChange.bind(this)} value={status}>
                  <Radio value={1}>启用</Radio>
                  <Radio value={2}>禁用</Radio>
                  <Radio value={0}>所有</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item>
                <Button type="primary" onClick={this.handleSubmit}>查询</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table loading={loading} showHeader={false} columns={columns} dataSource={dataSource} pagination={pagination}/>

        <Modal
          title={modelTitle + '-关联角色'}
          visible={visible}
          onOk={this.modalOk}
          confirmLoading={confirmLoading}
          maskClosable={false}
          onCancel={this.modalCancel}
          bodyStyle={bodyStyle}
          className='user-modal'
        >
          <div>
            <span className='modal-title'>用户名：{modelTitle}</span>
            <span>Email：{modelEmail}</span>
          </div>
          <div>
            <span>是否启用:</span>
            <Radio.Group value={modalRadio} onChange={this.modalRadioChange.bind(this)}>
              <Radio value={0}>启用</Radio>
              <Radio value={1}>禁用</Radio>
            </Radio.Group>
          </div>

          <div className="select-box">
            <div className="left-box">
              <Table height="200" rowSelection={rowSelection} columns={leftColumns} dataSource={allData}
                     pagination={false} scroll={tableScroll}></Table>
            </div>
            <div className="right-box">
              <Table height="200" columns={rightColumns} dataSource={rightData} pagination={false}
                     scroll={tableScroll}></Table>
            </div>
            <Spin className="spinCenter" spinning={spinLoading}></Spin>
          </div>


        </Modal>
      </div>
    )
  }
}

export default Role
