<!--
 Created by Thomas on 2018/7/5.
 首页组件
 -->
<template>
  <div class="home-index">
    <el-carousel v-if="bannerTop.length && isHaveActive" height="428px">
      <el-carousel-item v-for="(item, index) in bannerTop" :key="index">
        <div
          class="banner-img"
          :style="{ 'background-image': 'url(' + item.Activity.ImgUrl + ')' }"
          @click="enterThemeActiveLeaf(item.Activity.ChannelCode)"
        ></div>
      </el-carousel-item>
    </el-carousel>
    <!-- 最新图书 -->
    <div v-if="newestDataSlice.length && isHaveNewest">
      <div class="newest-title clearfix">
        <div class="newest-l">
          <div class="newest-icon"></div>
          <h3>{{ newestData.ChannelName }}</h3>
        </div>
        <div class="newest-more" @click="enterChannel('Newest')">更多>></div>
      </div>
      <div class="newest-content">
        <ul class="newest-content-ul clearfix">
          <li
            class="newest-content-item"
            v-for="(item, index) in newestForData"
            :key="index"
            :title="'【' + item.Name + '】' +item.Summary"
            @click="enterDetail1(item)"
          >
            <a>
              <div class="newest-content-img">
                <img v-lazy="item.Img ? item.Img : noBook" title=""/>
              </div>
              <p class="newest-content-title">【{{ item.Name }}】{{ item.Summary }}</p>
              <p class="newest-content-author">{{item.Author}}</p>
              <div class="newest-content-price">¥{{item.Price}}</div>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="Object.keys(bannerMiddle).length && isHaveActive" class="banner-long">
      <div
        class="banner-long-img"
        @click="enterThemeActiveLeaf(bannerMiddle.Activity.ChannelCode)"
      >
        <img v-lazy="bannerMiddle.Activity.ImgUrl" title=""/>
      </div>
    </div>
    <!-- 主题活动 -->
    <div v-if="bestSellDataSlice.length && isHaveActive" class="book-common-head clearfix">
      <div class="common-head-l">主题活动</div>
    </div>
    <div v-if="Object.keys(bannerBottom).length && isHaveActive" class="newest-content">
      <ul class="newest-content-ul banner-l-content clearfix">
        <li>
          <div
            class="banner-left-img"
            @click="enterThemeActiveLeaf(bannerBottom.Data[0].Activity.ChannelCode)"
          >
            <img v-lazy="bannerBottom.Data[0].Activity.ImgUrl" title=""/>
          </div>
        </li>
        <li
          class="newest-content-item banner-book-activity"
          v-for="(item, index) in bannerBottom.Data[0].Book"
          :key="index"
          :title="'【' + item.Name + '】' +item.Summary"
        >
          <a
            @click="$router.push({ name: 'DetailPage', params: { channel: 'general', category: '3', id: item.Id }})"
          >
            <div class="newest-content-img">
              <img v-lazy="item.Img" title=""/>
            </div>
            <p class="newest-content-title">【{{ item.Name }}】{{ item.Summary }}</p>
            <p class="newest-content-author">{{item.Author}}</p>
            <div class="newest-content-price">¥{{item.Price}}</div>
          </a>
        </li>

      </ul>
    </div>
    <!-- 畅销图书 -->
    <div v-if="bestSellDataSlice.length && isHaveBestSale">
      <div class="book-common-head clearfix">
        <div class="common-head-l">{{ bestSellData.ChannelName }}</div>
        <div class="common-head-r" @click="enterChannel('BestSell')">更多>></div>
      </div>
      <div class="newest-content">
        <ul class="newest-content-ul clearfix">
          <li
            class="newest-content-item"
            v-for="(item, index) in bestSellForData"
            :key="index"
            :title="'【' + item.Name + '】' +item.Summary"
            @click="enterDetail2(item)"
          >
            <a>
              <div class="newest-content-img">
                <img v-lazy="item.Img ? item.Img : noBook" title=""/>
              </div>
              <p class="newest-content-title">【{{ item.Name }}】{{ item.Summary }}</p>
              <p class="newest-content-author">{{item.Author}}</p>
              <div class="newest-content-price">¥{{item.Price}}</div>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!-- 重点产品 -->
    <div v-if="KeyProductsDataSlice.length && isHaveMate">
      <div class="book-common-head clearfix">
        <div class="common-head-l">{{ KeyProductsData.ChannelName }}</div>
        <div class="common-head-r" @click="enterChannel('Material')">更多>></div>
      </div>
      <div class="newest-content">
        <ul class="newest-content-ul clearfix">
          <li
            class="newest-content-item"
            v-for="(item, index) in KeyProductsForData"
            :key="index"
            :title="'【' + item.Name + '】' +item.Summary"
            @click="enterDetail3(item)"
          >
            <a>
              <p class="newest-content-title">【{{ item.Name }}】{{ item.Summary }}</p>
              <p class="newest-content-author">{{item.Author}}</p>
              <div class="newest-content-price price-radius">¥{{item.Price}}</div>
              <div class="newest-content-img item-margin-20">
                <img v-lazy="item.Img ? item.Img : noBook" title=""/>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!-- 大中专教材 -->
    <div v-if="materialDataSlice.length && isHaveKeyprod">
      <div class="book-common-head clearfix">
        <div class="common-head-l">{{ materialData.ChannelName }}</div>
        <div class="common-head-r" @click="enterChannel('KeyProducts')">更多>></div>
      </div>
      <div class="newest-content major-content">
        <ul class="newest-content-ul clearfix">
          <li
            class="newest-content-item major-item"
            v-for="(item, index) in materialForData"
            :key="index"
            :title="'【' + item.Name + '】' +item.Summary"
            @click="enterDetail4(item)"
          >
            <a>
              <div class="newest-content-img">
                <img v-lazy="item.Img ? item.Img : noBook" title=""/>
              </div>
              <div class="newest-content-price">¥{{item.Price}}</div>
              <p class="newest-content-author">{{item.Author}}</p>
              <p class="newest-content-title">【{{ item.Name }}】{{ item.Summary }}</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!-- 多元产品 -->
    <div v-if="polybasicDataSlice.length && isHavePoly">
      <div class="book-common-head clearfix">
        <div class="common-head-l">{{ polybasicData.ChannelName }}</div>
        <div class="common-head-r" @click="enterChannel('MultiProduct')">更多>></div>
      </div>
      <div class="newest-content">
        <ul class="newest-content-ul clearfix">
          <li
            class="newest-content-item"
            v-for="(item, index) in polybasicForData"
            :class="{'m-t': index > 4}"
            :key="index"
            :title="'【' + item.Name + '】' +item.Summary"
            @click="enterDetail5(item.Id)"
          >
            <a>
              <div class="newest-content-img">
                <img v-lazy="item.Img ? item.Img : noBook" title=""/>
              </div>
              <p class="newest-content-title">【{{ item.Name }}】{{ item.Summary }}</p>
              <p class="newest-content-author">{{item.Author}}</p>
              <div class="newest-content-price">¥{{item.Price}}</div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { globelFnHanle } from "@/common/js/mixin.js";
