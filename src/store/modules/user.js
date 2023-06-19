// 引入登录|退出登录|获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
// 获取token|设置token|移除token的函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 路由模块中的重置路由的方法
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes } from '@/router'
// 引入路由器
import router from '@/router/index'

const getDefaultState = () => {
  return {
    // 获取token
    token: getToken(),
    // 存储用户名
    name: '',
    // 存储用户名
    avatar: '',
    // 服务器返回的菜单信息【根据不同的角色，返回的标记信息，数组里面的元素是字符串】
    routes: [],
    // button的权限的信息
    buttons: [],
    // 角色信息的标记
    roles: [],
    // 对比之后【项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的路由】
    resultAsyncRoutes: [],
    // 用户最终需要展示的全部路由
    resultAllRoutes: []
  }
}

const state = getDefaultState()

// 唯一修复state的地方
const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    // 存储的用户名
    state.name = userInfo.name
    // 存储的用户的头像
    state.avatar = userInfo.avatar
    // 菜单权限的标记 []
    state.routes = userInfo.routes
    // 按钮权限的标记 []
    state.buttons = userInfo.buttons
    // 用户角色信息 []
    state.roles = userInfo.roles
  },
  // 最终计算出来的异步路由（保存的异步路由）
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    state.resultAsyncRoutes = asyncRoutes
    // 合并 全部路由进行展示渲染
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    // 给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
    state.ifChange = true
  }
}

// computedAsyncRoutes(asyncRoutes, data.routes)  
// 两个数组进行对比，对比当前的用户到底显示那些异步路由
/*  
 console.log(asyncRoutes, '异步路由规则')
 console.log(routes, '服务器返回的用户菜单权限的信息')
 */
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出但前用户【超级管理员|普通员工】需要展示的异步路由赋值给state里面的resultAsyncRoutes
  return asyncRoutes.filter(item => {
    if (routes.indexOf(item.name) !== -1) {
      // 递归深度过滤 查找2、4、5、6级路由
      if (item.children && item.children.length) {
        // 递归再次筛选子级路由
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

const actions = {
  // user login
  // 处理登录业务
  async login({ commit }, userInfo) {
    // 解构用户名和密码
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    if (result.code === 20000) {
      // vuex存储token
      commit('SET_TOKEN', result.data.token)
      // cookie 本地存储token
      setToken(result.data.token)
      return 'ok'
    } else {
      // 失败
      return Promise.reject(new Error('failed'))
    }
    /* return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    }) */
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 获取用户信息 返回的数据包含：用户名 | 头像 | routes(标记：不同的用户应该展示那些菜单的标记) | roles(用户角色信息) | button (按钮信息：按钮权限的标记)
        const { data } = response

        // vuex 存储用户的全部信息
        commit('SET_USERINFO', data)
        // computedAsyncRoutes返回所有的异步路由 1. asyncRoutes 异步路由规则  vs  2. data.routes 服务器返回的用户菜单的权限信息
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

