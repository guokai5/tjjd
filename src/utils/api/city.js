import request from '../request'

export function getCity(name) {
  return request.get('/area/info',{
    params: {name}
  })
}

export function getcityData(level=1){ 
  return request.get('/area/city',{
    params:{level}
  })
}
// 热门城市
export function getHotCity(){ 
  return request.get('/area/hot')
}

// 查询小区
export function getCommunity(name,id) { 
  return request.get('/area/community',{
    params:{
      name,
      id
    }
  })
}

export function getMapDataById (id) {
  return request.get('/area/map', {
    params: { id }
  })
}