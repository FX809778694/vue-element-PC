<!--
 Created by Thomas on 2018/7/6.
 详情组件
 -->
<template>
  <div class="detail-content clearfix">
    <div class="clearfix">
      <div class="detail-content-l fl">
        <div class="magnifier-show" ref="show">
          <div class="magnifier-small" ref="small">
            <img ref="newSmallImg" class="min_img" :src="(!defaultImg ? 'http://dtimg.aoshidata.com/common/no-book.png': defaultImg)">
          </div>
          <div class="magnifier-move" ref="move"></div>
          <div class="magnifier-big" ref="big">
            <img ref="newBigImg" :src="(!defaultImg ? 'http://dtimg.aoshidata.com/common/no-book.png': defaultImg)" alt="">
          </div>
        </div>
        <div class="img_tab">
          <!--<i class="icon-arrow icon-left" @click="magnierLeft" ref="iconleft"></i>-->
          <div class="img_con clearfix">
            <!-- 详情小图 -->
            <ul class="clearfix"
                ref="imgList"
                style="left: 0;">
              <li
                v-for="(item, index) in bookDetail.Image"
                :key="index"
              >
                <img class="commodity_details-img" @mousemove="imgMousemove" :src="(item==='' ? 'http://dtimg.aoshidata.com/common/no-book.png':item)">
              </li>
            </ul>
          </div>
          <!--<i class="icon-arrow icon-right" @click="magnierRight" ref="iconRight"></i>-->
        </div>
      </div>

      <div class="detail-content-r fl">
        <!-- 业务员联系方式 -->
        <div class="sales clearfix">
          <h3 class="fl">联系方式</h3>
          <div style="margin-left: 210px; margin-right: 20px" class="sales-content fl">
            <div class="content-item clearfix" @click="switchContact()">
              <div class="click-item">
                <p class="fl">区域业务员</p>
                <div class="content-img fr">
                  <img src="../assets/invalid-arrow.png" />
                </div>
              </div>
            </div>
            <div class="sales-contact" v-if="activeContact">
              <el-collapse v-model.trim="activeName" accordion>
                <el-collapse-item
                  v-for="(item, index) in areaData"
                  :title="item.name"
                  :name="item.code"
                  :key="index"
                >
                  <div class="contact-item-l" v-for="(val, num) in item.Data" :key="num">
                    <h3>{{val.AreaName}}区业务员:</h3>
                    <div class="contact-item">
                      <div class="qq-item clearfix">
                        <div class="qq-item-img fl">
                          <img src="../assets/portrait.png" />
                        </div>
                        <div class="qq-item-c fl">{{val.Name}}</div>
                      </div>
                      <div class="qq-item clearfix">
                        <div class="qq-item-img fl">
                          <img src="../assets/call.png" />
                        </div>
                        <div class="qq-item-c fl">{{val.Tel}}</div>
                      </div>
                      <div class="qq-item clearfix">
                        <div class="qq-item-img fl">
                          <img src="../assets/qq.png" />
                        </div>
                        <div class="qq-item-c fl">{{val.QQ}}</div>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
          <div class="sales-content fl">
            <div class="content-item clearfix" @click="switchClassContact()">
              <p class="fl">品类业务员</p>
              <div class="content-img fr">
                <img src="../assets/invalid-arrow.png" />
              </div>
            </div>
            <!-- 品类业务员块 -->
            <div class="class-sales-contact"
                 v-if="activeClassContact">
              <div
                class="contact-item"
                 v-for="(item, index) in typeData"
                 :key="index"
              >
                <div class="qq-item clearfix">
                  <div class="qq-item-img fl">
                    <img src="../assets/portrait.png" />
                  </div>
                  <div class="qq-item-c fl">{{item.Name}}</div>
                </div>
                <div class="qq-item clearfix">
                  <div class="qq-item-img fl">
                    <img src="../assets/call.png" />
                  </div>
                  <div class="qq-item-c fl">{{item.MobilePhone}}</div>
                </div>
                <div class="qq-item clearfix">
                  <div class="qq-item-img fl">
                    <img src="../assets/qq.png" />
                  </div>
                  <div class="qq-item-c fl">{{item.QQ}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="clearfix">
          <h3 class="fl">{{bookDetail.Name}}</h3>
          <p v-if="unAvailable" class="un-available fl">不可供原因：</p>
        </div>
        <div class="detail-content-pink">
          <div class="detail-content-price">
            价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格
            <span>¥{{bookDetail.Price}}</span>
          </div>
        </div>
        <div class="detail-content-pink" v-if="!multi" style="margin-top: 0">
          <div class="detail-content-stock">
            <div class="detail-content-stock-item">
              <span>本店库存<i></i></span>
              <p>{{bookDetail.ShopKc}}本</p>
            </div>
            <div class="detail-content-stock-item">
              <span>总部库存<i></i></span>
              <p>{{bookDetail.CompanyKc}}本</p>
            </div>
          </div>
        </div>
        <div v-if="!multi" class="detail-content-tag">
          <div class="detail-content-r-item">
            <span>出版社<i></i></span>
            <p>{{bookDetail.Publisher}}</p>
          </div>
          <div class="detail-content-r-item">
            <span>出版日期<i></i></span>
            <p>{{bookDetail.PublishTime}}</p>
          </div>
          <div class="detail-content-r-item">
            <span>作者<i></i></span>
            <p>{{bookDetail.Author}}</p>
          </div>
          <div v-if="available" class="detail-content-num">
            <span class="detail-content-num-p">数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量</span>
            <el-input-number :min="1" size="mini" v-model.trim="num"></el-input-number>
          </div>
          <div v-if="available" class="detail-content-r-item clearfix" style="margin-top: 10px">
            <span class="fl" style="margin-top: 6px">订货要求<i></i></span>
            <div class="detail-remark fl">
              <el-tooltip class="item" effect="light" placement="top">
                <div slot="content">{{bookDetail.Remark}}</div>
                <el-input
                  v-model.trim="bookDetail.Remark"
                  size="mini"
                  placeholder="请输入订货要求"
                  clearable>
                </el-input>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div v-else class="detail-content-tag">
          <div class="detail-content-r-item">
            <span>类型<i></i></span>
            <p>{{bookDetail.Type}}</p>
          </div>
          <div class="detail-content-r-item">
            <span>规格<i></i></span>
            <p>{{bookDetail.Specification}}</p>
          </div>
          <div class="detail-content-r-item">
            <span>品牌<i></i></span>
            <p>{{bookDetail.Brand}}</p>
          </div>
          <div class="detail-content-r-item">
            <span>包装<i></i></span>
            <p>{{bookDetail.Package}}</p>
          </div>
        </div>
        <a v-if="available" class="detail-content-btn">加入购物车</a>
      </div>
    </div>
    <!-- 放大镜下方 -->
    <div v-if="!multi">
      <div class="detail-content-main">
        <span>商品详情</span>
      </div>
      <div class="detail-content-main-dd clearfix">
        <dl class="clearfix">
          <dt class="fl">ISBN：</dt>
          <dd class="fl">{{bookDetail.Isbn}}</dd>
        </dl>
        <dl class="clearfix">
          <dt class="fl">字数：</dt>
          <dd class="fl">{{bookDetail.Word}}</dd>
        </dl>
        <dl class="clearfix">
          <dt class="fl">版次/印次：</dt>
          <dd class="fl">{{bookDetail.Edition}}</dd>
        </dl>
        <dl class="clearfix">
          <dt class="fl">从套书名：</dt>
          <dd class="fl">{{bookDetail.ParSeriesTitle}}</dd>
        </dl>
        <dl class="clearfix">
          <dt class="fl">图书类型：</dt>
          <dd class="fl">{{bookDetail.ParSeriesTitle}}</dd>
        </dl>
        <dl class="clearfix">
          <dt class="fl">开本：</dt>
          <dd class="fl">{{bookDetail.BookSize}}</dd>
        </dl>
        <dl class="clearfix" title="123123123">
          <dt class="fl">商品重量：</dt>
          <dd class="fl">{{bookDetail.Weight}}</dd>
        </dl>
        <dl class="clearfix" v-if="isStock">
          <dt class="fl">首次到货时间：</dt>
          <dd class="fl">{{bookDetail.FirstTime}}</dd>
        </dl>
        <dl class="clearfix" v-if="isStock">
          <dt class="fl">商品ID/征订代码：</dt>
          <dd class="fl">{{bookDetail.Id}}</dd>
        </dl>
        <dl class="clearfix">
          <dt class="fl">规格：</dt>
          <dd class="fl">{{bookDetail.Package}}</dd>
        </dl>
      </div>
      <div class="detail-content-mt">
        <h3><span>目录<i></i></span></h3>
      </div>
      <div class="detail-content-mc">
        <p v-if="bookDetail.Catalog ">{{ bookDetail.Catalog }}</p>
        <p v-else>暂无内容</p>
      </div>
      <div class="detail-content-mt">
        <h3><span>编辑推荐<i></i></span></h3>
      </div>
      <div class="detail-content-mc">
        <p v-if="bookDetail.Recommend">{{ bookDetail.Recommend }}</p>
        <p v-else>暂无内容</p>
      </div>
      <div class="detail-content-mt">
        <h3><span>文摘<i></i></span></h3>
      </div>
      <div class="detail-content-mc">
        <p v-if="bookDetail.Abslan">{{ bookDetail.Abslan }}</p>
        <p v-else>暂无内容</p>
      </div>
      <div class="detail-content-mt">
        <h3><span>序言<i></i></span></h3>
      </div>
      <div class="detail-content-mc">
        <p v-if="bookDetail.Preface">{{ bookDetail.Preface }}</p>
        <p v-else>暂无内容</p>
      </div>
    </div>
  </div>

</template>
<script>
import { mapState, mapMutations } from "vuex";
import { fetchBookDetail, fetchContact, fetchBookMultiDetail } from "../api";
import { globelFnHanle } from "@/common/js/mixin.js";

export default {
  name: "DetailPage",
  data() {
    return {
      bookDetail: {},
      defaultImg: "",
      num: "111",
      //详情判断
      available: false,
      unAvailable: false,
      general: false,
      multi: false,
      activeContact: false,
      activeClassContact: false,
      activeName: "1",
      areaData: [], //区域业务员
      typeData: [], //品类业务员
    };
  },
  mixins: [globelFnHanle],
  created() {
    // available：大中专可供，unAvailable：大中专不可供，multi： 多元，general：其他
    const { channel, category } = this.$route.params;

    if (channel === "available") {
      this.available = true;
    } else if (channel === "unAvailable") {
      this.unAvailable = true;
    } else if (channel === "general") {
      this.general = true;
    } else {
      this.multi = true;
    }

    this.activeName = this.$route.params.category;

    const id = this.$route.params.id;
    const type = this.$route.params.category;
    let params = {
      Data: {
        Spxxid: id,
        Type: ""
      }
    };

    switch (category) {
      case "1":
        this.updateNavIndex("2");
        break;
      case "2":
        this.updateNavIndex("3");
        break;
      case "3":
        this.updateNavIndex("4");
        break;
      case "4":
        this.updateNavIndex("5");
        break;
      case "5":
        this.updateNavIndex("6");
        break;
      case "6":
        this.updateNavIndex("7");
        break;
    }

    this.getContact(params);
  },
  computed: {
    ...mapState([
      "isStock"
    ]),
  },
  mounted() {
    const { id, channel } = this.$route.params;
    // console.log(id, channel)
    let params;
    if (this.multi) {
      params = {
        Id: id
      };
      fetchBookMultiDetail(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.bookDetail = res.Data;
          this.defaultImg = this.bookDetail.Image[0];
        })
        .catch(this.globelErrHandle);
    } else {
      params = {
        Data: {
          Id: id
        }
      };
      fetchBookDetail(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.bookDetail = res.Data;
          // console.log(this.bookDetail)
          this.defaultImg = this.bookDetail.Image[0];
        })
        .catch(this.globelErrHandle);
    }

    // this.magnifier();
  },
  methods: {
    ...mapMutations(["updateNavIndex"]),
    // magnifier() {
    //   let show = this.$refs.show;
    //   let move = this.$refs.move;
    //   let big = this.$refs.big;
    //   let bigImg = big.children[0];
    //   show.onmousemove = function(e) {
    //     move.style.display = "block";
    //     big.style.display = "block";
    //
    //     let event = e || window.event;
    //
    //     let newLeft = event.pageX - show.offsetLeft - move.offsetWidth / 2;
    //     let newTop = event.pageY - show.offsetTop - move.offsetHeight / 2;
    //     if (newLeft > show.offsetWidth - move.offsetWidth) {
    //       newLeft = show.offsetWidth - move.offsetWidth - 2;
    //     }
    //     if (newLeft < 0) {
    //       newLeft = 0;
    //     }
    //     if (newTop > show.offsetHeight - move.offsetHeight) {
    //       newTop = show.offsetHeight - move.offsetHeight - 2;
    //     }
    //     if (newTop < 0) {
    //       newTop = 0;
    //     }
    //     move.style.left = newLeft + "px";
    //     move.style.top = newTop + "px";
    //     let bigImgLeft = newLeft * bigImg.offsetWidth / show.offsetWidth;
    //     let bigImgTop = newTop * bigImg.offsetHeight / show.offsetHeight;
    //     bigImg.style.left = -bigImgLeft + "px";
    //     bigImg.style.top = -bigImgTop + "px";
    //   };
    //   show.onmouseout = function() {
    //     move.style.display = "none";
    //     big.style.display = "none";
    //   };
    // },
    // magnierLeft() {
    //   let ul = this.$refs.imgList;
    //   let left = parseInt(this.$refs.imgList.style.left);
    //
    //   if (left !== 0) {
    //     if (!parseInt(ul.style.left)) return;
    //     ul.style.left = left + 345 + "px";
    //   }
    // },
    // magnierRight() {
    //   let ul = this.$refs.imgList;
    //   let times = Math.ceil(ul.children.length / 5);
    //   let left = parseInt(this.$refs.imgList.style.left);
    //   let width = parseInt(this.$refs.imgList.style.width);
    //
    //   if (-top !== width - 345) {
    //     if (-parseInt(ul.style.left) / 345 + 1 >= times) return;
    //     ul.style.left = -345 + left + "px";
    //   }
    // },
    imgMousemove($event) {
      let imgSrc = $event.target.src;
      this.$refs.newSmallImg.src = imgSrc;
      this.$refs.newBigImg.src = imgSrc;
    },
    switchContact() {
      if (this.activeContact) {
        this.activeContact = false;
      } else {
        this.activeContact = true;
      }
    },
    switchClassContact() {
      if (this.activeClassContact) {
        this.activeClassContact = false;
      } else {
        this.activeClassContact = true;
      }
    },
    getContact(params) {
      fetchContact(params)
        .then(this.globelReqHandle)
        .then(res => {
          console.log("业务员数据", res.Data);
          // 数据整理
          let areaData = res.Data.Area;

          let areaDataArray = [];
          const nameArray = [
            {
              name: "最新图书",
              code: "1"
            },
            {
              name: "畅销图书",
              code: "2"
            },
            {
              name: "主题活动",
              code: "3"
            },
            {
              name: "重点产品",
              code: "4"
            },
            {
              name: "大中专教材",
              code: "5"
            },
            {
              name: "多元产品",
              code: "6"
            }
          ];
          nameArray.map(item => {
            areaDataArray.push({
              name: item.name,
              code: item.code,
              Data: areaData.filter(val => val.ChannelCode === item.code)
            });
          });
          console.log(areaDataArray);
          this.areaData = areaDataArray;
          this.typeData = res.Data.Type
        })
        .catch(this.globelErrHandle);
    }
  }
};
</script>
<style lang="scss">
@import "../common/css/_var";
@import "../common/css/mixin/text_overflow";

