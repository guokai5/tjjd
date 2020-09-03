import React, { Component } from 'react'
// 导入组件样式
import styles from './index.module.css'
import { NavBar, Icon } from 'antd-mobile'
import { getCityInfo } from '../../utils'
import { getMapDataById } from '../../utils/api/city'
import { getListFilter } from '../../utils/api/house'
import HouseItem from '../../components/HouseItem'
import { BASE_URL } from '../../utils/request'

class Map extends Component {

    state = {
      // 小区房源列表
      list: [],
      // 是否在地图中显示小区房源列表
      isShowList: false,
    }

  componentDidMount() {
    this.initMap()
  }

  // 初始化地图
  async initMap() {
    this.BMap  = window.BMap
    // 创建地图实例
    this.map = new this.BMap.Map('container')
    // 获取定位城市
    const { label: cityName, value } = await getCityInfo()
    // 创建地址解析器
    const myGeo = new this.BMap.Geocoder()
    // 将地址解析结果显示
    myGeo.getPoint(
      null,
      async (point) => {
        if (point) {
          // 初始化
          this.map.centerAndZoom(point, 11)
          

          // 添加地图操作控件
          // 地图平移缩放控件
          this.map.addControl(new this.BMap.NavigationControl())
          // 比例尺控件
          this.map.addControl(new this.BMap.ScaleControl())
          // 缩略图控件
          this.map.addControl(new this.BMap.OverviewMapControl())
          // 地图类型（卫星、三维）
          this.map.addControl(new this.BMap.MapTypeControl())
          // 添加marker覆盖物
          const marker = new this.BMap.Marker(point)
          this.map.addOverlay(marker)
          // 设置动画
          marker.setAnimation(window.BMAP_ANIMATION_BOUNCE) //跳动的动画

          this.renderOverlays(value)
        }
      },
      cityName
    )
  }

  async renderOverlays (value) {
    const { status, data } = await getMapDataById(value)
    const { type, zoom } = this.getTypeAndZoom()
    if (status === 200) {
      data.forEach((item) => {
        const {
          coord: { longitude, latitude },
          label: name,
          count,
          // 当前地区ID
          value,
        } = item
        // 创建当前区的point点
        const ipoint = new this.BMap.Point(longitude, latitude)
        const opts = {
          position: ipoint, // 指定文本标注所在的地理位置
          offset: new this.BMap.Size(0, 0), //设置文本偏移量
        }
        // 创建文本覆盖物的实例
        const label = new this.BMap.Label(null, opts)
        // 设置文本覆盖物的样式
        label.setStyle({
          // 清除默认样式
          background: 'transparent',
          border: 0,
        })
        // 点击覆盖物的事件处理函数
        let labelCallback
        if (type === 'circle') {
          // 画圈圈
          // 设置html内容（不是jsx）
          label.setContent(`
          <div class="${styles.bubble}">
            <p class="${styles.bubbleName}">${name}</p>
            <p>${count}套</p>
          </div>
         `)
         labelCallback = () => {
          this.map.centerAndZoom(ipoint, zoom)
          // 异步执行清除覆盖物
          setTimeout(() => {
            this.map.clearOverlays()
          }, 0)
          // 画下一层覆盖物
          this.renderOverlays(value)
        }
        } else {
          // 画长方形
          label.setContent(
            `
            <div class="${styles.rect}">
              <span class="${styles.housename}">${name}</span>
              <span class="${styles.housenum}">${count}</span>
              <i class="${styles.arrow}"></i>
            </div>
            `
          )
          labelCallback = (e) => {
            this.handlerHouseList(value)
            //把当前点击小区移动到地图中心点
            this.moveToCenter(e)
          }
        }
        // 添加点击事件
        label.addEventListener('click', labelCallback)
        //  添加到地图中渲染
        this.map.addOverlay(label)
      })
    }
  }

  async handlerHouseList(id) {
    let {
      status,
      data: { list },
    } = await getListFilter(id)
    // console.log(status, data)
    if (status === 200) {
      this.setState({
        list,
        isShowList: true,
      })
    }
  }

  //把当前点击小区移动到地图中心点
  moveToCenter(e) {
    const [startPos] = e.changedTouches
    // 起点坐标
    let startX = startPos.clientX,
      startY = startPos.clientY
    // 终点坐标
    let endX = window.innerWidth / 2,
      endY = (window.innerHeight - 330) / 2
    // 移动坐标
    let moveX = endX - startX,
      moveY = endY - startY
    // 移动开始位置到终点
    this.map.panBy(moveX, moveY)
  }

  getTypeAndZoom() {
    let type, zoom
    const curZoom = this.map.getZoom()
    if (curZoom >= 10 && curZoom < 12) {
      type = 'circle'
      // 第一层：区
      zoom = 13
    } else if (curZoom >= 12 && curZoom < 14) {
      // 第二层：街道
      type = 'circle'
      zoom = 15
    } else if (curZoom >= 14 && curZoom < 16) {
      // 第三层：小区
      type = 'rectangle'
    }
    return { type, zoom }
  }

  // 渲染小区下房屋列表
  renderHouseList = () => {
    return (
      <div
        className={[
          styles.houseList,
          this.state.isShowList ? styles.show : '',
        ].join(' ')}>
        <div className={styles.titleWrap}>
          <h1 className={styles.listTitle}>房屋列表</h1>
          <a className={styles.titleMore} href="/home/house">
            更多房源
          </a>
        </div>

        <div className={styles.houseItems}>
          {/* 房屋结构 */}
          {this.state.list.map((item) => (
            <HouseItem
              onClick={() =>
                this.props.history.push(`/detail/${item.houseCode}`)
              }
              key={item.houseCode}
              src={BASE_URL + item.houseImg}
              title={item.title}
              desc={item.desc}
              tags={item.tags}
              price={item.price}
            />
          ))}
        </div>
      </div>
    )
  }


  render() {
    return (
      <div className={styles.mapBox}>
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}>
          地图找房
        </NavBar>
        {/* 地图容器=》渲染百度地图 */}
        <div id="container"></div>
        {/* 渲染小区列表 */}
        {this.renderHouseList()}
      </div>
    )
  }
}

export default Map