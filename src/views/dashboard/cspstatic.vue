<template>
<div class="">
  <div ref="chart" :style="{width: '100%', height: '300px'}"></div>
</div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      list: 0,
      keylist: [],
      timeList: [],
      numberList: []
    }
  },
  mounted() {
    this.loadTime();
  },
  methods: {
    loadTime() {
      this.$store.dispatch('user/gettime').then((res) => {
        this.list = JSON.parse(res.data)
        this.keylist = this.list[0]
        this.timeList = this.list[2]
        this.numberList = this.list[1]
        this.drawLine()
      }).catch(() => {})
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const chart = this.$refs.chart
      let myChart = this.$echarts.init(chart)
      var option = {
        title: {
          text: '各函数重加密时间'
        },
        grid: {
          height: "70%",
          buttom: "30%"
        },
        tooltip: {},
        toolbox: {},
        legend: {
          data: ['时间','输入个数']
        },
        xAxis: {
          data: this.keylist
        },
        yAxis: [{
            name: 'ms/毫秒',
            type: 'value'
        }, {
            name: '个',
            type: 'value'
        }],
        dataZoom: [{ // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 0, // 左边在 10% 的位置。
            end: 100 // 右边在 60% 的位置。
          },
          { // 这个dataZoom组件，也控制x轴。
            type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
            start: 0, // 左边在 10% 的位置。
            end: 100 // 右边在 60% 的位置。
          }
        ],
        dataset: {},
        series: [{
            name: '时间',
            type: 'line',
            smooth: true,
            // data: this.timeList
            data: this.timeList
          }
          ,
          {
            name: '输入个数',
            type: 'line',
            yAxisIndex: 1,
            data: this.numberList
          }
        ]
      };
      myChart.setOption(option)
      window.addEventListener("resize", function() {
        myChart.resize()
      })
    }
  }
}
</script>

<style lang="" scoped>

</style>
