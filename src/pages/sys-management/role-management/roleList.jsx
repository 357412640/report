import React, {useState, useEffect} from 'react';
import {Button, Input, Table, Tree, Icon, Modal, notification} from 'antd';
import {withRouter} from 'react-router-dom';
import routerConfig from '@/router/config';
import {fetchRoleList, fetchRoleDelete, fetchRoleDetail} from '@/api/sys-role';
import './role-management.scss';

const {Search} = Input;
const {TreeNode} = Tree;
const treeMenu = routerConfig.menus;

const usercolumns = [
  {
    title: '角色名称',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  }
]

let deleteId = ''

function Role (props) {
  const [tableData, setTable] = useState ([]);
  const [loading, setLoading] = useState (false);
  const [total, setTotal] = useState (0);
  const [title, setTitle] = useState ('');
  const [content, setContent] = useState ('');
  const [showModal, setShowModal] = useState (false);
  const [params, setParams] = useState ({page: 1, page_size: 10});

  const getList = async (data = params) => {
    try {
      setLoading (true);
      const res = await fetchRoleList (data);
      if (res.errno === 10000) {
        const resList = res.data.list.map (item => {
          item.key = item.id;
          return item;
        });
        setTable (resList);
        setTotal (res.data.total);
      } else {
        throw res.errmsg;
      }
    } catch (e) {
      console.log (e);
      setTotal (0);
      notification.error({description: e})
    } finally {
      setLoading (false);
    }
  };
  useEffect (() => {
    getList ();
  }, []);

  const goAddRole = () => {
    props.history.push ({pathname: `/sys/role/add/:add`});
  };

  const changePage = (page, pageSize) => {
    setParams ({...params, page: page});
  };

  const columns = [
    {title: '角色名称', dataIndex: 'name', key: 'name'},
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      render: text => (
        <span>
          <a
            href="javascript:;"
            className="common-margin-right-10"
            onClick={() => previewPermission (text.id, 'permission')}
          >
            查看权限
          </a>
          <a
            href="javascript:;"
            className="common-margin-right-10"
            onClick={() => previewPermission (text.id, 'user')}
          >
            关联用户
          </a>
          <a
            href="javascript:;"
            className="common-margin-right-10"
            onClick={() => goUpdateRole (text.id)}
          >
            修改
          </a>
          <a
            href="javascript:;"
            className="common-margin-right-10"
            onClick={() => deleteRole (text.id)}
          >
            删除
          </a>
        </span>
      ),
    },
  ];
  const previewPermission = async (id, type) => {
    try {
      const res = await fetchRoleDetail ({id});
      if (res.errno === 10000) {
        res.data.user.forEach((ele, index) => {
          ele.key = index
        })
        setContent (res.data);
        setShowModal (true);
        if (type === 'permission') {
          setTitle ('角色权限');
        } else {
          setTitle ('关联用户');
        }
      } else {
        throw res.errmsg;
      }
    } catch (e) {
      console.log (e);
      notification.error({description: e})
    }
  };

  const goUpdateRole = id => {
    props.history.push ({pathname: `/sys/role/add/:${id}`});
  };

  const fetchDeleteRole = async () => {
    try {
      const res = await fetchRoleDelete ({id: deleteId});
      if (res.errno === 10000) {
        notification.success({description: '删除成功'})
        getList()
      } else {
        throw res.errmsg;
      }
    } catch (e) {
      console.log (e);
      notification.error({description: e})
    }
  };

  const deleteRole = (id) => {
    deleteId = id
    setShowModal(true)
    setTitle('是否删除该角色？')
  }

  const handleOk = () => {
    setShowModal (false);
    if (title === '是否删除该角色？') {
      fetchDeleteRole()
    }
  };

  const handleCancel = () => {
    setShowModal (false);
  }

  const renderTree = () => {
    return (
      <Tree defaultExpandAll switcherIcon={<Icon type="down" />}>
        {treeMenu.reduce ((arr, ele) => {
            const treeMenuList = (() => {
              const nodeTree = ele.subs ? ele.subs.reduce ((acc, subs) => {
                  return  content.menu.includes (subs.key) ? acc.concat (
                    <TreeNode title={subs.meta.title} key={subs.key} />
                  ) : acc
              }, []) : []
              if (ele.subs && (nodeTree && nodeTree.length)) {
                return (
                  <TreeNode title={ele.title} key={ele.key}>
                    {nodeTree}
                  </TreeNode>
                );
              }
            }) ()
            return !ele.meta && treeMenuList ? arr.concat(treeMenuList) : arr
        }, [])}
      </Tree>
    );
  };

  const renderTable = () => {
    return(
      <Table
            className="common-table-top"
            columns={usercolumns}
            pagination={false}
            dataSource={content.user}
          />
    )
  };

  const renderModalContent = () => {
    return title === '角色权限' ? renderTree () : (title === '关联用户' && renderTable());
  };

  return (
    <div className="main-page-box sys-role-management">
      <div className="filter-box">
        <h3>角色管理</h3>
        <Button type="primary" onClick={goAddRole}>创建角色</Button>
      </div>
      <div className="content">
        <div>
          <label>角色名称</label>&nbsp;&nbsp;
          <Search
            onSearch={value => getList ({...params, name: value})}
            style={{width: 200}}
          />
          <Table
            className="common-table-top"
            columns={columns}
            pagination={{pageSize: 10, total, onChange: changePage}}
            dataSource={tableData}
            loading={loading}
          />
        </div>
      </div>
      <div>
        <Modal
          title={title}
          visible={showModal}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>角色名称：{content.name}</p>
          {renderModalContent ()}
        </Modal>
      </div>

    </div>
  );
}

export default withRouter (Role);
