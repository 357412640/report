import React, {useState, useEffect} from 'react';
import {Tree, Button, notification, Input} from 'antd';
import routerConfig from '@/router/config';
import {fetchRoleUpdate, fetchRoleDetail, fetchRoleCreate} from '@/api/sys-role';

const {TreeNode} = Tree;

const treeMenu = routerConfig.menus;


export default props => {
  const editId = props.match.params.id !== 'add' ? props.match.params.id : '';
  const [detailData, setDetailData] = useState ([]);
  const [roleValue, setRoleValue] = useState ('');

  const getDetail = async id => {
    console.log ('执行获取详情');
    try {
      const res = await fetchRoleDetail ({id});
      if (res.errno === 10000) {
        setDetailData(res.data.menu)
        setRoleValue(res.data.name)
      } else {
        throw res.errmsg;
      }
    } catch (e) {
      console.log (e);
      notification.error({description: e})
    }
  };

  const httpupdateRole = async () => {
    const fetchApi = editId ? fetchRoleUpdate : fetchRoleCreate 
    const fetchData = editId ? {id: editId, name: roleValue, menu: detailData.join(',')} : {name: roleValue, menu: detailData.join(',')}
    try {
      const res = await fetchApi (fetchData);
      if (res.errno === 10000) {
        props.history.go (-1)
        notification.success({description: editId ? '修改成功' : '创建成功'})
      } else {
        throw res.errmsg;
      }
    } catch (e) {
      console.log (e);
      notification.error({description: e})
    }
  };

  const updateRole = () => {
    // 校验name
    if (!roleValue) {
      notification.error({description: '请填写角色名称哦'})
    } else {
      httpupdateRole()
    }
  }

  useEffect (() => {
    editId && getDetail (editId);
  }, []);

  const onCheck = (checkedKeys, info) => {
    setDetailData(checkedKeys)
  };

  const changeName = (e) => {
    setRoleValue(e.target.value)
  }

  const renderMenu = treeMenu.map (ele => {
    return (
      !ele.meta ?
      <TreeNode title={ele.title} key={ele.key}>
        {ele.subs &&
          ele.subs.map (subs => {
            return <TreeNode title={subs.meta.title} key={subs.key} />;
          })}
      </TreeNode>
      : ''
    );
  });

  return (
    <div className="main-page-box role-add-box">
      <div className="filter-box">
        <h3>新增角色</h3>
        <Button type="primary" onClick={() => props.history.go (-1)}>返回</Button>
      </div>
      <div>
        角色名称&nbsp;&nbsp;
        <Input onChange={changeName} style={{width: '200px'}} value={roleValue}/>
      </div>
      <Tree
        checkable
        defaultExpandAll
        checkedKeys={detailData}
        onCheck={onCheck}
      >
        {renderMenu}
      </Tree>
      <div>
        <Button
          type="primary"
          onClick={updateRole}
          className="common-margin-right-10"
        >
          确定
        </Button>
        <Button onClick={() => props.history.go (-1)}>取消</Button>
      </div>
    </div>
  );
};
