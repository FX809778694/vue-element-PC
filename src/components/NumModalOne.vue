<template>
  <section class="batch-num-modal">
    <el-dialog
      title="批量修改数量"
      :visible.sync="dialogVisible"
      :close-on-click-modal = "markSign"
      width="30%"
    >
      <div class="batch-modal">
        <div class="batch-modal-item">
          <span>数量：</span>
          <el-input-number v-model.trim="batchNum" size="mini" @change="change" :min="1" label="请输入数量"></el-input-number>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancelModal">取 消</el-button>
          <el-button type="primary" @click="confirmModal">确 定</el-button>
        </span>
    </el-dialog>
  </section>
</template>

<script>
  export default {
    name: "NumModalOne",
    data() {
      return {
        batchNum: '',
        batchNumJy: '',
        batchNumXy: '',
        markSign: false,
        dialogVisible: false
      }
    },
    props: [],
    mounted() {

    },
    methods: {
      // 批量修改
      change(value) {
        this.$emit("signChange", value);
      },
      cancelModal () {
        this.dialogVisible = false
      },
      confirmModal() {
        this.dialogVisible = false
        const { batchNum, batchNumJy, batchNumXy } = this
        let value = {
          batchNum: batchNum,
          batchNumJy: batchNumJy,
          batchNumXy: batchNumXy,
        }
        this.$emit("confirmModal", value);
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../common/css/_var.scss";
  /* 批量修改模态框内容 */
  .batch-modal{
    padding: 6px 30px;
    &-item{
      line-height: 20px;
      margin-top: 20px;
      & span{
        display: inline-block;
        width: 26%;
        text-align: right;
        margin-right: 40px;
      }
    }
  }
</style>
