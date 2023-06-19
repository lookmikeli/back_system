<template>
  <el-card class="box-card" style="margin: 10px 0">
    <div slot="header" class="clearfix">
      <!-- v-model="activeName" @tab-click="handleClick" -->
      <!-- 头部左侧内容 -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visits"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!-- v-model="value1" -->
        <el-date-picker
          v-model="date"
          value-format="yyyy-MM-dd"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
        >
        </el-date-picker>
      </div>
    </div>
    <!-- body区域 -->
    <div>
      <!-- 24 -->
      <el-row :gutter="10">
        <el-col :span="19">
          <!-- 柱状图容器 -->
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="5">
          <div style="font-weight: 700">门店{{ title }}排名</div>
          <ul>
            <li>
              <span class="index color">1</span>
              <span>肯德基</span>
              <span class="value">788</span>
            </li>
            <li>
              <span class="index color">2</span>
              <span>肯德基</span>
              <span class="value">788</span>
            </li>
            <li>
              <span class="index color">3</span>
              <span>肯德基</span>
              <span class="value">788</span>
            </li>
            <li>
              <span class="index">4</span>
              <span>肯德基</span>
              <span class="value">788</span>
            </li>
            <li>
              <span class="index">5</span>
              <span>肯德基</span>
              <span class="value">788</span>
            </li>
            <li>
              <span class="index">6</span>
              <span>肯德基</span>
              <span class="value">788</span>
            </li>
            <li>
              <span class="index">7</span>
              <span>肯德基</span>
              <span class="value">788</span>
            </li>
            <li>
              <span class="index">8</span>
              <span>肯德基</span>
              <span class="value">788</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'

export default {
  name: 'Sale',
  data() {
    return {
      activeName: 'sale',
      myCharts: null,
      // 收集日历的数据
      date: []
    }
  },
  computed: {
    // 标题 计算属性
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    },
    ...mapState({
      listState: state => state.home.list
    })
  },
  // 只执行一次没有数据
  mounted() {
    // 初始化echarts实例
    this.myCharts = echarts.init(this.$refs.charts)
    this.myCharts.setOption({
      title: {
        text: `${this.title}趋势`
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [],
          color: 'skyblue'
        }
      ]
    })
  },
  // 监听属性
  watch: {
    title() {
      // 数据发生变化重新配置数据
      // 图表配置数据可以再次修改，有新值就使用新值
      this.myCharts.setOption({
        title: {
          text: `${this.title}趋势`
        },
        xAxis: {
          data:
            this.title === '销售额'
              ? this.listState.orderFullYearAxis
              : this.listState.userFullYearAxis
        },
        series: {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data:
            this.title === '销售额' ? this.listState.orderFullYear : this.listState.userFullYear,
          color: 'skyblue'
        }
      })
    },
    // 请求到数据立即展示
    listState() {
      this.myCharts.setOption({
        title: {
          text: `${this.title}趋势`
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            // 第一次展示销售量数据
            data: this.listState.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            // 第一次展示销售量数据
            data: this.listState.orderFullYear,
            color: 'skyblue'
          }
        ]
      })
    }
  },
  methods: {
    // 本天
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    // 本周
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 本月
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 本年
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>
<style scoped>
.clearfix {
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  top: 0;
  right: 0;
}
.right > span {
  margin: 0 10px;
}
.clearfix {
  position: relative;
}
.date {
  width: 250px;
  margin: 0 20px;
}

.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul > li {
  height: 8%;
  margin: 10px;
}
.index {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  margin-right: 50px;
}
.color {
  background-color: #000;
  color: #fff;
}
.value {
  float: right;
}
</style>
