import React from 'react';

import {BrowserRouter, Route,  Switch, Redirect} from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/cityList'
import Map from './pages/map'
import NotFound from './pages/NotFound'
import HouseDetail from './components/HouseDetail';


function App() {
  return (
    <BrowserRouter>
    {/* 一级路由 */}
      {/* <Link to='/home'>首页</Link>
      <Link to='/cityList'>列表</Link>
      <Link to='/map'>地图</Link> */}
      <Switch>
        <Redirect exact from="/" to="/home"></Redirect>
        <Route path="/home" component={Home}></Route>
        <Route path="/cityList" component={CityList}></Route>
        <Route path="/map" component={Map}></Route>
        <Route path="/detail/:id" component={HouseDetail}></Route>
        <Route component={NotFound}></Route>
        
      </Switch>
    </BrowserRouter>
  );
}

export default App;
