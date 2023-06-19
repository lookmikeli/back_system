<template>
  <div>
    <!-- 表格 -->
    <el-table border style="width: 100%" :data="records">
      <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template v-slot="{ row }">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column label="重量(KG)" prop="weight" width="80"></el-table-column>
      <el-table-column label="价格(元)" prop="price" width="80"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            type="success"
            icon="el-icon-top"
            size="mini"
            title="上架"
            v-if="row.isSale === 0"
            @click="sale(row)"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-bottom"
            size="mini"
            title="下架"
            v-else
            @click="cancel(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="开发中"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            title="查看详情"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :total="total"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      style="text-align: center; margin-top: 20px"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    ></el-pagination>
    <!-- @current-change="getSkuList" 会传递当前页的数据形参接收 
         @size-change="handleSizeChange"  当每一页的条数发生变化触发 
    -->
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%" :before-close="handleClose">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              style="margin-right: 10px"
              type="success"
              v-for="attr in skuInfo.skuAttrValueList"
              :key="attr.id"
              >{{ attr.id }}--{{ attr.valueId }}</el-tag
            >
          </template></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="300px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" style="width: 100%" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      // 代表当前第几页
      page: 1,
      // 当前页面有几条数据
      limit: 5,
      // 存储sku列表的数据
      records: [],
      // 存储分页器一共展示数据
      total: 0,
      // 存储sku详细信息
      skuInfo: {},
      show: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    // 获取sku列表数据
    async getSkuList(pages = 1) {
      // 默认第一次是第一页
      this.page = pages
      // 解构出默认参数
      const { page, limit } = this
      const result = await this.$API.sku.reqSkuList(page, limit)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 当每一页的条数发生变化触发 ,形参接收注入的参数
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    // 上架
    async sale(row) {
      const result = await this.$API.sku.reqSale(row.id)
      if (result.code === 200) {
        row.isSale = 1
        this.$message.success('上架成功')
      }
    },
    // 下架
    async cancel(row) {
      const result = await this.$API.sku.reqCancel(row.id)
      if (result.code === 200) {
        row.isSale = 0
        this.$message.info('下架成功')
      }
    },
    edit() {
      this.$message.info('正在开发中...')
    },
    // 获取sku详情
    async getSkuInfo(row) {
      this.show = true
      const result = await this.$API.sku.reqSkuById(row.id)
      if (result.code === 200) {
        this.skuInfo = result.data
      }
    }
  }
}
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 20px;
  font-weight: 700;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
  font-weight: 500;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
>>> .el-carousel__button {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: skyblue;
}
</style>
<style></style>
