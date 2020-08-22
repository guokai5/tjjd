import React, {Component} from 'react';
// 导入路由
import {Route} from 'react-router-dom'
import { TabBar } from 'antd-mobile'

import Index from '../Index'
import Profile from '../Profile'
import House from '../House'

import './index.css'
import TabBarList from '../../utils/TabBarconfig'

class Home extends Component {

  // 响应数据
  state = {
    // tabBar当前选中的状态
    selectedTab: this.props.location.pathname,
  }
  
  renderTabBar() {
    return (
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white">
          {TabBarList.map((item) => (
          <TabBar.Item
            title={item.title}
            key={item.id}
            // 默认图标
            icon={<i className={`iconfont ${item.icon}`}></i>}
            // 选中图标
            selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
            // 选中状态
            selected={this.state.selectedTab === item.path}
            // 标签栏点击
            onPress={() => {
              this.props.history.push(item.path)
              // 选中状态
              this.setState({
                selectedTab: item.path,
              })
            }}
            />
          ))}
        </TabBar>
    )
  }
  render() {
    return (
      <div className="home" >
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/profile" component={Profile}></Route>
        <Route path="/home/house" component={House}></Route>
        {/* <div>
          <Link to="/home">首页</Link>
          <Link to="/home/houset">房屋列表</Link>
          <Link to="/home/profile">个人中心</Link>
        </div> */}
         <div className="tabBox">{this.renderTabBar()}</div>  
      </div>
    )
  }
}

export default Home