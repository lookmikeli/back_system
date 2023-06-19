// 平台属性管理模块的请求文件
import request from '@/utils/request'

// 获取一级分类的接口
// /admin/product/getCategory1   GET 
export const reqCategory1List = () => {
  return request({
    url: '/admin/product/getCategory1',
    method: 'GET',
  })
}

// 获取二级分类的接口
// /admin/product/getCategory2/{category1Id}  GET
export const reqCategory2List = (category1Id) => {
  return request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'GET',
  })
}

// 获取三级分类的接口
// /admin/product/getCategory3/{category2Id}   GET
export const reqCategory3List = (category2Id) => {
  return request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'GET',
  })
}

// 获取平台属性的接口
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  GET 
export const reqAttrList = (category1Id, category2Id, category3Id) => {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'GET',
  })
}

// 添加属性与属性值的接口
// /admin/product/saveAttrInfo  POST 
export const reqAddOrUpdateAttr = (data) => {
  return request({
    url: '/admin/product/saveAttrInfo',
    data,
    method: 'POST'
  })
}