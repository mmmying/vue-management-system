<template>
  <div>
    <el-button type="primary" icon="el-icon-edit" circle size="small" @click="editData(data)"></el-button>
    <el-button type="danger" icon="el-icon-delete" circle size="small" @click="deleteData(data)"></el-button>
    <el-button type="warning" icon="el-icon-setting" circle size="small" @click="setOther(data)"></el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    data: Object,
  },
  mounted() {},
  methods: {
    editData(data) {
      this.$emit('editData', data);
    },
    deleteData(data) {
      this.$emit('deleteData', data);
    },
    setOther(data) {
      this.$emit('setOther', data);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

