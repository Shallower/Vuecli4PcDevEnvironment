<template>
  <div class="register">
    <div class="step clearfix">
      <div class="step1"
        :class="{active1: isActive}">Step1</div>
      <div class="step2"
        :class="{active2: !isActive}">Step2</div>
    </div>
    <div class="step1-content">
      <el-form ref="form"
        :model="form"
        label-width="80px">
        <el-form-item label="手机号码">
          <el-input v-model="form.phone" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isActive: false,
      form: {
        phone: '',
        verificationCode: ''
      }
    }
  }
}
</script>
<style lang="scss">
.register {
  height: 100%;
  background: url('~@/assets/loginBackground.png');
  color: #5cdbff;
  .step {
    margin: 0 auto;
    width: 620px;
    .step1,
    .step2 {
      margin-top: 20vh;
      float: left;
      width: 310px;
      height: 42px;
      padding: 13px;
      border: 1px solid #5cdbff;
      text-align: center;
    }
    .step1 {
      border-top-left-radius: 21px;
      border-bottom-left-radius: 21px;
      border-right: none;
    }
    .step2 {
      position: relative;
      left: -21px;
      border-left: none;
      border-top-right-radius: 21px;
      border-bottom-right-radius: 21px;
    }
    .active1 {
      background: rgba(92, 219, 255, 0.3);
      border-top-right-radius: 21px;
      border-bottom-right-radius: 21px;
      border: 1px solid #5cdbff;
    }
    .active2 {
      background: rgba(92, 219, 255, 0.3);
      border-top-left-radius: 21px;
      border-bottom-left-radius: 21px;
      border: 1px solid #5cdbff;
    }
  }
  .step1-content {
    color: red;
  }
}
</style>

