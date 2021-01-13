<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
   <!-- 卡片内容主题区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button type="primary">添加角色</el-button>   
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
      <!-- 第一行为展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for='(item,index) in scope.row.children' class="expand vcenter" :key='item.id'>
              <el-col :span="5">
                <el-tag  closable @close='removeRightById(scope.row,item.id)'>{{item.authName}}</el-tag>
                <!-- 添加箭头图标 -->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级 -->
                  <el-row v-for='item2 in item.children' :key='item2.id' class="expand2 vcenter">
                    <el-col :span="6" >
                      <el-tag type='warning'  closable @close='removeRightById(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级 -->
                    <el-col :span="13">
                      <el-tag v-for='item3 in item2.children' closable @close='removeRightById(scope.row,item3.id)' type='danger'>{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
              </el-col>
            </el-row>
          </template>
</el-table-column>
<el-table-column type="index" label='#'></el-table-column>
<el-table-column prop="roleName" label='角色名称'></el-table-column>
<el-table-column prop="roleDesc" label='角色描述'></el-table-column>
<el-table-column label='操作'>
    <template slot-scope="scope">
      <el-button type="primary" icon="el-icon-edit" size="mini" >编辑</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click='deleteDate'>删除</el-button>
      <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
    </template>
</el-table-column>
</el-table>
</el-card>
<!-- 分配权限对话框 -->
<el-dialog title="提示" :visible.sync="setRightDialogVisible" width="50%">
    <!-- show-checkbox:添加复选框 default-expand-all:展开所有节点 node-key:唯一标识string类型 -->
    <el-tree :data="rightsList" :props="defaultProps" show-checkbox default-expand-all node-key='id'></el-tree>
    <span slot="footer" class="dialog-footer">
<el-button @click="setRightDialogVisible = false">取 消</el-button>
<el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
</span>
</el-dialog>

<!-- //后添加的一段小功能片段 -->

</div>
</template>
<script>
    export default {
        name: 'Roles',
        data() {
            return {
                rolesList: [],
                setRightDialogVisible: false,
                rightsList: [],
                defaultProps: {
                    children: 'children',
                    label: 'authName',
                    defkeys: [],
                },
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            async getRolesList() { // 初始化获取数据
                const {
                    data: res
                } =
                await this.$axios.get('roles')
                if (res.meta.status !== 200) return this.$message.error('数据请求失败')
                this.rolesList = res.data
                    // console.log(this.rolesList)
            },
            async removeRightById(scope, rightId) { //删除权限
                const res = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (res == 'confirm') {
                    const {
                        data: result
                    } =
                    await this.$axios.delete(`roles/${scope.id}/rights/${rightId}`)
                    if (result.meta.status !== 200) return this.$message.error('数据删除失败')
                        //为删除操作后整个数据重新赋值
                    scope.children = result.data
                    this.$message.success('已删除')

                } else {
                    return this.$message.error('取消删除')
                }
            },
            /*  async showSetRightDialog(role) {
                 const {
                     data: res
                 } =
                 await this.$axios.get('rights/tree')
                 if (res.meta.status !== 200) return this.$message.error('数据删除失败')
                 this.rightsList = res.data
                 console.log(role)
                     // console.log(this.rightsList)
                 this.getLeafkeys(role, this.defkeys)
                     //设置弹框可见
                 this.setRightDialogVisible = true
             } */
            async showSetRightDialog(role) {
                // this.roleId = role.id
                // 获取角色的所有权限
                const {
                    data: res
                } = await this.$axios.get('rights/tree')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取权限数据失败！')
                }
                //   获取权限树
                this.rightsList = res.data
                    //   console.log(res)
                    //   递归获取三级节点的id
                this.getLeafkeys(role, this.defaultProps.defkeys)

                this.setRightDialogVisible = true
            },
            getLeafkeys(node, arr) {
                // 没有children属性，则是三级节点
                if (!node.children) {
                    return arr.push(node.id)
                }
                node.children.forEach(item => this.getLeafkeys(item, arr))
            },
            deleteDate() {
                this.$alert('本操作无效', '警告', {
                    confirmButtonText: '确定',
                });
            }
        },
    }
</script>
<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }
    
    .expand {
        border-bottom: 1px solid rgb(161, 161, 163);
    }
    
    .expand:nth-child(1) {
        border-top: 1px solid rgb(161, 161, 163);
    }
    
    .expand2 {
        border-top: 1px solid rgb(161, 161, 163);
    }
    
    .expand2:nth-child(1) {
        border-top: 0;
    }
    
    .vcenter {
        display: flex;
        align-items: center;
    }
</style>