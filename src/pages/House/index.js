import React from 'react'

import { Flex, Toast } from 'antd-mobile'

import Filter from './components/Filter'
// 导入样式
import styles from './index.module.css'
import { getListFilter } from '../../utils/api/house'
import { AutoSizer, List, InfiniteLoader, } from 'react-virtualized'
import { getCityInfo } from '../../utils'
import { BASE_URL } from '../../utils/request'
import HouseItem from '../../components/HouseItem/index'
import NoHouse from '../../components/NoHouse'

export default class HouseList extends React.Component {


  state = {
    // 房源列表数据
    list: [],
    // 房源数据的总条数
    count: 0
  }

  onFilterSel = (filters) => {
    this.filters = filters
    this.getHouseList()
  }

  async componentDidMount() {
    let { value } = await getCityInfo()
    this.cityId = value
    this.getHouseList()
  }


  async getHouseList() {
    const { status, data: { list, count } } = await getListFilter(this.cityId, this.filters)
    // console.log(status);
    if (count !== 0) {
      Toast.success(`获取到${count}条房源信息`, 1)
    }
    if (status === 200) {
      this.setState({
        list,
        count
      })
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
    // 列表数据
    const { list } = this.state
    // 当前列表数据
    let item = list[index]
    // 处理上拉过快加载不出来
    if (!!item) {
      // 处理图片地址
      item.src = `${BASE_URL}${item.houseImg}`
      return (
        <HouseItem 
        {...item} 
        key={key} 
        style={style}
        onClick={() => { 
            this.props.history.push('/detail/'+item.houseCode) 
          }
        }></HouseItem>
      )
    } else {
      return (
        <div style={styles} key={key}>
          <p className={styles.loading}></p>
        </div>
      )
    }
  }

  // 判断当前行是否渲染完
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {
    return getListFilter(this.cityId, this.filters, startIndex, stopIndex).then((res) => {
      const { status, data: { list } } = res
      if (status === 200) {
        this.setState({
          list: [...this.state.list, ...list]
        })
      }
    })
  }

  renderHouseList = () => {
    const { count } = this.state;
    // 没有数据渲染NoHouse组件
    return count === 0 ? <NoHouse>没有更多房源,请换个搜索条件吧</NoHouse> : (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        // 列表数据的总条数
        rowCount={this.state.count}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ height, width }) => (
              <List
                className={styles.houseList}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                // 控制列表宽高
                width={width}
                height={height}
                rowCount={this.state.count}
                rowHeight={130}
                rowRenderer={this.rowRenderer}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    )
  }
  render() {
    return (
      <div className={styles.root}>
        {/* 条件筛选栏 */}
        <Filter onFilterSel={this.onFilterSel} />
        {this.renderHouseList()}
      </div>
    )
  }
}
