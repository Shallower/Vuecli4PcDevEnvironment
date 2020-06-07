<!--
 * @Descripttion: 首页 数据分析dataDnalysis
 * @version: 
 * @Author: Hevin
 * @Date: 2020-05-20 17:28:09
 * @LastEditors: Hevin
 * @LastEditTime: 2020-05-20 18:03:41
--> 

<template>
  <div class="home">
    <el-row type="flex" class="row-bg">
        <el-col :span="24"><div class="grid-title bg-purple">大数据统计分析</div></el-col>
    </el-row>
    <el-row type="flex" class="row-bg">
        <el-col :span="7" class="content"><LT></LT></el-col>
        <el-col :span="10"  class="content"><CB></CB><CC></CC></el-col>
        <el-col :span="7"  class="content"><RT></RT></el-col>
    </el-row>
  </div>
</template>
<script>
import LT from './components/echartsLT'
import CB from './components/echartsCB'
import CC from './components/echartsCC'
import RT from './components/echartsRT'
export default {
    name:'home',
    components:{LT,CB,CC,RT},
    data(){
        return{}
    },
    mounted(){},
    methods:{}

};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.home{
    .row-bg{
        .content{
            padding: 15px;
        }
        .grid-title{
            text-align: center;
            height: 50px;
            line-height: 50px;
            font-size: 28px;
        }
    }
}
</style>
