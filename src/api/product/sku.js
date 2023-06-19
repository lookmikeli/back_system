// sku接口模块

// 二次封装的axios
import request from '@/utils/request'

// 获取图片的接口
// /admin/product/spuImageList/{spuId} GET 
export const reqSpuImageList = (spuId) => {
  return request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'GET',
  })
}

// 获取销售属性的数据
// /admin/product/spuSaleAttrList/{spuId} GET 
export const reqSpuSaleAttrList = (spuId) => {
  return request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: 'GET',
  })
}

// 获取平台属性信息
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  GET 
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'GET',
  })
}

// sku列表的接口
// /admin/product/list/{page}/{limit}  GET 
export const reqSkuList = (page, limit) => {
  return request({
    url: `/admin/product/list/${page}/${limit}`,
    method: 'GET',
  })
}

// 上架
// /admin/product/onSale/{skuId}  GET 
export const reqSale = (skuId) => {
  return request({
    url: `/admin/product/onSale/${skuId}`,
    method: 'GET'
  })
}

// 下架
//  /admin/product/cancelSale/{skuId}  GET
export const reqCancel = (skuId) => {
  return request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: 'GET'
  })
}

// sku 详情
//  /admin/product/getSkuById/{skuId}  GET 
export const reqSkuById = (skuId) => {
  return request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: 'GET'
  })
}