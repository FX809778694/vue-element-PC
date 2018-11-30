<!--
 Created by Thomas on 2018/8/29.
 客服模块组件
 -->
<template>
  <div class="service-wrap">
    <!-- 聊天主题框 -->
    <div class="service-record">
      <div class="service-record-head">
        <h3>大客户平台客服人员为您服务</h3>
        <p>2018-06-26  15:29</p>
      </div>
      <!-- 聊天记录部分 -->
      <div id="dialog-area"  class="service-record-list clearfix" ref="scrollContent">
        <p
          v-for="(item, index) in recordData"
          :key="index"
          :class="{right : !(item.FromUser === User)}"
          v-html="emoji(item.Content)"
        ></p>
      </div>
    </div>
    <!-- 底部输入 -->
    <div class="service-input">
      <div class="service-face-btn">
        <div class="icon iconfont icon-face" @click="showEmoji = !showEmoji">
          <img src="../assets/face.png" />
        </div>
      </div>
      <div class="service-input">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 10}"
          placeholder="请输入内容"
          resize="none"
          v-model.trim="inputValue">
        </el-input>
        <!--<div style="line-height: 22px" v-html="emoji(inputValue)"></div>-->
        <div class="service-send">
          <el-button id="sendMessage" @click="sendMessage">发送</el-button>
        </div>
      </div>
        <!-- 表情 -->
      <transition name="el-fade-in-linear" mode="">
        <div class="emoji-box" v-if="showEmoji" >
          <a
            class="icon-close"
            @click="showEmoji = false">
            <img src="../assets/close.png" />
          </a>
          <vue-emoji
            @select="selectEmoji">
          </vue-emoji>
          <span class="pop-arrow arrow"></span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import vueEmoji from '../components/emoji.vue'
  import { getItem } from '../common/js/util'
  import "../../static/js/jquery-1.10.2.min"
  import "../../static/js/jquery.signalR-2.3.0.min"
  import {getRecordApi, sendMessageApi} from "../api"
  import "../common/js/singar"

  export default {
    name: "Service",
    data() {
      return {
        showEmoji: false,
        inputValue: '',
        recordData: [],
        PageIndex: 1,
        Total: 0,
        User: '',
        proxy: []
      }
    },
    components: {
      vueEmoji
    },
    watch: {
      '$route' (to, from) {

        const {channel} = this.$route.params
        const params = {
          Type: channel,
          PageIndex: 1,
          PageNum: 50
        };
        this.getRecordList(params)

      }
    },
    created() {

    },
    mounted() {

      const {channel} = this.$route.params
      const params = {
        Type: channel,
        PageIndex: 1,
        PageNum: 50
      };
      this.getRecordList(params)


    },
    methods: {
      // 选择表情
      selectEmoji(code) {
        console.log(code)
        this.showEmoji = false
        this.inputValue += code
      },
      scrollBottom() {
        this.$nextTick(function() {
          var div = document.getElementById("dialog-area");
          div.scrollTop = div.scrollHeight;
        });
      },
      // 获取列表
      getRecordList(params) {

        let conn  = $.hubConnection("http://200.1.3.234:5568")
        let proxy = conn.createHubProxy("chatHub")
        this.proxy = proxy;

        this.proxy.on('showChatDetail', (res) => {
          this.recordData = res.Data;
          this.scrollBottom()
        })

        conn.start().done(function () {
          //获取聊天记录
          let detailParams = getRecordApi(params);
          proxy.invoke("GetChatDetail", detailParams);

        }).fail(function () {
          console.log("Could not connect");
        });

      },
      // 发送消息
      sendMessage() {
        const {channel} = this.$route.params
        const params  = {
          Message: this.inputValue,
          Type: channel
        };

        let sendParams = sendMessageApi(params);
        this.proxy.invoke('SendMessage', sendParams);
        this.proxy.on('showNewestDetail', res => {
          this.recordData.push(res.Data)
          this.scrollBottom()
        })

      }
    },
    destroyed() {

    }
  }
</script>

<style lang="scss" scoped>
  @import "../common/css/_var";
.service-wrap{
  width: 1200px;
  margin: 0 auto;
  margin-top: 20px;
  padding-bottom: 100px;
  position: relative;
}
  .service-record{
    background: #f5f5f9;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 20px 30px;
    &-head{
      width: 100%;
      font-size: $font-14;
      & h3{
        color: $font_color_999;
        text-align: left;
      }
      & p{
        text-align: center;
        color: $border_E6;
      }
    }
    &-list{
      height: 300px;
      overflow-y: scroll;
      padding: 0 20px 0 20px;
    }
  }
  .service-input{
    width: 100%;
    height: 140px;
    background: $font_color_fff;
    position: relative;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    box-shadow: 0 2px 10px 0 rgba(13, 13, 13, 0.03);
  }
  .service-face-btn{
    width: 1200px;
    border: 1px solid $border_E6;
    border-bottom: none;
    height: 36px;
    line-height: 36px;
    .icon-face{
      width: 26px;
      height: 26px;
      margin-top: 4px;
      margin-left: 20px;
      cursor: pointer;
      & img{
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
  .icon {
    position: relative;
    margin-top: 20px;
    .iconfont {
      cursor: pointer;
      color: #F7BA2A;
    }
    .submit {
      float: right;
    }
  }
  .emoji-box {
    position: absolute;
    z-index: 10;
    left: 0;
    top: 30px;
    box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
    background: white;
    .el-button {
      position: absolute;
      border: none;
      color: #FF4949;
      right: 12px;
      top: 12px;
      z-index: 10;
    }
    .arrow {
      left: 10px;
    }
    .icon-close{
      width: 18px;
      height: 18px;
      display: block;
      position: absolute;
      right: 18px;
      top: 16px;
      z-index: 10;
      cursor: pointer;
      & img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
  .service-input{
    position: relative;
  }
  .service-send{
    position: absolute;
    bottom: 8px;
    right: 10px;
  }

  .service-record-list{
    & p{
      font-size: $font-14;
      line-height: 16px;
      color: $font_color_333;
      margin-top: 20px;
    }
    & img{
      margin-top: 10px;
    }
  }

  .right{
    text-align: right;
  }
</style>
