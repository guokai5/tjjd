import React, { Component } from 'react'

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal,
  NavBar,
  Icon,
  Toast
} from 'antd-mobile'

import HousePackage from '../../../components/HousePackage'

import styles from './index.module.css'
import {uploadHouseImg } from '../../../utils/api/house'
import {pubHouse} from '../../../utils/api/login'


const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

export default class RentAdd extends Component {
  constructor(props) {
    super(props)
    const { data } = this.props.location
    // 对象不存在obj?.key
    const comun = { id: data?.id, name: data?.name }
    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community: comun,
      // 价格
      price: '',
      // 面积
      size: '',
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }

  // 取消编辑，返回上一页
  onCancel = () => {
    alert('提示', '放弃发布房源?', [
      {
        text: '放弃',
        onPress: async () => this.props.history.go(-1)
      },
      {
        text: '继续编辑'
      }
    ])
  }
  // 输入框双向数据绑定
  handlerInput = (name,v)=> {
    this.setState({
      [name]:v
    })
  }

  upload= (files,type,index)=> {
    console.log(files,type,index);
    this.setState({
      tempSlides: files
    })
  }

  // 发布房源
  addHouse = async ()=> {
    // 获取表单数据
    const {
      // 临时图片地址
      tempSlides,
      // 价格
      price,
      // 面积
      size,
      // 房屋类型
      roomType,
      // 楼层
      floor,
      // 朝向：
      oriented,
      // 房屋标题
      title,
      // 房屋配套：
      supporting,
      // 房屋描述
      description,
      community
    } = this.state
    // 边界判断
    if (!title || !size || !price || !tempSlides.length) {
      return Toast.info('房源信息不完整！', 2)
    }
    // 房源图片服务器地址
    let houseImg
    const fm= new FormData()
    tempSlides.forEach((item)=>fm.append('file',item.file))
    const { status, data } = await uploadHouseImg(fm)
    if (status === 200) {
      houseImg = data.join('|')
    } else {
      return Toast.fail('上传失败！')
    }
    const houseData = {
      // 价格
      price,
      // 面积
      size,
      // 房屋类型
      roomType,
      // 楼层
      floor,
      // 朝向：
      oriented,
      // 房屋标题
      title,
      // 房屋配套：
      supporting,
      // 房屋描述
      description,
      //  服务器图片地址集合
      houseImg,
      //  小区ID
      community: community.id
    }

    const { status: sta, description: desc } = await pubHouse(houseData)
    if (sta === 200) {
      Toast.success('发布房源成功！', 2, () => {
        // 跳转到房源管理页面
        this.props.history.push('/rent')
      })
    } else {
      Toast.fail(desc)
    }
  }

  render() {
    const Item = List.Item
    const { history } = this.props
    const {
      community,
      price,
      size,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title
    } = this.state

    return (
      <div className={styles.root}>
        <NavBar
          className={styles.navHeader}
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={this.onCancel}
        >
          发布房源
        </NavBar>
        <List
          className={styles.header}
          renderHeader={() => '基本信息'}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请选择小区名称'}
            arrow="horizontal"
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>
          <InputItem placeholder="请输入租金/月" extra="￥/月" type="number" value={price} 
          onChange={(v)=>{this.handlerInput('price',v)}}>
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem placeholder="请输入建筑面积" extra="㎡" type="number" value={size} 
          onChange={(v)=>{this.handlerInput('size',v)}}>
            建筑面积
          </InputItem>
          <Picker data={roomTypeData} value={[roomType]} cols={1}
          onChange={(v)=>{this.handlerInput('roomType',v[0])}}
          >
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker data={floorData} value={[floor]} cols={1}
           onChange={(v)=>{this.handlerInput('floor',v[0])}}
          >
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker data={orientedData} value={[oriented]} cols={1}
           onChange={(v)=>{this.handlerInput('oriented',v[0])}}
          >
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={(v)=>{this.handlerInput('title',v)}}
          />
        </List>

        <List
          className={styles.pics}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}
            multiple={true}
            className={styles.imgpicker}
            onChange={this.upload}
            // 格式限定
            accept="image/jpg,image/png"
          />
        </List>

        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <HousePackage select onSelect={(seled) =>{
            this.setState({
              supporting :seled.join(',')
            })
          }}/>
        </List>

        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            autoHeight
            value={description}
            onChange={(v)=>{this.handlerInput('description',v)}}
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
