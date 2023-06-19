<template>
  <div>
    <el-row :gutter="10">
      <!-- 24 -->
      <el-col :span="6">
        <!-- 第一个card -->
        <el-card>
          <Detail title="总销售额" count="￥ 12561">
            <!-- 作用域插槽 -->
            <template #charts>
              <span
                >周同比 &nbsp;&nbsp; 56.67%
                <svg
                  t="1686985355549"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2396"
                  width="11"
                  height="14"
                >
                  <path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="2397" /></svg
              ></span>
              <span
                >日同比 &nbsp;&nbsp; 19.96%
                <svg
                  t="1686985794287"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3559"
                  width="11"
                  height="14"
                >
                  <path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="3560" /></svg
              ></span>
            </template>
            <template #footer>
              <span>日销售额￥ 12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="￥ 22201">
            <template #footer>
              <span>日访问量 123456</span>
            </template>
            <template #charts>
              <!-- 折线图 -->
              <LineChart></LineChart>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="￥ 55301">
            <template #charts>
              <!-- 柱状图组件 -->
              <BarChart></BarChart>
            </template>
            <template #footer>
              <span>转化率 64%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <!-- 进度条 -->
            <template #charts>
              <Progress></Progress>
            </template>
            <!-- 作用域插槽 -->
            <template #footer>
              <span
                >周同比&nbsp;&nbsp;56.67%
                <svg
                  t="1686985355549"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2396"
                  width="11"
                  height="14"
                >
                  <path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="2397" /></svg
              ></span>
              <span
                >日同比 &nbsp;&nbsp; 19.96%
                <svg
                  t="1686985794287"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3559"
                  width="11"
                  height="14"
                >
                  <path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="3560" /></svg
              ></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail'
import LineChart from './LineChart'
import BarChart from './BarChart'
import Progress from './Progress'

export default {
  name: 'Card',
  components: {
    Detail,
    LineChart,
    BarChart,
    Progress
  }
}
</script>
