import React from 'react';
import { Page404, Login, Layout, Page401 } from '@/pages'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import 'antd/dist/antd.css';
import '@/style/common.scss'

function App() {
  return (
    <BrowserRouter basename="/">
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/404" component={Page404}/>
          <Route path="/401" component={Page401}/>
          <Layout></Layout>
          <Redirect path="/" to={'/home'}/>
        </Switch>
    </BrowserRouter>
  )
}

export default App;
