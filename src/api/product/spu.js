// spu接口模块

// 二次封装的axios
import request from '@/utils/request'

// 获取SPU列表数据的接口
// /admin/product/{page}/{limit}  GET
export const reqSpuList = (page, limit, category3Id) => {
  return request({
    url: `/admin/product/${page}/${limit} `,
    method: 'GET',
    params: { category3Id } // key value 一致省略v
  })
}

// 获取SPU信息
// /admin/product/getSpuById/{spuId}  GET 
export const reqSpu = (spuId) => {
  return request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'GET',
  })
}

// 获取品牌的信息
// /admin/product/baseTrademark/getTrademarkList  GET 
export const reqTradeMarkList = () => {
  return request({
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'GET'
  })
}

// 获取SPU图片的接口
// /admin/product/spuImageList/{spuId}   GET
export const reqSpuImageList = (spuId) => {
  return request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'GET',
  })
}

// 获取平台全部的销售属性  共三个
// /admin/product/baseSaleAttrList   GET
export const reqBaseSaleAttrList = () => {
  return request({
    url: '/admin/product/baseSaleAttrList',
    method: 'GET'
  })
}

// 修改SPU | 添加SPU 带不带id的区别
export const reqAddOrUpdateSpu = (spuInfo) => {
  // 携带参数带有 id  ---修改spu
  if (spuInfo.id) {
    // /admin/product/updateSpuInfo POST
    return request({
      url: '/admin/product/updateSpuInfo',
      method: 'POST',
      data: spuInfo
    })
  } else {
    // 携带参数不带id ---添加spu
    // /admin/product/saveSpuInfo   POST
    return request({
      url: '/admin/product/saveSpuInfo',
      method: 'POST',
      data: spuInfo
    })
  }
}

// 删除SPU
// /admin/product/deleteSpu/{spuId}  DELETE
export const reqDeleteSpu = (spuId) => {
  return request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'DELETE'
  })
}

// 获取SKU列表数据的接口
// /admin/product/findBySpuId/{spuId}  GET 
export const reqSkuList = (spuId) => {
  return request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'GET'
  })
}