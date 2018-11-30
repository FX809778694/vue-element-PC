<!--
 Created by Thomas on 2018/7/10.
 子账号组件
 -->
<template>
  <div class="account-wrap">
    <div class="account-top">
      <div class="account-top-content clearfix">
        <h3>子账号信息</h3>
        <div class="add-account-btn fr">
          <el-button @click="addModel()" type="primary" size="mini"  round>添加子账号</el-button>
        </div>
      </div>
    </div>
    <!-- 子账号列表内容 -->
    <div class="account-content">
      <el-table
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="Id"
          label="用户"
          >
        </el-table-column>
        <el-table-column
          prop="Psw"
          label="密码"
          >
        </el-table-column>
        <el-table-column
          prop="Name"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="Tel"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          prop="QQ"
          label="QQ号"
        >
        </el-table-column>
        <el-table-column
          prop="Dept"
          label="所属部门"
        >
        </el-table-column>
        <el-table-column
          prop="Remark"
          label="备注"
        >
        </el-table-column>
        <el-table-column
          prop="ActiveEnd"
          label="账号有效截止日期"
        >
        </el-table-column>
        <el-table-column
          width="180"
          label="操作">
          <template slot-scope="scope">
            <div class="account-content-btn">
              <el-button @click="enableAccount(scope.row.Id)" v-if="scope.row.IsUse === '1'" type="text" size="small">停用</el-button>
              <el-button @click="ableAccount(scope.row.Id)" v-else type="text" size="small">启用</el-button>
              <el-button @click="editModel(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="deleteAccount(scope.row)"  type="text" size="small">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
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
    </div>
    <el-dialog
      title="子账号信息"
      :visible.sync="dialogVisible"
      width="600px"
      >
        <div class="account-edit-item clearfix">
          <P>用户名：</P>
          <input v-if="(this.method === 'update') ? true : false" title="用户名不能修改" class="account-input" v-model.trim="ruleForm.account" :disabled="true" placeholder="请输入用户名" />
          <input v-else class="account-input" v-model.trim="ruleForm.account" placeholder="请输入用户名" />
        </div>
        <div class="account-edit-item clearfix">
          <P>密码：</P>
          <input type="password" class="account-input" v-model.trim="ruleForm.passWard" placeholder="请输入密码" />
        </div>
        <div class="account-edit-item clearfix">
          <P>姓名：</P>
          <input class="account-input" v-model.trim="ruleForm.name" placeholder="请输入姓名" />
        </div>
        <div class="account-edit-item clearfix">
          <P>手机号：</P>
          <input class="account-input" v-model.trim="ruleForm.tel" placeholder="请输入手机号" />
        </div>
        <div class="account-edit-item clearfix">
          <P>QQ号：</P>
          <input class="account-input" v-model.trim="ruleForm.qq" placeholder="请输入QQ号" />
        </div>
        <div class="account-edit-item clearfix">
          <P>所属部门：</P>
          <input class="account-input" v-model.trim="ruleForm.dept" placeholder="请输入所属部门" />
        </div>
        <div class="account-edit-item clearfix">
          <P>备注：</P>
          <el-input class="account-textarea" type="textarea" :rows="3" v-model.trim="ruleForm.remark" placeholder="备注"></el-input>
        </div>
        <div class="account-edit-item clearfix">
          <p>账号有效时间：</p>
          <div class="account-time">
            <el-date-picker
              v-model.trim="ruleForm.orderSDate"
              type="daterange"
              align="right"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </div>
        <div class="account-edit-item">
          <P>能否提交订单：</P>
          <div class="account-edit-item-select">
            <el-radio v-model.trim="ruleForm.radio" label="1">是</el-radio>
            <el-radio v-model.trim="ruleForm.radio" label="0">否</el-radio>
          </div>
        </div>

      <span slot="footer" class="dialog-footer">
        <div class="account-edit-foot">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAccount()">确 定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { addSubAccount, fetchListData, ableAccountApi } from "../api";
import { getItem } from "../common/js/util";

