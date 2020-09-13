<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form ref="form" :model="form" class="form" :rules="rules">
        <el-form-item label prop="username">
          <el-input v-model="form.username" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label prop="password">
            <el-input
              v-model="form.password"
              prefix-icon="el-icon-lock"
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
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
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
        ],
        password: [
          { required: true, message: '请选择密码', trigger: 'change' },
        ],
      },
    }
  },
  methods: {
    login() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$axios
            .post('login', this.form)
            .then(({ data: res }) => {
              if (res.meta.status === 200) {
                this.$message({
                  message: '登陆成功',
                  type: 'success',
                })
                window.sessionStorage.setItem('token', res.data.token)
                window.sessionStorage.setItem('username', this.form.username)
                this.$router.push('/home')
              } else {
                this.$message.error(res.meta.msg)
              }
            })
            .catch((e) => {})
        }
      })
    },
    reset() {
      this.$refs.form.resetFields()
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.login-container {
  background: #2c4c6c;
  height: 100%;
  .login-box {
    background: #fff;
    width: 450px;
    height: 300px;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avatar-box {
      width: 100px;
      height: 100px;
      border: solid 1px #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #eee;
      }
    }
    .form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
    .btn-box {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
}
</style>
