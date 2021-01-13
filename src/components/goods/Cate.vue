<template>
  <div>
    <!-- 面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 顶部按钮 -->
      <el-row>
        <el-col>
          <el-button type='primary' @click='showAddCateDialog'>添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table :data="cateList" 
      :columns="columns" 
      index-text="序列" 
      border stripe 
      show-index 
      class="table" 
      :selection-type='false'
      :expand-type='false'>
      <!-- 是否有效模板 -->
        <template slot="isok" scope="scope">
          <i class="el-icon-success" v-if='scope.row.cat_deleted' style="color:green"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
<!-- 排序模板 -->
<template slot="order" scope="scope">
  <el-tag type="success" size='mini' v-if='scope.row.cat_level===0'>一级</el-tag>
  <el-tag type="warning" size='mini' v-else-if='scope.row.cat_level===1'>二级</el-tag>
  <el-tag type="danger" size='mini' v-else>三级</el-tag>
</template>
<!-- 操作模板 -->
<template slot="control" scope="scope">
  <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
  <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
</template>
</tree-table>

<!-- 分页区域 -->
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querInfo.pagenum" :page-sizes="[3, 5, 8, 12]" :page-size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
</el-pagination>
</el-card>
<!-- 添加分类对话框 -->
<el-dialog title="提示" :visible.sync="addCateDialogVisible" width="50%" @close='addCateDialogColsed'>
    <!-- 内容区域 -->
    <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
            <!-- 级联选择器 options:指定数据源 props:指定配置对象-->
            <el-cascader v-model="selectedKeys" :options="ParentCateList" :props="cascaderProps" @change="parentCateChanged" clearable></el-cascader>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>

</div>
</template>
<script>
    export default {
        name: 'Cate',
        data() {
            return {
                //商品分类列表数据
                cateList: [],
                //查询条件
                querInfo: {
                    type: 3,
                    //当前页码值
                    pagenum: 1,
                    //每页显示条数
                    pagesize: 5
                },
                //总数据条数
                total: 0,
                columns: [{ //每一列用一个对象来定义数据规则
                    //列绑定的数据标题
                    prop: 'cat_name',
                    // 绑定的数据属性
                    label: "分类名称",
                }, {
                    label: '是否有效',
                    //表示将当前列定义为模板列
                    type: 'template',
                    //定义模板列的名称
                    template: 'isok',
                }, {
                    label: '排序',
                    //表示将当前列定义为模板列
                    type: 'template',
                    //定义模板列的名称
                    template: 'order',
                }, {
                    label: '操作',
                    //表示将当前列定义为模板列
                    type: 'template',
                    //定义模板列的名称
                    template: 'control',
                }],
                //控制对话框显示与隐藏
                addCateDialogVisible: false,
                addCateForm: {
                    //验证名称
                    cat_name: '',
                    //父级分类的id，一级分类id为0
                    cat_pid: 0,
                    //分类层级,默认0，添加一级分类
                    cat_level: 0
                },
                //表单验证规则
                addCateFormRules: {
                    cat_name: [{
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur'
                    }],
                },
                ParentCateList: [],
                //指定级联选择器配置对象
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    expandTrigger: 'hover',
                    //是否可以选中一级选项
                    checkStrictly: true
                },
                //被选中的父级分类的id数据
                selectedKeys: []

            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            //获取商品列表数据
            async getCateList() {
                const {
                    data: res
                } = await this.$axios.get('/categories', {
                    params: this.querInfo
                })
                if (res.meta.status !== 200) return this.$message.error('初始化数据获取失败')
                    // console.log(res)
                this.cateList = res.data.result
                this.total = res.data.total
                    // console.log(this.cateList)
            },
            //修改显示数据条数触发，监听pagesize
            handleSizeChange(val) {
                this.querInfo.pagesize = val
                this.getCateList()
            },
            //监听pagenum的改变
            handleCurrentChange(vals) {
                this.querInfo.pagenum = vals
                this.getCateList()
            },
            showAddCateDialog() {
                this.getParentCateList()
                this.addCateDialogVisible = true
            },
            //获取父级分类列表
            async getParentCateList() {
                const {
                    data: res
                } =
                await this.$axios.get('/categories', {
                    params: {
                        type: 2
                    }
                })
                if (res.meta.status !== 200) return this.$message.error('数据请求失败')
                console.log(res)
                this.ParentCateList = res.data
            },
            //选择项发生变化，触发事件
            parentCateChanged() {
                if (this.selectedKeys.length > 0) {
                    //夫等级id
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                        // 为当前分类等级赋值
                    this.addCateForm.cat_level = this.selectedKeys.length
                } else {
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                }
                console.log(this.selectedKeys)
            },
            addCateDialogColsed() {
                this.$refs.addCateFormRef.resetFields();
                this.selectedKeys = []
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            },
            addCate() {
                this.$refs.addCateFormRef.validate(async valid => {
                    if (!valid) return
                    const {
                        data: res
                    } = await this.$axios.post('/categories', this.addCateForm)
                    if (res.meta.status !== 201) return this.$message.error('请求失败')
                    this.$message.success('添加分类成功')
                    this.getCateList()
                    this.addCateDialogVisible = false
                })
            }
        },
    }
</script>
<style lang="less" scoped>
    .table {
        margin-top: 10px;
    }
    
    .el-cascader {
        width: 100%;
    }
</style>