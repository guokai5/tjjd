import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    // 已经选中的条件数据
    seled: this.props.seled
  }

  // 处理选中的条件和高亮状态
  handlerSel = (item) => {
    const { seled } = this.state
    // 返回下标
    let index = seled.indexOf(item.value)
    if (index > -1) {
      // 选择过
      seled.splice(index, 1)
    } else {
      // 没有选择过
      seled.push(item.value)
    }
    this.setState({ seled })
  }
  // 渲染标签
  renderFilters (data) {
    // 高亮类名： styles.tagActive
    return data.map((item) => <span onClick={() => this.handlerSel(item)} key={item.value} className={[styles.tag, this.state.seled.includes(item.value) && styles.tagActive].join(' ')}>{item.label}</span>)
  }

  render() {
    console.log(this.props);
    const { data: { roomType, oriented, floor, characteristic }, onOK, onClose } = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={onClose}/>

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter className={styles.footer} onOK={() => onOK(this.state.seled)} onClose={onClose}/>
      </div>
    )
  }
}
