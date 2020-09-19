<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="searchKey"
          @keyup.enter.native="queryUserList"
        ></el-input>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" @click="addUser()">添加用户</el-button>
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
          <operation-btns
            :data="scope.row"
            @editData="editUser"
            @deleteData="deleteUser"
            @setOther="setUserRole"
          ></operation-btns>
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

    <!-- 添加/编辑用户弹框 -->
    <el-dialog
      :title="operation==='add'?'添加用户':'编辑用户'"
      :visible.sync="addAndEditDialogVisible"
      center
      @close="addAndEditDialogClosed"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input v-model="form.username" :disabled="operation==='edit'" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="operation==='add'" label="密码" prop="password" label-width="100px">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAndEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 设置用户角色弹框 -->
    <el-dialog
      title="设置用户角色"
      :visible.sync="settingDialogVisible"
      center
      width="30%"
      @close="settingDialogClosed"
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
        <el-button @click="settingDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSet">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OperationBtns from './common/OperationBtns.vue';
export default {
  data() {
    const checkEmail = (rule, value, callback) => {
      const regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (!regx.test(value)) {
        callback(new Error('请输入正确的邮箱'));
      } else {
        callback();
      }
    };
    const checkMobile = (rule, value, callback) => {
      const regx = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (!regx.test(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };

    return {
      tableData: [],
      pagination: {
        pagesize: 5,
        pageindex: 1,
      },
      total: 0,
      searchKey: '',
      addAndEditDialogVisible: false,
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
        email: [
          { required: true, message: '请输入邮箱', trigger: 'change' },
          { validator: checkEmail, trigger: 'change' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { validator: checkMobile, trigger: 'change' },
        ],
      },
      settingDialogVisible: false,
      userInfo: {
        id: '',
        username: '',
        role: '',
      },
      rolesList: [],
      selectedRoleId: '',
      operation: 'add',
    };
  },
  components: { OperationBtns },
  mounted() {
    this.queryUserList();
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
          this.tableData = res.data.users;
          this.total = res.data.total;
        });
    },
    handleSizeChange(val) {
      this.pagination.pagesize = val;
      this.pagination.pageindex = 1;
      this.queryUserList();
    },
    handleCurrentChange(val) {
      this.pagination.pageindex = val;
      this.queryUserList();
    },
    changeStatus(row) {
      this.$axios
        .put(`users/${row.id}/state/${row.mg_state}`)
        .then(({ data: res }) => {
          if (res.meta.status === 200) {
            this.$message.success('设置状态成功');
          } else {
            this.$message.error(res.meta.msg);
          }
        })
        .catch((e) => {
          this.$message.error('设置状态失败');
        });
    },
    addUser() {
      this.operation = 'add';
      this.addAndEditDialogVisible = true;
    },
    editUser(row) {
      this.form = {
        id: row.id,
        username: row.username,
        email: row.email,
        mobile: row.mobile,
      };
      this.operation = 'edit';
      this.addAndEditDialogVisible = true;
    },
    confirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.operation === 'add') {
            this.$axios
              .post('users', this.form)
              .then(({ data: res }) => {
                if (res.meta.status === 201) {
                  this.addAndEditDialogVisible = false;
                  this.$message.success('创建成功');
                  this.queryUserList();
                } else {
                  this.$message.error(res.meta.msg);
                }
              })
              .catch(() => {
                this.$message.error('创建失败');
              });
          } else {
            this.$axios
              .put(`users/${this.form.id}`, this.form)
              .then(({ data: res }) => {
                if (res.meta.status === 200) {
                  this.addAndEditDialogVisible = false;
                  this.$message.success('更新成功');
                  this.queryUserList();
                } else {
                  this.$message.error(re.meta.msg);
                }
              })
              .catch(() => {
                this.$message.error('更新失败');
              });
          }
        }
      });
    },
    addAndEditDialogClosed() {
      this.$refs.form.resetFields();
    },
    deleteUser(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios
          .delete(`users/${row.id}`)
          .then(({ data: res }) => {
            if (res.meta.status === 200) {
              this.$message.success('删除成功');
              if (
                (this.pagination.pageindex - 1) * this.pagination.pagesize +
                  1 ===
                this.total
              ) {
                this.pagination.pageindex -= 1;
              }
              this.queryUserList();
            } else {
              this.$message.error(res.meta.msg);
            }
          })
          .catch(() => {
            this.$message.error('删除失败');
          });
      });
    },
    setUserRole(row) {
      this.settingDialogVisible = true;
      this.userInfo = {
        id: row.id,
        username: row.username,
        role: row.role_name,
      };
      this.queryRoleList();
    },
    queryRoleList() {
      this.$axios('roles').then(({ data: res }) => {
        this.rolesList = res.data;
      });
    },
    confirmSet() {
      this.$axios
        .put(`users/${this.userInfo.id}/role`, {
          rid: this.selectedRoleId,
        })
        .then(({ data: res }) => {
          if (res.meta.status === 200) {
            this.settingDialogVisible = false;
            this.$message.success('设置角色成功');
            this.queryUserList();
          } else {
            this.$message.error(res.meta.msg);
          }
        });
    },
    settingDialogClosed() {
      this.selectedRoleId = '';
    },
  },
};
</script>
<style lang="scss" scoped>
</style>