<!--
 Created by Thomas on 2018/7/4.
 浮动显示公共组件
 -->
<template>
  <div>
    <div v-if="filterData ? Object.keys(filterData).length : null" class="hover-content clearfix">
      <div class="hover-content-img fl">
        <img :src="Img[0] ? img[0] : noBook" />
      </div>
      <div class="hover-content-l fl">
        <h3>{{ filterData.Name }}</h3>
        <p class="" style="margin-top: 10px">定价: {{ filterData.Price ? filterData.Price : "暂无" }}</p>
        <p class="">开本: {{ filterData.Kb ? filterData.Kb : "暂无" }}</p>
        <p class="">可供状态: {{ filterData.IsKg === "1" ? "是" : "否" }}</p>
        <p class="">出版时间: {{ filterData.PublishTime ? filterData.PublishTime : "暂无" }}</p>
      </div>
      <div class="hover-content-l fr" style="margin-top: 12px">
        <p class="" style="margin-top: 20px">作者: {{ filterData.Author ? filterData.Author : "暂无" }}</p>
        <p class="">版次: {{ filterData.Bc ? filterData.Bc : "暂无" }}</p>
        <p class="">营销分类: {{ filterData.Yxfl ? filterData.Yxfl : "暂无" }}</p>
        <p class="">版别: {{ filterData.EditionName ? filterData.EditionName : "暂无" }}</p>
      </div>
    </div>
    <div v-else>暂无数据</div>
  </div>

</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "hoverContent",
  data() {
    return {};
  },
  props: ["filterData"],
  computed: {
    ...mapState(["noBook"]),
    Img: function() {
      return this.filterData.Img ? this.filterData.Img : [];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/css/_var.scss";
/* 列表Hover显示块 */
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
</style>
