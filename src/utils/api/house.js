import request from '../request'

export function getFliters (id) {
  return request.get('/houses/condition',{params:{id}})
}

export function getListFilter (cityId, filters, start = 1, end = 20) {
  return request.get('/houses',{
    params:{
      cityId,
      ...filters,
      start,
      end
    }
  })
}

export function getDetail (id) {
  return request.get(`/houses/${id}`)
}

// 发布房源
export function uploadHouseImg (formData) {
  return request.post('/houses/image', formData)
}