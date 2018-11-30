<!--
 Created by Thomas on 2018/7/12.
 图文列表组件
 -->
<template>
  <section class="list-display">
    <!-- 头部操作按钮组 -->
    <div class="operate-content clearfix">
      <div class="tab-switch-operate fl clearfix">
        <a
          class="tab-switch-btn fl"
          @click="pictureActive()"
          title="图文模式"
        >
          <div :class="tabPictureSign ? 'tab-switch-picture-active' : 'tab-switch-picture'">
          </div>
        </a>
        <a
          class="tab-switch-btn fl"
          @click="listActive()"
          title="列表模式"
        >
          <div :class="tabListSign ? 'tab-switch-list-active' : 'tab-switch-list'">
          </div>
        </a>
      </div>
      <div class="clearfix fl">
        <div class="tab-price-input-name fl">价格：</div>
        <div class="tab-price-input fl">
          <el-input v-model.trim="PriceStart" size="mini" placeholder="¥"></el-input>
        </div>
        <div class="tab-price-input-line fl" style="padding: 0 4px;">-</div>
        <div class="tab-price-input fl">
          <el-input v-model.trim="PriceEnd" size="mini" placeholder="¥"></el-input>
        </div>
        <a class="tab-price-input-btn fl" @click="filterPrice">确定</a>
      </div>
      <div class="fr">
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" @click="showModal" round>批量修改数量</el-button>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" :disabled="clickSignAll" @click="exportAllShop()" round>导出全部商品</el-button>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" :disabled="clickSignSelect" @click="exportShop()" round>导出选中的商品</el-button>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" @click="addShopCart" round>加入购物车</el-button>
        </div>
      </div>
    </div>
    <!-- 列表展示 -->
    <div v-if="tabListSign">
      <div class="null-data" v-if="tableData.length === 0">暂无数据</div>
      <div v-else>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          border
          height="700"
          style="width: 100%;margin-top: 10px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column
            fixed="left"
            label="商品ID"
            v-if="isStock"
            width="128">
            <template slot-scope="scope">{{ scope.row.Id }}</template>
          </el-table-column>
          <el-table-column
            label="是否可供"
            width="80">
            <template slot-scope="scope">可供</template>
          </el-table-column>
          <el-table-column
            fixed="left"
            prop="Isbn"
            label="ISBN"
            width="100">
          </el-table-column>
          <el-table-column
            fixed="left"
            prop="Name"
            label="书名"
            width="100">
          </el-table-column>
          <el-table-column
            fixed="left"
            prop="Price"
            label="定价"
            width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.Price ? scope.row.Price.toFixed(2) : '暂无' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="press"
            label="版别"
            width="">
          </el-table-column>
          <el-table-column
            prop="Author"
            label="作者"
            width="">
          </el-table-column>
          <el-table-column
            prop="PunlishTime"
            label="首次到货时间"
            v-if="isStock"
            width="160">
          </el-table-column>
          <el-table-column
            prop="PublishTime"
            label="出版日期"
            width="90">
          </el-table-column>
          <el-table-column
            prop="Zbkc"
            label="总部库存"
            v-if="isStock"
            width="90">
          </el-table-column>
          <el-table-column
            prop="Mdkc"
            label="门店库存"
            v-if="isStock"
            width="90">
          </el-table-column>
          <el-table-column
            fixed="right"
            prop="num"
            label="订数"
            width="116">
            <template slot-scope="scope">
              <div class="tab-num clearfix">
                <el-input-number
                  v-model.trim="scope.row.Count"
                  :min="1"
                  size="mini"
                  @change="handleChange"
                  label="描述文字">
                </el-input-number>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="详情" width="69">
            <template slot-scope="scope">
              <el-popover trigger="hover" :open-delay="1000" placement="top">
                <HoverContent
                  :filterData="scope.row"
                ></HoverContent>
                <img
                  class="tab-btn"
                  @click="enterDetail(scope.row.Id)"
                  src="../../assets/watch.svg"
                  slot="reference"
                  alt="">
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="96">
            <template slot-scope="scope">
              <img
                class="tab-btn"
                @click="addSingleShopCart(scope.row)"
                src="../../assets/shop_car.svg"
                alt="">
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
                    @change="remarkChange(scope.row.Remark)"
                    placeholder="请输入备注"
                    clearable>
                  </el-input>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 底部操作按钮组 -->
      <div class="operate-content clearfix">
        <div class="check-btn fl" v-if="allCheck">
          <el-checkbox :value="allSelect" @change="handleSelectionAllChange(tableData)">全选</el-checkbox>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" @click="showModal" round>批量修改数量</el-button>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" :disabled="clickSignAll" @click="exportAllShop()" round>导出全部商品</el-button>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" :disabled="clickSignSelect" @click="exportShop()" round>导出选中的商品</el-button>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" @click="addShopCart" round>加入购物车</el-button>
        </div>
      </div>
    </div>
    <!-- 图文展示 -->
    <div
      v-if="tabPictureSign"
    >
      <div class="null-data" v-if="tableData.length===0">暂无数据</div>
      <div v-else>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model.trim="checkList" @change="handleCheckedItemChange">
          <div class="clearfix picture-content-layout">
            <div class="picture-content fl" v-for="(item, index) in tableData" :key="item.id">
              <el-checkbox :label="item.Id" ref="check" @change="singleChange(item.Id, item.Name, item, index)">
                <span></span>
              </el-checkbox>
              <el-popover trigger="hover" :open-delay="1000" placement="top">
                <HoverContent
                  :filterData="item"
                ></HoverContent>
                <div
                  class="picture-content-img"
                  @click="enterDetail(item.Id)"
                  slot="reference"
                >
                  <img  v-lazy="item.Img ? item.Img : noBook" />
                </div>
              </el-popover>
              <h3>{{item.Name}}</h3>
              <h4>出版社名称：{{item.Id}}</h4>
              <h4>出版日期：{{item.PublishTime}}</h4>
              <h4>是否可供：可供</h4>
              <h4>作者：{{item.Author}}</h4>
              <div class="picture-content-number">
                <el-input-number size="mini" :min="1" v-model.trim="item.Count"></el-input-number>
              </div>
              <div class="picture-content-item-bottom clearfix">
                <span>{{item.price}}</span>
                <a @click="addSingleShopCart(item)">加入购物车</a>
              </div>
            </div>
          </div>
        </el-checkbox-group>
      </div>

      <!-- 底部操作按钮组 -->
      <div class="operate-content clearfix" style="margin-top: 20px">
        <div class="check-btn fl" v-if="allCheck">
          <el-checkbox :indeterminate="isIndeterminate" v-model.trim="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" @click="showModal" round>批量修改数量</el-button>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" :disabled="clickSignAll" @click="exportAllShop()" round>导出全部商品</el-button>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" :disabled="clickSignSelect" @click="exportShop()" round>导出选中的商品</el-button>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" @click="addShopCart" round>加入购物车</el-button>
        </div>
      </div>
    </div>
    <NumModalOne
      ref="modal"
      @signChange="handleBatchChange"
      @confirmModal="batchModalConfirm"
    ></NumModalOne>
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import HoverContent from "@/components/hoverContent";
import { getCheckedArr } from "@/common/js/util";
import { addShopCartApi, exportShopApi } from "../../api";
import NumModalOne from "@/components/NumModalOne";

