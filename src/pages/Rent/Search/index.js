import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCityInfo } from '../../../utils'

import styles from './index.module.css'
import { getCommunity } from '../../../utils/api/city'

export default class Search extends Component {

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  async componentDidMount() {
    // 获取城市ID
    const { value } = await getCityInfo();
    this.cityId = value;
  }

  // 房源数据
  selectCommunity(item){
    this.props.history.replace({
      pathname: '/rent/add', data: {
        // 小区ID
        id: item.community,
        // 小区名字
        name: item.communityName
      }
    })
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li onClick={()=>{this.selectCommunity(item)}} key={item.community} className={styles.tip}>
        {item.communityName}
      </li>
    ))
  }

  // 响应 模糊匹配
  seatch = (value) => {
    let _value = value.trim();
    if (_value.length === 0) {
      return this.setState({searchTxt:'', tipsList: []})
    }
    this.setState({
       searchTxt:value
    },()=> {
      // 函数防抖 避免输入获取多次数据
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(async() =>{
        const {status, data} = await getCommunity(value,this.cityId)
        console.log(status, data);
        if (status === 200) {
          this.setState({
            tipsList:data
          })
        }
      },600)
    })
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          onChange={this.seatch}
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
