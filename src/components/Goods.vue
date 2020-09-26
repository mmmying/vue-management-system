<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="searchKey"
          @keyup.enter.native="queryGoodList"
        ></el-input>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" @click="addGood()">添加商品</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量(克)"
        width="180"
      ></el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.add_time | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" width="180">
        <template slot-scope="scope">
          <operation-btns
            :data="scope.row"
            @editData="editUser"
            @deleteData="deleteUser"
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
      searchKey: '',
    };
  },
  components: { OperationBtns },
  mounted() {
    this.queryGoodList();
  },
  methods: {
    queryGoodList() {
      this.$axios
        .get('goods', {
          params: {
            query: this.searchKey,
            pagenum: this.pagination.pageindex,
            pagesize: this.pagination.pagesize,
          },
        })
        .then(({ data: res }) => {
          this.tableData = res.data.goods;
          this.total = res.data.total;
        });
    },
    handleSizeChange(val) {
      this.pagination.pagesize = val;
      this.pagination.pageindex = 1;
      this.queryGoodList();
    },
    handleCurrentChange(val) {
      this.pagination.pageindex = val;
      this.queryGoodList();
    },
    addGood() {},
    editUser(row) {},
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
              this.queryGoodList();
            } else {
              this.$message.error(res.meta.msg);
            }
          })
          .catch(() => {
            this.$message.error('删除失败');
          });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>