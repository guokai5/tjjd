/**
 * 全局公共方法
 */
import {getCity} from './api/city'
export function getCityInfo() {
   const cityinfo = JSON.parse(sessionStorage.getItem('CURR_CITY'))
   if(!cityinfo){
      return new Promise((resolve,reject) =>{
        const {BMap} = window
        const myCity = new BMap.LocalCity();
        myCity.get(async (res)=>{
          // console.log(res);
          const {status, data, description} = await getCity(res.name)
          // console.log(status,data);
          if(status === 200){
            // 存储信息
            sessionStorage.setItem('CURR_CITY',JSON.stringify(data))
            // 返回结果
            resolve(data)
          }else{
            reject(description)
          }
        })
      })
   }else{
      return Promise.resolve(cityinfo)
   }
 }

//  本地数据持久化
// 储存
export function setLocalData (key, val) {
  localStorage.setItem(key, val)
}
// 获取
export function getLocalData (key) {
  return localStorage.getItem(key)
}

// 删除
export function delLocalData (key) {
  localStorage.removeItem(key)
}

/**
 * 本地数据持久化（数据存储）
 * 1. sessionStorage=> 大小：5M => 关闭浏览器/标签就删除了
 * 2. localStorage=> 大小：5M => 除非用户手动删除
 * 3. cookie => 大小：4KB =》不安全 =》可以设置有效期 | 没有设置，相当于sessionStorage
 * 3. IndexedDB => 大小没有限制
 */