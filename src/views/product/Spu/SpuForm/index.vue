<template>
  <div>
    <el-form label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <!-- rows="4" 控制 textarea 表单的高度 -->
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 
          照片墙组件 
              action:图片上传地址
              file-list：	上传的文件列表【数组：数组里面的元素必须要有name、url两个属性】
              list-type：	文件列表的类型 picture-card
              on-preview：图片预览的时候会触发
              on-remove：删除图片触发
              on-success：文件上传成功时的钩子
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <!-- 对话框 -->
        <!-- sync 父子组件数据同步 -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
            v-for="unSelect in unSelectSaleAttr"
            :key="unSelect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table border :data="spu.spuSaleAttrList">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
          <el-table-column label="属性值名称列表">
            <!-- 销售属性值tag标签组件 -->
            <!-- row 每一项的销售属性 -->
            <template v-slot="{ row }">
              <!-- el-tag 展示已有的属性值列表  spuSaleAttrValueList-->
              <el-tag
                closable
                v-for="(tag, i) in row.spuSaleAttrValueList"
                :key="tag.id"
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(i, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>

              <!-- input 和 button 来回切换显示 -->
              <!--  
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <!-- @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateAttr">保存</el-button>
        <!-- 触发自定义事件回到跳转到父组件spu列表页面 -->
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储spu信息属性
      spu: {
        // 三级分类id
        category3Id: 0,
        // 品牌id
        tmId: '',
        // 描述
        description: '',
        // spu名称
        spuName: '',
        // 收集spu图片信息
        spuImageList: [
          /* {
            id: 0,
            imgName: 'string',
            imgUrl: 'string',
            spuId: 0
          } */
        ],
        // 平台属性与属性值信息
        spuSaleAttrList: [
          /* {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: 'string',
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: 'string',
                saleAttrName: 'string',
                saleAttrValueName: 'string',
                spuId: 0
              }
            ]
          } */
        ]
      },
      // 存储品牌信息
      tradeMarkList: [],
      // 存储SPU图片的数据
      spuImageList: [],
      // 销售属性的数据
      saleAttrList: [],
      // 收集选择的销售属性的id和选择的销售属性名称
      attrIdAndAttrName: ''
    }
  },
  computed: {
    // 计算出还未选择的销售属性
    // SaleAttrList 平台的所有销售属性的数据
    // spu.spuSaleAttrList spu自己的销售属性
    unSelectSaleAttr() {
      return this.saleAttrList.filter(item => {
        // every 会返回布尔值（真，假）
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
    }
  },
  methods: {
    // 照片墙删除某一个图片的回调
    // file 删除的那张图片  fileList 删除过后剩余的图片的数组
    handleRemove(file, fileList) {
      // 收集照片墙图片的数据
      this.spuImageList = fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      // 将图片的地址赋值给这个属性 dialogImageUrl
      this.dialogImageUrl = file.url
      // 对话框显示
      this.dialogVisible = true
    },
    // 初始化SpuForm数据
    async initSpuForm(spu) {
      // spu接收点击某个修改spu按钮传递的spu信息
      // 父组件传递的SPU当前项
      // 调接口发请求
      // 获取SPU信息的数据
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }

      // 获取品牌的信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }

      // 获取SPU图片的数据
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (spuImageResult.code === 200) {
        const listArr = spuImageResult.data
        // 由于ElementUI照片墙显示图片的数据需要数组，数组里面的元素需要 name 和 url 字段
        // 需要把服务器返回的数据进行修改
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 把整理好的数据赋值
        this.spuImageList = listArr
      }

      // 获取平台所有的销售属性
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      // 收集图片的信息
      this.spuImageList = fileList
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 把收集到的销售属性数据进行分隔
      // baseSaleAttrId, saleAttrName 是spu里面需要提交给服务器的字段
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 清空属性名
      this.attrIdAndAttrName = ''
    },
    // 添加按钮的回调
    addSaleAttrValue(row) {
      // 点击销售属性值的添加按钮，需要展示模式(input)变为编辑模式(button)  inputVisible
      // 每个属性添加一个 inputVisible 属性来控制button和input的切换
      this.$set(row, 'inputVisible', true)
      // 收集新的销售属性值
      this.$set(row, 'inputValue', '')
    },
    // input 失去焦点的事件
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row
      // 新增的销售属性值不能为空
      if (!inputValue.trim()) return this.$message.error('添加的属性值不能为空！')
      // 属性值不能重复
      const result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName !== inputValue)
      if (!result) {
        row.inputValue = ''
        return this.$message.error('属性值重复请重新添加！')
      }
      // 新增的销售属性值
      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      // 修改显示button
      row.inputVisible = false
      // 收集数据 baseSaleAttrId  saleAttrValueName
      row.spuSaleAttrValueList.push(newSaleAttrValue)
    },
    // 保存按钮的回调
    async addOrUpdateAttr() {
      // 整理参数：照片墙的数据
      // 图片参数需要携带 imgName 和 imgUrl
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          // 更新的图片的地址是放在 response 属性里面的 而旧图是放在 url 里
          imgUrl: (item.response && item.response.data) || item.url
        }
      })

      // 发请求
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code === 200) {
        // 提示成功
        this.$message.success('保存数据成功！')
        // 通知父组件回到spu列表页面 父组件还得再次发送请求展示数据
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }

      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 父组件点击添加SPU按钮的时候，发请求的函数
    async addSpuData(category3Id) {
      // 添加SPU收集分类的id
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }

      // 获取平台所有的销售属性
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 取消按钮
    cancel() {
      // 取消按钮的回调 切换场景
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 取消按钮 清除数据
      // Object.assign ES6合并对象
      // this._data，_data是组件的实例对象的属性，通过数据代理可以操作data当中的响应式数据
      // this.$options 是组件的实例对象的配置对象，配置对象上面有data函数；且data函数执行，返回的响应式数据是空对象
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
