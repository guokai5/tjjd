import request from '../request'

/**
 * 用户登录相关接口
 */
export function login(data){
  return request.post('/user/login',data)
}

export function getUserData () {
  return request.get('/user')
}

// 退出登录
export function logout() {
  return request.post('/user/logout')
}

// 房源是否收藏
export function checkFav(id) {
  return request.get(`/user/favorites/${id}`)
}

// 添加收藏
export function addFav(id) {
  return request.post(`/user/favorites/${id}`)
}

// 删除收藏
export function delFav(id) {
  return request.delete(`/user/favorites/${id}`)
}

// 获取已发布房源
export function getPubHouse() {
  return request.get('/user/houses')
}

// 房源数据
export function pubHouse (data) {
  return request.post('/user/houses', data)
}