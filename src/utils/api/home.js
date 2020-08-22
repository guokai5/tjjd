import request from '../request'

/**
 * 首页接口
 */

/**
 * 轮播图
 */
export function getSwiper() {
  return request.get('/home/swiper')
}
/**
 * 租房数据
 * area 区域ID
 */
export function getGrid (area='AREA|88cff55c-aaa4-e2e0') {
  return request.get('/home/groups',{params:{area}})
}

export function getNews (area='AREA|88cff55c-aaa4-e2e0') {
  return request.get('/home/news',{params:{area}})
}