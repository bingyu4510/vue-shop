<template>
  <div id="app">
    <!-- 路由占位符 -->
   <router-view></router-view>
  </div>
</template>

<script>
    export default {
        name: 'app',
        components: {
            // HelloWorld
        }
    }
</script>

<style scoped>
    @import "./assets/css/global.css";
</style>