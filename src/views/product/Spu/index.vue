<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- 全局组件 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="scene !== 0"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 三种状态切换 -->
      <div v-show="scene === 0">
        <!-- 展示SPU列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu"
          >添加SPU</el-button
        >
        <el-table border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
          <el-table-column label="spu名称" prop="spuName" width="width"></el-table-column>
          <el-table-column label="spu描述" prop="description" width="width"></el-table-column>
          <el-table-column label="操作" width="width">
            <template v-slot="{ row }">
              <!-- 自定义全局按钮组件 -->
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu的sku列表"
                @click="handler(row)"
              ></hint-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center; margin: 20px 0"
          :total="total"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3, 5, 10]"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          layout="prev, pager, next, jumper, ->, sizes, total"
        ></el-pagination>
      </div>
      <SkuFrom v-show="scene === 2" ref="sku">添加SPU|修改SPU</SkuFrom>
      <SpuFrom v-show="scene === 1" @changeScene="changeScene" ref="spu">添加SKU</SpuFrom>
    </el-card>
    <!-- sku 对话框 -->
    <el-dialog
      :title="`${spu.spuName} 的列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <!-- 展示sku列表的table -->
      <el-table :data="skuList" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
        <el-table-column prop="price" label="价格" width="100"></el-table-column>
        <el-table-column prop="weight" label="重量" width="100"></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template v-slot="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuFrom from './SkuForm'
import SpuFrom from './SpuForm'

export default {
  name: 'Spu',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1, // 分页器当前第几页
      limit: 3, // 每页展示多少条数据
      records: [], // 存储SPU列表数据
      total: 0, // 分页器总共需要展示多少条数据
      scene: 0, // 0 代表展示SPU列表数据 1 代表添加SPU|修改SPU 2 添加SKU
      dialogTableVisible: false, // 控制对话框的显示与隐藏
      spu: {},
      skuList: [], // 存储sku列表的数据
      loading: true
    }
  },
  components: {
    SpuFrom,
    SkuFrom
  },
  methods: {
    // 三级联动自定义事件的回调，可以把子组件相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      // categoryId: 获取一、二、三级分类的id  level:区分是几级id
      if (level === 1) {
        this.category1Id = categoryId
        // 一级分类id变化需要清除二、三级id
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        // 二级分类id变化需要清除三级id
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 发请求获取SPU列表数据
        this.getSpuList()
      }
    },
    // 获取SPU列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages
      // 三个参数 page：当前第几页 limit：一页展示多少条数据 category3Id：三级分类id
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 点击分页器的第几页按钮的回调
    // page： 点击的那一页 elementUI 内置
    /* handleCurrentChange(page) {
      this.page = page
      // 再次获取最新的数据列表显示
      this.getSpuList()
    } */

    // 当分页器的某一个展示数据的条数据发生变化会触发的回调
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit
      // 再次发请求展示数据
      this.getSpuList()
    },
    // 添加SPU按钮的回调
    addSpu() {
      this.scene = 1
      // 通知子组件 spuForm 发请求 --- 品牌 和 销售属性
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改某一个SPU
    updateSpu(row) {
      this.scene = 1
      // $refs 拿到子组件的实例对象
      this.$refs.spu.initSpuForm(row)
    },
    // 自定义事件的回调 SPUForm
    changeScene({ scene, flag }) {
      // flag 区分保存按钮是添加还是修改
      this.scene = scene
      // 子组件触发自定义事件，切换场景需要再次发请求展示列表
      this.getSpuList(this.page)
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList(1)
      }
    },
    // 删除SPU的回调
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message.success('删除成功')
        // 发请求展示新的列表
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加Sku按钮的回调
    addSku(row) {
      // 切换场景 为2
      this.scene = 2
      // 父组件调用子组件的方法
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // 产看sku按钮的回调
    async handler(spu) {
      // 点击显示对话框或者隐藏
      this.dialogTableVisible = true
      this.spu = spu
      // 获取sku列表的数据进行展示
      const result = await this.$API.spu.reqSkuList(spu.id)
      if (result.code === 200) {
        this.skuList = result.data
        // loading 效果隐藏
        this.loading = false
      }
    },
    // 关闭对话框的回调
    close(done) {
      // loading 效果再次变为真
      this.loading = true
      // 清除sku列表的数据
      this.skuList = []
      // 关闭对话框
      done()
    }
  }
}
</script>
