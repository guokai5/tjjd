import React, { Component } from 'react'

import { Flex, WingBlank, WhiteSpace, NavBar, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import styles from './index.module.css'

import { login } from '../../utils/api/login'
import { setToken } from '../../utils'
import {withFormik} from 'formik'
import * as yup from 'yup';
// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {

  render() {
    const {
      values,
      handleChange,
      handleSubmit,
      errors,
      touched,
      handleBlur
    } = this.props
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavBar mode="light">
          账号登录
        </NavBar>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <input
                value={values.username}
                onChange={handleChange}
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {errors.username && <div className={styles.error}>{errors.username}</div>}
            <div className={styles.formItem}>
              <input
                value={values.password}
                onChange={handleChange}
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {errors.password && <div className={styles.error}>{errors.password}</div>}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

// 高阶组件Formik
const NewLogin = withFormik({
  // 对应表单的name值
  mapPropsToValues: () => ({ username: '', password:'' }),

  // Custom sync validation
  // 手动配置
  // validate: values => {
  //   const errors = {};

  //   if (!values.name) {
  //     errors.name = 'Required';
  //   }

  //   return errors;
  // },

  // 配置+yup校验库
  validationSchema: yup.object().shape({
      username: yup.string().required('账号不能为空').matches(REG_UNAME,'长度为5到8位，只能出现数字、字母、下划线'),
      password: yup.string().required('密码不能为空').matches(REG_PWD,'长度为5到12位，只能出现数字、字母、下划线'),
    }),

  // 表单提交的操作
  handleSubmit: async (values, {props}) => {
    const {username, password} = values
    const {status, data, description} = await login({username, password})
    if (status === 200) {
      Toast.success(description,1,()=>{
        // 如果存在BackUrl跳回url
        if(props.location.BackUrl){
          props.history.replace(props.location.BackUrl)
        } else {
          // 不存在返回个人中心
          props.history.replace('/home/profile')
        }
        
      })
      // 保存token
      setToken(data.token) 
    } else {
      Toast.success(description)
    }
  },

  displayName: 'BasicForm',
})(Login);

export default NewLogin
