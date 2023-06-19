// 主要是获取品牌管理的模块
import request from '@/utils/request'

// 获取品牌列表的接口
// /admin/product/baseTrademark/{page}/{limit} GET

export const reqTradeMarkList = (page, limit) => {
  return request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'GET'
  })
}

// 处理添加品牌
// 新增品牌
// /admin/product/baseTrademark/save POST

// 修改品牌
// /admin/product/baseTrademark/update PUT

export const reqAddOrUpdateTradeMark = (tradeMark) => {
  // 带给服务器的数据携带 id ---修改
  if (tradeMark.id) {
    return request({
      url: '/admin/product/baseTrademark/update',
      data: tradeMark,
      method: 'PUT'
    })
  } else {
    // 新增品牌
    return request({
      url: '/admin/product/baseTrademark/save',
      data: tradeMark,
      method: 'POST'
    })
  }
}

// 删除品牌的接口
// /admin/product/baseTrademark/remove/{id}   DELETE 
export const reqDeleteTradeMark = (id) => {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'DELETE'
  })
}