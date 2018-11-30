<!--
 Created by Thomas on 2018/7/9.
 登陆组件组件
 -->
<template>
  <div class="login">
    <div class="login-back">
      <div class="login-back-con clearfix">
        <p>大客户后台管理系统</p>
        <a target="_blank" href="http://bsb.etjbooks.com.cn/manage">登录</a>
      </div>
    </div>
    <div class="login-wrap">
      <h1><a @click="$router.push({name: 'Home'})" class="logo"></a></h1>
    </div>
    <div class="login-content clearfix">
      <div class="login-content-form fr">
        <h3 class="login-content-form-title">大客户服务平台</h3>
        <el-form
          label-position="left"
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item prop="name" label="账号">
            <el-input
              v-model.trim="ruleForm.name"
              placeholder="请输入用户名"
              auto-complete="off"
              @keyup.native.13="handleKeyupAccount($event)"
            ></el-input>
          </el-form-item>
          <el-form-item prop="pass" label="密码">
            <el-input
              type="password"
              ref="password"
              v-model.trim="ruleForm.pass"
              placeholder="密码"
              auto-complete="off"
              @keyup.native.13="handleKeyupPassword($event)"
            ></el-input>
          </el-form-item>
          <div class="login-verify">
            <el-form-item prop="img">
              <el-input
                ref="verify"
                v-model.trim="ruleForm.VerCode"
                placeholder="验证码"
                @keyup.native.13="handleKeyup($event)"
              ></el-input>
            </el-form-item>
            <div class="login-verify-img">
              <img :src="verifyImg" />
            </div>
            <p @click="changeVerifyImg()">看不清楚换一张</p>
          </div>
          <el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            </div>
          </el-form-item>
        </el-form>
        <div class="login-shadow">
          <img src="../assets/shadow.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globelFnHanle } from "@/common/js/mixin.js";
import { mapState, mapMutations } from "vuex";
import { Login, fetchVerifyImg } from "../api";
import { setItem, spliceToken } from "../common/js/util";

export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        name: "",
        pass: "",
        VerCode: ""
      },
      VerId: "",
      verifyImg: "",
      rules: {
        name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        pass: [{ required: true, message: "密码不能为空", trigger: "blur" }],
        VerCode: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ]
      }
    };
  },
  mixins: [globelFnHanle],
  created() {
    fetchVerifyImg()
      .then(res => {
        this.verifyImg = res.data.Data.Img;
        this.VerId = res.data.Data.VerId;
      })
      .catch(this.globelErrHandle);
  },
  methods: {
    ...mapMutations([
      "upMainAccount",
      "updateLoginStatus",
      "updateUserName",
      "updateUserId",
      "updateIsStock"
    ]),
    handleKeyupAccount(event) {
      this.$refs.password.focus()
    },
    handleKeyupPassword(event) {
      this.$refs.verify.focus()
    },
    handleKeyup(event) {
      const { name, pass } = this.ruleForm;
      if (!name || !pass) return false;

      this.submitForm("ruleForm");
    },
    submitForm(formName) {
      let isGoOn = false;

      this.$refs[formName].validate(valid => {
        if (valid) isGoOn = true;
      });

      if (!isGoOn) return false;

      const { name, pass, VerCode } = this.ruleForm;
      const { VerId } = this;
      let params = {
        Data: {
          Id: name,
          Psw: pass,
          VerId,
          VerCode,
          LoginType: "user"
        }
      };
      Login(params)
        .then(this.globelReqHandle)
        .then(res => {
          setItem("BigUser", res.Data);
          console.log(res);
          this.updateLoginStatus(true);
          this.updateUserName(res.Data.UserName);
          this.updateUserId(res.Data.UserId);
          if (res.Data.InOut === "O") {
            this.updateIsStock(false);
          } else {
            this.updateIsStock(true);
          }

          if (res.Data.UserType === "2") {
            setItem("account", true);
          } else {
            setItem("account", false);
          }
          this.$router.push({ name: "Home" });
        })
        .catch(this.globelErrHandle);
    },
    changeVerifyImg() {
      fetchVerifyImg()
        .then(res => {
          this.verifyImg = res.data.Data.Img;
          this.VerId = res.data.Data.VerId;
        })
        .catch(this.globelErrHandle);
    }
  }
};
</script>

<style lang="scss">
@import "../common/css/_var";

.login-back {
  line-height: 40px;
  background-color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  &-con {
    width: 1200px;
    margin: 0 auto;
  }
  & p {
    float: left;
    font-size: 14px;
    color: #999999;
  }
  & a {
    float: left;
    margin-left: 8px;
    text-decoration: none;
    color: #5e69ad;
  }
}
.login-wrap {
  width: 1200px;
  height: 130px;
  margin: 0 auto;
  margin-top: 20px;
  & h1 {
    display: inline-block;
    height: 100%;
    margin-right: 70px;
    overflow: hidden;
  }
  .logo {
    display: inline-block;
    width: 311px;
    height: 46px;
    margin-top: 40px;
    vertical-align: middle;
    background: url("../assets/logo.png") no-repeat center;
    background-size: 100% 100%;
  }
}
.login-content {
  width: 100%;
  height: 500px;
  background: url("../assets/login-bg.png") no-repeat center;
  position: relative;
  &-form {
    width: 380px;
    border: solid 1px #d3d3d3;
    border-top: 2px solid $theme_color;
    background: #ffffff;
    padding: 20px;
    margin-right: 20%;
    margin-top: 50px;
    &-title {
      color: $theme_color;
      font-size: 14px;
      line-height: 40px;
    }
  }
  .login-shadow {
    position: absolute;
    bottom: 98px;
    right: 380px;
    & img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .login-verify {
    position: relative;
    height: 50px;
    margin-bottom: 10px;
    .el-input {
      width: 150px;
      position: absolute;
    }
    &-img {
      width: 60px;
      height: 30px;
      position: absolute;
      left: 164px;
      top: 5px;
      & img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    & p {
      position: absolute;
      top: 5px;
      right: 16px;
      line-height: 30px;
      font-size: 12px;
      cursor: pointer;
      color: $font_color_666;
    }
    .el-form-item__content {
      height: 40px;
      margin-left: 0 !important;
    }
  }
  .el-button--primary {
    margin-left: 0;
    width: 144%;
    position: absolute;
    top: 0;
    left: -100px;
  }
  .login-btn {
    height: 40px;
    position: relative;
    margin-top: 6px;
  }
}
</style>
