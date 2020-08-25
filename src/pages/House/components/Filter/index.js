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

export default class Filter extends Component {

  state = {
    titleSelectedStatus: { ...titleSelectedStatus },
    openType: ''
  }
  
  componentDidMount() {
    this.getFilters()
  }
  // 获取页面数据
  async getFilters () {
    const {value} = await getCityInfo()
    console.log(value);
    const {status,data} = await getFliters(value)
    console.log(status,data);
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

  // 确定关闭选框
  onOK = () => {
    this.setState({ 
      openType: ''
    })
  }
  // 取消关闭选框
  onClose = () => {
    this.setState({ 
      openType:''
    })
  }

  renderFilterPick(){
    if(this.isShowPicker()){
      const {openType} = this.state
      const {area, subway,  rentType, price} = this.filterData
      let curFilterData = [], col = 1
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
      return <FilterPicker data={curFilterData} col = {col} onOK={this.onOK} onClose={this.onClose} />
    }
    return null
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
        </div>
      </div>
    )
  }
}
