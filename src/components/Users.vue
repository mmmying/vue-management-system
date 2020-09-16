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
        <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
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
            @click="openEditDialog(scope.row)"
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
            @click="openSetDialog(scope.row)"
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

    <!-- 添加用户弹框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" center @close="addDialogClosed">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" label-width="100px">
          <el-input type="password" v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile" label-width="100px">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户弹框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" center>
      <el-form :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="editForm.username" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile" label-width="100px">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 设置用户角色弹框 -->
    <el-dialog
      title="设置用户角色"
      :visible.sync="setDialogVisible"
      center
      width="30%"
      @close="setDialogClosed"
    >
      <el-form>
        <el-form-item label="当前用户" label-width="100px">{{userInfo.username}}</el-form-item>
        <el-form-item label="当前角色" label-width="100px">{{userInfo.role}}</el-form-item>
        <el-form-item label="设置新角色" label-width="100px">
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const checkEmail = (rule, value, callback) => {
      const regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      if (!regx.test(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    const checkMobile = (rule, value, callback) => {
      const regx = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (!regx.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }

    return {
      tableData: [],
      pagination: {
        pagesize: 5,
        pageindex: 1,
      },
      total: 0,
      searchKey: '',
      addDialogVisible: false,
      addForm: {
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
        email: [
          { required: true, message: '请输入邮箱', trigger: 'change' },
          { validator: checkEmail, trigger: 'change' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { validator: checkMobile, trigger: 'change' },
        ],
      },
      editDialogVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: '',
      },
      setDialogVisible: false,
      userInfo: {
        id: '',
        username: '',
        role: '',
      },
      rolesList: [],
      selectedRoleId: '',
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
      this.$axios
        .put(`users/${row.id}/state/${row.mg_state}`)
        .then(({ data: res }) => {
          if (res.meta.status === 200) {
            this.$message.success('设置状态成功')
          } else {
            this.$message.error(res.meta.msg)
          }
        })
        .catch((e) => {
          this.$message.error('设置状态失败')
        })
    },
    addUser() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.$axios
            .post('users', this.addForm)
            .then(({ data: res }) => {
              if (res.meta.status === 201) {
                this.addDialogVisible = false
                this.$message.success('创建成功')
                this.queryUserList()
              } else {
                this.$message.error(res.meta.msg)
              }
            })
            .catch(() => {
              this.$message.error('创建失败')
            })
        }
      })
    },
    addDialogClosed() {
      this.$refs.addForm.resetFields()
    },
    openEditDialog(row) {
      this.editDialogVisible = true
      this.editForm = {
        id: row.id,
        username: row.username,
        email: row.email,
        mobile: row.mobile,
      }
    },
    editUser() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.$axios
            .put(`users/${this.editForm.id}`, this.editForm)
            .then(({ data: res }) => {
              if (res.meta.status === 200) {
                this.editDialogVisible = false
                this.$message.success('更新成功')
                this.queryUserList()
              } else {
                this.$message.error(re.meta.msg)
              }
            })
            .catch(() => {
              this.$message.error('更新失败')
            })
        }
      })
    },
    deleteUser(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios
          .delete(`users/${row.id}`)
          .then(({ data: res }) => {
            if (res.meta.status === 200) {
              this.$message.success('删除成功')
              if (
                (this.pagination.pageindex - 1) * this.pagination.pagesize +
                  1 ===
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
      })
    },
    openSetDialog(row) {
      this.setDialogVisible = true
      this.userInfo = {
        id: row.id,
        username: row.username,
        role: row.role_name,
      }
      this.queryRoleList()
    },
    queryRoleList() {
      this.$axios('roles').then(({ data: res }) => {
        this.rolesList = res.data
      })
    },
    setRole() {
      this.$axios
        .put(`users/${this.userInfo.id}/role`, {
          rid: this.selectedRoleId,
        })
        .then(({ data: res }) => {
          if (res.meta.status === 200) {
            this.setDialogVisible = false
            this.$message.success('设置角色成功')
            this.queryUserList()
          } else {
            this.$message.error(res.meta.msg)
          }
        })
    },
    setDialogClosed() {
      this.selectedRoleId = ''
    },
  },
}
</script>
<style lang="scss" scoped>
.header-wrap {
  margin-bottom: 10px;
}
</style>