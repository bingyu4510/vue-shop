<template>
  <div class="global-container">
   <div class="login-box">
     <!-- 登陆图标 -->
    <div class="avatar-box">
      <img src="../assets/img/logo.png" alt="">
    </div>
    <!-- 表单项 -->
    <el-form  label-width="0px" class="login_from" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input prefix-icon="el-icon-user-solid" v-model='loginForm.username'></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input prefix-icon="el-icon-s-data" v-model='loginForm.password' type='password'></el-input>
      </el-form-item>
      <!-- 登陆按钮 -->
      <el-form-item class="btns">
        <el-button type="primary" round @click='login'>登陆</el-button>
        <el-button type="info" round @click='resetLoginForm'>重置</el-button>
      </el-form-item>
    </el-form>
   </div>
  </div>
</template>
<script>
    export default {
        name: 'Login',
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                loginFormRules: { //设定验证信息规则项
                    username: [{
                        required: true,
                        message: '请输入登陆名称',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请输入活动名称',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 15,
                        message: '长度在 3 到 15 个字符',
                        trigger: 'blur'
                    }]
                }
            }
        },
        methods: {
            resetLoginForm() { //重置登陆信息
                this.$refs.loginFormRef.resetFields()
                this.password = ''
                this.username = ''
            },
            login() {
                this.$refs.loginFormRef.validate(async valid => { //validate中的第一个参数是表单是否通过验证的布尔值 
                    // console.log(valid)
                    const {
                        data: res
                    } = await this.$axios.post('login', this.loginForm);
                    // console.log(res);
                    if (res.meta.status === 200) {
                        // console.log('登陆成功')
                        // console.log(res)
                        this.$message.success('登陆成功') //element ui组件的一部分，信息提示弹框
                        window.sessionStorage.setItem('token', res.data.token);
                        this.$router.push("/home") //跳转路由，这里会验证token，所以需要先在上面保存token，再跳转
                    } else {
                        // console.log('请检查登陆信息后重新登陆')
                        this.$message.error('请检查登陆信息后重新登陆');

                    }
                })
            }

        },
    }
</script>
<style scoped lang="less">
    .global-container {
        width: 100%;
        height: 100%;
        background-color: #2b4b6b;
    }
    
    .login-box {
        width: 450px;
        height: 300px;
        background: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 5px;
        .avatar-box {
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            height: 130px;
            width: 130px;
            border-radius: 50%;
            border: 1px soild #eee;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0 0 10px #ddd;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }
    
    .login_from {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    
    .btns {
        display: flex;
        justify-content: flex-end;
    }
</style>