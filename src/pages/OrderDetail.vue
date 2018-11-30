<template>
  <section class="my-order">
    <div class="order-title clearfix">
      <h3 class="fl">订单明细</h3>
      <div @click="exportOrder()" class="fr export-order">导出</div>
    </div>
    <div class="order-list">
      <el-table
        :data="orderDetailData"
        border
      >
        <el-table-column
          prop="ChannelName"
          label="频道名称"
        >
        </el-table-column>
        <el-table-column
          prop="BookName"
          label="书名"
        >
        </el-table-column>
        <el-table-column
          prop="Isbn"
          label="ISBN"
        >
        </el-table-column>
        <el-table-column
          prop="Publisher"
          label="出版社"
        >
        </el-table-column>
        <el-table-column
          prop="Price"
          label="价格"
        >
        </el-table-column>
        <el-table-column
          prop="Dgsl"
          label="订购数量"
        >
        </el-table-column>
        <el-table-column
          prop="Dgmy"
          label="订购码洋"
        >
        </el-table-column>
        <el-table-column
          prop="OrderState"
          label="订单状态"
        >
        </el-table-column>
        <el-table-column
          prop="Remark"
          label="备注"
        >
        </el-table-column>
      </el-table>
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
    </div>
  </section>
</template>

<script>

  import { globelFnHanle } from "@/common/js/mixin.js";
  import { fetchAccountDataList, exportOrderApi } from "../api";

  export default {
    name: "OrderDetail",
    data() {
      return {
        orderDetailData: [],
        Total: 0,
        PageIndex: 1,
        PageNum: 15
      }
    },
    mixins: [globelFnHanle],
    created() {
      const { PageIndex, PageNum } = this;
      console.log(this.$route)
      const {id} = this.$route.params
      let params = {
        PageIndex: PageIndex,
        PageNum: PageNum,
        OrderId: id
      };
      this.initTableData(params);
    },
    methods: {
      initTableData(params) {
        fetchAccountDataList(params)
          .then(this.globelReqHandle)
          .then(res => {
            console.log(res);
            this.orderDetailData = res.Data;
            this.Total = res.Total;
          })
          .catch(this.globelErrHandle);
      },
      handleCurrentChange(val) {
        const {PageNum} = this
        let params ={
          PageIndex: val,
          PageNum: PageNum,
        }
        this.initTableData(params);
        window.scroll(0, 0);
      },
      exportOrder() {
        const {id} = this.$route.params
        let params = {
          Data: {
            OrderId: id
          }
        };
        console.log(params);
        exportOrderApi(params)
          .then(this.globelReqHandle)
          .then(res => {
            console.log(res);
            if (res.Success) {
              const url = res.Data.Url;
              console.log(url);
              window.open(url);
            }
          })
          .catch(this.globelErrHandle);
      }
    }
  }
</script>

<style lang="scss">
  @import "../common/css/_var";

  .my-order {
    min-height: 650px;
  }
  .search-bar,
  .order-list,
  .order-title {
    width: 1200px;
    margin: 10px auto 0;
  }
  .order-title {
    line-height: 46px;
    font-size: $font-16;
    color: $theme_color;
    border-bottom: 1px solid $border_E6;
  }
  .export-order{
    text-decoration: none;
    margin-right: 20px;
    cursor: pointer;
  }
</style>
