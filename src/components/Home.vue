<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/img/main.jpg" alt="">
        <span>看到了说Hi</span>
      </div>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <!-- 内容区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px' ">
            <div class="toggle-button" @click='toggleClick' >|||</div>
        <!-- unique-opened:是否只保持一个子菜单的展开,默认false，写上为true -->
        <!-- router：是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
            <el-menu background-color="#373b41" text-color="#fff" active-text-color="#090" unique-opened 
            :collapse='isCollapse'
            :collapse-transition='false'
            router
            :default-active='activePath'>
                <!--一级列表 index属性需要传入一个字符串类型，限定为一值，保证点击后只有被点击的一项起作用 -->
                <el-submenu :index="item.id + ''" v-for='item in menuList' :key="item.id">
                    <template slot="title">
                        <!-- 图标 -->
                        <i :class="iconsObj[item.id]"></i>
                        <!-- 文本 -->
                        <span>{{item.authName}}</span>
                    </template>
<!-- 二级列表 -->
<el-menu-item :index="'/'+ subItem.path" v-for='subItem in item.children' :key="subItem.id" @click='saveNavState("/"+ subItem.path)'>
    <template slot="title">
                        <i class="el-icon-s-grid"></i>
                        <span>{{subItem.authName}}</span>
                    </template>
</el-menu-item>

</el-submenu>
</el-menu>
</el-aside>
<!-- 主题区 -->
<el-main>
    <!-- 路由占位符 -->
    <router-view></router-view>
</el-main>
</el-container>
</el-container>
</template>
<script>
    export default {
        name: 'Home',
        data() {
            return {
                menuList: [],
                iconsObj: {
                    '125': 'iconfonts el-icon-s-custom',
                    '103': 'iconfonts el-icon-s-cooperation',
                    '101': 'iconfonts el-icon-s-goods',
                    '102': 'iconfonts el-icon-delete-solid',
                    '145': 'iconfonts el-icon-s-data'
                },
                isCollapse: false,
                activePath: ''
            }
        },
        mounted() {
            this.getMenuList()
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        methods: {
            logOut() {
                window.sessionStorage.clear()
                this.$router.push('/login')
            },
            async getMenuList() { //获取左侧下拉列表信息
                var {
                    data: res
                } = await this.$axios.get('menus')
                    // console.log(res)
                if (!res.meta.status === 200) return this.$message.error(res.meta.msg)
                this.menuList = res.data
                    // console.log(this.menuList)
            },
            //实现点击折叠左侧选项栏效果
            toggleClick() {
                this.isCollapse = !this.isCollapse
            },
            //实现点击选项高亮
            saveNavState(activePath) {
                window.sessionStorage.setItem('activePath', activePath)
                this.activePath = activePath
            }
        },
    }
</script>
<style lang="less" scoped>
    .home-container {
        height: 100%;
    }
    
    .el-header {
        padding-left: 0px;
        display: flex;
        background-color: #373b41;
        align-items: center;
        justify-content: space-between;
        font-size: 20px;
        color: #fff;
    }
    
    .el-header div {
        display: flex;
        height: 100%;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
    
    .el-header div img {
        height: 100%;
        /* width: 100px; */
    }
    
    .el-aside {
        background-color: #333744;
        .el-menu {
            border: 0;
        }
        .toggle-button {
            text-align: center;
            letter-spacing: .2em;
            height: 24px;
            background-color: #4a5064;
            color: #fff;
            cursor: pointer;
        }
    }
    
    .el-main {
        background-color: #eaedf1;
    }
    
    .iconfonts {
        margin-right: 10px;
    }
</style>