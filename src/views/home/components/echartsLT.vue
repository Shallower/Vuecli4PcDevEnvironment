<template>
  <div>
      <div id="ltChart" :style="{width: '100%', height: '300px'}"></div>
  </div>
</template>

<script>
import {ltoption} from './data'
export default {
    name:"lt",
    components:{},
    data(){
        return{
            data:ltoption
        }
    },
    mounted(){
        this.drawLine()
    },
    methods:{
        drawLine(){
            console.log(9999,window.echarts,window.VeIndex)
            // 基于准备好的dom，初始化echarts实例
            let myChart = window.echarts.init(document.getElementById('ltChart'))
            // 绘制图表
            myChart.setOption(ltoption);
        }
    }
}
</script>

<style>

</style>