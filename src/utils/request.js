import axios from 'axios'

import {Toast} from 'antd-mobile'


const BASE_URL = 'http://api-haoke-dev.itheima.net'
const instance = axios.create({
  baseURL: BASE_URL
});

// 请求拦截器
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  Toast.loading('加载中...',0)
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// 请求响应之后
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response 
  Toast.hide()
  const {data:{status, description, body}} = response;
  return {
    status,description,data:body
  };
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

export { BASE_URL }
export default instance