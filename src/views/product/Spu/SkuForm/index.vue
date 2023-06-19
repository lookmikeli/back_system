<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="规格描述"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" value="">
              <el-option label="" value=""></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item label="颜色" label-width="80px">
            <el-select placeholder="请选择" value="">
              <el-option label="" value=""></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border :data="skuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80px"></el-table-column>
          <el-table-column label="图片">
            <template v-slot="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button type="primary" v-if="row.isDefault === 0" @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      // 存储图片信息
      skuImageList: [],
      // 存储销售属性
      skuSaleAttrList: [],
      // 存储平台属性
      attrInfoList: [
        {
          attrId: 1,
          attrName: '大熊猫',
          id: 1,
          skuId: 0,
          valueId: 0,
          valueName: 'string'
        },
        {
          attrId: 2,
          attrName: '蜘蛛侠',
          id: 2,
          skuId: 0,
          valueId: 0,
          valueName: 'string'
        }
      ],
      // 父组件传递的spu的数据
      spu: {},
      // 收集sku数据的字段
      skuInfo: {
        // 1类：父组件给的数据
        category3Id: 0,
        // spu id
        spuId: 0,
        // 品牌id
        tmId: 0,

        // 2类：v-model收集的数据
        skuName: '',
        price: 0,
        weight: '',
        // 描述的数据
        skuDesc: '',

        skuDefaultImg: '',
        // 3类：默认图片
        skuImageList: [
          /*  {
            id: 0,
            imgName: 'string',
            imgUrl: 'string',
            isDefault: 'string',
            skuId: 0,
            spuImgId: 0
          } */
        ],
        // 平台属性
        skuAttrValueList: [
          {
            skuId: 0,
            valueId: 0
          }
        ],
        // 销售属性列表
        skuSaleAttrValueList: [
          /* {
            id: 0,
            saleAttrId: 0,
            saleAttrName: 'string',
            saleAttrValueId: 0,
            saleAttrValueName: 'string',
            skuId: 0,
            spuId: 0
          } */
        ]
      },
      // 收集图片的数据字段
      imageList: []
    }
  },
  methods: {
    // 获取skuForm数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件给的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu

      // 获取图片的数据
      const result = await this.$API.sku.reqSpuImageList(spu.id)
      if (result.code === 200) {
        let list = result.data
        list.forEach(item => {
          // 手动添加 isDefault 属性
          item.isDefault = 0
        })
        this.skuImageList = list
      }

      // 获取销售属性的数据
      const result1 = await this.$API.sku.reqSpuSaleAttrList(spu.id)
      if (result1.code === 200) {
        this.skuSaleAttrList = result.data
      }

      // 获取平台属性的数据
      const result2 = await this.$API.sku.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      if (result2.code === 200) {
        // this.attrInfoList = result.data
      }
    },
    // table 复选框的事件  当选择项发生变化时会触发该事件
    handleSelectionChange(params) {
      // 可以获取到用户选中图片的信息，但没有 default 字段
      this.imageList = params
    },
    // 按钮显示的排他操作
    changeDefault(row) {
      // 图片列表的数据的isDefault字段为 0
      this.skuImageList.forEach(item => {
        item.isDefault = 0
      })
      // 点击的那个图片的isDefault字段为 1
      row.isDefault = 1
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    }
  }
}
</script>

<style></style>
