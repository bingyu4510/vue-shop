<template>
  <div>
        <!-- 面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
          <!-- 卡片头部提示区域 -->
          <el-alert title="添加商品信息" type="info" center show-icon :closable='false'> </el-alert>
          <!-- 步骤条区域 align-center：居中显示-->
          <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
          <!-- tab栏区域  v-model:绑定值，选中选项卡的 name  所有el-tab-pane面板中的数据才是一个完整的form表单数据
          但是el-tab-pane只能作为el-tabs的子节点，所以不能将form表单包裹在el-tab-pane的外层，而是放在el-tabs的外面，将其包裹-->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position='top'>
            <el-tabs :tab-position="'left'"  v-model='activeIndex' :before-leave='beforeTabLeave' @tab-click='tabClicked'>
              <el-tab-pane label="基本信息" name='0'>
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                  <el-input v-model="addForm.goods_price" type='number'></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                  <el-input v-model="addForm.goods_weight" type='number'></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                  <el-input v-model="addForm.goods_number" type='number'></el-input>
                </el-form-item>
                <el-form-item>
                  <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品参数" name='1'>
                <el-form-item :label='item.attr_name' v-for='item in manyTableData' :key='item.attr_id'>
                  <!-- 复选框区域 -->
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox :label="value" v-for='(value,index) in item.attr_vals' border :key="index"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品属性" name='2'>
                <el-form-item :label='item.attr_name' v-for='item in onlyTableData' :key="item.attr_id">
                  <el-input v-model='item.attr_vals'></el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品图片" name='3'>
                <el-upload
                      action='http://119.23.53.78:8888/api/private/v1/upload'
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      list-type="picture" :headers='headersObj' :on-success='handleSuccess'>
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
              </el-tab-pane>
              <el-tab-pane label="商品内容" name='4'>
                <quill-editor :content="addForm.goods_introduce"/>
                <el-button type='primary' class="btn" @click='add'>添加商品</el-button>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-card>

        <!-- 图片预览对话框  此处有报错，待完善-->
        <el-dialog title="图片预览" :visible.sync="previewVisible"  width="50%">
            <img :src='previewPath' alt="">
        </el-dialog>
  </div>
