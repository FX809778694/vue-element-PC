<template>
  <div id="app" v-loading.fullscreen.lock="loading">
    <router-view/>
    <Footer></Footer>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Footer from "@/components/Footer";
export default {
  name: "App",
  components: {
    Footer
  },
  computed: {
    ...mapState(["loading"])
  },
  methods: {
    ...mapMutations(["setLoading"])
  }
};
</script>

<style lang="scss">
@import "./common/css/mixin/_normalize";
@import "./common/css/mixin/_clearfix";
@import "./common/css/_var";
@import "./common/css/mixin/_text_overflow";

#app {
  width: 100%;
  height: 100%;
}
.el-table th > .cell {
  text-align: center;
}
/*全局展示区域按钮*/
.shop_cart_wrap {
  box-shadow: inset 0 1px 1px 0 #d9d9d9;
}
.shop-cart {
  a {
    text-decoration: none;
  }
  width: 1200px;
  margin: 0 auto;
  .el-table th {
    text-align: center;
    border-right: 1px solid #e6e6e6;
    border-top: 1px solid #e6e6e6;
    &:first-child {
      border-left: 1px solid #e6e6e6;
    }
  }
  .el-table {
    margin-top: 10px;
    font-size: 14px;
    & td {
      padding: 0;
      border-right: 1px solid $border_E6;
      &:first-child {
        border-left: 1px solid $border_E6;
      }
    }
  }
  .el-table-column--selection .cell {
    padding-left: 14px;
  }
  .tab-delete {
    cursor: pointer;
    &-graphic {
      color: $btn-color;
    }
  }
  .tab-price-graphic {
    color: $theme_color;
  }
}
.operate-content {
  width: 1200px;
  height: 40px;
  border: 1px solid $border_E6;
  margin-top: 10px;
  line-height: 40px;
  background: #F5F5F9;
  .check-btn {
    margin-left: 10px;
    margin-right: 20px;
  }
  .tab-price-input {
    width: 60px;
    &-name {
      font-size: $font-14;
      color: $font_color_666;
      margin-left: 40px;
    }
    &-line {
      padding: 0 4px;
      font-size: $font-14;
      color: $font_color_666;
    }
    &-btn {
      display: block;
      width: 50px;
      height: 28px;
      background: $theme_color;
      color: $font_color_fff;
      text-align: center;
      line-height: 28px;
      border-radius: 2px;
      margin-top: 6px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
.operate-car-btn {
  display: inline-block;
  border-radius: 4px;
  background: $theme_color;
  line-height: 22px;
  font-size: $font-14;
  color: $font_color_fff;
  text-align: center;
  cursor: pointer;
  margin-right: 20px;
  .el-button,
  .is-round {
    border-radius: 4px !important;
  }
}
.add-account-btn {
  display: inline-block;
  border-radius: 4px;
  background: $theme_color;
  line-height: 22px;
  font-size: $font-14;
  color: $font_color_fff;
  border: 1px solid $font_color_fff;
  margin-top: 3px;
  text-align: center;
  cursor: pointer;
  margin-right: 20px;
  .el-button,
  .is-round {
    border-radius: 4px !important;
  }
}
.car-head {
  &-op {
    width: 1200px;
    height: 40px;
    line-height: 40px;
    margin: 0 auto;
    border-bottom: 1px solid $border_E6;
  }
  &-total {
    height: 39px;
    line-height: 39px;
    font-size: $font-16;
    color: $theme_color;
    text-align: center;
    border-bottom: 2px solid $theme_color;
  }
  &-select {
    margin-left: 690px;
    width: 260px;
    text-align: center;
    & i {
      display: inline-block;
      width: 60%;
      @include text-overflow;
      float: left;
    }
    & span {
      color: $theme_color;
      width: 40%;
      display: inline-block;
      @include text-overflow;
      float: left;
    }
  }
  &-option {
    margin-left: 20px;
    .el-select {
      width: 120px;
    }
    .el-input__inner {
      height: 28px;
      line-height: 28px;
    }
  }
}
.tab-switch-operate {
  width: 100px;
  height: 100%;
  .tab-switch {
    &-btn {
      width: 50%;
      border-right: 1px solid $border_E6;
      height: 100%;
      display: block;
      text-align: center;
      position: relative;
      cursor: pointer;
      & div {
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -6px 0 0 -6px;
        display: block;
        height: 12px;
        width: 12px;
        cursor: pointer;
      }
    }
    &-list {
      background: url("./assets/list.png");
      &-active {
        background: url("./assets/list-active.png");
      }
    }
    &-picture {
      background: url("./assets/picture.png");
      &-active {
        background: url("./assets/picture-active.png");
      }
    }
  }
}
.tab-num {
  .el-input-number {
    width: 180px;
  }
  .el-input-number__increase .el-input-number__decrease {
    width: 20px !important;
  }
  &-l {
    margin-top: 4px;
  }
  &-r {
    margin-top: 4px;
    margin-bottom: 4px;
  }
}
.shop-cart-remark {
  padding: 6px 0;
}
/*复用后区别于列表*/
.tab-shop {
  &-block {
    padding: 10px 6px;
  }
  &-img {
    width: 80px;
    height: 80px;
    & img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  &-title {
    margin-left: 10px;
    h3 {
      text-align: left;
      font-size: $font-14;
      color: $font_color_333;
      @include text-overflow;
      width: 100px;
    }
    p {
      margin-top: 16px;
      font-size: $font-14;
      color: $font_color_999;
    }
  }
}

.tab-btn {
  display: inline-block;
  width: 34px;
  height: 34px;
  padding: 5px;
  vertical-align: middle;
  color: $btn-color;
  cursor: pointer;
}
/* 图文展示不同于购物车 */
.picture-content {
  .el-checkbox {
    margin-bottom: 6px;
    position: absolute;
    top: 4px;
    left: 4px;
  }
  position: relative;
  margin-right: 20px;
  margin-top: 20px;
  width: 224px;
  padding: 10px 10px 10px 20px;
  text-align: center;
  border: 1px solid #f5f5f9;
  &:nth-child(5n) {
    margin-right: 0;
  }
  &-layout {

  }
  &-img {
    width: 184px;
    height: 184px;
    cursor: pointer;
    & img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  & h3 {
    font-size: $font-16;
    color: $font_color_333;
    margin-top: 10px;
    text-align: left;
    @include text-overflow;
  }
  & h4 {
    font-size: $font-14;
    color: $font_color_666;
    margin-top: 6px;
    text-align: left;
    @include text-overflow;
  }
  &-number {
    margin-top: 6px;
    text-align: left;
    font-size: $font-14;
    color: $font_color_666;
  }
  &-item-bottom {
    color: $theme_color;
    margin-top: 6px;
    & span {
      font-size: $font-18;
      float: left;
    }
    & a {
      display: block;
      font-size: $font-14;
      width: 80px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      border-radius: 4px;
      background: $theme_color;
      color: $font_color_fff;
      float: right;
      cursor: pointer;
    }
  }
}

/*分页器*/
.pagination-block {
  position: relative;
  width: 1200px;
  height: 120px;
  margin: 0 auto;
  .el-pagination {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

body {
  font-size: 14px;
  font-family: "Microsoft Yahei";
  min-width: 1200px;
}
/**
 * 重点标记
 */
.point {
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: middle;
  background: url("assets/point.png") no-repeat center;
  margin-right: 5px;
}
.picture-content-img {
  position: relative;
  .point_big {
    position: absolute;
    top: -23px;
    right: -23px;
    width: 46px;
    height: 46px;
    display: inline-block;
    vertical-align: middle;
    background: url("assets/point.png") no-repeat center;
  }
  .active-name{
    position: absolute;
    width: 100%;
    height: 36px;
    opacity: 0.8;
    background-color: #ff2626;
    bottom: 0;
    & p{
      font-size: 16px;
      color: #ffffff;
      text-align: left;
      line-height: 36px;
      padding-left: 14px;
      padding-right: 10px;
      @include text-overflow;
    }
  }
}
/* 隐藏最新图书的全选喽 */
.newest {
  .el-table--border th:first-child label {
    display: none !important;
  }
}
/* 收起筛选 */
.el-button--info.is-plain{
  color: #333333;
  background: #FFFFFF;
  border-color: #e6e6e6;
}
  /* 表格边框颜色 */
.el-table th.is-leaf, .el-table td{
  border-bottom: 1px solid #e6e6e6;
}
.el-table--border th, .el-table--border td{
  border-right: 1px solid #e6e6e6;
}
.el-table--border td:first-child .cell{
  padding-left: 14px;
}
  /* 列表标题 */
.el-table th > .cell{
  font-weight: 500;
  color: #333;
}
.el-checkbox__inner::after{

}
  /* 数量输入框 */
.el-input--mini .el-input__inner{
  height: 22px;
  line-height: 22px;
}
.el-input-number--mini .el-input-number__increase, .el-input-number--mini .el-input-number__decrease{
  height: 20px;
  margin-top: 2px;
  line-height: 20px;
}

  .null-data{
    width: 100%;
    height: 700px;
    text-align: center;
    font-size: 18px;
    line-height: 700px;
    color: #666;
    border: 1px solid #e6e6e6;
    margin-top: 10px;
  }
  /* 子账号表头 */
  .account-wrap{
    & thead th{
      background: #F5F5F9;
    }
  }
.el-table--border th{
  background: #f5f5f5;
}
</style>
