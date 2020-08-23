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

export function getHotCity(){ 
  return request.get('/area/hot')
}