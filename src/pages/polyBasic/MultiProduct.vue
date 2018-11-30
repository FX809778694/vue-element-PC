<!--
 Created by Thomas on 2018/7/12.
 多元产品组件
 -->
<template>
  <section class="multi-product">
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
          <el-button type="primary" size="mini" @click="exportAllShop()" round>导出全部商品</el-button>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" @click="exportShop()" round>导出选中的商品</el-button>
        </div>
      </div>
    </div>
    <!-- 列表展示 -->
    <div v-if="tabListSign">
      <div class="null-data" v-if="tableData.length===0">暂无数据</div>
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
            prop="Id"
            fixed="left"
            label="商品ID"
            v-if="isStock"
            width="166">
            <template slot-scope="scope">{{ scope.row.Id }}</template>
          </el-table-column>
          <el-table-column
            prop="Name"
            label="商品名称"
            width="200">
          </el-table-column>
          <el-table-column
            prop="Price"
            label="定价"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.Price ? scope.row.Price.toFixed(2) : '暂无' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="Specification"
            label="规格"
            width="100">
          </el-table-column>
          <el-table-column
            prop="Type"
            label="分类"
            width="140">
          </el-table-column>
          <el-table-column
            prop="Brand"
            label="品牌"
            width="180">
          </el-table-column>
          <el-table-column
            prop="Package"
            label="包装"
            width="180">
          </el-table-column>
          <el-table-column fixed="right" label="详情">
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
        </el-table>
      </div>

      <!-- 底部操作按钮组 -->
      <div class="operate-content clearfix">
        <div class="check-btn fl">
          <el-checkbox :value="allSelect" @change="handleSelectionAllChange(tableData)">全选</el-checkbox>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" @click="exportAllShop()" round>导出全部商品</el-button>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" @click="exportShop()" round>导出选中的商品</el-button>
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
              <h4>规格：{{ item.Specification }}</h4>
              <h4>类型：{{ item.Type }}</h4>
              <div class="picture-content-item-bottom clearfix">
                <span>{{ item.Price }}</span>
              </div>
            </div>
          </div>
        </el-checkbox-group>
      </div>

      <!-- 底部操作按钮组 -->
      <div class="operate-content clearfix" style="margin-top: 20px">
        <div class="check-btn fl">
          <el-checkbox :indeterminate="isIndeterminate" v-model.trim="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" @click="exportAllShop()" round>导出全部商品</el-button>
        </div>
        <div class="operate-car-btn">
          <el-button type="primary" size="mini" @click="exportShop()" round>导出选中的商品</el-button>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="pagination-block" v-if="Total">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="PageIndex"
        :page-size="PageNum"
        background
        layout="prev, pager, next"
        :total="Total">
      </el-pagination>
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
import { exportAllShopApi, fetchMultiData, exportShopApi } from "../../api";
import NumModalOne from "@/components/NumModalOne";

export default {
  name: "MultiProduct",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      multipleSelectionAll: [],
      checkList: [],
      keySign: "Id",
      //切换显示
      tabPictureSign: false,
      tabListSign: true,
      isIndeterminate: false,
      checkAll: false,
      PageIndex: 1,
      PageNum: 15,
      PriceStart: "", //筛选价格低
      PriceEnd: "", //筛选价格高
      Total: 0
    };
  },
  components: {
    HoverContent,
    NumModalOne
  },
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
  created() {
    const { PageIndex, PageNum } = this;
    let params = {
      Data: {
        PageIndex: PageIndex,
        PageNum: PageNum,
        PriceStart: "",
        PriceEnd: "",
        Search: ""
      }
    };

    this.initTableData(params);
    // 导入查询 事件总线派发
    this.bus.$on("toChangeTableData", data => {
      console.log(data);
      this.tableData = data.Data;
      this.Total = data.Total;
      this.filterData = [];
    });
  },
  computed: {
    ...mapState(["loading", "showNav", "noBook", "isStock"]),
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
    enterDetail(id) {
      console.log(id);
      this.$router.push({
        name: "DetailPage",
        params: {
          channel: "multi",
          category: "6",
          id: id
        }
      });
      window.scrollTo(0, 0);
    },
    initTableData(params) {
      fetchMultiData(params)
        .then(this.globelReqHandle)
        .then(res => {
          console.log(res);
          this.tableData = res.Data;
        })
        .catch(this.globelErrHandle);
    },
    //根据价格筛选
    filterPrice() {
      const { PriceStart, PriceEnd } = this;
      if (PriceStart === "" && PriceEnd === "") {
        return;
      }
      console.log(111);

      let params = {
        PriceStart,
        PriceEnd,
        PageNum: 15,
        PageIndex: 1
      };
      console.log(params);
      this.initTableData(params);
    },
    handleCurrentChange(val) {
      const { PriceStart, PriceEnd } = this;
      let params = {
        PriceStart,
        PriceEnd,
        PageNum: 15,
        PageIndex: val
      };
      this.initTableData(params);
      window.scroll(0, 0);
      this.$refs.multipleTable.$refs.bodyWrapper.scrollTop = 0;
    },
    handleDelete(index, row) {
      // console.log(index, row);
    },
    /* 表格多选操作监听 */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleChange(value) {
      console.log(value);
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
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.tableData.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.tableData.length;
    },
    singleChange(Id, Name, item, index) {
      console.log(Id, Name, item, index, this.$refs.check[index].isChecked);
      // this.$refs.check[index].isChecked false
      // 控制当前图文的选择与否
      this.checkList.forEach((item, index) => {
        if (item.index === Id) {
          this.checkList.splice(index, 1);
        }
      });
      // debugger
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
              // console.log(selectData)
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

      //标识当前行的唯一键名称
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
              // 如果总选择中有未被选中的，那么就删除这条
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
        item.XyCount = value.batchNumXy;
        item.JyCount = value.batchNumJy;
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
        })
        .catch(this.globelErrHandle);
    },
    exportAllShop() {
      const { Pricestart, Priceend } = this;
      let params = {
        Data: {
          Search: this.Search,
          Type: "6",
          Pricestart: Pricestart,
          Priceend: Priceend
        }
      };
      exportAllShopApi(params)
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
};
</script>

<style lang="scss">
.multi-product {
  width: 1200px;
  margin: 0 auto;
  a {
    text-decoration: none;
  }
}
</style>