</template>
<script>
    export default {
        name: 'Add',
        data() {
            return {
                //处于险种状态的step标签，从0开始
                activeIndex: '0',
                //表单数据对象
                addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    goods_cat: [],
                    //图片的临时地址，每个索引值都是一个对象
                    pics: [],
                    goods_introduce: '',
                    //记录静态参数与动态属性,每个索引值都是一个对象
                    attrs: [],
                },
                //表单数据规则对象
                addFormRules: {
                    goods_name: [{
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'blur'
                    }],
                    goods_price: [{
                        required: true,
                        message: '请输入商品价格',
                        trigger: 'blur'
                    }],
                    goods_weight: [{
                        required: true,
                        message: '请输入商品重量',
                        trigger: 'blur'
                    }],
                    goods_number: [{
                        required: true,
                        message: '请输入商品数量',
                        trigger: 'blur'
                    }],
                    goods_cat: [{
                        required: true,
                        message: '请选择',
                        trigger: 'blur'
                    }],

                },
                //商品分类列表
                cateList: [],
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'

                },
                //动态参数数据
                manyTableData: [],
                //静态属性数据
                onlyTableData: [],
                //图片上传请求头
                headersObj: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                //预览图片的地址信息
                previewPath: '',
                //预览图片对话框显示与隐藏
                previewVisible: false,


            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            //获取商品分类数据
            async getCateList() {
                const {
                    data: res
                } = await this.$axios.get('categories')
                if (res.meta.status !== 200) return this.$message.error('分类数据获取失败')
                this.cateList = res.data
                    // console.log(this.cateList)

            },
            //选中的多级列表数据,级联选择器变化时触发
            handleChange() {
                // console.log(this.addForm.goods_cat)
            },
            //tabs发生切换触发，事件返回false阻止切换,两个参数，切换后与切换前的el-tab-pane中那么属性
            beforeTabLeave(activename, oldactivename) {
                //没有选择商品分类时阻止跳转
                if (this.addForm.goods_cat.length !== 3) {
                    this.$message.error('请选择分类商品')
                    return false
                }
            },
            //点击选中某个tab实例时触发
            async tabClicked() {
                if (this.activeIndex === '1') {
                    const {
                        data: res
                    } = await this.$axios.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {
                        params: {
                            sel: 'many'
                        }
                    })
                    if (res.meta.status !== 200) return this.$message.error('获取动态参数列表失败')
                    res.data.forEach(ele => {
                        ele.attr_vals = ele.attr_vals === '' ? [] : ele.attr_vals.split(',')
                    });
                    this.manyTableData = res.data
                    console.log(this.manyTableData)
                } else if (this.activeIndex === '2') {
                    const {
                        data: res
                    } = await this.$axios.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {
                        params: {
                            sel: 'only'
                        }
                    })
                    if (res.meta.status !== 200) return this.$message.error('获取静态属性列表失败')
                    this.onlyTableData = res.data
                        // console.log(res.data)
                    console.log(this.onlyTableData)
                }
            },
            //图片预览触发 参数为图片信息
            handlePreview(res) {
                // console.log(res)
                this.previewPath = res.response.data.url
                console.log(this.previewPath)
                this.previewVisible = true
            },
            //移除图片触发
            handleRemove(res) {
                // console.log(res)
                const result = res.response.data.tmp_path;
                // console.log(this.addForm.pics)
                this.addForm.pics.forEach((item, index) => {
                    if (item.pic === result) {
                        this.addForm.pics.splice(index, 1)
                            // console.log(this.addForm.pics)
                    }
                })
            },
            //图片上传成功的回调函数，第一个参数是服务器返回的数据对象，有数据的临时存储地址
            handleSuccess(res) {
                // console.log(res)
                const picInfo = {
                    pic: res.data.tmp_path
                }
                this.addForm.pics.push(picInfo)
                    // console.log(this.addForm.pics)
            },
            //添加商品点击事件
            add() {
                this.$refs.addFormRef.validate(async valid => {
                    if (valid) {
                        //使用深拷贝的方式拷贝datafrom数据，使修改参数时不影响data中的原数据
                        var cloneFrom = this.deepcLone(this.addForm)
                            //使用逗号分隔后重新赋值
                        cloneFrom.goods_cat = cloneFrom.goods_cat.join(',')
                            // console.log(cloneFrom.goods_cat)
                        this.onlyTableData.forEach(item => {
                            const newInfo = {
                                attr_id: item.attr_id,
                                attr_value: item.attr_vals
                            }
                            this.addForm.attrs.push(newInfo)
                        })
                        this.manyTableData.forEach(item => {
                            const newInfo = {
                                attr_id: item.attr_id,
                                attr_value: item.attr_vals.join(' ')
                            }
                            this.addForm.attrs.push(newInfo)
                        })
                        cloneFrom.attrs = this.addForm.attrs
                        console.log(cloneFrom)
                        const {
                            data: res
                        } = await this.$axios.post('goods', cloneFrom)
                        if (res.meta.status !== 201) return this.$message.error('添加商品失败')
                        this.$message.success('添加商品成功')
                        this.$router.push('/goods')
                    } else {
                        this.$message.error('请填写必要的信息项')
                    }
                })
            },
            //深拷贝函数
            deepcLone(father) {
                return JSON.parse(JSON.stringify(father))
            }

        },
    }
</script>
<style>
    .el-steps {
        margin: 15px;
    }
    
    .el-checkbox {
        margin: 0 5px 0 0!important;
    }
    
    .btn {
        margin-top: 10px;
    }
</style>