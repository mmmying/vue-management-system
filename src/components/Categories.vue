<template>
  <div>
    <el-row>
      <el-col>
        <el-button type="primary" @click="addCategory">添加分类</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%"
      row-key="cat_id"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column
        type="index"
        label="分类id"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="cat_name"
        label="分类名称"
        width="220"
      ></el-table-column>
      <!-- <el-table-column prop="effective" label="是否有效"></el-table-column> -->
      <el-table-column prop="cat_level" label="层级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else-if="scope.row.cat_level === 2" type="warning"
            >三级</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" width="180">
        <template slot-scope="scope">
          <operation-btns
            :data="scope.row"
            @editData="editCategory"
            @deleteData="deleteCategory"
          ></operation-btns>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.pageindex"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pagination.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog
      :title="operation === 'add' ? '添加分类' : '编辑分类'"
      :visible.sync="addAndEditDialogVisible"
      center
      @close="addAndEditDialogClosed"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="分类名称" prop="cat_name" label-width="100px">
          <el-input v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item
          v-if="operation === 'add'"
          label="父级分类"
          prop="parent"
          label-width="100px"
        >
          <el-cascader
            v-model="form.parent"
            :options="parentList"
            :props="cascaderProps"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAndEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
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
      pagination: {
        pagesize: 10,
        pageindex: 1,
      },
      total: 0,
      addAndEditDialogVisible: false,
      form: {
        cat_id: '',
        cat_name: '',
        parent: [],
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'change' },
        ],
      },
      operation: '',
      selectedVal: [],
      parentList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true,
      },
    };
  },
  components: { OperationBtns },
  mounted() {
    this.queryCategoryList();
  },
  methods: {
    queryCategoryList() {
      this.$axios
        .get('categories', {
          params: {
            pagenum: this.pagination.pageindex,
            pagesize: this.pagination.pagesize,
          },
        })
        .then(({ data: res }) => {
          this.tableData = res.data.result;
          this.total = res.data.total;
        });
    },
    queryAllCategoryList() {
      this.$axios
        .get('categories', {
          params: {
            type: 2,
          },
        })
        .then(({ data: res }) => {
          this.parentList = res.data;
        });
    },
    addCategory() {
      this.operation = 'add';
      this.addAndEditDialogVisible = true;
      this.queryAllCategoryList();
    },
    editCategory(row) {
      console.log('edit', row);
      this.form.cat_id = row.cat_id;
      this.form.cat_name = row.cat_name;
      this.operation = 'edit';
      this.addAndEditDialogVisible = true;
    },
    deleteCategory(row) {
      this.$confirm('此操作将永久删除该分类与其子分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios
          .delete(`categories/${row.cat_id}`)
          .then(({ data: res }) => {
            if (res.meta.status === 200) {
              this.$message.success('删除成功');
              this.pagination.pageindex = 1;
              this.queryCategoryList();
            } else {
              this.$message.error(res.meta.msg);
            }
          })
          .catch(() => {
            this.$message.error('删除失败');
          });
      });
    },
    confirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.operation === 'add') {
            this.$axios
              .post('categories', {
                cat_pid: this.form.parent[this.form.parent.length - 1] || 0,
                cat_name: this.form.cat_name,
                cat_level: this.form.parent.length,
              })
              .then(({ data: res }) => {
                if (res.meta.status === 201) {
                  this.addAndEditDialogVisible = false;
                  this.$message.success('创建成功');
                  this.queryCategoryList();
                } else {
                  this.$message.error(res.meta.msg);
                }
              })
              .catch(() => {
                this.$message.error('创建失败');
              });
          } else {
            this.$axios
              .put(`categories/${this.form.cat_id}`, {
                cat_name: this.form.cat_name,
              })
              .then(({ data: res }) => {
                if (res.meta.status === 200) {
                  this.addAndEditDialogVisible = false;
                  this.$message.success('更新成功');
                  this.queryCategoryList();
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
    handleSizeChange(val) {
      this.pagination.pagesize = val;
      this.pagination.pageindex = 1;
      this.queryCategoryList();
    },
    handleCurrentChange(val) {
      this.pagination.pageindex = val;
      this.queryCategoryList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

