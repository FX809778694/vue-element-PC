<template>
  <section class="my-order">
    <div class="order-title">
      <h3>全部订单</h3>
    </div>
    <div class="search-bar">
      <div class="search-date fl">
        订购日期：
          <el-date-picker
            v-model.trim="orderSDate"
            type="datetimerange"
            value-format="yyyy-MM-dd:HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
      </div>
      <div class="search-no search-input fl">
        订单号：
        <el-input @change="inputOrder()" v-model.trim="orderNo" placeholder="请输入订单号"></el-input>
      </div>
      <div class="search-button fl">
        <div class="operate-car-btn">
          <el-button type="primary" @click="searchOrder" size="mini"  round>搜索</el-button>
        </div>
      </div>
    </div>
    <div class="order-list">
    	<el-table
    		:data="tableData"
    		border
      >
        <el-table-column
          prop="OrderId"
          label="订单号"
        >
        </el-table-column>
        <el-table-column
          prop="Count"
          label="订购数量"
        >
        </el-table-column>
        <el-table-column
          prop="TypeCount"
          label="订购品种"
        >
        </el-table-column>
        <el-table-column
          prop="TotalPrice"
          label="订购码洋"
        >
        </el-table-column>
        <el-table-column
          prop="OrderDate"
          label="订购日期"
        >
        </el-table-column>
        <el-table-column
          prop="orderState"
          label="导出"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="exportOrder(scope)" size="small">导出</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderState"
          v-if="account"
          label="撤回"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="revokeOrder(scope)" size="small">撤回</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderState"
          label="订单明细"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="enterOrderDetail(scope)" size="small">订单明细</el-button>
          </template>
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
import { mapState, mapMutations } from "vuex";
import { globelFnHanle } from "@/common/js/mixin.js";
import { fetchAccountList, exportOrderApi, revokeOrderApi } from "../api";
import { getItem, adjustTime } from "../common/js/util";

export default {
  name: "MyOrder",
  data() {
    return {
      tableData: [],
      orderNo: "",
      orderSDate: "",
      Total: 0,
      PageIndex: 1,
      PageNum: 15,
      account: false,
    };
  },
  mixins: [globelFnHanle],
  mounted() {},
  created() {
    this.account = getItem("account");
    const { PageIndex, PageNum } = this;
    let params1 = {
      PageIndex: PageIndex,
      PageNum: PageNum
    };
    let params2 = {
      PageIndex: PageIndex,
      PageNum: PageNum
    };
    this.initTableData(params1, params2);
  },
  methods: {
    ...mapMutations(["setLoading", "setShowNav", "updateSearch"]),
    initTableData(params1, params2) {
      fetchAccountList(params1, params2)
        .then(this.globelReqHandle)
        .then(res => {
          console.log(res);
          this.tableData = res.Data;
          this.Total = res.Total;
        })
        .catch(this.globelErrHandle);
    },
    searchOrder() {
      if (this.orderSDate === null) {
        this.orderSDate = "";
      }
      const { PageIndex, PageNum, orderNo, orderSDate } = this;

      if (orderNo === "" && orderSDate === "") {
        this.$message({
          message: "请输入时间或者订单号！",
          type: "warning"
        });
        return;
      }
      let time = {};
      if (orderSDate.length > 0) {
        time = adjustTime(orderSDate[0], orderSDate[1]);
      }

      let params1 = {
        PageIndex: PageIndex,
        PageNum: PageNum,
        OrderId: orderNo,
        StartTime: time.timeStart21 === undefined ? "" : time.timeStart21,
        EndTime: time.timeEnd22 === undefined ? "" : time.timeEnd22
      };

      let params2 = {
        PageIndex: PageIndex,
        PageNum: PageNum,
        OrderId: orderNo,
        StartTime: time.timeStart11 === undefined ? "" : time.timeStart11,
        EndTime: time.timeEnd12 === undefined ? "" : time.timeEnd12
      };
      console.log(params1, params2);
      this.initTableData(params1, params2);
    },
    handleCurrentChange(val) {
      const { PageNum, orderNo, orderSDate } = this;

      let time = {};
      if (orderSDate.length > 0) {
        time = adjustTime(orderSDate[0], orderSDate[1]);
      }

      let params1 = {
        PageIndex: val,
        PageNum: PageNum,
        OrderId: orderNo,
        StartTime: time.timeStart21,
        EndTime: time.timeEnd22
      };

      let params2 = {
        PageIndex: val,
        PageNum: PageNum,
        OrderId: orderNo,
        StartTime: time.timeStart11,
        EndTime: time.timeEnd12
      };
      console.log(params1, params2);

      this.initTableData(params1, params2);
      window.scroll(0, 0);
    },
    inputOrder() {
      if (/[\u4E00-\u9FA5]/g.test(this.orderNo)) {
        this.orderNo = "";
        this.$message({
          message: "订单号不能输入汉字哦！",
          type: "warning"
        });
      }
    },
    exportOrder(val) {
      console.log(val);
      let params = {
        Data: {
          OrderId: val.row.OrderId
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
    },
    enterOrderDetail(scope) {
      console.log(scope)
      this.$router.push({
        name: 'OrderDetail',
        params: {
          id: scope.row.OrderId
        }
      })
      window.scroll(0, 0)
    },
    revokeOrder(scope) {
      let params = {
        Data: {
          OrderId: scope.row.OrderId
        }
      }
      revokeOrderApi(params)
        .then(this.globelReqHandle)
        .then(res=> {
          console.log(res)
          if(res.Success) {
            this.$message({
              message: "撤回成功",
              type: "success"
            });
            setTimeout(item => {
              this.$router.go(0);
            }, 400);
          }
        })
        .catch(this.globelErrHandle)
    }
  }
};
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
.search-bar {
  box-sizing: border-box;
  border: 1px solid $border_E6;
  height: 40px;
  line-height: 40px;
  font-size: $font-14;
  overflow: hidden;
}
.car-head-option .el-input__inner {
  border-radius: 0;
}
.search-isbn,
.search-no {
  margin-left: 20px;
}
.search-input {
  .el-input__inner {
    width: 134px;
    height: 24px;
    line-height: 24px;
    border-radius: 0;
  }
  .el-input {
    width: auto;
  }
}
.search-date {
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
  .el-input__inner {
    position: relative;
    height: 24px;
    line-height: 24px;
    border-radius: 0;
  }
  .el-input__icon {
    height: 100%;
    line-height: 100% !important;
  }
  .el-range-separator {
    height: 100%;
    line-height: 100%;
  }
}
.search-button {
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
  margin-top: -3px;
  .operate-car-btn {
    width: 50px;
    text-align: center;
    height: 24px;
    box-sizing: border-box;
    margin-top: 0;
    line-height: normal;
    border-radius: 2px;
  }
  .el-button--default {
    height: 24px;
    line-height: 24px;
    padding: 0 !important;
    border: 0;
    background: $theme_color;
    color: #fff;
  }
}
</style>
