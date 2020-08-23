import React, { Component } from 'react'

import { List, AutoSizer } from 'react-virtualized'
import { NavBar, Icon, Toast } from 'antd-mobile'

import { getcityData, getHotCity } from '../../utils/api/city'
import { getCityInfo } from '../../utils/index'
import './index.scss'


class CityList extends Component {
  state = {
    // 列表数据
    cityList: {},
    // 首字母
    cityIndex: [],
    // 当前位置的索引,激活索引样式状态
    activeIndex: 0
  }

  componentDidMount() {
    this.getCityList()
  }

  async getCityList() {
    const { status, data } = await getcityData()
    if (status === 200) {
      const { cityList, cityIndex } = this.formatCity(data)
      const { status, data: hot } = await getHotCity()
      if (status === 200) {
        cityList['hot'] = hot
        cityIndex.unshift('hot')
      }
      const currCity = await getCityInfo()
      cityList['#'] = [currCity]
      cityIndex.unshift('#')
      // 响应式
      this.setState({
        cityList: cityList,
        cityIndex: cityIndex
      })
    }
  }
  // 归类数据按拼音首字母
  formatCity(data) {
    let cityList = {}, cityIndex
    data.forEach((item) => {
      const key = item.short.slice(0, 1)
      if (!(key in cityList)) {
        cityList[key] = [item]
      } else {
        cityList[key].push(item)
      }
    })
    cityIndex = Object.keys(cityList).sort()
    return { cityList, cityIndex }
  }

  // 格式化字母
  formatCateKey(cateKey, isIndex) {
    switch (cateKey) {
      case 'hot':
        return isIndex ? '热' : '热门城市';
      case '#':
        return isIndex ? '当' : '当前城市';
      default:
        return cateKey.toUpperCase();
    }
  }

  handlerSelect = (item) => {
    // console.log(item);
    const hasData = ['北京', '上海', '广州', '深圳']
    if (hasData.includes(item.label)) {
      // 储存本地
      sessionStorage.setItem('CURR_CITY', JSON.stringify(item))
      // 跳转页面
      this.props.history.goBack()
    } else {
      Toast.info('暂无数据')
    }
  }

  // 列表渲染的项item模版
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {

    const { cityList, cityIndex } = this.state
    // 首字母数据
    const cateKey = cityIndex[index]
    // 城市数据
    const cateList = cityList[cateKey]
    // console.log(cateList);
    return (
      <div key={key} style={style} className="city-item">
        <div className="title">{this.formatCateKey(cateKey)}</div>
        {
          cateList.map((item) =>
            <div key={item.value} className="name" onClick={() => { this.handlerSelect(item) }
            }>
              {item.label}
            </div>)
        }
      </div>
    )
  }


  // 计算高度
  excueHeight = ({ index }) => {
    // 获取归类项和该项数据
    const { cityList, cityIndex } = this.state
    // 类别
    const cateKey = cityIndex[index]
    // 当前类别下的数据
    const cateList = cityList[cateKey]

    return 36 + 50 * cateList.length
  }

  // 渲染右侧索引
  renderCityIndex = () => {
    const { cityIndex, activeIndex } = this.state;
    return cityIndex.map((item, index) => {
      return (
        <li
          key={item}
          className="city-index-item"
          onClick={() => {
            // 当前行
            this.listRef.scrollToRow(index)
            // 高亮
            // this.setState({activeIndex:index})
          }}
        >
          <span className={activeIndex === index ? 'index-active' : ''}>
            {this.formatCateKey(item, true)}
          </span>
        </li>
      )
    })
  }
  // 滚动时钩子函数
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({ activeIndex: startIndex })
    }
  }
  render() {
    return (
      <div className="cityList">
        {/* 导航返回 */}
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        ></NavBar>
        <AutoSizer>
          {({ height, width }) => (
            <List
              // 获取组件实例ref
              ref={(ele) => this.listRef = ele}
              // 点击谁置顶
              scrollToAlignment="start"
              onRowsRendered={this.onRowsRendered}
              // 控制列表宽高
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.excueHeight}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
        {/* 右侧索引列表 */}
        <ul className="city-index">
          {this.renderCityIndex()}
        </ul>
      </div>
    )
  }
}

export default CityList