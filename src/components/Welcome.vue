<template>
  <div>
    <header>Welcome</header>
    <div class="tip">
      <p>使用须知</p>
      <p>1.本应用提供后台信息管理</p>
      <p>2.使用方式可以查看教程</p>
      <p>3.版本所有权归本公司所有</p>
      <p>.............................</p>
      <p>{{message}}</p>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'Welcome',
        data() {
            return {
                message: ' 关注我们哦！'
            }
        },
    }
</script>
<style lang="less">
    header {
        width: 100%;
        height: 50px;
        line-height: 50px;
        background-color: rgb(85, 87, 204);
        text-align: center;
        color: red;
        padding: 0;
        margin: 0;
        border-radius: 20px;
        /* box-shadow: v-shadow 2px solid rgb(31, 30, 30); */
    }
    
    .tip {
        /* width: 100%; */
        padding: 10px;
        border: 1px solid #ccc;
        margin-top: 10px;
        box-sizing: content-box;
        p:first-child {
            text-align: center;
            font-size: 20px;
            color: #000;
            font-family: '隶书';
        }
        p:last-child {
            color: red;
        }
        p {
            padding: 5px 0;
            color: slategrey;
            font-family: '楷体';
        }
    }
</style>