<template>
<div>
  <!-- 面包屑导航区域-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card>
    <!-- echarts数据表 -->
    <!-- 2.为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main" style="width: 600px;height:400px;"></div>

  </el-card>
</div>
</template>
<script>
    // 1.导入数据表插件
    import echarts from 'echarts'
    export default {
        name: 'Report',
        data() {
            return {
              option :{
                title: {
                    text: 'ECharts 入门示例'
                },
                tooltip: {},
                legend: {
                    data: ['销量']
                },
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
              }
            }
        },
        created() {
        },
        async mounted() {
            // 获取网络中的图表数据
            const {
                data: res
            } = await this.$axios.get('reports/type/1')
            if (res.meta.status !== 200) return this.$message.error('图表数据获取失败')
            const reslut = res.data
            console.log(reslut)
                // 3.基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            // 4.指定图表的配置项和数据
           
            // 5.使用刚指定的配置项和数据显示图表。
            //完整图表需要自己的数据和原来的option数据合并后一起使用
            // const unit = Object.assign(reslut, option) //合并不成功，待后续补充
            reslut.title={
              text:'区域销量统计图'
            }
            myChart.setOption(reslut);
        },
        methods: {

        },
    }
</script>
<style scoped>

</style>