export default {
  name: "SubAccount",
  data() {
    return {
      tableData: [],
      PageIndex: 1,
      PageNum: 15,
      Total: 0,
      dialogVisible: false,
      method: "",
      ruleForm: {
        account: "",
        passWard: "",
        name: "",
        tel: "",
        qq: "",
        dept: "",
        remark: "",
        orderSDate: "",
        radio: "0"
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近半年',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 180);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 360);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };
  },
  computed: {
    ...mapState(["loading", "showNav"])
  },
  created() {
    const { PageIndex, PageNum } = this;
    let params = {
      PageIndex: PageIndex,
      PageNum: PageNum
    };
    this.initTableData(params);
  },
  methods: {
    ...mapMutations(["setLoading", "setShowNav"]),
    initTableData(params) {
      fetchListData(params)
        .then(Data => {
          console.log(Data);
          this.tableData = Data.Data;
          this.Total = Data.Total;
        })
        .catch(this.globelErrHandle);
    },
    addModel() {
      this.ruleForm.account = "";
      this.ruleForm.passWard = "";
      this.ruleForm.radio = "0";
      this.dialogVisible = true;
      this.method = "add";
    },
    editModel(row) {
      console.log(row)
      this.ruleForm.account = row.Id;
      this.ruleForm.passWard = row.Psw;
      this.ruleForm.name = row.Name;
      this.ruleForm.tel = row.Tel;
      this.ruleForm.qq = row.QQ;
      this.ruleForm.dept = row.Dept;
      this.ruleForm.remark = row.Remark;
      this.ruleForm.radio = row.IsOrder;
      this.dialogVisible = true;
      this.method = "update";
    },
    submitAccount() {
      console.log(this.method);

      this.dialogVisible = false;
      const { account, passWard, radio, name, tel, qq, dept, remark } = this.ruleForm;

      if (account == "") {
        this.$message({
          message: "请输入账号",
          type: "error"
        });
        return;
      } else if (passWard == "") {
        this.$message({
          message: "密码不能为空",
          type: "error"
        });
        return;
      }

      const method = this.method;
      const { UserId, UserType } = getItem("BigUser");
      const startTime = this.ruleForm.orderSDate[0];
      const endTime = this.ruleForm.orderSDate[1];
      let params = {
        UserId: UserId,
        UserType: UserType,
        Id: account,
        Psw: passWard,
        Name: name,
        Tel: tel,
        QQ: qq,
        Dept: dept,
        Remark: remark,
        ActiveStart: startTime,
        ActiveEnd: endTime,
        IsOrder: radio,
        Method: method
      };
      console.log(params);
      addSubAccount(params)
        .then(res => {
          if (res.Success) {
            this.$message({
              message: "添加或修改成功",
              type: "success"
            });
            setTimeout(item => {
              this.$router.go(0);
            }, 400);
            const { PageIndex, PageNum } = this;
            let params = {
              PageIndex: PageIndex,
              PageNum: PageNum
            };
            this.initTableData(params);
          } else {
            this.$message.error(res.ErrorMsg);
          }
        })
        .catch(this.globelErrHandle);
    },
    handleCurrentChange(val) {
      const { PageNum } = this;
      let params = {
        PageIndex: val,
        PageNum: PageNum
      };

      this.initTableData(params);
      window.scroll(0, 0);
    },
    deleteAccount(val) {
      console.log(val);
      this.method = "delete";
      const { Id, Psw, IsOrder } = val;
      const method = this.method;
      const { UserId, UserType } = getItem("BigUser");
      let params = {
        UserId: UserId,
        UserType: UserType,
        Id: Id,
        Psw: Psw,
        IsOrder: IsOrder,
        Method: method
      };
      addSubAccount(params)
        .then(res => {
          if (res.Success) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            setTimeout(item => {
              this.$router.go(0);
            }, 400);
            const { PageIndex, PageNum } = this;
            let params = {
              PageIndex: PageIndex,
              PageNum: PageNum
            };
            this.initTableData(params);
          } else {
            this.$message.error(res.ErrorMsg);
          }
        })
        .catch(this.globelErrHandle);
    },
    enableAccount(id) {
      let params = {
        Data: {
          UserId: id,
          IsUse: '0'
        }
      }
      ableAccountApi(params)
        .then(this.globelReqHandle)
        .then(res => {
          console.log(res)
          if(res.Success) {
            this.$message({
              type: 'success',
              message: "停用成功"
            })
            setTimeout(item => {
              this.$router.go(0);
            }, 400);
          }
        })
        .catch(this.globelErrHandle)
    },
    ableAccount(id) {
      let params = {
        Data: {
          UserId: id,
          IsUse: '1'
        }
      }
      ableAccountApi(params)
        .then(this.globelReqHandle)
        .then(res => {
          console.log(res)
          if(res.Success) {
            this.$message({
              type: 'success',
              message: '启用成功'
            })
            setTimeout(item => {
              this.$router.go(0);
            }, 400);
          }
        })
        .catch(this.globelErrHandle)
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/css/_var";

.account-top {
  width: 100%;
  height: 36px;
  background: $theme_color;
  margin-top: 20px;
  &-content {
    width: 1200px;
    line-height: 36px;
    margin: 0 auto;
    & h3 {
      float: left;
      font-size: $font-16;
      color: $font_color_fff;
      margin-left: 36px;
    }
    & a {
      width: 86px;
      height: 26px;
      display: block;
      margin-top: 5px;
      margin-right: 26px;
      border-radius: 4px;
      line-height: 24px;
      text-align: center;
      text-decoration: none;
      font-size: $font-16;
      color: $font_color_fff;
      border: 1px solid $font_color_fff;
      float: right;
      cursor: pointer;
    }
  }
}
.account-content {
  width: 1200px;
  margin: 20px auto;
  min-height: 640px;
  &-btn {
    .el-button {
      color: $font_color_666 !important;
      font-size: 14px;
    }
  }
}
.account-edit-item {
  margin: 0 auto;
  margin-top: 20px;
  width: 80%;
  .el-input {
    width: 75%;
    float: right;
  }
  & p {
    width: 25%;
    float: left;
    text-align: right;
    line-height: 40px;
  }
  &-select {
    line-height: 40px;
    margin-left: 130px;
  }
}
.account-edit-foot {
  width: 80%;
  margin: 0 auto;
}
.account-input {
  border: 1px solid #d3d3d3;
  width: 75%;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
}
  .account-textarea{
    width: 75%;
    line-height: 40px;
  }
  .account-time{
    width: 75%;
    float: right;
    .el-range-editor.el-input__inner{
      width: 100%!important;
    }
  }
</style>
