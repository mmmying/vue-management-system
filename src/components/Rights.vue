<template>
  <div>
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180"
      ></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="权限等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag v-else-if="scope.row.level === '1'" type="success"
            >二级</el-tag
          >
          <el-tag v-else-if="scope.row.level === '2'" type="warning"
            >三级</el-tag
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.queryRightList();
  },
  methods: {
    queryRightList() {
      this.$axios.get('rights/list', {}).then(({ data: res }) => {
        this.tableData = res.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>