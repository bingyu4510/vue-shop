<template>
  <div>
    <!-- 面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert title="注意：只允许为三级分类设置相关参数！" type="warning" :closable='false' show-icon></el-alert>

      <el-row class="row-params">
        <el-col>
          <span>选择商品分类:</span>
          <!-- //props：配置级联选择框  v-model：绑定被选中的id值，多级节点有多个id值，需要定义为数组 change：选择项改变触发事件-->
          <el-cascader v-model="selectedCateKeys" 
          :options="cateList" 
          :props="cateProps"
           @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域v-model双向绑定被选中的标签页的name名称 -->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type='primary' :disabled='isBtnDisabled' size='mini' @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数列表 -->
          <el-table :data="manyTableData" style="width: 100%" border stripe>
              <el-table-column type="expand" label='展开' width='55'>
          <template  slot-scope="scope">
                  <el-tag :key="index" closable v-for='(item ,index) in scope.row.attr_vals' @close='handleClosed(index,scope.row)'> {{item}}</el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ 添加New Tag</el-button>
                </template>
</el-table-column>
<el-table-column type='index' label="#"></el-table-column>
<el-table-column prop="attr_name" label="参数名称"></el-table-column>
<el-table-column label="操作">
    <template scope="scope">
                  <el-button type='primary' size='mini' icon="el-icon-edit" @click='showEditDialog(scope.row.attr_id)'>编辑</el-button>
                  <el-button type='danger' size='mini' icon="el-icon-delete" @click='removeParams(scope.row.attr_id)'>删除</el-button>
                </template>
</el-table-column>
</el-table>
</el-tab-pane>
<!-- 添加静态参数面板 -->
<el-tab-pane label="静态属性" name="only">
    <el-button type='primary' :disabled='isBtnDisabled' size='mini' @click="addDialogVisible = true">添加属性</el-button>
    <!-- 静态参数列表 -->
    <el-table :data="onlyTableData" style="width: 100%" border stripe type="expand">
        <el-table-column type="expand" label='展开' width='55'>
            <template slot-scope="scope">
                    <el-tag :key="index" closable v-for='(item ,index) in scope.row.attr_vals' @close='handleClosed(index,scope.row)'> {{item}}</el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                      >
                      </el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ 添加New Tag</el-button>
                  </template>
        </el-table-column>
        <el-table-column type='index' label="#"></el-table-column>
        <el-table-column prop="attr_name" label="属性名称"></el-table-column>
        <el-table-column label="操作">
            <template scope="scope">
            <el-button type='primary' size='mini' icon="el-icon-edit" @click='showEditDialog(scope.row.attr_id)'>编辑</el-button>
            <el-button type='danger' size='mini' icon="el-icon-delete" @click='removeParams(scope.row.attr_id)'>删除</el-button>
        </template>
        </el-table-column>
    </el-table>
</el-tab-pane>
</el-tabs>
</el-card>

<!-- 添加数据分类数据对话框 -->
<el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close='addDialogClosed'>

    <!-- 主题表单区域 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>

<!-- 编辑表单数据对话框 -->
<el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%" @close='editDialogClosed'>

    <!-- 主题表单区域 -->
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
  <el-button @click="editDialogVisible = false">取 消</el-button>
  <el-button type="primary" @click="editParams">确 定</el-button>
