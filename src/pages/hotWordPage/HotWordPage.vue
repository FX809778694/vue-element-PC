<template>
  <section class="search_detail clearfix">
    <div class="search_detail-content">
      <!-- 价格 -->
      <list-display
        ref="tableComponent"
        :tableData="tableData"
        @priceClick="filterPrice"
        @exportClick="exportAllShop"
      ></list-display>
    </div>
    <!-- 分页器 -->
    <div class="pagination-block" v-if="Total > 15">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="PageIndex"
        :page-size="PageNum"
        background
        layout="prev, pager, next"
        :total="Total">
      </el-pagination>
    </div>
  </section>
</template>

<script>
  import { mapState, mapMutations } from "vuex";
  import { globelFnHanle } from "@/common/js/mixin.js";
  import ListDisplay from "@/pages/hotWordPage/List_display";
  import { getHotWordListApi } from "../../api/index";
  export default {
    name: "HotWordPage",
    data() {
      return {
        tableData: [],
        Total: 0,
        PageIndex: 1,
        PageNum: 15,
        onOff: true
      };
    },
    mixins: [globelFnHanle],
    components: {
      ListDisplay
    },
    created() {

      this.initTableData(1)

    },
    methods: {
      initTableData(val) {
        const { PageNum } = this;
        const hotWord = this.$route.params.searchText
        const params = {
          Data:{
            PageIndex: val,
            PageNum,
            Word: hotWord
          }
        };
        getHotWordListApi(params)
          .then(this.globelReqHandle)
          .then(res => {
            console.log(res)
            this.tableData = res.Data
          })
          .catch(this.globelErrHandle)
      },
      handleCurrentChange(val) {
        this.initTableData(val)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../common/css/var";

  .search_detail {
  &-content {
     width: 1200px;
     margin: 0 auto;
    margin-top: 20px;
  & a {
      text-decoration: none;
    }
  }
  }
</style>
