import React, {Component} from 'react';
// 导入路由
import {Route} from 'react-router-dom'
import { TabBar } from 'antd-mobile'

import Index from '../Index'
import Profile from '../Profile'
import House from '../House'

class Home extends Component {

  // 响应数据
  state = {
    // tabBar当前选中的状态
    selectedTab: 'blueTab',
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
           {/* tabBar标签栏 */}
        <div
          style={{
            position: 'fixed',
            width: '100%',
            bottom: 0,
          }}>
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white">
            <TabBar.Item
              title="首页"
              key="Life"
              icon={
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    background:
                      'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat',
                  }}
                />
              }
              selectedIcon={
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    background:
                      'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat',
                  }}
                />
              }
              selected={this.state.selectedTab === 'blueTab'}
              // 标签栏点击
              onPress={() => {
                this.props.history.push('/home')
                // 选中状态
                this.setState({
                  selectedTab: 'blueTab',
                })
              }}
            />
            <TabBar.Item
              icon={
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    background:
                      'url(https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat',
                  }}
                />
              }
              selectedIcon={
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    background:
                      'url(https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat',
                  }}
                />
              }
              title="找房"
              key="Koubei"
              selected={this.state.selectedTab === 'redTab'}
              onPress={() => {
                this.props.history.push('/home/house')
                this.setState({
                  selectedTab: 'redTab',
                })
              }}
            />
            <TabBar.Item
              icon={
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    background:
                      'url(https://zos.alipayobjects.com/rmsportal/psUFoAMjkCcjqtUCNPxB.svg) center center /  21px 21px no-repeat',
                  }}
                />
              }
              selectedIcon={
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    background:
                      'url(https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg) center center /  21px 21px no-repeat',
                  }}
                />
              }
              title="我的"
              key="Friend"
              selected={this.state.selectedTab === 'greenTab'}
              onPress={() => {
                this.props.history.push('/home/profile')
                this.setState({
                  selectedTab: 'greenTab',
                })
              }}
            />
          </TabBar>
        </div>
      </div>
    )
  }
}

export default Home