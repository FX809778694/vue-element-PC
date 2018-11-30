<!--
 Created by Thomas on 2018/7/12.
 大中专教材组件
 -->
<template>
<section class="key-products clearfix">
  <div class="reference-book clearfix" v-if="showNewBook">
    <div class="book-title">
      <i class="book-icon"></i>
      <span>新书推荐</span>
    </div>
    <div class="book-class">
      <span class="class-list"><span class="class-name">本科教材</span><i
       class="triangle"></i></span>
      <span class="class-list"><span class="class-name">高职教材</span><i
       class="triangle"></i></span>
      <span class="class-list"><span class="class-name">中职教材</span><i
       class="triangle"></i></span>
    </div>
    <div class="book-content">
      <el-carousel :interval="4000" height="46px" arrow="never" indicator-position="none">
        <el-carousel-item v-for="(val, num) in BookData1" :key="num">
          <div class="slide-list" >
            <div class="book-list">
              <div class="books" v-for="(list, a) in val" :key="a">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  :open-delay="1000"
                  >
                  <HoverContent
                    :filterData="list"
                  ></HoverContent>
                  <div class="hover-btn" slot="reference" @click="enterDetail(list)">
                    <span class="book-name">{{list.Name}}</span>
                    <span class="press-name">出版社：{{list.Publisher}}</span>
                    <span class="book-price">￥{{list.Price}}</span>
                  </div>
                </el-popover>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="book-content">
      <el-carousel :interval="4000" height="46px" arrow="never" indicator-position="none">
        <el-carousel-item v-for="(val, num) in BookData2" :key="num">
          <div class="slide-list" >
            <div class="book-list">
              <div class="books" v-for="(list, a) in val" :key="a">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  :open-delay="1000"
                >
                  <HoverContent
                    :filterData="list"
                  ></HoverContent>
                  <div class="hover-btn" slot="reference" @click="enterDetail(list)">
                    <span class="book-name">{{list.Name}}</span>
                    <span class="press-name">出版社：{{list.Publisher}}</span>
                    <span class="book-price">￥{{list.Price}}</span>
                  </div>
                </el-popover>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="book-content">
      <el-carousel :interval="4000" height="46px" arrow="never" indicator-position="none">
        <el-carousel-item v-for="(val, num) in BookData3" :key="num">
          <div class="slide-list" >
            <div class="book-list">
              <div class="books" v-for="(list, a) in val" :key="a">
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  :open-delay="1000"
                >
                  <HoverContent
                    :filterData="list"
                  ></HoverContent>
                  <div class="hover-btn" slot="reference" @click="enterDetail(list)">
                    <span class="book-name">{{list.Name}}</span>
                    <span class="press-name">出版社：{{list.Publisher}}</span>
                    <span class="book-price">￥{{list.Price}}</span>
                  </div>
                </el-popover>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
  <multi-sort
    ref="multiSort"
    :filterData="filterData"
    :publisherData="publisherData"
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
    @selectPublisher="handleSelectPublisher"
  ></multi-sort>
  <div class="key-products-content">
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
import HoverContent from "@/components/hoverContent";
import ListDisplay from "./List_display";
import MultiSort from "./Multi_sort";
import { getItem } from "../../common/js/util";
import { getBookBanner, fetchKeyProducts, exportAllShopApi } from "../../api";

