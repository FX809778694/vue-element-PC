<template>
  <div class="shop_cart_wrap">
    <div class="shop-cart">
      <div class="car-head-op clearfix">
        <p class="car-head-total fl">全部商品（{{Total}}）</p>
        <p class="car-head-select shop-total fl clearfix">
        <i>已选商品（{{shopTotal}}件）</i>
        <span>¥{{priceTotal}}</span>
        </p>
        <div class="operate-car-btn fl" style="margin-left: 20px;margin-right: 0;margin-top: 6px">
          <el-button v-if="primaryAccount" @click="submitOrder" type="primary" size="mini"  round>提交订单</el-button>
          <el-button v-else-if="isOrder" type="primary" @click="submitOrder" size="mini"  round>提交给主账号</el-button>
          <div v-else></div>
        </div>
      </div>
      <div class="operate-content clearfix">
        <div class="tab-switch-operate fl clearfix">
          <a
            class="tab-switch-btn fl"
            @click="pictureActive()"
          >
            <div :class="tabPictureSign ? 'tab-switch-picture-active' : 'tab-switch-picture'">
            </div>
          </a>
          <a
            class="tab-switch-btn fl"
            @click="listActive()"
          >
            <div :class="tabListSign ? 'tab-switch-list-active' : 'tab-switch-list'">
            </div>
          </a>
        </div>
        <div class="fl">
          <div class="car-head-option fl" v-if="account">
            查看商品：
            <el-select v-model.trim="valueAccount" @change="changeAccount" size="min" placeholder="请选择">
              <el-option
                v-for="(item, index) in accountOptions"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="car-head-option fl">
            频道：
            <el-select v-model.trim="valueChannel" @change="changeAccount" size="min" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="fr">
          <div class="operate-car-btn">
            <el-button type="primary" @click="showModal" size="mini"  round>批量修改数量</el-button>
          </div>
          <div class="operate-car-btn">
            <el-button type="primary" size="mini" :disabled="clickSignAll" @click="exportAllShop()" round>导出全部商品</el-button>
          </div>
          <div class="operate-car-btn">
            <el-button type="primary" size="mini" :disabled="clickSignSelect" @click="exportShop()" round>导出选中的商品</el-button>
          </div>
          <div class="operate-car-btn">
            <el-button type="primary" size="mini" @click="handleBatchDelete"  round>删除</el-button>
          </div>
        </div>

      </div>
      <!-- 列表展示 -->
      <div v-if="tabListSign">
        <div class="null-data" v-if="tableData.length===0">暂无数据</div>
        <div v-else>
          <el-table
            ref="multipleTable"
            key="listTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            @select="tableSingleChange"
            @select-all="handleAllChange"
            max-height="740"
          >
            <el-table-column
              type="selection"
              width="50"
            >
            </el-table-column>
            <el-table-column
              fixed
              prop="ChannelCode"
              label="频道ID"
              width="70">
            </el-table-column>
            <el-table-column
              fixed
              prop="ChannelName"
              label="频道名称"
              width="90">
            </el-table-column>
            <el-table-column
              fixed
              prop="BookName"
              label="书名"
              width="150">
            </el-table-column>
            <el-table-column
              prop="Isbn"
              label="ISBN"
              width="180">
            </el-table-column>
            <el-table-column
              prop="Price"
              label="定价"
              width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.Price ? scope.row.Price.toFixed(2) : '暂无' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="num"
              label="订数"
              width="260">
              <template slot-scope="scope">
                <div class="tab-num" v-if="scope.row.ChannelCode === '5' ">
                  <div class="tab-num-l">
                    教用：
                    <el-input-number
                      v-model.trim="scope.row.JyCount"
                      :min="1"
                      size="mini"
                      @change="handleChange(scope.row)"
                      label="描述文字">
                    </el-input-number>
                  </div>
                  <div class="tab-num-r">
                    学用：
                    <el-input-number
                      v-model.trim="scope.row.XyCount"
                      :min="1"
                      size="mini"
                      @change="handleChange(scope.row)"
                      label="描述文字">
                    </el-input-number>
                  </div>
                </div>
                <div class="tab-num" v-else>
                  <div class="tab-num-l">
                    数量：
                    <el-input-number
                      v-model.trim="scope.row.Count"
                      :min="1"
                      size="mini"
                      @change="handleChange(scope.row)"
                      label="描述文字">
                    </el-input-number>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="UserName"
              label="操作员"
              width="100">
              <template slot-scope="scope">
                {{ scope.row.UserName ? scope.row.UserName : '无' }}
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="70"
            >
              <template slot-scope="scope">
                <div
                  class="tab-delete"
                  size="mini"
                  type="danger"
                  @click="handleSingleDelete(scope.$index, scope.row)">删除</div>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              prop="Remark"
              label="备注"
              width="160px">
              <template slot-scope="scope">
                <div class="shop-cart-remark">
                  <el-tooltip :disabled="!scope.row.Remark" class="item" effect="light" placement="top">
                    <div slot="content">{{scope.row.Remark}}</div>
                    <el-input
                      v-model.trim="scope.row.Remark"
                      size="mini"
                      maxlength="350"
                      placeholder="请输入备注"
                      @change="remarkChange(scope.row)"
                      clearable>
                    </el-input>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 图文展示 -->
      <div v-if="tabPictureSign">
        <div class="null-data" v-if="tableData.length===0">暂无数据</div>
        <div v-else>
          <el-table
            ref="multipleTable"
            key="pictureTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            @select-all="handleAllChange"
            @select="tableSingleChange"
          >
            <el-table-column
              type="selection"
              width="50">
            </el-table-column>
            <el-table-column
              prop=""
              label="商品信息"
              width="284">
              <template slot-scope="scope">
                <div class="tab-shop-block clearfix">
                  <div class="tab-shop-img fl">
                    <img src="../assets/book.png" />
                  </div>
                  <div class="tab-shop-title fl">
                    <h3>{{scope.row.BookName}}</h3>
                    <p>型号/规格：{{scope.row.spec}}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="ChannelName"
              label="频道名称"
              width="90">
            </el-table-column>
            <el-table-column
              prop="Price"
              label="定价"
              width="90">
              <template slot-scope="scope">
                <div class="tab-price-graphic">{{ scope.row.Price ? scope.row.Price.toFixed(2) : '暂无' }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="num"
              label="定数"
              width="260">
              <template slot-scope="scope">
                <div class="tab-num" v-if="scope.row.ChannelCode === '5'">
                  <div class="tab-num-l">
                    教用：
                    <el-input-number
                      v-model.trim="scope.row.JyCount"
                      :min="1"
                      size="mini"
                      @change="handleChange(scope.row)"
                      label="描述文字">
                    </el-input-number>
                  </div>
                  <div class="tab-num-r">
                    学用：
                    <el-input-number
                      v-model.trim="scope.row.XyCount"
                      :min="1"
                      size="mini"
                      @change="handleChange(scope.row)"
                      label="描述文字">
                    </el-input-number>
                  </div>
                </div>
                <div class="tab-num" v-else>
                  <div class="tab-num-l">
                    数量：
                    <el-input-number
                      v-model.trim="scope.row.Count"
                      :min="1"
                      size="mini"
                      @change="handleChange(scope.row)"
                      label="描述文字">
                    </el-input-number>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="UserName"
              label="操作员"
              width="100">
            </el-table-column>
            <el-table-column
              prop="require"
              label="订货要求"
              width="100">
            </el-table-column>
            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <div
                  class="tab-delete tab-delete-graphic"
                  size="mini"
                  type="danger"
                  @click="handleSingleDelete(scope.$index, scope.row)">删除</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              width="160px">
              <template slot-scope="scope">
                <div class="shop-cart-remark">
                  <el-tooltip :disabled="!scope.row.Remark" class="item" effect="light" placement="top">
                    <div slot="content">{{scope.row.Remark}}</div>
                    <el-input
                      placeholder="请输入备注"
                      v-model.trim="scope.row.Remark"
                      maxlength="350"
                      @change="remarkChange(scope.row)"
                      clearable>
                    </el-input>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="operate-content clearfix">
        <div class="check-btn fl">
          <el-checkbox :value="allSelect" @change="handleSelectionAllChange(tableData)">全选</el-checkbox>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" @click="showModal" size="mini"  round>批量修改数量</el-button>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" :disabled="clickSignAll" @click="exportAllShop()" round>导出全部商品</el-button>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" :disabled="clickSignSelect" @click="exportShop()" round>导出选中的商品</el-button>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" @click="handleBatchDelete" size="mini"  round>删除</el-button>
        </div>
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
    </div>
    <NumModalOne
      ref="modalOne"
      @signChange="handleBatchChange"
      @confirmModal="batchModalConfirm"
    ></NumModalOne>
    <NumModalTwo
      ref="modalTwo"
      @signChange="handleBatchChange"
      @confirmModal="batchModalConfirm"
    ></NumModalTwo>
    <BatchNumModal
      ref="modalThree"
      @signChange="handleBatchChange"
      @confirmModal="batchModalConfirm"
    ></BatchNumModal>
  </div>

</template>

<script>
import { mapState, mapMutations } from "vuex";
import { globelFnHanle } from "@/common/js/mixin.js";
import {
  fetchShopCarData,
  deleteShopCart,
  submitOrderData,
  fetchAccountDrop,
  editShopCartData,
  fetchIndexImg,
  exportCarAllShopApi,
  exportShopCarApi,
  editShopBatchCartData
} from "../api";
import { splitData, getItem, add, mul, sub, div } from "../common/js/util";
import BatchNumModal from "@/components/BatchNumModal";
import NumModalOne from "@/components/NumModalOne";
import NumModalTwo from "@/components/NumModalTwo";

export default {
  name: "ShopCart",
  data() {
    return {
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "最新图书"
        },
        {
          value: "2",
          label: "畅销图书"
        },
        {
          value: "3",
          label: "主题活动"
        },
        {
          value: "4",
          label: "重点产品"
        },
        {
          value: "5",
          label: "大中专教材"
        }
      ],
      accountOptions: [],
      valueAccount: "",
      valueChannel: "",
      tableData: [],
      multipleSelection: [], //当前页选中
      multipleSelectionAll: [], //所有选中的包括跨页数据
      keySign: "Guid", // 标识列表数据中每一行的唯一键的名称(需要根据数据改一下)
      primaryAccount: false, // 子主账号判断
      isOrder: false, //是否能提交订单
      //切换显示
      tabPictureSign: false,
      tabListSign: true,
      PageIndex: 1,
      PageNum: 15,
      Total: 0,
      isIndeterminate: false,
      checkAll: false,
      modalSign: "", // 1的时候代表只有普通的 2代表只有大中专的 3代表全都有
      account: false
    };
  },
  mixins: [globelFnHanle],
  watch: {
    tableData(val, oldVal) {
      console.log(111);
      this.changePageRecordData(oldVal);
      setTimeout(item => {
        this.setSelectRow();
      }, 20);
    }
  },
  components: {
    BatchNumModal,
    NumModalOne,
    NumModalTwo
  },
  mounted() {},
  created() {
    const account = getItem("account");
    this.account = account;
    const { UserType } = getItem("BigUser");
    if (UserType === "2") {
      this.primaryAccount = true;
    }
    const { IsOrder } = getItem("BigUser");
    if (IsOrder == "0") {
      this.isOrder = false;
    } else {
      this.isOrder = true;
    }
    const { PageIndex, PageNum } = this;
    // 获取子账号下拉数据
    let data = {
      PageIndex: PageIndex,
      PageNum: PageNum
    };
    fetchAccountDrop(data)
      .then(this.globelReqHandle)
      .then(res => {
        // console.log(res);
        res.Data.map(item => {
          this.accountOptions.push(item);
        });
      })
      .catch(this.globelErrHandle);

    let params = {
      PageIndex: PageIndex,
      PageNum: PageNum,
      Channel: "",
      UserId: ""
    };
    this.initTableData(params);
    // 获取活动下拉信息
    fetchIndexImg()
      .then(this.globelReqHandle)
      .then(res => {
        // console.log('主题活动', res)
        let data = res.Data;
        let channelArray = [];
        data.map(item => {
          item.Data.map(val => {
            channelArray.push({
              value: val.Activity.ChannelCode,
              label: val.Activity.ChannelName
            });
          });
        });
        channelArray.map(item => {
          this.options.push(item);
        });
        // console.log(this.options)
      })
      .catch(this.globelErrHandle);
  },
  computed: {
    ...mapState([
      "loading",
      "showNav",
      "Search",
      "clickSignAll",
      "clickSignSelect"
    ]),
    allSelect: function() {
      return this.multipleSelection.length === this.tableData.length;
    },
    shopTotal: function() {
      return this.multipleSelectionAll.length;
    },
    priceTotal: function() {
      let price = 0;
      if (this.multipleSelectionAll.length === 0) {
        price = 0;
      } else {
        this.multipleSelectionAll.map((item, index) => {
          let priceNew = 0;
          if (item.ChannelCode === "5") {
            priceNew = mul(item.Price, item.XyCount);
          } else {
            priceNew = mul(item.Price, item.Count);
          }
          price = add(price, priceNew);
        });
      }
      return Math.round(price * 100) / 100;
    }
  },
  methods: {
    ...mapMutations([
      "setLoading",
      "setShowNav",
      "updateSearch",
      "updateClickSignAll",
      "updateClickSignSelect"
    ]),
    initTableData(params) {
      fetchShopCarData(params)
        .then(this.globelReqHandle)
        .then(res => {
          console.log(res);
          this.tableData = res.Data;
          this.Total = res.Total;
        })
        .catch(this.globelErrHandle);
    },
    // 使用子账号 筛选
    changeAccount(val) {
      console.log(val);
      const { PageIndex, PageNum, valueChannel, valueAccount } = this;
      let params = {
        PageIndex: PageIndex,
        PageNum: PageNum,
        Channel: valueChannel,
        UserId: valueAccount
      };
      fetchShopCarData(params)
        .then(this.globelReqHandle)
        .then(res => {
          console.log(res);
          this.tableData = res.Data;
          this.Total = res.Total;
          setTimeout(item => {
            this.multipleSelectionAll = [];
          }, 20);
        })
        .catch(this.globelErrHandle);
    },
    // 提交订单
    submitOrder() {
      this.changePageRecordData(this.tableData);
      if (this.multipleSelectionAll.length <= 0) {
        const message = `请选择数据`;
        this.$message.error(message);
        return;
      }
      if (this.valueChannel) {
      }
      const data = this.multipleSelectionAll;
      const id = splitData(data, "Guid");
      let params = {
        GoodsId: id
      };
      submitOrderData(params)
        .then(res => {
          if (res.Success) {
            const { UserId } = getItem("BigUser");
            let params = {
              PageIndex: 1,
              PageNum: 15,
              Channel: "",
              UserId: UserId
            };

            this.initTableData(params);

            const message = `恭喜你，提交成功`;
            this.$message({
              message: message,
              type: "success"
            });
          } else {
            const message = res.ErrorMsg;
            this.$message.error(message);
          }
        })
        .catch(this.globelErrHandle);
    },
    // 删除操作
    handleSingleDelete(index, row) {
      let params = {
        Id: row.Guid
      };

      deleteShopCart(params)
        .then(res => {
          console.log(res);
          if (res.Success) {
            const message = `恭喜你，删除成功`;
            this.$message({
              message: message,
              type: "success"
            });
            setTimeout(item => {
              this.$router.go(0);
            }, 100);
            // 删除成功重新获取数据
            const { UserId } = getItem("BigUser");
            let params = {
              PageIndex: 1,
              PageNum: 15,
              Channel: "",
              UserId: UserId
            };
            this.initTableData(params);
          } else {
            const message = `出错啦！`;
            this.$message.error(message);
          }
        })
        .catch(this.globelErrHandle);
    },
    handleBatchDelete() {
      this.changePageRecordData(this.tableData);
      if (this.multipleSelectionAll.length <= 0) {
        this.$message({
          message: "您还未选择操作数据！",
          type: "warning"
        });
        return;
      }
      const data = this.multipleSelectionAll;
      const id = splitData(data, "Guid");

      let params = {
        Id: id
      };
      console.log(params);
      deleteShopCart(params)
        .then(res => {
          if (res.Success) {
            const message = `恭喜你，删除成功`;
            this.$message({
              message: message,
              type: "success"
            });
            setTimeout(item => {
              this.$router.go(0);
            }, 100);
            // 删除成功重新获取数据
            const { UserId } = getItem("BigUser");
            let params = {
              PageIndex: 1,
              PageNum: 15,
              Channel: "",
              UserId: UserId
            };
            this.initTableData(params);
          } else {
            const message = `出错啦！`;
            this.$message.error(message);
          }
        })
        .catch(this.globelErrHandle);
    },
    handleSelectionChange(val) {
      // console.log(val);
      this.multipleSelection = val;
    },
    //全选的事件
    handleAllChange() {
      this.changePageRecordData(this.tableData);
    },
    // 单条数据点击时触发
    tableSingleChange(selection, row) {
      this.singleChange(selection, row);
    },
    /* 底部全选操作 */
    handleSelectionAllChange(tableData) {
      const isChecked = !this.allSelect;
      if (tableData) {
        tableData.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, isChecked);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
      this.changePageRecordData(this.tableData);
    },
    // 修改购物车数量
    handleChange(value) {
      console.log(value);
      const { JyCount, XyCount, Count, Remark, Guid } = value;
      let params = {
        JyCount: JyCount,
        XyCount: XyCount,
        Count: Count,
        Remark: Remark,
        Guid: Guid
      };
      console.log(params);
      editShopCartData(params)
        .then(res => {
          console.log(res);
        })
        .catch(this.globelErrHandle);
      // 改了数量自动选中
      // this.$refs.multipleTable.toggleRowSelection(value, true);
    },
    // 修改购物车单条备注
    remarkChange(value) {
      console.log(value);
      if(value.Remark.length >= 350) {
        this.$message({
          message: "请注意！只允许输入200个字符",
          type: "warning"
        });
      }
      const { JyCount, XyCount, Count, Remark, Guid } = value;
      let params = {
        JyCount: JyCount,
        XyCount: XyCount,
        Count: Count,
        Remark: Remark,
        Guid: Guid
      };
      console.log(params);
      editShopCartData(params)
        .then(res => {
          console.log(res);
        })
        .catch(this.globelErrHandle);
      // 改了数量自动选中
      // this.$refs.multipleTable.toggleRowSelection(value, true);
    },
    // 批量修改
    handleBatchChange(value) {
      console.log(value);
    },
    // 批量修改 确认模态框按钮
    batchModalConfirm(value) {
      console.log(value);
      let idArray = [];
      this.multipleSelectionAll.map(item => {
        idArray.push(item.Guid);
      });
      let params = {
        JyCount: value.batchNumJy,
        XyCount: value.batchNumXy,
        Count: value.batchNum,
        Guid: idArray.join(",")
      };

      editShopBatchCartData(params)
        .then(this.globelReqHandle)
        .then(res => {
          console.log(res);
          if (res.Success) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            const { PageIndex, PageNum } = this;
            let params = {
              PageIndex: PageIndex,
              PageNum: PageNum,
              Channel: "",
              UserId: getItem("BigUser")
            };
            this.initTableData(params);
          }
        })
        .catch(this.globelErrHandle);
    },
    showModal() {
      this.changePageRecordData(this.tableData);
      if (this.multipleSelectionAll.length <= 0) {
        this.$message({
          message: "您还未选择操作数据！",
          type: "warning"
        });
      } else {
        let keyProduct = this.multipleSelectionAll.filter(
          item => item.ChannelCode === "5"
        );
        let general = this.multipleSelectionAll.filter(
          item =>
            item.ChannelCode === "1" ||
            item.ChannelCode === "2" ||
            item.ChannelCode === "3" ||
            item.ChannelCode === "4" ||
            item.ChannelCode === "6"
        );
        // console.log(keyProduct, general)
        // debugger
        if (keyProduct.length > 0 && general.length <= 0) {
          this.modalSign = "2";
        } else if (keyProduct.length <= 0 && general.length > 0) {
          this.modalSign = "1";
        } else {
          this.modalSign = "3";
        }
        if (this.modalSign === "1") {
          this.$refs.modalOne.dialogVisible = true;
        } else if (this.modalSign === "2") {
          this.$refs.modalTwo.dialogVisible = true;
        } else {
          this.$refs.modalThree.dialogVisible = true;
        }
      }
    },
    //切换
    pictureActive() {
      if (
        !this.checkAll &&
        this.multipleSelection.length === this.tableData.length
      ) {
        this.checkAll = true;
      }

      this.tabPictureSign = true;
      this.tabListSign = false;
      this.changePageRecordData(this.tableData);
      setTimeout(() => {
        this.setSelectRow();
      }, 20);
    },
    listActive() {
      this.tabListSign = true;
      this.tabPictureSign = false;

      this.changePageRecordData(this.tableData);
      setTimeout(() => {
        this.setSelectRow();
      }, 20);
    },
    //抽出逻辑图文item
    handleCheckAllChange(val) {
      console.log(val);
      this.multipleSelection = val ? this.tableData : [];
      this.isIndeterminate = false;
    },
    handleCheckedItemChange(value) {
      console.log(value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.tableData.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.tableData.length;
    },
    handleCurrentChange(val) {
      let UserId = this.valueAccount;
      let Channel = this.valueChannel;
      let params = {
        PageIndex: val,
        PageNum: 15,
        Channel: Channel,
        UserId: UserId
      };
      this.initTableData(params);
      window.scroll(0, 0);
      this.$refs.multipleTable.$refs.bodyWrapper.scrollTop = 0;
    },
    //设置选中方法
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      // debugger
      //标识当前行的唯一键名称
      let idKey = this.keySign;
      let selectAllIds = [];
      let that = this;
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      //遍历选中
      this.$refs.multipleTable.clearSelection();
      for (let i = 0; i < selectAllIds.length; i++) {
        for (let j = 0; j < this.tableData.length; j++) {
          if (selectAllIds[i].indexOf(this.tableData[j][idKey]) >= 0) {
            this.$refs.multipleTable.toggleRowSelection(
              this.tableData[j],
              true
            );
          }
        }
      }
    },
    // 记忆选择核心方法
    changePageRecordData(oldVal) {
      // debugger
      // 标识当前行的唯一键的名称
      let idKey = this.keySign;
      let that = this;
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection;
        return;
      }
      // 总选择里面的key集合
      let selectAllIds = [];
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      let selectIds = [];
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        }
      });
      let noSelectIds = [];
      // 得到当前页没有选中的id
      oldVal.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      });
    },
    singleChange(selection, row) {
      console.log(selection, row);
      // 标识当前行的唯一键的名称
      let idKey = this.keySign;

      // 总选择里面的key集合
      let selectAllIds = [];
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });

      let selectAllIdsString = selectAllIds.toString();

      if (selectAllIdsString.includes(row.Guid)) {
        console.log("已经有需要拿出来");
        let index = this.multipleSelectionAll.findIndex(item => item === row);
        this.multipleSelectionAll.splice(index, 1);
      } else {
        this.multipleSelectionAll.push(row);
        console.log("没有需要放进去");
      }
    },
    exportShop() {
      let paramsData = [];
      this.changePageRecordData(this.tableData);
      if (!this.multipleSelectionAll.length > 0) {
        this.$message({
          message: "请选择数据",
          type: "error"
        });
        return;
      }

      if (this.clickSignSelect) {
        this.$message({
          message: "请勿频繁操作",
          type: "warning"
        });
      }
      this.updateClickSignSelect(true);

      this.multipleSelectionAll.map((item, index) => {
        paramsData.push(item.Guid);
      });
      let params = {
        Data: {
          Guid: paramsData.join(",")
        }
      };
      console.log(params);
      exportShopCarApi(params)
        .then(this.globelReqHandle)
        .then(res => {
          console.log(res);
          const url = res.Data.Url;
          console.log(url);
          window.open(url);
          this.updateClickSignSelect(false);
        })
        .catch(this.globelErrHandle);
    },
    exportAllShop() {
      if (this.clickSignAll) {
        this.$message({
          message: "请勿频繁操作",
          type: "warning"
        });
      }
      this.updateClickSignAll(true);
      let params = {
        Data: {
          Channel: this.valueChannel,
          UserId: this.valueAccount
        }
      };
      exportCarAllShopApi(params)
        .then(this.globelReqHandle)
        .then(res => {
          console.log(res);
          if (res.Success) {
            const url = res.Data.Url;
            console.log(url);
            window.open(url);
            this.updateClickSignAll(false);
          }
        })
        .catch(this.globelErrHandle);
    }
  }
};
</script>

<style lang="scss">
</style>
