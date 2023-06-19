<template>
  <el-card>
    <div slot="header" class="header">
      <div class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <i class="el-icon-more"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-row>
      <el-col :span="12">
        <LineCharts></LineCharts>
      </el-col>
      <el-col :span="12">
        <LineCharts></LineCharts>
      </el-col>
    </el-row>
    <!-- table表格 -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="date" label="排名" type="index" width="80" align="center">
      </el-table-column>
      <el-table-column prop="name" label="搜索关键字" width="180"> </el-table-column>
      <el-table-column prop="address" label="用户数" sortable> </el-table-column>
      <el-table-column prop="address" label="周涨幅" sortable> </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination align="right" layout="prev, pager, next" :total="1000"> </el-pagination>
  </el-card>
</template>

<script>
import LineCharts from './LineCharts'
export default {
  name: 'Search',
  data() {
    return {
      tableData: []
    }
  },
  components: {
    LineCharts
  }
}
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
}
.header {
  border-bottom: 1px solid #eee;
  padding: 0 0 15px 0;
}
</style>