export default {
  name: "KeyProducts",
  data() {
    return {
      /* 筛选数据 */
      filterData: [],
      /* 出版社数据 */
      publisherData: [],
      /* 用户选择的筛选条件 */
      selectedCondition: {},
      /* 用户选择的筛选条件 Id */
      selectedIdCondition: {
        Publisher: ""
      },
      /* 筛选条件是否显示更多 */
      box: {},
      /* 筛选条件是否多选 */
      checkMore: {},
      /* 点击出版社logo隐藏新书推荐 */
      showNewBook: true,
      /* 表格数据 */
      tableData: [],
      Total: 0,
      bookBannerList: [],
      BookData1: [],
      BookData2: [],
      BookData3: [],
      PageIndex: 1,
      PageNum: 15,
      onOff: true,
      isClickPublisher: false,
    };
  },
  mixins: [globelFnHanle],
  components: {
    MultiSort,
    ListDisplay,
    HoverContent
  },
  computed: {
    ...mapState(["loading", "showNav", "Search", "noBook", "clickSignAll"]),
    Pricestart() {
      return this.$refs.tableComponent.PriceStart;
    },
    Priceend() {
      return this.$refs.tableComponent.PriceEnd;
    }
  },
  created() {
    /* 初始化表格数据 */
    this.initTableData(this.Search);
    // 导入查询 事件总线派发
    this.bus.$on("toChangeTableData", data => {
      console.log(data);
      this.tableData = data.Data;
      this.Total = data.Total;
      this.filterData = [];
    });

    const { UserId } = getItem("BigUser");
    let bannerParams = {
      UserId: UserId
    };
    getBookBanner(bannerParams)
      .then(Data => {
        console.log(Data);
        this.bookBannerList = Data.Data;
        this.BookData1 = this.bookBannerList[0].BookData;
        this.BookData2 = this.bookBannerList[1].BookData;
        this.BookData3 = this.bookBannerList[2].BookData;
      })
      .catch(this.globelErrHandle);
    this.getPressLogo();
  },
  watch: {
    '$route' (to, from) {
      this.initTableData(this.Search)
    }
  },
  methods: {
    ...mapMutations([
      "setLoading",
      "setShowNav",
      "updateSearch",
      "updateClickSignAll"
    ]),
    initTableData(Search) {
      const { PageNum } = this;
      const {type} = this.$route.params;
      const params = {
        Search,
        Type: type,
        PageIndex: 1,
        PageNum
      };

      this.getSearchBook(params);
    },
    enterDetail(value) {
      console.log(value);
      this.$router.push({
        name: "DetailPage",
        params: {
          channel: value.IsKg === 1 ? "available" : "unAvailable",
          category: "5",
          id: value.Id
        }
      });
      window.scrollTo(0, 0);
    },
    handleCurrentChange(val) {
      this.setLoading(true);
      const { Search, Pricestart, Priceend, PageNum } = this;
      const {type} = this.$route.params;
      let params = {
        ...this.selectedIdCondition,
        Search,
        Pricestart,
        Priceend,
        PageNum,
        PageIndex: val,
        Type: type
      };

      this.$refs.multiSort.filterStatus = false;

      this.fetchFilterData(params);
      window.scroll(0, 0);
      this.$refs.tableComponent.$refs.multipleTable.$refs.bodyWrapper.scrollTop = 0;
    },
    filterPrice(value) {
      this.getFilterData();
    },
    getSearchData(Search) {
      this.initTableData(Search);
    },
    getFilterData() {
      this.setLoading(true);

      const { Search, Pricestart, Priceend, PageNum } = this;
      /**
       * TODO:
       * 对 type 做处理
       */
      let {type} = this.$route.params;
      if(this.isClickPublisher) {
        type = '5'
      }

      const params = {
        ...this.selectedIdCondition,
        Search,
        Type: type,
        Pricestart,
        Priceend,
        PageNum,
        PageIndex: 1
      };

      this.fetchFilterData(params);
    },
    getPressLogo() {
      // debugger
      fetchKeyProducts()
        .then(this.globelReqHandle)
        .then(res => {
          this.publisherData = res.Data.map(el => {
            el.active = false;
            return el;
          });
        })
        .catch(this.globelErrHandle);
    },
    exportAllShop() {
      const { Pricestart, Priceend } = this;
      const {type} = this.$route.params;
      let params = {
        Data: {
          ...this.selectedIdCondition,
          Search: this.Search,
          Type: type,
          Pricestart: Pricestart,
          Priceend: Priceend
        }
      };

      if (this.clickSignAll) {
        this.$message({
          message: "请勿频繁操作",
          type: "warning"
        });
      }
      this.updateClickSignAll(true);

      exportAllShopApi(params)
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
    },
    handleSelectPublisher(item) {
      this.showNewBook = false;
      this.isClickPublisher = true;
      const { Guid, Name, active } = item;

      this.publisherData.map(el => {
        if (el.Guid === Guid) {
          el.active = !active;
        } else {
          el.active = false;
        }

        return el;
      });

      if (active) {
        this.selectedIdCondition.Publisher = "";
        return false;
      }

      this.selectedIdCondition.Publisher = Name;
    }
  },
  destroyed() {}
};
</script>