export default {
  name: "ListDisplay",
  data() {
    return {
      multipleSelection: [],
      multipleSelectionAll: [],
      checkList: [],
      keySign: "Id",
      //切换显示
      tabPictureSign: false,
      tabListSign: true,
      isIndeterminate: false,
      checkAll: false,
      allCheck: false, //隐藏最新图书的全选
      PriceStart: "", //筛选价格低
      PriceEnd: "" //筛选价格高
    };
  },
  props: ["tableData", "selectedCondition", "box", "checkMore"],
  watch: {
    tableData(val, oldVal) {
      this.changePageRecordData(oldVal);
      if (!this.tabPictureSign) {
        setTimeout(item => {
          this.setSelectRow();
        }, 20);
      }

      // 监听图文的全选
      if (this.tabPictureSign) {
        this.checkAll = true;
        val.map(item => {
          if (!this.checkList.includes(item.Id)) {
            this.checkAll = false;
          }
        });
      }
      this.updateMultiSelection();
    }
  },
  components: {
    HoverContent,
    NumModalOne
  },
  computed: {
    ...mapState([
      "loading",
      "showNav",
      "noBook",
      "clickSignAll",
      "clickSignSelect",
      "isStock"
    ]),
    allSelect: function() {
      return this.multipleSelection.length === this.tableData.length;
    },
    checkListArray: function() {
      let arrList = [];
      this.multipleSelectionAll.map(item => {
        arrList.push(item.Id);
      });
      return arrList;
    }
  },
  methods: {
    ...mapMutations(["updateClickSignAll", "updateClickSignSelect"]),
    enterDetail(id) {
      console.log(id);
      this.$router.push({
        name: "DetailPage",
        params: {
          channel: "general",
          category: "1",
          id: id
        }
      });
      window.scrollTo(0, 0);
    },
    /* 表格多选操作监听 */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleChange(value) {
      console.log(value);
    },
    filterPrice() {
      const { PriceStart, PriceEnd } = this;
      if (PriceStart === "" && PriceEnd === "") {
        return;
      }
      console.log(111);

      let value = {
        PriceStart: PriceStart,
        PriceEnd: PriceEnd
      };
      this.$emit("priceClick", value);
    },
    /* 底部全选操作 */
    handleSelectionAllChange(rows) {
      const isChecked = !this.allSelect;
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, isChecked);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
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
      this.checkList = this.checkListArray;
    },
    listActive() {
      this.tabListSign = true;
      this.tabPictureSign = false;

      this.changePageRecordData(this.tableData);
      setTimeout(item => {
        this.setSelectRow();
      }, 20);
    },
    //抽出逻辑图文item
    handleCheckAllChange(val) {
      console.log(val);
      if (val) {
        let obj = {};
        this.multipleSelection.map(v => {
          if (obj[v.Id] === void 2333) obj[v.Id] = true;
        });
        console.log(obj);
        this.tableData.forEach((item, index) => {
          if (obj[item.Id]) return;
          this.multipleSelectionAll.push(item);
          this.checkList.push(item.Id);
        });
      } else {
        this.multipleSelection = [];
        this.tableData.forEach((item, index) => {
          this.multipleSelectionAll.forEach((a, i) => {
            if (item.Id === a.Id) {
              this.multipleSelectionAll.splice(i, 1);
            }
          });
        });
        this.tableData.forEach((item, index) => {
          this.checkList.forEach((a, j) => {
            if (item.Id === a) {
              this.checkList.splice(j, 1);
            }
          });
        });
      }
    },
    handleCheckedItemChange(value) {
      console.log(value);
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.tableData.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.tableData.length;
    },
    singleChange(Id, Name, item, index) {
      console.log(Id, Name, item, index, this.$refs.check[index].isChecked);
      // 控制当前图文的选择与否
      this.checkList.forEach((item, index) => {
        if (item.index === Id) {
          this.checkList.splice(index, 1);
        }
      });
      // 控制总记忆数组的维护更新
      if (!this.$refs.check[index].isChecked) {
        this.multipleSelection.push(item);
      } else {
        this.multipleSelectionAll.forEach((item, index) => {
          if (item.Id === Id) {
            this.multipleSelectionAll.splice(index, 1);
          }
        });
        this.multipleSelection.forEach((item, index) => {
          if (item.Id === Id) {
            this.multipleSelection.splice(index, 1);
          }
        });
      }

      // 监听图文的全选
      if (this.tabPictureSign) {
        this.checkAll = true;
        this.tableData.map(item => {
          if (!this.checkList.includes(item.Id)) {
            this.checkAll = false;
          }
        });
      }
    },
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      //标识当前行的唯一键名称
      let idKey = this.keySign;
      let selectAllIds = [];
      let that = this;
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });

      //遍历选中 ... tabPictureSign 判断是否是图文展示组件
      if (!this.tabPictureSign) {
        this.$refs.multipleTable.clearSelection();
      }

      for (let i = 0; i < selectAllIds.length; i++) {
        for (let j = 0; j < this.tableData.length; j++) {
          if (selectAllIds[i] === this.tableData[j][idKey]) {
            if (!this.tabPictureSign) {
              let selectData = this.multipleSelectionAll.filter(
                item => item[idKey] === selectAllIds[i]
              );
              this.tableData[j].Count = selectData[0].Count;
              this.$refs.multipleTable.toggleRowSelection(
                this.tableData[j],
                true
              );
            }
          }
        }
      }
    },
    updateMultiSelection() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }

      let idKey = this.keySign;
      let selectAllIds = [];
      let that = this;
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });

      if (this.tabPictureSign) {
        this.multipleSelection = [];
        for (let i = 0; i < selectAllIds.length; i++) {
          for (let j = 0; j < this.tableData.length; j++) {
            if (selectAllIds[i] === this.tableData[j][idKey]) {
              let selectData = this.multipleSelectionAll.filter(
                item => item[idKey] === selectAllIds[i]
              );
              this.tableData[j].Count = selectData[0].Count;
              this.multipleSelection.push(this.tableData[j]);
            }
          }
        }
      }
    },
    changePageRecordData(oldVal) {
      // 标识当前行的唯一键的名称
      let idKey = this.keySign;
      let that = this;
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
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        } else {
          let selectData = this.multipleSelectionAll.filter(
            item => item[idKey] === row[idKey]
          );
          selectData[0].Count = row.Count;
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
              that.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      });
    },
    handleBatchChange(value) {
      console.log(value);
    },
    // 批量修改 确认模态框按钮
    batchModalConfirm(value) {
      console.log(value);
      let dataArray = this.multipleSelection;
      dataArray.map((item, index) => {
        item.Count = value.batchNum;
      });
      console.log(dataArray);
    },
    showModal() {
      this.changePageRecordData(this.tableData);
      if (this.multipleSelectionAll.length <= 0) {
        this.$message({
          message: "您还未选择操作数据！",
          type: "warning"
        });
      } else {
        this.$refs.modal.dialogVisible = true;
      }
    },
    addShopCart() {
      let paramsData = [];
      this.changePageRecordData(this.tableData);
      if (this.multipleSelectionAll.length <= 0) {
        this.$message({
          message: "您还未选择操作数据！",
          type: "warning"
        });
        return;
      }
      this.multipleSelectionAll.map((item, index) => {
        paramsData.push({
          Count: item.Count,
          GoodsId: item.Id,
          Remark: item.Remark === undefined ? "" : item.Remark
        });
      });

      let params = {
        Data: paramsData
      };
      addShopCartApi(params)
        .then(this.globelReqHandle)
        .then(res => {
          console.log(res);
          if (res.Success) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
          }
        })
        .catch(this.globelErrHandle);
    },
    addSingleShopCart(item) {
      console.log(item);
      let params = {
        Data: [
          {
            Count: item.Count,
            GoodsId: item.Id,
            Remark: item.Remark === undefined ? "" : item.Remark
          }
        ]
      };
      addShopCartApi(params)
        .then(this.globelReqHandle)
        .then(res => {
          console.log(res);
          if (res.Success) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
          }
        })
        .catch(this.globelErrHandle);
    },
    exportShop() {
      console.log(111);
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
        paramsData.push(item.Id);
      });
      let params = {
        Data: {
          BookId: paramsData.join(",")
        }
      };
      console.log(params);
      exportShopApi(params)
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
      this.$emit("exportClick");
    },
    remarkChange(val) {
      if(val.length >= 350) {
        this.$message({
          message: "请注意！只允许输入200个字符",
          type: "warning"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/css/var";
@import "../../common/css/mixin/text_overflow";
.tab-btn {
  display: inline-block;
  width: 34px;
  height: 34px;
  padding: 5px;
  vertical-align: middle;
  color: $btn-color;
  cursor: pointer;
}
.el-input-number {
  width: 100px !important;
}
</style>
