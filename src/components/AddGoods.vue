<template>
  <div class="add-goods">
    <el-steps :active="active" finish-status="success">
      <el-step title="基本信息" @click="toStep"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-form v-model="addForm" :rules="rules">
      <el-form-item label="商品名称" prop="goods_name" label-width="100px">
        <el-input v-model="addForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price" label-width="100px">
        <el-input v-model="addForm.goods_price"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight" label-width="100px">
        <el-input v-model="addForm.goods_weight"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_num" label-width="100px">
        <el-input v-model="addForm.goods_num"></el-input>
      </el-form-item>
      <el-form-item
        label="商品分类"
        prop="goods_category"
        label-width="100px"
        class="cate-form-item"
      >
        <el-cascader
          v-model="addForm.goods_cate"
          :options="categoryList"
          :props="categoryProps"
          @change="selectedChange"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <div class="bottom-btn-wrap">
      <el-button v-if="active > 0" type="primary" @click="toPreviousStep">
        {{ previousStepBtn }}
      </el-button>
      <el-button @click="returnList">返回</el-button>
      <el-button type="primary" @click="toNextStep">
        {{ nextStepBtn }}
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      previousStepBtn: '上一步',
      nextStepBtn: '下一步',
      categoryList: [],
      categoryProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      addForm: {},
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'change' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'change' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'change' },
        ],
        goods_num: [
          { required: true, message: '请输入商品数量', trigger: 'change' },
        ],
        goods_catefory: [
          { required: true, message: '请选择商品分类', trigger: 'change' },
        ],
      },
    };
  },
  components: {},
  mounted() {
    this.queryCategoryList();
  },
  methods: {
    toNextStep() {
      if (this.active++ > 5) this.active = 0;
      if (this.active === 4) {
        this.nextStepBtn = '保存';
      } else {
        this.nextStepBtn = '下一步';
      }
    },
    toPreviousStep() {
      if (this.active-- < 0) {
        this.active = 0;
      }
    },
    returnList() {
      this.$confirm('当前页面操作将会丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$router.push('/goods');
      });
    },
    queryCategoryList() {
      this.$axios.get('categories').then(({ data: res }) => {
        this.categoryList = res.data;
      });
    },
    selectedChange() {},
    toStep() {
      console.log('===');
    },
  },
};
</script>
<style lang="scss" scoped>
.add-goods {
  margin: 0 50px;
}
.cate-form-item {
  position: relative;
}
</style>