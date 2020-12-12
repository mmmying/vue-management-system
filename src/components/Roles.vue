<template>
  <div>
    <el-row>
      <el-col>
        <el-button type="primary" @click="addRole">添加角色</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="220"
      ></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column prop="operation" label="操作" width="180">
        <template slot-scope="scope">
          <operation-btns
            optType="extra"
            :data="scope.row"
            @editData="editRole"
            @deleteData="deleteRole"
            @setOther="setAuth"
          ></operation-btns>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="operation === 'add' ? '添加角色' : '编辑角色'"
      :visible.sync="addAndEditDialogVisible"
      center
      @close="addAndEditDialogClose"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="角色名称" prop="roleName" label-width="100px">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAndEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配权限" :visible.sync="setAuthDialogVisible" center>
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        default-expand-all
        node-key="id"
        highlight-current
        :props="treeProps"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setAuthDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmToSetAuth">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OperationBtns from './common/OperationBtns.vue';
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      addAndEditDialogVisible: false,
      setAuthDialogVisible: false,
      form: {
        roleName: '',
        roleDesc: '',
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'change' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'change' },
        ],
      },
      operation: '',
      treeData: [],
      treeProps: {
        label: 'authName',
      },
      defaultChecked: [],
      checkedArr: [],
      rowData: {},
    };
  },
  components: { OperationBtns },
  mounted() {
    this.queryRoleList();
    this.queryRightList();
  },
  methods: {
    queryRoleList() {
      this.$axios.get('roles').then(({ data: res }) => {
        this.tableData = res.data;
        this.total = res.data.length;

        this.tableData.forEach((item) => {
          if (!item.children.length) {
            item.checked = [];
            return;
          }
          this.recursion(item.children);
          item.checked = this.checkedArr;
          this.checkedArr = [];
        });
      });
    },
    addRole() {
      this.operation = 'add';
      this.addAndEditDialogVisible = true;
    },
    editRole(row) {
      this.form = {
        roleName: row.roleName,
        roleDesc: row.roleDesc,
      };
      this.operation = 'edit';
      this.addAndEditDialogVisible = true;
    },
    deleteRole(row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios
          .delete(`roles/${row.id}`)
          .then(({ data: res }) => {
            if (res.meta.status === 200) {
              this.$message.success('删除成功');
              this.queryRoleList();
            } else {
              this.$message.error(res.meta.msg);
            }
          })
          .catch(() => {
            this.$message.error('删除失败');
          });
      });
    },
    setAuth(val) {
      this.setAuthDialogVisible = true;
      this.defaultChecked = val.checked;
      this.rowData = val;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.defaultChecked);
      });
    },
    confirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.operation === 'add') {
            this.$axios
              .post('roles', this.form)
              .then(({ data: res }) => {
                if (res.meta.status === 201) {
                  this.addAndEditDialogVisible = false;
                  this.$message.success('创建成功');
                  this.queryRoleList();
                } else {
                  this.$message.error(res.meta.msg);
                }
              })
              .catch(() => {
                this.$message.error('创建失败');
              });
          } else {
            this.$axios
              .put(`roles/${this.form.id}`, this.form)
              .then(({ data: res }) => {
                if (res.meta.status === 200) {
                  this.addAndEditDialogVisible = false;
                  this.$message.success('更新成功');
                  this.queryRoleList();
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
    addAndEditDialogClose() {
      this.$refs.form.resetFields();
    },
    queryRightList() {
      this.$axios.get('rights/tree', {}).then(({ data: res }) => {
        this.treeData = res.data;
      });
    },
    recursion(arr) {
      arr.forEach((item) => {
        if (item.children) {
          this.recursion(item.children);
        } else {
          this.checkedArr.push(item.id);
        }
      });
    },
    confirmToSetAuth() {
      const checkdKeys = this.$refs.tree.getCheckedKeys();
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      this.$axios
        .post(`roles/${this.rowData.id}/rights`, {
          rids: [...checkdKeys, ...halfCheckedKeys].join(','),
        })
        .then(({ data: res }) => {
          if (res.meta.status === 200) {
            this.setAuthDialogVisible = false;
            this.$message.success('设置权限成功');
            this.queryRoleList();
          } else {
            this.$message.error(res.meta.msg);
          }
        })
        .catch(() => {
          this.$message.error('设置权限失败');
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

