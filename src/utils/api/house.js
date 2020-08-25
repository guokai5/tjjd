import request from '../request'

export function getFliters (id) {
  return request.get('/houses/condition',{params:{id}})
}