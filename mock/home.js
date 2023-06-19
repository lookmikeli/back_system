// 可视化模拟数据
const data = require('./data');

module.exports = [
  {
    url: '/home/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data
      }
    }
  }
]
