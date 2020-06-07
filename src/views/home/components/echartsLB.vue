<template>
  <div>
      <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
  </div>
</template>

<script>
import {cboption} from './data'
export default {
    name:"lb",
    components:{},
    data(){
        return{
            data:cboption
        }
    },
    mounted(){
        this.drawLine()
    },
    methods:{
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = window.echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption(cboption);
        }
    }
}
</script>

<style>

</style>