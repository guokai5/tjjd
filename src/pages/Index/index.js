import React,{ Component} from 'react'

import {Carousel, Flex, Grid, WingBlank, SearchBar} from 'antd-mobile'
// 导入axios
import {getSwiper, getGrid, getNews} from '../../utils/api/home'
// 导入导航图片
import Navs from '../../utils/Navconfig'

import {BASE_URL} from '../../utils/request'

import './index.scss'


class Index extends Component {
  state = {
    keyword:'',
    news: [],
    // 租房数据
    groups:[],
    // 自动播放
    isPlay: false,
    swiper: [],
    // 图片高度
    imgHeight: 212,
  }
  componentDidMount() {
    this.getAll()
  }
  // promise优化
  getAll() {
    const promises = [getSwiper(), getGrid(), getNews()]
    Promise.all(promises).then((res) =>{
      const [swiper, groups, news] =res
      this.setState({swiper:swiper.data, groups:groups.data, news:news.data},()=>{
        this.setState({isPlay:true})
      })
    })
  }

  // 轮播图
  renderSwiper= () => {
    return (
      <Carousel
          autoplay={this.state.isPlay}
          infinite
          autoplayInterval='2000'
      >
        {this.state.swiper.map((item) => (
          <a
            key={item.id}
            href="http://www.alipay.com"
            style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
          >
            <img
              src={`http://api-haoke-dev.itheima.net${item.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'));
                this.setState({ imgHeight: 'auto' });
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }

  // 导航
  renderNavs= () => {
    return (
      <Flex className="nav">
        {Navs.map((item)=> (
          <Flex.Item 
            key={item.id}
            onClick={()=>{this.props.history.push(item.url)
          }}>
            <img src={item.icon} />
            <p>{item.title}</p>
        </Flex.Item>
      ))} 
    </Flex>
    )
  }

// 渲染最新资讯
  renderNews= () => {
    return this.state.news.map((item) => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`${BASE_URL}${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  // 租房
  renderGroup= () => {
    return (
      <div className="group">
          <Flex className="group-title" justify="between">
            <h3>租房小组</h3>
            <span>更多</span>
          </Flex> 
          <Grid 
            data={this.state.groups}
            columnNum={2}
            hasLine={false}
            square={false}
            renderItem={(item) => (
              // item结构
              <Flex className="grid-item" justify="between">
                <div className="desc">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />     
        </div>
    )
  }

  // 渲染顶部导航
  renderTopNav = () => {
    return (
      <Flex justify="around" className="topNav">
        <div className="searchBox">
          <div className="city" onClick={()=>{this.props.history.push('/cityList')}}>
            北京<i className="iconfont icon-arrow" />
          </div>
          <SearchBar
            value={this.state.keyword}
            onChange={(v) => this.setState({ keyword: v })}
            placeholder="请输入小区或地址"
          />
        </div>
        <div className="map" onClick={()=>{this.props.history.push('/map')}}>
          <i key="0" className="iconfont icon-map" />
        </div>
      </Flex>
    )
  }

  render() {
    return (
      <div className="index">
        {/* 轮播图 */}
        {this.renderSwiper()}
        {/* flex布局 */}
        {this.renderNavs()}
        {/* 租房 */}
        {this.renderGroup()}
        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
        {/* 搜索框 */}
        {this.renderTopNav()}
      </div>
    );
  }
}

export default Index