import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import {getFliters}  from '../../../../utils/api/house'
import {getCityInfo} from '../../../../utils'

import styles from './index.module.css'

// 标题高亮状态(默认值)
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

const filterSels = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends Component {

  state = {
    titleSelectedStatus: { ...titleSelectedStatus },
    openType: ''
  }
  
  componentDidMount() {
    this.getFilters()
    this.filterSels = { ...filterSels }
  }
  // 获取页面数据
  async getFilters () {
    const {value} = await getCityInfo()
    // console.log(value);
    const {status,data} = await getFliters(value)
    // console.log(status,data);
    if (status === 200){
      this.filterData = data
    }
  }

   // 修改筛选器title的选中状态
   onTitleClick = (type) => {
    this.setState({ titleSelectedStatus: { ...titleSelectedStatus, [type]: true }, openType:type })
  }

  isShowPicker = () => {
    const {openType} = this.state
    return openType === 'area' || openType === 'mode' || openType === 'price'
  }

  // 实现筛选器有选中高亮
  handlerSel(){
    const newSel = {}
    Object.keys(this.filterSels).forEach((item)=>{
      // 当前值
      const filterType = item
      // d当前选中的值
      let cur = this.filterSels[filterType]
      // 做对比
      if(filterType === 'area' && (cur[1] !== null || cur[0] === 'subway')){
        newSel[filterType] = true
      } else if(filterType === 'mode' && (cur[0]) !== null){
        newSel[filterType] = true
      } else if(filterType === 'price' && cur[0] !== null){
        newSel[filterType] = true
      } else if (filterType === 'more' && cur.length > 0) {
        newSel[filterType] = true
      }
      else {
        newSel[filterType] = false
      }
        
    })
    return newSel
  }

  // 处理查询到的数据
  handlerFilters() {
    // 获取用户的数据
    const {area, mode, price, more} = this.filterSels
    // 组装查询条件
    const filters = {}
    // 区域地铁选择
    let areaKey = area[0], areaVal
    if(area.length === 2) {
      areaVal = area[1]
    }else {
      if(area[2] !== 'null'){
        areaVal = area[2]
      }else{
        areaVal = area[1]
      }
    }
    filters[areaKey] = areaVal
    filters.rentType = mode[0]
    filters.price = price[0]
    filters.more = more.join(',')
    return filters
  }

  // 确定关闭选框
  onOK = (sel) => {
    // console.log(sel);
    const { openType } = this.state;
    this.filterSels[openType] = sel;
    this.setState({ 
      openType: '',
      // 处理选中条件后title的状态
      titleSeledStatus: this.handlerSel()
    },()=>{
      this.props.onFilterSel(this.handlerFilters())
    })
  }
  // 取消关闭选框
  onClose = () => {
    this.setState({ 
      openType:'', 
      // 处理选中条件后title的状态
      titleSeledStatus: this.handlerSel()
    })
  }

  renderFilterPick(){
    if(this.isShowPicker()){
      const {openType} = this.state
      const {area, subway,  rentType, price} = this.filterData
      let curFilterData = [], col = 1
      let curSels = this.filterSels[openType]
      switch (openType) {
        case 'area':
          col = 3
          curFilterData= [area, subway]
          break;
        case 'mode':
          curFilterData= rentType
          break;
        default:
          curFilterData= price
      }
      return <FilterPicker key={openType} value={curSels} data={curFilterData} col = {col} onOK={this.onOK} onClose={this.onClose} />
    }
    return null
  }

  renderFilterMore () {
    // 当前选中的筛选器
    const { openType } = this.state
    if (openType === 'more') {
      const { roomType, oriented, floor, characteristic } = this.filterData
      // 更多筛选器需要的数据
      const data = { roomType, oriented, floor, characteristic }
      // 获取用户上次选择的值
      const lastSel = this.filterSels[openType]

      return <FilterMore data={data} seled={lastSel} onOK={this.onOK} onClose={this.onClose} />
    }
  }


  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {
          this.isShowPicker() ? <div onClick={this.onClose} className={styles.mask}/> : null
        }
        
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={this.state.titleSelectedStatus} onTitleClick={this.onTitleClick} />

          {/* 前三个菜单对应的内容： */}
          {/* <FilterPicker /> */}
          {this.renderFilterPick()}
          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
