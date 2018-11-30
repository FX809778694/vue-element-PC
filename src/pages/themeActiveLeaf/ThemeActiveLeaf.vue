<!--
 Created by Thomas on 2018/7/12.
 主题活动二级列表图文组件
 -->
<template>
<section class="newest clearfix">
  <multi-sort
    ref="multiSort"
    :filterData="filterData"
    :selectedCondition="selectedCondition"
    :box="box"
    :checkMore="checkMore"
    @itemSelect="itemSelect"
    @multiSelect="multiSelect"
    @removeSelected="removeSelected"
    @showMore="showMore"
    @showCheckMore="showCheckMore"
    @showLess="showLess"
    @cancelMultiSelect="cancelMultiSelect"
  ></multi-sort>
  <div class="newest-content">
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
import ListDisplay from "./List_display";
import MultiSort from "@/components/Multi_sort";
import { SearchBook, exportAllShopApi } from "../../api";

export default {
  name: "ThemeActiveLeaf",
  data() {
    return {
      /* 筛选数据 */
      filterData: [],
      /* 用户选择的筛选条件 */
      selectedCondition: [],
      /* 用户选择的筛选条件 Id */
      selectedIdCondition: [],
      /* 筛选条件是否显示更多 */
      box: {},
      /* 筛选条件是否多选 */
      checkMore: {},
      /* 表格数据 */
      tableData: [],
      Total: 0,
      PageIndex: 1,
      PageNum: 15,
      Type: 0,
      onOff: true
    };
  },
  mixins: [globelFnHanle],
  components: {
    MultiSort,
    ListDisplay
  },
  computed: {
    ...mapState(["loading", "showNav", "Search", "clickSignAll"]),
    Pricestart() {
      return this.$refs.tableComponent.PriceStart;
    },
    Priceend() {
      return this.$refs.tableComponent.PriceEnd;
    }
  },
  created() {
    const Type = this.$route.params.activeId;
    this.Type = Type;
    /* 初始化表格数据 */
    this.initTableData(this.Search);
    // 导入查询 事件总线派发
    this.bus.$on('toChangeTableData', data => {
      console.log(data)
      this.tableData = data.Data
      this.Total = data.Total
      this.filterData = []
    })
  },
  methods: {
    ...mapMutations(["setLoading", "setShowNav", "updateSearch", "updateClickSignAll"]),
    initTableData(Search) {
      const { Type, PageNum } = this;

      const params = {
        Search,
        Type,
        PageIndex: 1,
        PageNum
      };

      this.getSearchBook(params);
    },
    handleCurrentChange(val) {
      const { Search, Type, Pricestart, PriceEnd, PageNum } = this;

      let params = {
        ...this.selectedIdCondition,
        Search,
        Type,
        Pricestart,
        PriceEnd,
        PageNum,
        PageIndex: val
      };

      this.$refs.multiSort.filterStatus = false;

      this.fetchFilterData(params);
      window.scroll(0, 0)
      this.$refs.tableComponent.$refs.multipleTable.$refs.bodyWrapper.scrollTop = 0
    },
    filterPrice(value) {
      this.getFilterData();
    },
    getSearchData(Search) {
      this.initTableData(Search);
    },
    getFilterData() {
      this.setLoading(true);

      const { Search, Type, Pricestart, Priceend, PageNum } = this;

      const params = {
        ...this.selectedIdCondition,
        Search,
        Type,
        Pricestart,
        Priceend,
        PageNum,
        PageIndex: 1
      };

      this.fetchFilterData(params);
    },
    exportAllShop() {
      const { Pricestart, Priceend } = this
      let params = {
        Data: {
          ...this.selectedIdCondition,
          Search: this.Search,
          Type: '3',
          Pricestart: Pricestart,
          Priceend: Priceend
        }
      }

      if(this.clickSignAll) {
        this.$message({
          message: "请勿频繁操作",
          type: 'warning'
        })
      }
      this.updateClickSignAll(true)

      exportAllShopApi(params)
        .then(this.globelReqHandle)
        .then(res => {
          console.log(res)
          if(res.Success) {
            const url = res.Data.Url
            console.log(url)
            window.open(url)
            this.updateClickSignAll(false)
          }
        })
        .catch(this.globelErrHandle)
    }
  },
  destroyed() {}
};
</script>

<style lang="scss" scoped>
@import "../../common/css/var";
.newest {
  &-content {
    width: 1200px;
    margin: 0 auto;
    & a {
      text-decoration: none;
    }
  }
}
</style>
