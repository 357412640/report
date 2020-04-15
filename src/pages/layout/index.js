import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import SiderMenu from './sidemenu/index.jsx'
import TabsNav from './tabs-nav'
import { connect } from "react-redux";
import RenderRoutes from '@/router'

function layout(props) {
  return (
    <Spin spinning={props.auth.username === undefined}>
    <Layout>
        <SiderMenu></SiderMenu>
        <Layout>
          <TabsNav></TabsNav>
          <div className='layout-content'>
            <Switch>
              <Redirect exact from="/" to="/home" />
              <RenderRoutes></RenderRoutes>
            </Switch>
          </div>
        </Layout>
      </Layout>
    </Spin>
      
  )
}

const mapStateToProps = state => {
  return {
    auth: state.userManage.userData
  };
};

export default connect(mapStateToProps)(layout)
