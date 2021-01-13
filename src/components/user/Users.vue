<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片组件 -->
    <el-card>
      <el-row :gutter="20">
        <!-- :span指定每一列的宽度（格数），一共24格 gutter：属性来指定每一栏之间的间隔，默认间隔为 0。-->
        <el-col :span="8"><div class="grid-content bg-purple">
          <el-input placeholder="请输入内容" class="input-with-select"
          v-model='queryInfo.query' clearable @clear='getUserList'> 
          <!-- clearable可清空输入框 -->
            <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
          </el-input>
        </div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">
          <el-button type="primary" round @click='dialogVisible=true'>添加用户</el-button>
        </div></el-col>
      </el-row>
      <!-- 数据表格区域 -->
      <el-table :data="userList" border stripe>
        <!-- type='index表示索引列 -->
        <el-table-column type='index' label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 使用template标签获取整列或者整行中的数据 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" 
            @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
</el-table-column>
<el-table-column prop="" label="操作" width='180px'>
    <template slot-scope="scope">
      <el-button type="primary" icon="el-icon-edit" size='mini' @click='showEditDialog(scope.row.id)'></el-button>
      <el-button  icon="el-icon-delete" size='mini' type="danger" @click='removeUserById(scope.row.id)'></el-button>
      <!-- enterable	鼠标是否可进入到 tooltip 中 -->
      <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable='false'>
        <el-button  icon="el-icon-setting" size='mini' type="warning" @click='setRole(scope.row)'></el-button>
      </el-tooltip>
  </template>
