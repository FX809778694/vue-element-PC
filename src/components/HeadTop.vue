<template>
  <div class="header_wrap clearfix">
    <!-- 头部操作模块 -->
    <div class="header_wrap-nav">
      <header>
        <nav class="clearfix">
          <div class="nav_left fl">
            <a v-if="!isLogin" @click="$router.push({ name: 'Login'} )" href="javascript:;">请登录</a>
            <el-popover
              v-else
              class="clearfix"
              trigger="hover"
              placement="top"
            >
              <p>账号：{{ UserId }}</p>
              <p>单位：{{ CompanyName }}</p>
              <p v-if="!account">所属主账号：{{ FatherUserId }}</p>
              <p slot="reference" class="fl">
                <span class="fl">您好，<i style="color: #ff2626">{{ UserId }} </i>{{welcomeWord}}</span>
              </p>
            </el-popover>
            <a @click="handleLogout" v-if="isLogin" type="text" class="btn_logout fr">退出登录</a>
          </div>
          <div class="nav_right fr">
            <ul class="fl">
              <li class="fl" v-if="isHome">
                <a @click="$router.push({ name: 'Home' })" style="color: #FF2626">首页</a>
              </li>
              <li class="fl">
                <a @click="$router.push({ name: 'MyOrder' })">我的订单</a>
              </li>
              <li @click="$router.push({ name: 'ShopCart' });" class="fl">
                <img src="../assets/shop_car.png" alt="" width="14" height="12"><a href="javascript:;">购物车</a>
              </li>
              <li class="fl" v-if="account"><a @click="$router.push({ name: 'SubAccount' })">子账号信息</a></li>
            </ul>
            <p class="fl">
              <img src="../assets/customer_service.png" alt="" width="12" height="12">
              <a
                class="service-btn"
              >
                客服
                <div class="service-content">
                  <ul>
                    <li
                      v-for="(item, index) in channelData"
                      :key="index"
                      @click="$router.push( { name: 'Service', params:{ channel: item.code } })"
                    >{{item.name}}</li>
                  </ul>
                </div>
              </a>
            </p>
          </div>
        </nav>
      </header>
    </div>
    <!-- 搜索模块 -->
    <div class="search_wrap clearfix" v-if="showSearch">
      <h1 class="fl">
        <a @click="$router.push({name: 'Home'})" class="logo"></a>
      </h1>
      <!-- 搜索框部分 -->
      <div class="wrap_right fr">
        <div class="search_cont">
          <div class="cont_top clearfix">
            <el-autocomplete
              ref="globelSearch"
              class="search_input fl"
              popper-class="my-autocomplete"
              v-model.trim="searchTxt"
              :fetch-suggestions="querySearchAsync"
              :placeholder="placeholder"
              :trigger-on-focus="false"
              @select="handleSelect"
              @keyup.enter.native="toSearchDetail(searchTxt)"
            >
              <template slot-scope="{ item }">
                <div class="name">{{ getVal(item, 'Name') }}</div>
                <span class="isbn">{{ getVal(item, 'Isbn') }}</span>
              </template>
            </el-autocomplete>
            <el-button @click="toSearchDetail(searchTxt)" class="btn_search fl" size="medium" type="primary">搜索</el-button>
            <a class="btn_import_goods fl" @click="uploadGoods">导入商品搜索</a>
          </div>
          <!-- 搜索历史 / 热词 -->
          <ul class="cont_bottom clearfix">
            <li v-for="(item, index) in hotWord" :key="index" class="fl">
              <a v-if="!isSearchDetail" @click="toHotWordPage(item)" href="javascript:;">{{ item }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 导航栏 -->
    <div v-if="showNav" class="nav_wrap">
      <nav-menu class="nav clearfix" :defaultActive="activeNav">
        <menu-item index="1" @click.stop="toDemo('Home', '')">
          <a href="javascript:;">首页</a>
        </menu-item>
        <menu-item index="2" v-if="isHaveNewest">
          <a href="javascript:;" @click.stop="toDemo('Newest', '1')">
            最新图书
          </a>
          <div class="sub-channel" v-if="newestData.length > 0">
            <ul>
              <li style="margin-top: 10px"
                  v-for="(item, index) in newestData"
                  @click.stop="toDemo('Newest', item.Code)"
                  :key="index"
              >{{item.Name}}</li>
            </ul>
          </div>
        </menu-item>
        <menu-item index="3" v-if="isHaveBestSale" @click="toDemo('BestSell', '2')">
          <a href="javascript:;">畅销图书</a>
          <div class="sub-channel" v-if="bestsaleData.length > 0">
            <ul>
              <li style="margin-top: 10px"
                  v-for="(item, index) in bestsaleData"
                  @click.stop="toDemo('BestSell', item.Code)"
                  :key="index"
              >{{item.Name}}</li>
            </ul>
          </div>
        </menu-item>
        <menu-item index="4" v-if="isHaveActive" @click="toDemo('ThemeActive', '3')">
          <a href="javascript:;">主题活动</a>
          <div class="sub-channel" v-if="activeData.length > 0">
            <ul>
              <li style="margin-top: 10px"
                  v-for="(item, index) in activeData"
                  @click.stop="toDemo('ThemeActiveLeaf', item.Code)"
                  :key="index"
              >{{item.Name}}</li>
            </ul>
          </div>
        </menu-item>
        <menu-item index="5" v-if="isHaveMate" @click="toDemo('Material', '4')">
          <a href="javascript:;">重点产品</a>
          <div class="sub-channel" v-if="materialData.length > 0">
            <ul>
              <li style="margin-top: 10px"
                  v-for="(item, index) in materialData"
                  @click.stop="toDemo('Material', item.Code)"
                  :key="index"
              >{{item.Name}}</li>
            </ul>
          </div>
        </menu-item>
        <menu-item index="6" v-if="isHaveKeyprod" @click="toDemo('KeyProducts', '5')">
          <a href="javascript:;">大中专教材</a>
          <div class="sub-channel" v-if="keyproductData.length > 0">
            <ul>
              <li style="margin-top: 10px"
                  v-for="(item, index) in keyproductData"
                  @click.stop="toDemo('KeyProducts', item.Code)"
                  :key="index"
              >{{item.Name}}</li>
            </ul>
          </div>
        </menu-item>
        <menu-item index="7" v-if="isHavePoly" @click="toDemo('MultiProduct', '6')">
          <a href="javascript:;">多元产品</a>
          <div class="sub-channel" v-if="polybasicData.length > 0">
            <ul>
              <li style="margin-top: 10px"
                  v-for="(item, index) in polybasicData"
                  @click.stop="toDemo('MultiProduct', item.Code)"
                  :key="index"
              >{{item.Name}}</li>
            </ul>
          </div>
        </menu-item>
      </nav-menu>
    </div>
    <!-- 导入商品搜索弹框 -->
    <el-dialog title="导入商品信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="导入文件">
          <el-upload
            ref="upload"
            action="http://200.1.3.234/bigcus/api/Good/ImportQuery"
            :data="uploadData"
            class="upload-demo"
            drag
            :on-success="handleUploadSuccess"
            :on-error="handleUploadFailed"
            :auto-upload="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传 xls 表格文件。</div>
            <div class="el-upload__file-template clearfix" slot="tip">
              <div class="">
                <span>导入搜索（Excel模板）</span>
                <a style="color: #ff2626;font-weight: bold" href="http://opbsb.etjbooks.com.cn/ModelFiles/excel" target="_blank">下载</a>
              </div>
              <div class="">
                <span>导入搜索（MARC模板）</span>
                <a style="color: #ff2626;font-weight: bold" href="http://opbsb.etjbooks.com.cn/ModelFiles/marc" target="_blank">下载</a>
              </div>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { globelFnHanle } from "@/common/js/mixin.js";
import { GetMainHotWord, SearchBook, loginOutApi, getChannelApi } from "../api";
import NavMenu from "./nav/Menu";
import MenuItem from "./nav/MenuItem";
import { getItem, removeItem, authorFn } from "../common/js/util";

export default {
  name: "HeadTop",
  data() {
    return {
      searchTxt: "",
      SearchCondition: null,
      hotWord: [],
      placeholder: "商品名称/出版社名称/作者/ISBN",
      //导入搜索弹框
      dialogTableVisible: false,
      dialogFormVisible: false,
      UserId: "",
      CompanyName: '',
      FatherUserId: "",
      account: false,
      welcomeWord: '',
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      uploadData: {
        Type: "1"
      },
      isShowService: false,
      channelData: [
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
      ],
      isHavePoly: true,
      isHaveKeyprod: true,
      isHaveMate: true,
      isHaveActive: true,
      isHaveBestSale: true,
      isHaveNewest: true,
      isLogin: false,
      newestData: [],
      bestsaleData: [],
      activeData: [],
      materialData: [],
      keyproductData: [],
      polybasicData: [],
    };
  },
  components: { NavMenu, MenuItem },
  mixins: [globelFnHanle],
  watch: {
    activeNav: function(val, oldVal) {
      if (val === "7") {
        this.placeholder = "商品名称";
      } else {
        this.placeholder = "商品名称/出版社名称/作者/ISBN";
      }
    }
  },
  computed: {
    ...mapState([
      "loading",
      "showNav",
      "Search",
      "navActiveIndex",
      "mainAccount",
      "isHome",
      "showSearch",
      "isSearchDetail"
    ]),
    activeNav() {
      return this.navActiveIndex;
    }
  },
  created() {
    /* 获取主页热词 */
    this.getMainHotWord();
    const { CompanyName, UserId, FatherUserId, WelcomeWord } = getItem("BigUser");
    const account = getItem("account");
    if (getItem("BigUser")) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
    this.UserId = UserId;
    this.CompanyName = CompanyName;
    this.FatherUserId = FatherUserId;
    this.account = account;
    this.welcomeWord = WelcomeWord;

    // 获取频道信息
    getChannelApi()
      .then(this.globelReqHandle)
      .then( res => {
        console.log(res)
        this.newestData = (res.Data.filter(item => item.Code === '1'))[0].ChildChannel
        this.bestsaleData = (res.Data.filter(item => item.Code === '2'))[0].ChildChannel
        this.activeData = (res.Data.filter(item => item.Code === '3'))[0].ChildChannel
        this.materialData = (res.Data.filter(item => item.Code === '4'))[0].ChildChannel
        this.keyproductData = (res.Data.filter(item => item.Code === '5'))[0].ChildChannel
        this.polybasicData = (res.Data.filter(item => item.Code === '6'))[0].ChildChannel
        console.log(this.newestData, this.bestsaleData, this.activeData, this.materialData, this.keyproductData)
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
  methods: {
    ...mapMutations([
      "setLoading",
      "setShowNav",
      "updateSearch",
      "upMainAccount",
      "updateLoginStatus",
      "updateUserName",
      "updateUserId",
      "updateIsHome",
      "updateImportData",
      "updateIsImport"
    ]),
    querySearchAsync(Search, cb) {
      let navActiveIndex = this.navActiveIndex;
      navActiveIndex = navActiveIndex * 1 - 1;

      if (navActiveIndex === 0) navActiveIndex = "";

      const self = this;
      const params = {
        Search,
        Type: navActiveIndex + ""
      };

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        self.getSearchData(params, cb);
      }, 500);
    },
    handleSelect(item) {
      const id = item.Id;
      const category = item.ChannelCode;

      let channel;
      let channelType = [
        "general",
        "general",
        "general",
        "general",
        "available",
        "multi"
      ];

      if (category === "5") {
        const isKg = el.isKg;
        channel = isKg ? "available" : "unAvailable";
      } else {
        channel = channelType[item.ChannelCode * 1 + 1];
      }

      this.$router.push({
        name: "DetailPage",
        params: { id, channel, category }
      });
    },
    getMainHotWord() {
      GetMainHotWord()
        .then(this.globelReqHandle)
        .then(res => {
          // console.log(res)
          this.hotWord = res.Data;
        })
        .catch(this.globelErrHandle);
    },
    /* 获取模糊搜索数据 */
    getSearchData(params, cb) {
      SearchBook(params)
        .then(this.globelReqHandle)
        .then(res => {
          const { BookInfo, SearchCondition } = res.Data;

          this.SearchCondition = SearchCondition;

          let arr = [];
          let ChannelCode;
          let channelType = [
            "general",
            "general",
            "general",
            "general",
            "available",
            "multi"
          ];

          // 搜索结果数据结构拼接
          BookInfo.forEach((el, index) => {
            ChannelCode = el.ChannelCode;

            if (ChannelCode === "5") {
              const isKg = el.isKg;
              el.channel = isKg ? "available" : "unAvailable";
              return true;
            }
            el.channel = channelType[ChannelCode * 1 + 1];
          });

          cb(BookInfo);
        })
        .catch(this.globelErrHandle);
    },
    toSearchDetail(Search) {
      this.updateSearch(Search);

      const nextSibling = this.$parent.$children[1];
      const demo = nextSibling.$options.name;
      const navActiveIndex = this.navActiveIndex;

      if (demo === "DetailPage") {
        this.toChannelSearch(navActiveIndex);
        return false;
      } else if (demo === "Home" || demo === "ShopCart") {
        // 跳至搜索详情页
        this.updateIsImport(false);
        this.$router.push({ name: "SearchDetail" });
      } else {
        nextSibling.getSearchData(Search);
      }
    },
    toChannelSearch(navActiveIndex) {
      let demo = "";

      switch (navActiveIndex) {
        case "2":
          demo = "Newest";
          break;
        case "3":
          demo = "BestSell";
          break;
        case "4":
          demo = "ThemeActiveLeaf";
          break;
        case "5":
          demo = "Material";
          break;
        case "6":
          demo = "KeyProducts";
          break;
        case "7":
          demo = "MultiProduct";
          break;
      }

      this.$router.push({ name: demo });
    },
    getVal(item, name) {
      return item[name];
    },
    toDemo(demo, type) {
      const nextSibling = this.$parent.$children[1];
      const name = nextSibling.$options.name;
      this.$router.push({
        name: demo,
        params: {
          type: type
        }
      });

      if (demo === name) return false;
      this.updateSearch("");
      this.$refs.globelSearch.suggestions = [];
      this.searchTxt = "";
    },
    toHotWordPage(item) {
      console.log(item);
      this.$router.push({
        name: "HotWordPage",
        params: { searchText: item }
      });
    },
    toSearch(Search) {
      this.updateSearch(Search);
      this.searchTxt = Search;
      this.updateIsImport(false);
      this.$router.push({ name: "SearchDetail" });
    },
    handleUpload() {
      this.$refs.upload.submit();
    },
    handleUploadSuccess(res, file, fileList) {
      this.dialogFormVisible = false;
      console.log(res);
      if (this.uploadData.Type === "") {
        console.log(111);
        this.updateImportData(res);
        this.updateIsImport(true);
        this.$router.push({ name: "SearchDetail" });
      }
      this.bus.$emit("toChangeTableData", res);
    },
    handleUploadFailed(err, file, fileList) {
      this.$message({
        type: "error",
        duration: 0,
        message: err,
        showClose: true
      });
    },
    handleLogout() {
      const { UserId } = getItem("BigUser");
      let params = {
        Data: {
          Id: UserId
        }
      };
      loginOutApi(params)
        .then(this.globelReqHandle)
        .then(res => {
          console.log(res);
          removeItem("BigUser");
        })
        .catch(this.globelErrHandle);

      this.updateLoginStatus(false);
      this.updateUserName("");
      this.updateUserId("");

      this.$router.push({ name: "Login" });
    },
    uploadGoods() {
      this.dialogFormVisible = true;

      let navActiveIndex = this.navActiveIndex;
      navActiveIndex = navActiveIndex * 1 - 1;

      if (navActiveIndex === 0) navActiveIndex = "";

      this.uploadData.Type = navActiveIndex + "";
    }
  }
};
</script>

<style lang="scss">
@import "../common/css/_var";
@import "../common/css/mixin/text_overflow";

.header_wrap {
  width: 100%;
  color: $font_color_999;
  background-color: #ffffff;
  header {
    width: 1200px;
    margin: 0 auto;
  }
}
.header_wrap-nav {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
}
header {
  nav {
    height: 40px;
    position: relative;
  }
  .nav_left {
    padding: 13px 0;
    a {
      color: $txt_color;
    }
    .btn_logout {
      padding-top: 0;
      padding-bottom: 0;
      border: none;
      margin-left: 24px;
      position: absolute;
      opacity: .8;
      left: 210px;
      bottom: 13px;
      &:hover {
        color: $theme_color;
        cursor: pointer;
      }
    }
  }
  .nav_right {
    padding: 10px 0 0 0;
    > ul {
      border-right: 1px solid $txt_color;
      > li {
        padding: 0 14px;
        cursor: pointer;
      }
    }
    > p {
      padding: 0 14px;
      height: 30px;
      cursor: pointer;
      &:hover .service-content {
        display: block;
      }
    }
    img,
    a {
      cursor: pointer;
      vertical-align: middle;
    }
    img {
      margin-right: 4px;
    }
    a {
      color: $txt_color;
    }
  }
}
/* 搜索模块 */
.search_wrap {
  width: 1200px;
  height: 130px;
  margin: 0 auto;
  h1 {
    display: inline-block;
    height: 100%;
    margin-right: 70px;
    overflow: hidden;
    cursor: pointer;
    &:after {
      content: "";
      display: inline-block;
      width: 0;
      height: 100%;
      vertical-align: middle;
    }
  }
  .logo {
    display: inline-block;
    width: 311px;
    height: 46px;
    margin-top: -30px;
    vertical-align: middle;
    background: url("../assets/logo.png") no-repeat center;
    background-size: 100% 100%;
  }
  .wrap_right {
    display: inline-block;
    overflow: hidden;
    &:after {
      content: "";
      display: inline-block;
      width: 0;
      height: 130px;
      vertical-align: middle;
    }
  }
  /* 搜索框部分 */
  .search_cont {
    display: inline-block;
    vertical-align: middle;
  }
  .cont_top {
    .search_input input {
      width: 493px;
      height: 36px;
      border: 2px solid $theme_color;
      border-top-left-radius: 2px !important;
      border-top-right-radius: 0 !important;
      border-bottom-left-radius: 2px !important;
      border-bottom-right-radius: 0 !important;
    }
    .btn_search {
      width: 132px;
      font-size: $font-18;
      padding-top: 8px;
      padding-bottom: 8px;
      border-top-right-radius: 2px;
      border-top-left-radius: 0;
      border-bottom-right-radius: 2px;
      border-bottom-left-radius: 0;
      > span {
        letter-spacing: 1.8px;
        font-weight: normal;
      }
    }
    .btn_import_goods {
      font-size: $font-16;
      cursor: pointer;
      display: block;
      text-align: center;
      border: 2px solid #ff2626;
      padding: 8px;
      text-decoration: none;
      margin-left: 8px;
      border-radius: 2px;
      color: $theme_color;
    }
  }
  /* 搜索历史 / 热词  */
  .cont_bottom {
    padding: 10px 0;
    width: 500px;
    li:not(:first-child) {
      line-height: 15px;
      padding: 0 15px;
    }
    li:first-child {
      line-height: 15px;
      padding-right: 15px;
    }
    li + li {
      border-left: 1px solid $txt_color;
    }
    a {
      color: $txt_color;
      &:hover {
        color: $theme_color;
      }
    }
  }
}

/* 搜索下拉数据展示 */
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      @include text-overflow;
    }
    .isbn {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .isbn {
      color: #ddd;
    }
  }
}
/*  客服模块 */
.service-btn {
  position: relative;
}
.service-content {
  position: absolute;
  top: 30px;
  right: -30px;
  width: 100px;
  background-color: $font_color_fff;
  border: 1px solid #d9d9d9;
  padding: 8px;
  display: none;
  z-index: 9999999;
  & li {
    text-align: center;
    line-height: 22px;
    font-size: 14px;
    color: $font_color_999;
    border-bottom: 1px solid #ccc;
    margin-top: 6px;
    &:first-of-type {
      margin-top: 0;
    }
    &:hover {
      color: $theme_color;
    }
  }
}
  .el-upload__file-template{
    & a{
      color: #606266;
      text-decoration: none;
      &:hover{
        color: #ff2626;
      }
    }
  }
  .el-upload__file-template{
    & a{
      width: 30%;
    }
  }
  .sub-channel{
    display: none;
    width: 153px;
    padding: 0 16px;
    position: absolute;
    left: 0;
    top: 36px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    z-index: 999;
    border-radius: 4px;
    & ul{
      display: block;
    }
    & li{
      text-align: center;
      font-size: 15px!important;
      &:hover{
        color: #ff2626;
      }
    }
  }
.nav_wrap .nav li{
  position: relative;
  &:hover .sub-channel{
    display: block;
  }
}
</style>
