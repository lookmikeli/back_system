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
        // 最大值和最小值的设置
        min: 0,
        max: 100
      },
      yAxis: {
        // 隐藏y轴
        show: false,
        // 均分
        type: 'category'
      },

      // 系列
      series: [
        {
          // 图表的形式
          type: 'bar',
          data: [78],
          color: 'yellowgreen',
          // 柱状图的宽度设置
          barWidth: 15,
          // 开启背景颜色的显示
          showBackground: true,
          // 设置背景颜色
          backgroundStyle: {
            color: '#eee'
          },
          // 文本的展示
          label: {
            show: true,
            // 改变文本的内容
            formatter: '|',
            color: 'pink',
            // 文本标签位置的调试
            position: 'right'
          }
        }
      ],
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