.detail-content {
  width: 1200px;
  margin: 0 auto;
  margin-top: 20px;
  & a {
    text-decoration: none;
  }
  .magnifier {
    width: 452px;
    height: 452px;
    border: 1px solid $bor-color-e7e3;
    padding: 25px;
  }
  &-r {
    width: 700px;
    margin-left: 20px;
    padding-top: 20px;
    & h3 {
      font-size: $font-18;
      color: $font_color_333;
    }
    &-item {
      width: 500px;
      font-size: $font-14;
      color: $font_color_666;
      line-height: 16px;
      padding-left: 20px;
      & span {
        margin-right: 10px;
        width: 70px;
        display: inline-block;
        text-align: justify;
        color: $font_color_999;
        & i {
          display: inline-block;
          padding-left: 100%;
        }
      }
      & p {
        float: right;
        text-align: left;
        width: 400px;
      }
    }
  }
  &-tag {
    margin-bottom: 20px;
    margin-top: 36px;
  }
  &-pink {
    margin-top: 20px;
    border-top: 1px solid $theme_color;
  }
  &-price {
    font-size: $font-14;
    color: $font_color_666;
    height: 64px;
    line-height: 64px;
    background-color: rgba(255, 33, 33, 0.05);
    padding-left: 20px;
    & span {
      margin-left: 10px;
      font-size: $font-22;
      color: $theme_color;
    }
  }
  &-stock {
    font-size: $font-14;
    color: $font_color_666;
    height: 84px;
    line-height: 84px;
    background-color: rgba(255, 33, 33, 0.05);
    padding-left: 20px;
    padding-top: 20px;
    &-item {
      width: 500px;
      font-size: $font-14;
      color: $font_color_666;
      line-height: 16px;
      & span {
        margin-right: 10px;
        width: 70px;
        display: inline-block;
        text-align: justify;
        color: $font_color_999;
        & i {
          display: inline-block;
          padding-left: 100%;
        }
      }
      & p {
        float: right;
        text-align: left;
        width: 400px;
      }
    }
  }
  &-num {
    padding-left: 20px;
    &-p {
      color: $font_color_999;
      font-size: $font-14;
      margin-right: 10px;
    }
  }
  &-btn {
    width: 180px;
    height: 40px;
    line-height: 40px;
    background: $theme_color;
    border-radius: 4px;
    color: $font_color_fff;
    font-size: $font-20;
    display: block;
    text-align: center;
    cursor: pointer;
    margin: 50px 0 0 20px;
  }

  &-main {
    width: 100%;
    height: 38px;
    border-bottom: 1px solid $theme_color;
    background: $bg_color_F9;
    margin-top: 20px;
    & span {
      display: block;
      width: 106px;
      height: 38px;
      text-align: center;
      font-size: 16px;
      line-height: 38px;
      color: $font_color_fff;
      background-color: $theme_color;
      letter-spacing: normal;
    }
    &-dd {
      width: 100%;
      text-align: justify;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 2;
      padding: 20px;
      margin-bottom: 40px;
      color: #666;
      letter-spacing: normal;
      & dl {
        float: left;
        width: 340px;
        margin: 0 12px;
      }
      & dd {
        width: 200px;
        @include text-overflow;
      }
    }
  }

  &-mt {
    height: 25px;
    border-bottom: 1px solid $bor-color-e7e3;
    & h3 {
      line-height: 28px;
      width: 99px;
      height: 25px;
      overflow: hidden;
      font-size: $font-14;
      color: $font_color_333;
      padding-left: 10px;
      background: url("../assets/detail-arrow.png") no-repeat;
      text-align: justify;
      & span {
        width: 56px;
        display: inline-block;
        text-align: justify;
        & i {
          display: inline-block;
          padding-left: 100%;
        }
      }
    }
  }
  &-mc {
    padding: 20px;
    font-size: $font-14;
    line-height: 1.6;
  }
  .un-available {
    font-size: $font-14;
    color: $font_color_999;
    margin-top: 4px;
    margin-left: 8px;
  }
  /* 业务员联系方式 */
  .sales {
    height: 40px;
    margin-bottom: 10px;
    & h3 {
      display: block;
      font-size: 18px;
      color: #333;
      line-height: 40px;
      font-weight: bold;
    }
    .sales-content {
      cursor: pointer;
      margin-top: 10px;
      position: relative;
      .content-item {
        position: relative;
        width: 180px;
        height: 24px;
        border-radius: 12px;
        background-color: #f9f9f9;
        border: 1px solid #f1f1f1;
        text-align: center;
        line-height: 24px;
        .click-item {
          display: block;
          width: 100%;
        }
        & p {
          margin-left: 40px;
        }
      }
      .content-img {
        width: 8px;
        height: 6px;
        margin-top: 8px;
        margin-right: 20px;
        & img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
    /* 展示块 */
    .sales-contact {
      position: absolute;
      width: 160px;
      top: 24px;
      left: 12px;
      padding: 20px;
      box-shadow: 0 2px 10px 0 rgba(13, 13, 13, 0.03);
      background-color: #ffffff;
      border: solid 1px #f1f1f1;
    }
    /* 品类业务员 */
    .class-sales-contact {
      position: absolute;
      width: 160px;
      top: 24px;
      left: 12px;
      padding: 20px;
      box-shadow: 0 2px 10px 0 rgba(13, 13, 13, 0.03);
      background-color: #ffffff;
      border: solid 1px #f1f1f1;
    }
  }
  /* 联系方式列表条目 */
  .contact-item {
    &-l {
      & h3 {
        color: #ff2626;
        font-size: 14px;
      }
    }
    .qq-item {
      height: 30px;
      line-height: 30px;
      &-img {
        width: 15px;
        height: 16px;
        margin-top: 6px;
        & img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      &-c {
        font-size: 14px;
        margin-left: 4px;
        color: #333;
      }
    }
  }
}
#_magnifier_layer {
  border: 1px solid $bor-color-e7e3;
}
//  放大镜
.magnifier {
  .min_img {
    width: 100%;
    display: block;
    height: 100%;
  }
  &-show {
    position: relative;
  }
  &-small {
    width: 450px;
    height: 450px;
    border: 1px solid #ddd;
    & img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  &-big {
    width: 450px;
    height: 450px;
    z-index: 666;
    background: white;
    border: 1px solid #ccc;
    top: 0;
    position: absolute;
    left: 470px;
    overflow: hidden;
    display: none;
    & img {
      position: absolute;
    }
  }
  &-move {
    width: 210px;
    height: 210px;
    background: rgba(252, 241, 31, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    cursor: move;
    display: none;
  }
}
.img_tab {
  width: 450px;
  height: 65px;
  margin-top: 30px;

  .icon-arrow {
    width: 50px;
    height: 65px;
    line-height: 60px;
    cursor: pointer;
  }
  .icon-left {
    background: url("../assets/arrow-left.png");
    background-repeat: no-repeat;
    background-position: center center;
    float: left;
  }
  .icon-right {
    background: url("../assets/arrow-right.png");
    background-repeat: no-repeat;
    background-position: center center;
    float: right;
  }
  .img_con {
    position: relative;
    float: left;
    width: 345px;
    height: 69px;
    margin-left: 50px;
    overflow: hidden;

    ul {
      position: absolute;
      top: 0;
      left: 0;
      transition: all 0.6s;
      width: 20000px;
      li {
        float: left;
        border: 2px solid #ddd;
        margin-right: 4px;
        &:last-child {
          margin-right: 0;
        }
        img {
          width: 55px;
          height: 57px;
          margin: 3px;
        }

        &:hover {
          border: 2px solid $theme_color;
        }
      }
    }
  }
}
.detail-remark {
  width: 134px;
}
</style>
