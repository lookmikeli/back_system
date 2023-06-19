<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr"
          >添加属性</el-button
        >
        <!-- 展示平台属性 -->
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
          <el-table-column label="属性名称" width="200px" prop="attrName"></el-table-column>
          <el-table-column label="属性值列表">
            <!-- row 数组的每一元素 类似 item -->
            <template v-slot="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 10px"
                >{{ attrValue.valueName }}</el-tag
              ></template
            >
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template v-slot="{ row }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"
                >修改</el-button
              >
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table border style="margin: 20px 0" :data="attrInfo.attrValueList">
          <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template v-slot="{ row, $index }">
              <!-- 编辑模式 -->
              <el-input
                :ref="$index"
                placeholder="请输入你需要添加的属性值"
                v-if="row.flag"
                v-model="row.valueName"
                size="mini"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              ></el-input>
              <!-- 展示模式 -->
              <span v-else @click="toEdit(row, $index)" style="display: block">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template v-slot="{ row, $index }">
              <!-- 气泡确认框 -->
              <!-- onConfirm老版本的确认按钮触发事件 -->
              <el-popconfirm
                :title="`确定要删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 接收平台属性的字段
      attrList: [],
      // 控制table表格显示与隐藏
      isShowTable: true,
      // 收集新增属性|修改属性
      attrInfo: {
        attrName: '', // 属性名
        // 属性值列表
        attrValueList: [
          /* {
            attrId: 0, // 相应属性名的id
            valueName: ''
          } */
        ],
        categoryId: 0, // 三级分类id
        categoryLevel: 0 // 服务器区分几级id
      }
    }
  },
  methods: {
    // 自定义事件的回调
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        // 一级
        this.category1Id = categoryId
        // 清除id
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        // 二级
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        // 代表三级分类的id有了
        this.category3Id = categoryId
        // 需要发请求获取平台的属性
        this.getAttrList()
      }
    },
    // 获取平台的属性的数据
    // 确定三级分类数据的时候发起请求
    async getAttrList() {
      // 获取分类的id
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    // 添加属性值回调
    addAttrValue() {
      // 像属性值的数组里面添加元素
      const { attrValueList } = this.attrInfo
      attrValueList.push({
        // 相应属性名的id
        flag: true, // 属性值的展示模式和编辑模式的切换  响应式数据
        attrId: this.attrInfo.id, // 添加属性没有id ；但修改某一个已有属性的属性的时候，需要带上属性的id
        valueName: '' // 相应属性值的名称
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加属性属性的回调
    addAttr() {
      this.isShowTable = false
      // 清除数据
      this.attrInfo = {
        attrName: '', // 属性名
        // 属性值列表
        attrValueList: [],
        categoryId: this.category3Id, // 收集三级分类id
        categoryLevel: 3
      }
    },
    // 修改某一个属性
    updateAttr(row) {
      this.isShowTable = false
      // 将选中的值赋值给attrInfo
      // 由于数据结构当中存在对象里面嵌套数组，数组里面有对象，因此需要使用深拷贝解决
      // 展开运算符不完全算深拷贝，只有一层结构是深拷贝，多层嵌套是浅拷贝
      // 递归深拷贝
      this.attrInfo = cloneDeep(row)
      // this.attrInfo = JSON.parse(JSON.stringify(row))
      // 在修改某一个属性的时候，将相应的属性值添加 flag 标记 用户切换显示和编辑模式
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'flag', false)
      })
    },
    // 失去焦点的事件
    toLook(row) {
      // row 当前用户添加的最新属性值
      // 最新属性值不能为空
      if (!row.valueName.trim()) return this.$message.error('属性值不能为空！')
      // 新增属性值不能与已有属性值相同
      const { attrValueList } = this.attrInfo
      const isRepat = attrValueList.some(item => {
        if (row !== item) return row.valueName === item.valueName
      })
      if (isRepat) {
        row.valueName = ''
        return this.$message.error('属性值重复！')
      }

      row.flag = false
    },
    // 点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true
      // 获取input实现自动聚焦
      // 等input 模板解析完毕再获取焦点
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 气泡确认框确定按钮回调
    deleteAttrValue(index) {
      // 当前删除属性值的操作不需要发请求
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮：进行添加属性或者修改属性
    async addOrUpdateAttr() {
      // 整理参数：1.属性值为空，不能提交给服务器 2.其中且不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // 过滤valueName不为空的
        if (item.valueName !== '') {
          // 删除flag属性
          delete item.flag
          return true
        }
      })
      // 发请求
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        // 展示平台属性首页列表
        this.isShowTable = true
        this.$message.success('保存成功')
        // 保存成功以后 再次获取数据展示
        this.getAttrList()
      } catch (err) {
        this.$message.error(err.message)
      }
    }
  }
}
</script>
