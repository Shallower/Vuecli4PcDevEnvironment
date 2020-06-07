<template>
  <div>
      <div id="rtChart" :style="{width: '100%', height: '300px'}"></div>
  </div>
</template>

<script>
export default {
    name:"rt",
    components:{},
    data(){
        return{
            data:[
                {value:235, name:'视频广告'},
                {value:274, name:'联盟广告'},
                {value:310, name:'邮件营销'},
                {value:335, name:'直接访问'},
                {value:400, name:'搜索引擎'}
            ]
        }
    },
    mounted(){
        this.drawLine()
    },
    methods:{
        drawLine(){
            const _this = this
            // 基于准备好的dom，初始化echarts实例
            let myChart = window.echarts.init(document.getElementById('rtChart'))
            myChart.showLoading();
            window.setTimeout(
                function(){
                    myChart.hideLoading();
                    myChart.setOption({
                        title : {
                            text: '访问来源',
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        roseType: 'angle',
                        series : [
                            {
                                name: '访问来源',
                                type: 'pie',
                                radius: '55%',
                                data:_this.data
                            }
                        ],
                        itemStyle: {
                            // 阴影水平方向上的偏移
                            shadowOffsetX: 0,
                            // 阴影垂直方向上的偏移
                            shadowOffsetY: 0,
                            emphasis: {
                                // 阴影的大小
                                shadowBlur: 200,
                                // 阴影颜色
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    });         
                },3000
            )
            
        }
    }
}
</script>

<style>

</style>