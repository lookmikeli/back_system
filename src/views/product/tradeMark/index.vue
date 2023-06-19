<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 15px" @click="showDialog"
      >添加</el-button
    >
    <!--
      1.表格组件
          data:表格组件将来要展示的数据----数组类型
          border:表格添加边框

      1.1column属性
          label:显示标题
          width:对应列的宽度
          lign:对齐方式
          index:展示序号
          prop:对应列内容的字段名
      注意：elementUI的table组件，展示数据是以一列一列的进行展示
    -->
    <el-table style="width: 100%" border :data="list">
      <!-- 一列 -->
      <el-table-column type="index" label="序列" align="center" width="80px" />
      <el-table-column prop="tmName" label="品牌名称" width="width" />
      <el-table-column prop="" label="品牌LOGO" width="width">
        <!-- elementUI 规定必须解构 row 和 $index -->
        <template v-slot="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{ row }">
          <!-- row 插槽传递数据对象 -->
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--
      分页器
        total:展示数据总条数
        current-page:当前第几页
        page-size:每一页显示多少条数据
        page-sizes:可以设置每一展示多少条数据
        pager-count:按钮的数量(如果是7 连续页码数5)
        layout: 控制要显示或者隐藏的分页器元素, 排列顺序右=>左
        @current-change:点击某一页触发
        @size-change:当每一页展示的条数发生变化触发
     -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :pager-count="7"
      :total="total"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @size-change="handleSizeChange"
      @current-change="getPageList"
    />
    <!--
      对话框
          title：对话框标题
          :visible.sync：控制对话框显示与隐藏
          :model:收集表单数据,到那个对象身上,表单验证也需要这个属性
     -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form 表单 -->
      <!-- :model:收集表单数据,到那个对象身上,表单验证也需要这个属性 -->
      <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可 -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <!--
          上传图片
              注意:图片上传不能使用v-model
              action:设置图片上传地址
              :on-success:可以检测到图片上传成功,当图片上传成功,会执行一次
              :before-upload:上传图片之前,会在执行一次
        -->

        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    // ElementUI 提供的自定义校验规则
    // rule :校验的规则, value: 用户输入的内容, callback: 放行的回调函数
    let validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('请输入品牌名称为2-10位'))
      } else {
        callback()
      }
    }
    return {
      // 代表分页器第几页
      page: 1,
      // 当前页数展示数据条数
      limit: 3,
      // 总共数据的条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 控制对话框显示与隐藏的变量
      dialogFormVisible: false,
      // 收集品牌信息
      // 需要匹配请求头参数
      tmForm: {
        // 品牌图片
        logoUrl: '',
        // 品牌名称
        tmName: ''
      },
      // 表单验证规则
      rules: {
        // 品牌名称的验证规则
        // trigger:用户的行为设置(事件的设置:blur\change)
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // 自定义校验规则
          { validator: validateTmName, trigger: 'change' }
        ],
        // 品牌LOGO的验证规则
        logoUrl: [{ required: true, message: '请选择品牌的图片' }]
      }
    }
  },
  mounted() {
    // 获取列表数据方法
    this.getPageList()
  },
  methods: {
    // 获取品牌列表数据
    async getPageList(pager = 1) {
      this.page = pager
      // 解构参数
      const { page, limit } = this
      // 获取品牌列表接口
      const result = await this.$API.trademark.reqTradeMarkList(page, limit)
      console.log(result)
      if (result.code === 200) {
        // 展示数据的总条数和列表展示的数据
        this.list = result.data.records
        this.total = result.data.total
      }
    },
    // 当分页器某一页需要展示数据条数发生变化的时候触发
    handleSizeChange(limit) {
      // 整理参数
      this.limit = limit
      this.getPageList()
    },
    // 点击添加品牌
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true
      // 重置对话框数据
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    // 修改某一个品牌
    updateTradeMark(row) {
      // row:当前用户选中的品牌信息
      this.dialogFormVisible = true
      // 将但前点击已有的品牌信息赋值给tmForm来显示
      this.tmForm = { ...row }
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      // res:上传成功之后服务器返回前端的数据
      // file:上传成功之后服务器返回前端的数据
      // 收集图片的数据,之后带给服务器
      this.tmForm.logoUrl = res.data
    },
    // 上传图片之前
    beforeAvatarUpload(file) {
      // 判断图片的格式和大小
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 添加品牌和修改品牌
    addOrUpdateTradeMark() {
      // 全部验证字段通过,才去执行逻辑
      // validate方法 形参接收表单验证是否全部通过 布尔值
      this.$refs.ruleForm.validate(async success => {
        if (success) {
          this.dialogFormVisible = false
          // 发起请求 添加|修改
          const result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if (result.code === 200) {
            // 弹出提示信息
            this.$message.success(this.tmForm.id ? '修改品牌成功' : '添加品牌成功')
            // 添加或者修改成功之后再次获取品牌列表展示
            // 如果是添加品牌:停留在最后一页,修改品牌停留在当前页
            this.getPageList(this.tmForm.id ? this.page : Math.ceil(this.total / this.limit))
          }
        } else {
          this.$message.error('提交错误')
          return false
        }
      })
    },
    // 删除品牌
    deleteTradeMark(row) {
      // 弹框
      this.$confirm(`你确定删除${row.tmName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 点击确定触发
          // 向服务器发请求
          const reslut = await this.$API.trademark.reqDeleteTradeMark(row.id)
          // 删除成功
          if (reslut.code === 200) this.$message.success('删除成功')
          // 再次获取商品列表数据渲染
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          // 点击取消触发
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