</span>
</el-dialog>
</div>
</template>
<script>
    export default {
        name: 'Params',
        data() {
            return {
                cateList: [],
                //配置级联选择框
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    //看到的名称
                    label: 'cat_name',
                    children: 'children'
                },
                //级联选择框双向绑定到的数组
                selectedCateKeys: [],
                // 被选中的标签页的name名称
                activeName: 'many',
                //动态数据列表
                manyTableData: [],
                // 静态数据列表
                onlyTableData: [],
                //对话框的显示与隐藏
                addDialogVisible: false,
                //表单数据据
                addForm: {
                    attr_name: ''
                },
                // 验证规则
                addFormRules: {
                    attr_name: [{
                        required: true,
                        message: '请输入参数名称',
                        trigger: 'blur'
                    }],
                },
                //编辑表单数据对话框显示与隐藏
                editDialogVisible: false,
                //编辑表单数据对话框双向绑定的数据对象
                editForm: {
                    attr_name: ''
                },
                //编辑表单数据对话框验证规则对象
                editFormRules: {
                    attr_name: [{
                        required: true,
                        message: '请输入参数名称',
                        trigger: 'blur'
                    }, {
                        // min: 3,
                        // max: 5,
                        // message: '长度在 3 到 5 个字符',
                        // trigger: 'blur'
                    }],
                },



            }
        },
        created() {
            this.getCateList()
        },
        computed: {
            isBtnDisabled() {
                if (this.selectedCateKeys.length !== 3) return true
                return false
            },
            titleText() {
                if (this.activeName === 'many') return '动态参数'
                return "静态属性"
            },
            cateId() {
                if (this.selectedCateKeys.length === 3) {
                    return this.selectedCateKeys[2]
                } else {
                    return null
                }
            }
        },
        methods: {
            //获取分类列表数据
            async getCateList() {
                const {
                    data: res
                } = await this.$axios.get('/categories')
                if (res.meta.status !== 200) return this.$message.error('数据列表获取失败')
                this.cateList = res.data
                    // console.log(this.cateList)
            },
            // 选择项改变触发事件
            async handleChange() {
                // console.log(this.selectedCateKeys)
                this.getParamsData()
            },
            //tabs标签页发生切换触发
            handleTabsClick() {
                console.log(this.activeName)
                this.getParamsData()
            },
            // 获取参数列表数据
            async getParamsData() {
                if (this.selectedCateKeys.length !== 3) {
                    this.onlyTableData = []
                    this.manyTableData = []
                    this.selectedCateKeys = []
                    return
                }
                const {
                    data: res
                } =
                await this.$axios.get(`/categories/${this.cateId}/attributes`, {
                    params: {
                        sel: this.activeName
                    }
                })
                if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
                res.data.forEach(ele => {
                    ele.attr_vals = ele.attr_vals ? ele.attr_vals.split(',') : []
                    ele.inputVisible = false
                    ele.inputValue = ''
                });
                console.log(res.data)
                if (this.activeName === 'many') {
                    this.manyTableData = res.data
                } else {
                    this.onlyTableData = res.data
                }
            },
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            addParams() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                    const {
                        data: res
                    } = await this.$axios.post(`/categories/${this.cateId}/attributes`, {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    })
                    if (res.meta.status !== 201) return this.$message.error('添加数据请求失败')
                    this.$message.success('添加数据请求成功')
                        //重新请求数据，刷新一下
                    this.getParamsData()
                })

                this.addDialogVisible = false
            },
            //显示编辑对话框
            async showEditDialog(attr_id) {
                // console.log(attr_id)
                const {
                    data: res
                } =
                await this.$axios.get(`/categories/${this.cateId}/attributes/${attr_id}`, {
                    params: {
                        attr_sel: this.activeName
                    }
                })
                if (res.meta.status !== 200) return this.$message.error(res.msg)
                this.editForm = res.data
                console.log(this.editForm)
                this.editDialogVisible = true
            },
            // 关闭编辑表单对话框
            editDialogClosed() {
                // 关闭编辑表单对话框后重置表单数据
                this.$refs.editFormRef.resetFields()
            },
            // 点击关闭编辑表单对话框中的确定按钮，保存修改数据
            editParams() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                    const {
                        data: res
                    } = await this.$axios.put(`/categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.activeName
                    })
                    if (res.meta.status !== 200) return this.$message.error(res.msg)
                    this.$message.success('数据修改成功')
                        //刷新数据
                    this.getParamsData();
                    // 关闭对话框
                    this.editDialogVisible = false;
                })
            },
            //删除数据
            async removeParams(attr_id) {
                const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (result !== 'confirm') return this.$message.info('已经取消修改')
                const {
                    data: res
                } = await this.$axios.delete(`/categories/${this.cateId}/attributes/${attr_id}`)
                if (res.meta.status !== 200) return this.$message.error('删除数据失败')
                this.$message.success('删除数据成功')
                    //刷新数据
                this.getParamsData();
            },
            //失去焦点事件,或者enter键都会触发
            async handleInputConfirm(row) {
                //输入为空时的返回结果
                if (row.inputValue.trim().length == 0) {
                    row.inputValue = ''
                    row.inputVisible = false
                } else {
                    //输入不为空时的返回结果
                    row.attr_vals.push(row.inputValue.trim())
                    row.inputVisible = false
                    const {
                        data: res
                    } = await this.$axios.put(`/categories/${this.cateId}/attributes/${row.attr_id}`, {
                        attr_name: row.attr_name,
                        attr_sel: row.attr_sel,
                        attr_vals: row.attr_vals.join(',')
                    })
                    if (res.meta.status !== 200) return this.$message.error('添加数据失败')
                    this.$message.success('添加数据成功')
                }

                // this.$refs.saveTagInput.inputValue
            },
            //点击按钮事件
            showInput(row) {
                row.inputVisible = true
                    // 文本框自动获取焦点
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //关闭tag标签时触发，并删除数据
            async handleClosed(index, row) {
                row.attr_vals.splice(index, 1);
                const {
                    data: res
                } = await this.$axios.put(`/categories/${this.cateId}/attributes/${row.attr_id}`, {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(',')
                })
                if (res.meta.status !== 200) return this.$message.error('删除数据失败')
                this.$message.success('删除数据成功')

            }


        },

    }
</script>
<style lang="less" scoped>
    .row-params {
        margin: 15px 0;
        font-size: 18px;
        color: rgb(54, 2, 2);
    }
    
    .el-cascader {
        margin-left: 10px;
    }
    
    .el-tag {
        margin-right: 10px;
    }
    
    .input-new-tag {
        width: 150px;
    }
</style>