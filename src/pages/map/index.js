import React, {Component} from 'react'

import { NavBar, Icon } from 'antd-mobile';

import './index.scss'

class Map extends Component {
  
  componentDidMount() {
    this.initMap()
  }
// 地图实例
  initMap() { 
    // 取出BMap
    const {BMap} = window
    // 创建实例
    const map = new BMap.Map("container")
    // 中心点坐表
    const point = new BMap.Point(116.404, 39.915)
    // 地图初始化
    map.centerAndZoom(point, 15)

  }

  render() {
    return (
      <div className="map">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >地图找房</NavBar>
        {/* 地图 */}
        <div id="container"></div> 
      </div> 
    )
  }
}

export default Map