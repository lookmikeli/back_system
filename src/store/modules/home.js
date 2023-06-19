// mock 小仓库
import mockRequest from '@/utils/mockRequest'

const state = {
  list: {}
}
const actions = {
  // 发请求模拟首页的数据
  async getData({ commit }) {
    const result = await mockRequest.get('/home/list')
    if (result.code === 20000) {
      commit('GETDATA', result.data)
    }
  }

}
const mutations = {
  // state仓库里面的state
  GETDATA(state, list) {
    state.list = list
  }
}
const getters = {}

export default {
  state,
  actions,
  mutations,
  getters
}