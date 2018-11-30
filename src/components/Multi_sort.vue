<template>
  <section class="mutiple_sort clearfix">
    <div class="sort_wrap">
      <!-- 面包屑--筛选条件 -->
      <div class="sort_condition clearfix">
        <span class="fl">所有分类</span>
        <ul class="fl" v-if="Object.keys(selectedCondition).length">
          <li
            v-for="(value, key) in selectedCondition"
            :key="key"
            v-if="value"
            @click="removeSelected(key)"
            :title="concatTitle(key, value)"
            class="category_item fl"
          >
            {{ concatTitle(key, value) }}<i class="icon_remove">x</i>
          </li>
        </ul>
        <el-button
          v-if="btnFilterShow"
          @click="toggleFilterStatu"
          class="btn_filter fr"
          type="info"
          size="mini"
          plain
        >
          <span v-if="filterStatus">
            收起筛选<i class="el-icon-arrow-up"></i>
          </span>
          <span v-else>
            显示筛选<i class="el-icon-arrow-down"></i>
          </span>
        </el-button>
      </div>
      <!-- 筛选条件区域 -->
      <div v-show="filterStatus" class="condition_wrap">
        <div
          v-show="!selectedCondition[item.name] && Object.keys(item.data).length"
          v-for="(item, index) in filterData"
          :key="item.name"
          class="sort_item_wrap"
        >
          <dl v-if="Object.keys(item.data).length" class="sort_cont clearfix">
            <dt class="sort_title">{{ item.label }}：</dt>
            <dd class="sort_group clearfix">
              <div
                :class="box['box' + (index + 1)] ? 'multi_show' : ''"
                class="list_wrap"
              >
                <ul
                  @click="handleItemSelect($event, item.name)"
                  class="list_cont clearfix"
                >
                  <li
                    v-for="(value, key) in item.data"
                    :key="value"
                    class="fl"
                  >
                    <label
                      v-show="checkMore['checkMore' + (index + 1)]"
                      class="checkbox_group"
                    >
                      <input
                        :data-id="key"
                        :data-txt="value"
                        class="icon_checkbox"
                        type="checkbox"
                      >
                      <i></i>
                      <span>{{ value }}</span>
                    </label>
                    <span
                      v-show="!checkMore['checkMore' + (index + 1)]"
                      :data-id="key"
                      :data-txt="value"
                      class="single_select"
                    >{{ value }}</span>
                  </li>
                </ul>
              </div>
              <div
                v-if="checkMore['checkMore' + (index + 1)]"
                class="btn_group"
              >
                <el-button
                  @click="handleMultiSelect(index, item.name)"
                  type="primary"
                  size="small"
                >提交</el-button>
                <el-button
                  @click="handleCancel(('checkMore' + (index + 1)), ('box' + (index + 1)))"
                  size="small"
                >取消</el-button>
              </div>
            </dd>
            <dd class="show_group">
              <span
                v-if="!checkMore['checkMore' + (index + 1)]"
                @click="handleCheckMore(('checkMore' + (index + 1)), ('box' + (index + 1)))"
                class="show_multi"
              >多选</span>
              <span
                v-if="!box['box' + (index + 1)]"
                @click="handleShowMore('box' + (index + 1))"
                class="icon_show_more"
              >展开</span>
              <span
                v-else
                @click="handleShowLess(('box' + (index + 1)), ('checkMore' + (index + 1)))"
                class="icon_show_less"
              >收起</span>
            </dd>
          </dl>
        </div>


      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "MultiSort",
  data() {
    return {
      /* 筛选显示、收起状态切换 */
      filterStatus: true,
      /* 筛选条件是否选择完毕（隐藏 btn_filter） */
      btnFilterShow: true
    };
  },
  props: [
    // 筛选条件数据
    "filterData",
    // 选定条件集合
    "selectedCondition",
    // 筛选项收缩状态判断状态
    "box",
    // 筛选项复选状态判断状态
    "checkMore"
  ],
  watch: {
    selectedCondition: {
      handler: function(val, oldVal) {
        let isGoOn = false;

        for (const key in val) {
          const value = val[key];

          if (!value) {
            isGoOn = true;
            break;
          }
        }

        if (isGoOn) {
          this.btnFilterShow = true;
        } else {
          this.btnFilterShow = false;
        }
      },
      deep: true
    }
  },
  methods: {
    handleCheckMore(checkName, selectName) {
      this.$emit("showCheckMore", checkName, selectName);
    },
    handleShowMore(selectName) {
      this.$emit("showMore", selectName);
    },
    handleShowLess(selectName, checkName) {
      this.$emit("showLess", selectName, checkName);
    },
    handleCancel(checkName, selectName) {
      this.$emit("cancelMultiSelect", checkName, selectName);
    },
    toggleFilterStatu() {
      this.filterStatus = !this.filterStatus;
    },
    /* 筛选条件单选 */
    handleItemSelect(e, key) {
      const singleSelset = e.target;
      const ClassName = singleSelset.className;
      let itemId, itemTxt, val;

      if (ClassName !== "single_select") return false;
      itemId = singleSelset.dataset.id;
      itemTxt = singleSelset.dataset.txt;

      this.$emit("itemSelect", key, itemId, itemTxt);
    },
    /* 筛选条件多选 */
    handleMultiSelect(index, key) {
      const oUl = document.querySelectorAll(".list_cont")[index];

      let selectedGroup = oUl.querySelectorAll(".icon_checkbox:checked");

      if (!selectedGroup.length) {
        this.$message({
          message: "请选择条件！",
          type: "warning"
        });
      }

      let IdResult = "";
      let TxtResult = "";
      let result, sortItem, id, value;

      result = [];
      sortItem = null;

      selectedGroup = Array.from(selectedGroup);
      selectedGroup.map((el, index) => {
        id = el.dataset.id;
        value = el.dataset.txt;

        IdResult += `${id},`;
        TxtResult += `${value},`;
      });

      IdResult = IdResult.replace(/,$/, "");
      TxtResult = TxtResult.replace(/,$/, "");

      this.$emit("multiSelect", key, IdResult, TxtResult);
    },
    /* 去除已选条件 */
    removeSelected(key) {
      this.$emit("removeSelected", key);
    },
    concatTitle(key, value) {
      const label = {
        Author: "作者",
        PublishYear: "出版年份",
        Publisher: "出版社",
        Cbfl: "出版分类",
        Fxfl: "发行分类",
        Type: "频道",
        CsType: "畅销图书类型",
        CsTime: "畅销图书时间",
        DzzjcType: "大中专教材类型",
        IsKg: "是否可供"
      };

      let html = `${label[key]}：${value}`;
      if (!value) return "";

      return html;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/css/_var";
@import "../common/css/mixin/_text_overflow";

.mutiple_sort {
  box-shadow: inset 0 1px 1px 0 #d9d9d9;
  .sort_wrap {
    width: 1200px;
    margin: 0 auto;
  }
  .condition_wrap {
    border: 1px solid #f5f5f9;
    padding: 10px;
  }
  /* 面包屑--筛选条件 */
  .sort_condition {
    height: 46px;
    font-size: 16px;
    padding: 13px 0;
    color: #666;
    > span {
      position: relative;
      height: 20px;
      line-height: 20px;
      padding-right: 15px;
      margin-right: 5px;
      &:before,
      &:after {
        position: absolute;
        top: 6px;
        content: "";
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 4px 0 4px 8px;
        border-color: transparent transparent transparent $font_color_666;
      }
      &:before {
        right: 0;
      }
      &:after {
        right: 1px;
        border-color: transparent transparent transparent $font_color_fff;
      }
    }
    .btn_filter {
      padding-top: 5px;
      padding-bottom: 5px;
      margin-top: -2px;
    }
    .category_item {
      position: relative;
      width: 169px;
      height: 20px;
      font-size: 12px;
      line-height: 18px;
      padding: 0 19px 0 4px;
      border: 1px solid #e8e8e8;
      margin-right: 5px;
      cursor: pointer;
      @include text-overflow;
      background: #f5f5f9;
      &:hover {
        border-color: $theme_color;
        .icon_remove {
          color: $theme_color;
        }
      }
      .icon_remove {
        position: absolute;
        top: 0;
        right: 6px;
        font-size: 14px;
        line-height: 18px;
      }
    }
  }
  /* 各筛选条件项 */
  .sort_item_wrap {
    font-size: 14px;
    text-align: left;
    border-bottom: solid 1px #f5f5f9;
    margin-bottom: 10px;
    color: #333;
    .list_wrap {
      height: 34px;
      overflow: hidden;
      margin-left: 40px;
    }
    .btn_group {
      text-align: center;
      > button {
        width: 42px;
        height: 22px;
        padding: 0;
        margin: 5px;
      }
    }
  }
  .sort_item_wrap {
    position: relative;
    .sort_cont {
      .multi_show {
        height: auto;
        max-height: 102px;
        overflow: hidden;
        overflow-y: auto;
      }
    }
    .sort_title,
    .show_group {
      position: absolute;
      top: 0;
      height: 34px;
    }
    .sort_title {
      left: 0;
      width: 118px;
      padding: 10px 0 10px 20px;
      color: #999;
    }
    .sort_group {
      padding: 0 130px 0 120px;
      li {
        margin: 10px 36px 10px 0;
        cursor: pointer;
      }
      li:hover {
        color: $theme_color;
      }
    }
    .show_group {
      right: 0;
      width: 130px;
      padding: 10px 0;
      .show_multi,
      .icon_show_more,
      .icon_show_less {
        position: absolute;
        cursor: pointer;
        user-select: none;
        &:hover {
          color: $theme_color;
        }
      }
      .show_multi {
        top: 8px;
        right: 80px;
        height: 20px;
        padding: 2px 6px;
        border: 1px solid #ccc;
      }
      .icon_show_more,
      .icon_show_less {
        top: 11px;
        right: 20px;
        padding-right: 10px;
      }
      .icon_show_more:before,
      .icon_show_more:after,
      .icon_show_less:before,
      .icon_show_less:after {
        content: "";
        position: absolute;
        top: 5px;
        right: 0;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 4px 4px 4px;
        border-color: transparent transparent $font_color_333 transparent;
      }
      .icon_show_more:before,
      .icon_show_more:after {
        border-width: 4px 4px 0 4px;
        border-color: $font_color_333 transparent transparent transparent;
      }

      .icon_show_less:after {
        top: 6px;
        border-color: transparent transparent $font_color_fff transparent;
      }
      .icon_show_more:after {
        top: 4px;
        border-color: #fff transparent transparent transparent;
      }
    }
  }
  .checkbox_group {
    cursor: pointer;
    .icon_checkbox {
      display: none;
    }
    .icon_checkbox + i {
      display: inline-block;
      width: 14px;
      height: 14px;
      vertical-align: middle;
      background: url("../assets/check_empty.png") no-repeat center;
      background-size: cover;
    }
    > span {
      display: inline-block;
      vertical-align: middle;
      user-select: none;
    }
    .icon_checkbox:checked + i {
      background: url("../assets/check_fill.png") no-repeat center;
      background-size: cover;
    }
  }
}
</style>
