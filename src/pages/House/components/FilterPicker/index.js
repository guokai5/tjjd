import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'



export default class FilterPicker extends Component {

  state= {
    // 设置当前选中的值
    value: this.props.value
  }
  
  render() {
    const {onOK, onClose, data, col } = this.props
    return (
      <>
        {/* 选择器组件： */}
        <PickerView data={data} value={this.state.value} cols={col} onChange={
          (sel)=>{this.setState({value:sel})}
          }/>

        {/* 底部按钮 */}
      <FilterFooter onOK={()=>{onOK(this.state.value)}} onClose={onClose}/>
      </>
    )
  }
}
