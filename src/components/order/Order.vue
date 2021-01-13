<template>
  <div>
      <!-- 面包屑导航区域-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区域 -->
      <el-card>
        <el-row>
          <el-col :span='8'>
            <el-input placeholder="请输入内容" >
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>

        <!-- 表格区域 -->
        <el-table :data="orderList" style="width: 100%" border>
           <el-table-column type='index' label="#" ></el-table-column>
           <el-table-column prop='order_number' label="订单编号" width='220'></el-table-column>
           <el-table-column prop='order_price' label="订单价格" ></el-table-column>
           <el-table-column prop='pay_status' label="是否付款" >
             <template scope='scope'>
              <el-tag type="success" size='mini' v-if='scope.row.pay_status==="1"'>已付款</el-tag>
              <el-tag type="warning" size='mini' v-else>未付款</el-tag>
             </template>
</el-table-column>
<el-table-column prop='is_send' label="是否发货"></el-table-column>
<el-table-column prop='create_time' label="下单时间">
    <template scope="scope">
    {{ scope.row.create_time |dataFormat }}
  </template>
</el-table-column>
<el-table-column label="操作">
    <template>
              <el-button type="primary" icon="el-icon-edit" size='mini' @click="showBox"></el-button>
              <el-button type="success" icon="el-icon-location" size='mini' @click="showProgressBox"></el-button>
            </template>
</el-table-column>
</el-table>

<!-- 分页条 -->
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 8, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
</el-pagination>
</el-card>

<!-- 修改地址对话框 -->
<el-dialog title="修改地址" :visible.sync="addressVisible" width="50%">
    <el-form ref="form" :model="addressForm" label-width="80px">
        <el-form-item label="省市区/县">
            <el-input v-model="addressForm.address"></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
            <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
    </el-form>
</el-dialog>

<!-- 快递信息对话框 -->
<el-dialog title="修改地址" :visible.sync="progressVisible" width="50%">
    <!-- 时间线 -->
    <el-timeline :reverse="reverse">
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
            {{activity.context}}
        </el-timeline-item>
    </el-timeline>
</el-dialog>
</div>
</template>
<script>
    export default {
        name: 'Order',
        data() {
            return {
                queryInfo: {
                    query: '',
                    //页码
                    pagenum: 1,
                    //分页数据条数
                    pagesize: 10
                },
                total: 0,
                orderList: [],
                //对话框显示与隐藏
                addressVisible: false,

                addressForm: {
                    address: '',
                    address2: ''
                },
                //快递信息对话框的显示与隐藏
                progressVisible: false,
                //获取的快递信息数组
                progressInfo: [],
                // 指定节点排序方向，默认为正序
                reverse: true

            }
        },
        created() {
            this.getOrderList()
        },
        methods: {
            //湖区初始化数据
            async getOrderList() {
                const {
                    data: res
                } = await this.$axios.get('orders', {
                    params: this.queryInfo
                })
                if (res.meta.status !== 200) return this.$message.error('获取初始化数据失败')
                console.log(res)
                this.total = res.data.total
                this.orderList = res.data.goods
            },
            handleSizeChange(newsize) {
                this.queryInfo.pagesize = newsize
                this.getOrderList()
            },
            handleCurrentChange(newnum) {
                this.queryInfo.pagenum = newnum
                this.getOrderList()
            },
            showBox() {
                this.addressVisible = true
            },
            //显示物流信息对话框
            async showProgressBox() {
                const {
                    data: res
                } = await this.$axios.get('/kuaidi/804909574412544580')
                if (res.meta.status !== 200) return this.$message.error('获取快递信息失败')
                this.progressInfo = res.data
                console.log(this.progressInfo)
                this.progressVisible = true

            }
        },
    }
</script>
<style scoped>
    .el-select {
        width: 50%;
    }
</style>