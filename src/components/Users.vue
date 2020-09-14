<template>
  <div>
    <el-row :gutter="20" class="header-wrap">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="searchKey"
          @keyup.enter.native="queryUserList"
        ></el-input>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
      <el-table-column prop="mg_state" label="状态" width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="changeStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="small"
            @click="editUser(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="small"
            @click="deleteUser(scope.row)"
          ></el-button>
          <el-button
            type="warning"
            icon="el-icon-setting"
            circle
            size="small"
            @click="setRole(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.pageindex"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="pagination.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" center @close="addDialogClosed">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" label-width="100px">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      pagination: {
        pagesize: 5,
        pageindex: 1,
      },
      total: 0,
      searchKey: '',
      dialogFormVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'change' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
        ],
      },
    }
  },
  mounted() {
    this.queryUserList()
  },
  methods: {
    queryUserList() {
      this.$axios
        .get('users', {
          params: {
            query: this.searchKey,
            pagenum: this.pagination.pageindex,
            pagesize: this.pagination.pagesize,
          },
        })
        .then(({ data: res }) => {
          this.tableData = res.data.users
          this.total = res.data.total
        })
    },
    handleSizeChange(val) {
      this.pagination.pagesize = val
      this.pagination.pageindex = 1
      this.queryUserList()
    },
    handleCurrentChange(val) {
      this.pagination.pageindex = val
      this.queryUserList()
    },
    changeStatus(row) {
      console.log(row)
      this.$axios
        .put(`users/${row.id}/state/${row.mg_state}`)
        .then(({ data: res }) => {
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg)
          } else {
            this.$message.error(res.meta.msg)
          }
        })
        .catch((e) => {
          this.$message.error('设置状态失败')
        })
    },
    addUser() {
      this.$axios
        .post('users', this.form)
        .then(({ data: res }) => {
          console.log(res)
          if (res.meta.status === 201) {
            this.dialogFormVisible = false
            this.$message.success(res.meta.msg)
            this.queryUserList()
          } else {
            this.$message.error(res.meta.msg)
          }
        })
        .catch(() => {
          this.$message.error('创建失败')
        })
    },
    addDialogClosed() {
      this.$refs.form.resetFields()
    },
    editUser() {},
    deleteUser(row) {
      this.$axios
        .delete(`users/${row.id}`)
        .then(({ data: res }) => {
          if (res.meta.status === 200) {
            this.$message.success(res.meta.msg)
            if (
              (this.pagination.pageindex - 1) * this.pagination.pagesize + 1 ===
              this.total
            ) {
              this.pagination.pageindex -= 1
            }
            this.queryUserList()
          } else {
            this.$message.error(res.meta.msg)
          }
        })
        .catch(() => {
          this.$message.error('删除失败')
        })
    },
    setRole() {},
  },
}
</script>
<style lang="scss" scoped>
.header-wrap {
  margin-bottom: 10px;
}
</style>