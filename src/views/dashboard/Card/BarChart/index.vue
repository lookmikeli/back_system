<template>
  <!-- echarts容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入 echarts
import * as echarts from 'echarts'

export default {
  name: 'LineChart',
  mounted() {
    // 初始化echarts实例
    const lineCharts = echarts.init(this.$refs.charts)
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        // 均分
        type: 'category'
      },
      yAxis: {
        // 隐藏y轴
        show: false
      },

      // 系列
      series: [
        {
          // 图表的形式
          type: 'bar',
          data: [10, 99, 45, 12, 38, 20, 60, 55, 30, 33, 55, 20],
          color: 'cyan'
        }
      ],
      tooltip: {},
      // 布局调试
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    })
  }
}
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>