import { fetchIndexShop, fetchIndexImg } from "../api";
import { getItem, authorFn } from "../common/js/util"

export default {
  name: "Home",
  data() {
    return {
      bannerTop: {},
      bannerMiddle: {},
      bannerBottom: {},
      newestData: {},
      newestDataSlice: [],
      bestSellData: {},
      bestSellDataSlice: [],
      themeActiveData: {},
      themeActiveDataSlice: [],
      KeyProductsData: {},
      KeyProductsDataSlice: [],
      materialData: {},
      materialDataSlice: [],
      polybasicData: {},
      polybasicDataSlice: [],
      isHavePoly: true,
      isHaveKeyprod: true,
      isHaveMate: true,
      isHaveActive: true,
      isHaveBestSale: true,
      isHaveNewest: true
    };
  },
  mixins: [globelFnHanle],
  created() {
    // 获取展示数据
    const fetch1 = fetchIndexShop()
      .then(this.globelReqHandle)
      .then(res => {
        console.log(res)
        let Data = res.Data;
        this.newestData = Data.filter(item => item.ChannelCode === "1")[0]; //最新图书
        this.bestSellData = Data.filter(item => item.ChannelCode === "2")[0]; //畅销图书
        this.KeyProductsData = Data.filter(item => item.ChannelCode === "4")[0]; //重点产品
        this.materialData = Data.filter(item => item.ChannelCode === "5")[0]; //大中专教材
        this.polybasicData = Data.filter(item => item.ChannelCode === "6")[0]; //多元产品

        this.newestDataSlice =
          this.newestData && Object.keys(this.newestData).length
            ? this.newestData.ChannelData
            : [];
        this.bestSellDataSlice =
          this.bestSellData && Object.keys(this.bestSellData).length
            ? this.bestSellData.ChannelData
            : [];
        this.KeyProductsDataSlice =
          this.KeyProductsData && Object.keys(this.KeyProductsData).length
            ? this.KeyProductsData.ChannelData
            : [];
        this.materialDataSlice =
          this.materialData && Object.keys(this.materialData).length
            ? this.materialData.ChannelData
            : [];
        this.polybasicDataSlice =
          this.polybasicData && Object.keys(this.polybasicData).length
            ? this.polybasicData.ChannelData
            : [];
      })
      .catch(this.globelErrHandle);
    //获取轮播图
    const fetch2 = fetchIndexImg()
      .then(this.globelReqHandle)
      .then(res => {
        console.log(res)
        let Data = res.Data;
        this.bannerTop = Data.filter(item => item.Position === "1")[0].Data;
        this.bannerMiddle = Data.filter(
          item => item.Position === "2"
        )[0].Data[0];
        this.bannerBottom = Data.filter(item => item.Position === "3")[0];
        // console.log(this.bannerTop, this.bannerMiddle, this.bannerBottom)
      })
      .catch(this.globelErrHandle);
    // 权限处理
    const User = getItem('BigUser');
    if(User) {
      const channelLimit = User.Function;

      this.isHavePoly = authorFn(channelLimit, '6');
      this.isHaveKeyprod = authorFn(channelLimit, '5');
      this.isHaveMate = authorFn(channelLimit, '4');
      this.isHaveActive = authorFn(channelLimit, '3');
      this.isHaveBestSale = authorFn(channelLimit, '2');
      this.isHaveNewest = authorFn(channelLimit, '1');
    }
  },
  computed: {
    ...mapState(["loading", "showNav", "noBook"]),
    newestForData: function() {
      if (this.newestDataSlice) {
        return this.newestDataSlice.slice(0, 5);
      }
    },
    bestSellForData: function() {
      if (this.bestSellDataSlice) {
        return this.bestSellDataSlice.slice(0, 5);
      }
    },
    KeyProductsForData: function() {
      if (this.KeyProductsDataSlice) {
        return this.KeyProductsDataSlice.slice(0, 5);
      }
    },
    materialForData: function() {
      if (this.materialDataSlice) {
        return this.materialDataSlice.slice(0, 4);
      }
    },
    polybasicForData: function() {
      if (this.polybasicDataSlice) {
        return this.polybasicDataSlice.slice(0, 10);
      }
    }
  },
  methods: {
    ...mapMutations(["setLoading", "setShowNav", "updateNavIndex"]),
    enterDetail1(item) {
      this.$router.push({
        name: 'DetailPage',
        params: {
          channel: 'general',
          category: '1',
          id: item.Id
        }
      })
      window.scroll(0, 0)
    },
    enterDetail2(item) {
      this.$router.push({
        name: 'DetailPage',
        params: {
          channel: 'general',
          category: '2',
          id: item.Id
        }
      })
      window.scroll(0, 0)
    },
    enterDetail3(item) {
      this.$router.push({
        name: 'DetailPage',
        params: {
          channel: 'general',
          category: '4',
          id: item.Id
        }
      })
      window.scroll(0, 0)
    },
    enterDetail4(item) {
      this.$router.push({
        name: 'DetailPage',
        params: {
          channel: item.IsKg === '1' ? 'available' : 'unAvailable',
          category: '5',
          id: item.Id
        }
      })
      window.scroll(0, 0)
    },
    enterDetail5(id) {
      this.$router.push({
        name: 'DetailPage',
        params: {
          channel: 'multi',
          category: '6',
          id: id
        }
      })
      window.scroll(0, 0)
    },
    enterChannel(channel) {
      this.$router.push({
        name: channel
      })
      window.scroll(0, 0)
    },
    enterThemeActiveLeaf(id) {
      this.$router.push({
        name: 'ThemeActiveLeaf',
        params: {
          activeId: id
        }
      })
      window.scroll(0, 0)
      this.updateNavIndex("4")
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../common/css/_var";

.home-index {
  padding-bottom: 50px;
}

/*公共适用需要部分*/
.item-margin-20 {
  margin-top: 20px;
}
.price-radius {
  display: inline-block;
  width: auto;
  padding: 0 7px;
  border-radius: 10px;
  background: $theme_color;
  color: white !important;
  font-size: 14px !important;
  text-align: center;
  line-height: 18px;
}
.major-content .major-item {
  width: 265px;
  margin-right: 46px;
  &:last-child {
    margin-right: 0;
  }
  .newest-content {
    &-img {
      width: 220px;
      height: 220px;
      & img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    &-title {
      font-size: $font-16;
      height: 36px;
    }
    &-author {
      font-size: $font-16;
      text-align: center;
    }
    &-price {
      font-size: $font-20;
      text-align: center;
    }
  }
}

.banner-img {
  width: 100%;
  height: 428px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  cursor: pointer;
}

.newest-title {
  width: 1200px;
  margin: 30px auto 20px auto;
  font-size: $font-24;
  color: $theme_color;
  & h3 {
    margin-left: 6px;
    float: left;
  }
}
.newest-icon {
  width: 20px;
  height: 30px;
  margin-left: 530px;
  float: left;
  background-image: url("../assets/newest-icon.png");
}
.m-t{
  margin-top: 20px;
}
.newest-content {
  a {
    text-decoration: none;
  }
  width: 1200px;
  height: auto;
  margin: 0 auto;
  &-item {
    float: left;
    cursor: pointer;
    padding: 20px;
    width: 224px;
    border: 1px solid $border_E6;
    margin-right: 20px;
    transition: border-color 0.5s cubic-bezier(0.23, 0.24, 1, 0.74),
      box-shadow 0.5s cubic-bezier(0.23, 0.24, 1, 0.74);
    &:hover {
      border: 1px solid $theme_color;
      box-shadow: 0 0 10px rgba(255, 38, 38, 0.3);
    }
    &:nth-child(5n) {
      margin-right: 0;
    }
  }
  &-img {
    width: 184px;
    height: 184px;
    text-align: center;
    & img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  &-title {
    font-size: $font-14;
    line-height: 18px;
    height: 36px;
    overflow: hidden;
    margin-top: 16px;
  }
  &-author {
    margin-top: 6px;
    height: 14px;
    font-size: $font-14;
    color: $font_color_999;
  }
  &-price {
    font-size: $font-18;
    color: $theme_color;
    margin-top: 10px;
  }
}

.banner-long-img {
  width: 1200px;
  height: 90px;
  margin: 0 auto;
  cursor: pointer;
  & img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.banner-long {
  margin-top: 20px;
  .el-carousel {
    width: 1200px;
    margin: 0 auto;
  }
}

.book-common-head {
  width: 1200px;
  margin: 30px auto 20px auto;
  height: 24px;
  .common-head {
    &-l {
      float: left;
      font-size: $font-24;
      color: $theme_color;
      border-left: 4px solid $theme_color;
      padding-left: 10px;
    }
    &-r {
      float: right;
      font-size: $font-16;
      color: $font_color_999;
      cursor: pointer;
      &:hover{
        color: $theme_color;
      }
    }
  }
}
.banner-l-content {
  .el-carousel {
    width: 590px;
    margin: 0 auto;
    margin-right: 90px;
    float: left;
  }
  .newest-content-item:nth-child(2) {
    margin-right: 0;
  }
  .newest-content-item:nth-child(3) {
    margin-right: 0;
  }
  .newest-content-item:nth-child(5) {
    margin-right: 20px;
  }
  .newest-content-item:nth-child(7) {
    margin-right: 0;
  }
}
.banner-left-img {
  width: 730px;
  height: 320px;
  float: left;
  cursor: pointer;
  & img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.banner-book-activity {
  margin-left: 10px;
}
/* 最新更多 */
.newest-l{
  float: left;
}
.newest-more{
  font-size: 16px;
  color: $font_color_999;
  cursor: pointer;
  float: right;
  line-height: 30px;
  &:hover{
    color: $theme_color;
  }
}
</style>
