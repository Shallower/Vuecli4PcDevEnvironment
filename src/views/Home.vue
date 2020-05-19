<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
console.log("测试一下构建是否去除了console");
export default {
  name: "Home",
  components: {
    HelloWorld
  }
};
</script>
<style lang="scss">
.test {
  background: #fff;
}
.home {
  display: flex;
  transform: scale3d(30);
}
</style>
