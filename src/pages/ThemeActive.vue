<!--
 Created by Thomas on 2018/7/11.
 主题活动一级组件
 -->
<template>
<section class="theme-active">
  <el-carousel height="428px">
    <el-carousel-item v-for="(item, index) in bannerTop" :key="index">
      <div
        @click="$router.push({ name: 'ThemeActiveLeaf', params: { activeId: `${item.Activity.ChannelCode}`}})"
        class="banner-img"
        v-bind:style="{ 'background-image': 'url(' + item.Activity.ImgUrl + ')' }"
      ></div>
    </el-carousel-item>
  </el-carousel>
  <div class="active-content clearfix">
    <div class="active-content-img fl"
         v-for="(item, index) in contentData"
         :key="index"
         @click="$router.push({ name: 'ThemeActiveLeaf', params: { activeId: `${item.Activity.ChannelCode}`}})">
      <img :src="item.Activity.ImgUrl"/>
      <div class="active-content-mask">
        <h3><a>{{item.Activity.ChannelName}}</a></h3>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import { fetchIndexImg } from "../api";
import { globelFnHanle } from "@/common/js/mixin.js";

export default {
  name: "ThemeActive",
  data() {
    return {
      bannerTop: {},
      contentData: []
    };
  },
  mixins: [globelFnHanle],
  created() {
    fetchIndexImg()
      .then(this.globelReqHandle)
      .then(res => {
        // console.log(res)
        this.bannerTop = res.Data.filter(item => item.Position === "1")[0].Data;
        this.contentData = res.Data.filter(
          item => item.Position === "3"
        )[0].Data;
        console.log(this.contentData);
      })
      .catch(this.globelErrHandle);
  }
};
</script>

<style lang="scss" scoped>
@import "../common/css/_var";

.theme-active {
  min-height: 700px;
}
.banner-img {
  width: 100%;
  height: 428px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}
.active-content {
  width: 1200px;
  margin: 20px auto;
  &-img {
    cursor: pointer;
    width: 590px;
    height: 230px;
    margin-top: 10px;
    position: relative;
    &:nth-child(2n) {
      margin-left: 20px;
    }
    &:hover .active-content-mask {
      display: block;
    }
    & img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  &-mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    & a {
      text-decoration: none;
      display: block;
      font-size: $font-30;
      text-align: center;
      line-height: 230px;
      color: rgba(255, 255, 255, 0.89);
    }
  }
}
</style>
