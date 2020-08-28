import request from '../request'

/**
 * 用户登录相关接口
 */
export function login(data){
  return request.post('/user/login',data)
}