</el-table-column>
</el-table>
<!-- 分页组件 -->
<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[2, 5, 8, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="Number(total)">
</el-pagination>
</el-card>

<!-- 添加用户对话框组件 -->
<el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close='addDialogColsed'>
    <!-- 内容主题区域 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" class="demo-ruleForm">
        <!-- 用户名区域 -->
        <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!-- 密码区域 -->
        <el-form-item label="密码" prop="password" type='password'>
            <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱区域 -->
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <!-- 手机号码区域 -->
        <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
    </el-form>
    <!-- 底部按钮区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
</el-dialog>

<!-- 编辑用户信息对话框组件 -->
<el-dialog title="提示" :visible.sync="eidtDialogVisible" width="50%" @close='eidtDialogClosed'>
    <!-- 内容区域 -->
    <el-form :model="eidtForm" :rules="eidtFormRules" ref="eidtFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
            <el-input type="password" v-model="eidtForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="eidtForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
            <el-input v-model="eidtForm.mobile"></el-input>
        </el-form-item>
    </el-form>
    <!-- 底部按钮区域 -->
    <span slot="footer" class="dialog-footer">
    <el-button @click="eidtDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="eidtUserInfo">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配角色对话框 -->
<el-dialog title="提示" :visible.sync="setRoleDialogVisible" width="50%" @close='setRoleDialogClosed'>
    <!-- 内容区域 -->
    <div>当前用户:{{userInfo.username}}</div>
    <div>当前角色:{{userInfo.role_name}}</div>
    <p>分配新角色
        <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
        </el-select>
    </p>
    <!-- 底部按钮区域 -->
    <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>
<script>
    export default {
        name: 'Users',
        data() {
            // 自定义验证规则
            var checkEmail = (rule, value, callback) => {
                var reg =
                    /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
                if (reg.test(value)) {
                    return callback()
                } else {
                    return callback(new Error('信息不合法，请重新输入'))
                }
            };
            const checkMobile = (rule, value, callback) => {
                var reg = /^1[3456789]\d{9}$/
                if (reg.test(value)) {
                    return callback()
                } else {
                    return callback(new Error('信息不合法，请重新输入'))
                }
            };
            return {
                queryInfo: { //请求参数信息
                    //搜索关键字
                    query: '',
                    //当前页数
                    pagenum: 1,
                    //每页显示多少条数据
                    pagesize: 2
                },
                userList: [],
                total: '',
                // 添加用户信息框的显示与隐藏
                dialogVisible: false,
                // 编辑用户信息框的显示与隐藏
                eidtDialogVisible: false,

                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                addFormRules: {
                    username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请输入用户密码',
                        trigger: 'blur'
                    }, {
                        min: 5,
                        max: 10,
                        message: '长度在 5 到 10 个字符',
                        trigger: 'blur'
                    }],
                    email: [{
                        required: true,
                        message: '请输入用户邮箱',
                        trigger: 'blur'
                    }, {
                        //注册上面定义的验证规则
                        validator: checkEmail,
                        trigger: 'blur'
                    }],
                    mobile: [{
                        required: true,
                        message: '请输入用户手机号码',
                        trigger: 'blur'
                    }, {
                        //注册上面定义的验证规则
                        validator: checkMobile,
                        trigger: 'blur'
                    }]
                },
                addFormRef: {},
                eidtForm: {},
                eidtFormRules: { //编辑表单验证规则
                    email: [{
                        required: true,
                        message: '请输入用户邮箱',
                        trigger: 'blur'
                    }, {
                        //注册上面定义的验证规则
                        validator: checkEmail,
                        trigger: 'blur'
                    }],
                    mobile: [{
                        required: true,
                        message: '请输入用户手机号码',
                        trigger: 'blur'
                    }, {
                        //注册上面定义的验证规则
                        validator: checkMobile,
                        trigger: 'blur'
                    }]
                },
                //分配角色对话框显示与隐藏
                setRoleDialogVisible: false,
                //分配角色对话框行scope.row信息
                userInfo: {},
                //所有角色的数据列表
                rolesList: [],
                // 被选中的当前角色
                selectedRoleId: ''
            }
        },
        mounted() {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                const {
                    data: res
                } = await this.$axios.get('users', {
                        params: this.queryInfo
                    })
                    // console.log(res)
                if (!res.meta.status === 200) return this.$message.error(res.meta.msg)
                this.userList = res.data.users
                this.total = res.data.total
                    // console.log(this.userList)
                    // console.log(this.total)
            },
            handleSizeChange(newSize) { //监听pagesize改变
                // console.log(newSize)
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },
            handleCurrentChange(newPage) { //监听页码值改变，获取最新的页码值
                // console.log(newPage)
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },
            async userStateChanged(userInfo) { //   监听开关状态的改变
                const {
                    data: res
                } =
                await this.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
                    // console.log(res)
                if (res.meta.status !== 200) {
                    userInfo.mg_state = !userInfo.mg_state
                    return this.$message.error('状态信息修改失败')
                }
                return this.$message.success('状态信息修改成功')
            },
            addDialogColsed() { //关闭对话框，重置信息
                // resetFields是from表单组件中的内置函数
                this.$refs.addFormRef.resetFields();
            },
            addUser() { //添加用户信息
                this.$refs.addFormRef.validate(async valid => {

                    if (!valid) return //不符合验证条件直接返回，没有任何操作                      
                    const { //符合验证条件之后发起添加用户的网络请求
                        data: res
                    } = await this.$axios.post('users', this.addForm)
                    if (res.meta.status !== 201) return this.$message.error('数据添加失败')
                    this.$message.success('数据添加成功')
                        //隐藏对话框
                    this.dialogVisible = false
                        //重新获取数据
                    this.getUserList()
                })

            },
            async showEditDialog(id) { //显示编辑对话框
                const {
                    data: res
                } = await this.$axios.get('users/' + id)
                if (res.meta.status !== 200) return this.$message.error('请求数据失败')
                this.eidtForm = res.data
                console.log(this.eidtForm)
                this.eidtDialogVisible = true
            },
            eidtDialogClosed() { //重置编辑对话框表单
                this.$refs.eidtFormRef.resetFields()
            },
            eidtUserInfo() { //编辑提交用户信息是的规则语预验证

                this.$refs.eidtFormRef.validate(async valid => {
                    if (!valid) return
                        //发起网络请求，修改用户信息
                    const {
                        data: res
                    } =
                    await this.$axios.put('users/' + this.eidtForm.id, {
                        email: this.eidtForm.email,
                        mobile: this.eidtForm.mobile
                    })
                    if (res.meta.status !== 200) return this.$message.error('数据保存失败')
                    this.getUserList() //重新获取数据
                    this.$message.success('数据保存成功')
                    this.eidtDialogVisible = false
                })
            },
            async removeUserById(userId) { //删除用户信息
                const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (res !== "confirm") return this.$message.error('数据删除失败')
                    //确认删除后请求数据删除
                const {
                    data: ress
                } = await this.$axios.delete('users/' + userId)
                if (ress.meta.status !== 200) return this.$message.error('数据删除失败')
                this.getUserList();
                return this.$message.success('数据删除成功')
            },
            async setRole(role) {
                this.userInfo = role
                    // console.log(this.userInfo)
                const {
                    data: res
                } =
                await this.$axios.get('roles')
                if (res.meta.status !== 200) return this.$message.error('数据获取失败')
                this.rolesList = res.data
                    // console.log(this.rolesList)
                this.setRoleDialogVisible = true
            },
            async saveRoleInfo() { //保存用户角色修改信息
                if (!this.selectedRoleId) return this.$message.error('请选择修改的角色')
                const {
                    data: res
                } = await this.$axios.put(`users/${this.userInfo.id}/role`, {
                        rid: this.selectedRoleId
                    })
                    // console.log(res)
                if (res.meta.status !== 200) return this.$message.error(res.msg)
                this.$message.success('角色修改成功')
                this.getUserList()
                this.setRoleDialogVisible = false
            },
            setRoleDialogClosed() { //关闭分配角色对话框后,重置内部数据
                this.selectedRoleId = ''
                this.userInfo = {}
            }
        }
    }
</script>
<style lang="less" scoped>
    .el-card {
        margin-top: 10px;
    }
    
    .el-pagination {
        margin-top: 15px;
    }
</style>