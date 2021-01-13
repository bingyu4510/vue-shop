<template>
  <div>
     <!-- 面包屑导航区域-->
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card>
      <!-- :gutter="20"指定每一列的间距 -->
      <el-row :gutter="20"> 
        <el-col :span="10">
          <!-- 输入框区域 -->
          <el-input placeholder="请输入内容" v-model='queryInfo.query' clearable @clear='getGoodsList'></el-select>
            <el-button slot="append" icon="el-icon-search" @click='getGoodsList'></el-button>
          </el-input>
        </el-col>
        <el-col :span="10">
          <el-button type='primary' @click='addGoods'>添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type='index' label="#" width=""></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width=""></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160">
          <template slot-scope="scope">{{scope.row.add_time | dataFormat }}</template>
</el-table-column>
<el-table-column label="操作" width="130">
    <template scope='scope'>
            <el-button type="primary" icon="el-icon-edit" size='mini'></el-button>
            <el-button type="primary" icon="el-icon-delete" size='mini' @click='removeById(scope.row.goods_id)'></el-button>
          </template>
</el-table-column>
</el-table>
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 8, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
</el-pagination>
</el-card>
</div>
</template>
<script>
    export default {
        name: 'GoodsList',
        data() {
            return {
                queryInfo: {
                    //查询参数
                    query: '',
                    //当前页码
                    pagenum: 1,
                    //每页显示条数
                    pagesize: 5
                },
                //总数据条数
                total: 0,
                //商品数组
                goodsList: []
            }
        },
        created() {
            this.getGoodsList()
        },
        methods: {
            async getGoodsList() {
                const {
                    data: res
                } = await this.$axios.get('goods', {
                    params: this.queryInfo
                })
                if (res.meta.status !== 200) return this.$message.error('数据请求失败')
                    // this.$message.success('数据请求成功')
                this.total = res.data.total
                this.goodsList = res.data.goods
                    //数组条数与this.queryInfo.pagesize有关
                    // console.log(this.goodsList)
            },
            //每页显示条数发生改变触发
            handleSizeChange(newsize) {
                this.queryInfo.pagesize = newsize
                this.getGoodsList()
            },
            //当前页码值发生改变触发
            handleCurrentChange(newnum) {
                this.queryInfo.pagenum = newnum
                this.getGoodsList()
            },
            //根据id删除商品信息
            async removeById(id) {
                const reslut = await this.$confirm('此操作将永久删除该商品信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (reslut !== 'confirm') return this.$message.info('已取消删除')
                const {
                    data: res
                } =
                await this.$axios.delete(`goods/${id}`)
                if (res.meta.status !== 200) return this.$message.error('删除失败')
                this.$message.success('删除成功')
                this.getGoodsList()
            },
            //添加商品按钮
            addGoods() {
                this.$router.push('goods/add')
            }
        },
    }
</script>
<style lang="less" scoped>

</style>