<style lang="scss" scoped>
@import "../../common/css/var";
@import "../../common/css/mixin/_text_overflow";
.key-products {
  &-content {
    width: 1200px;
    margin: 0 auto;
    & a {
      text-decoration: none;
    }
  }
  .mutiple_sort {
    box-shadow: none;
  }
  .reference-book {
    width: 1200px;
    margin: 0 auto;
    border-bottom: 1px solid $border_E6;
    height: auto;
    .book-title {
      padding-left: 120px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 25px;
      i.book-icon {
        width: 28px;
        height: 28px;
        display: block;
        background: url("../../assets/clock.png") no-repeat center;
        background-size: 90%;
        position: relative;
        left: -14px;
        top: 1px;
      }
    }
    .book-class {
      width: 120px;
      border-right: 1px solid $border_E6;
      float: left;
      height: 220px;
      padding-top: 30px;
      padding-bottom: 10px;
      display: flex;
      flex-flow: row wrap;
      align-content: space-around;
      .class-list {
        width: 100px;
        height: 22px;
        background: $theme_color;
        display: block;
        text-align: center;
        line-height: 22px;
        color: #fff;
        font-size: $font-14;
        position: relative;
        span.class-name {
          display: block;
          width: 100%;
          height: 100%;
          @include text-overflow;
        }
        &:after {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $theme_color;
          display: block;
          content: "";
          position: absolute;
          top: 50%;
          margin-top: -4px;
          right: -24px;
        }
      }
      .triangle {
        border-width: 6px;
        width: 0;
        height: 0;
        display: block;
        content: "";
        border-style: solid;
        border-color: transparent transparent transparent $theme_color;
        position: absolute;
        top: 50%;
        right: -12px;
        margin-top: -6px;
      }
    }
    .book-content {
      float: left;
      padding-top: 30px;
      height: 66px;
      padding-bottom: 10px;
      width: 1080px;
      .slide-list {
        margin-bottom: 17px;
      }
      .slide-list,
      .book-list {
        height: 46px;
        width: 100%;
        .books {
          width: 235px;
          height: 46px;
          float: left;
          margin-left: 40px;
          border: 1px solid $border_E6;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
          padding: 5px;
          cursor: pointer;
          background: #fafafa;
          &:first-child {
            margin-left: 20px;
          }
          span {
            font-size: 14px;
            &.book-name {
              color: #333;
              display: block;
              @include text-overflow;
            }
            &.press-name {
              color: #999;
              margin-top: auto;
              display: block;
              @include text-overflow;
              margin-right: 60px;
            }
            &.book-price {
              color: $theme_color;
              position: absolute;
              right: 5px;
              bottom: 5px;
            }
          }
        }
      }
    }
  }
}
/* 新书展示块 */
.hover-content {
  &-img {
    width: 140px;
    height: 140px;
    text-align: center;
    margin-right: 10px;
    & img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  &-l {
    margin-right: 20px;
    & h3 {
      font-size: $font-16;
      color: $font_color_333;
    }
    & p {
      margin-top: 6px;
      font-size: $font-14;
      color: $font_color_666;
    }
  }
}
.hover-btn{
  width: 100%;
  height: 100%;
  &:hover.hover-btn span{
    color: #ff2626!important;
  }
}
</style>
