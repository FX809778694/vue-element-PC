import {
  SearchBook
} from "../../api";

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

export const globelFnHanle = {
  watch: {
    filterData: function (val, oldVal) {
      if (val) {
        const len = val.length;
        let boxArr = {};
        let checkMoreArr = {};

        for (let i = 0; i < len; i++) {
          boxArr["box" + (i + 1)] = false;
          checkMoreArr["checkMore" + (i + 1)] = false;
        }

        this.box = boxArr;
        this.checkMore = checkMoreArr;
      }
    },
    // 选定的作者条件项
    selectedIdCondition: {
      handler: function (val, oldVal) {
        const isFirst = this.onOff;

        if (isFirst) {
          this.onOff = false;
          return false;
        }

        if (val) {
          this.getFilterData();
        }
      },
      deep: true
    }
  },
  methods: {
    /* 全局 ErrorCode 监听处理 */
    globelReqHandle({
      Success,
      ErrorMsg,
      Data,
      Total,
      ErrorCode
    }) {
      if (ErrorCode === 100) {
        /**
         * TODO:
         * 重定向至登录页
         */
        return false;
      } else if (ErrorCode !== 0) {
        this.$message(ErrorMsg);
        console.log(ErrorMsg);

        return false;
      }

      return Promise.resolve({
        Success,
        ErrorMsg,
        Data,
        Total,
        ErrorCode
      });
    },
    /* 全局 error 监听处理 */
    globelErrHandle(err) {
      console.log(err);
    },
    itemSelect(key, id, txt) {
      this.selectedCondition[key] = txt;
      this.selectedIdCondition[key] = id;
    },
    multiSelect(itemKey, IdResult, TxtResult) {
      const {
        checkMore,
        box
      } = this;

      for (const key in checkMore) {
        this.checkMore[key] = false;
      }

      for (const name in box) {
        this.box[name] = false;
      }

      this.selectedCondition[itemKey] = TxtResult;
      this.selectedIdCondition[itemKey] = IdResult;
    },
    removeSelected(key) {
      this.selectedCondition[key] = "";
      this.selectedIdCondition[key] = "";
    },
    showLess(selectName, checkName) {
      this.box[selectName] = false;

      if (checkName) this.checkMore[checkName] = false;
    },
    showMore(selectName) {
      const {
        box,
        checkMore
      } = this;

      this.box[selectName] = true;

      for (const key in checkMore) {
        if (checkMore.hasOwnProperty(key)) {
          this.checkMore[key] = false;
        }
      }

      for (const name in box) {
        if (box.hasOwnProperty(name)) {
          if (name !== selectName) this.box[name] = false;
        }
      }
    },
    cancelMultiSelect(checkName, selectName) {
      this.checkMore[checkName] = false;
      this.box[selectName] = false;
    },
    showCheckMore(checkName, selectName) {
      const {
        checkMore,
        box
      } = this;

      this.checkMore[checkName] = true;

      for (const key in checkMore) {
        if (checkMore.hasOwnProperty(key)) {
          if (key !== checkName) this.checkMore[key] = false;
        }
      }

      for (const name in box) {
        if (box.hasOwnProperty(name)) {
          if (name !== selectName) this.box[name] = false;
        }
      }

      if (selectName) this.box[selectName] = true;
    },
    getSearchBook(params) {
      SearchBook(params)
        .then(this.globelReqHandle)
        .then(res => {
          const {
            BookInfo,
            SearchCondition
          } = res.Data;

          /* ----- 筛选条件数据结构改造 start ----- */
          let filterData = [];
          let data;
          let item;
          let selectedObj = {};

          for (const key in SearchCondition) {
            data = SearchCondition[key];

            item = {
              name: key,
              data,
              label: label[key]
            };

            filterData.push(item);
            selectedObj[key] = "";
          }

          this.filterData = filterData;
          this.selectedCondition = {
            ...selectedObj
          };
          this.selectedIdCondition = {
            ...this.selectedIdCondition,
            ...selectedObj
          };
          /* ----- 筛选条件数据结构改造 end ----- */

          this.tableData = BookInfo;
          this.Total = res.Total;

          this.setLoading(false);
        })
        .catch(this.globelErrHandle);
    },
    fetchFilterData(params) {
      SearchBook(params)
        .then(this.globelReqHandle)
        .then(res => {
          setTimeout(() => {
            this.setLoading(false);
          }, 500);

          const {
            BookInfo,
            SearchCondition
          } = res.Data;

          /* ----- 筛选条件数据结构改造 start ----- */
          let filterData = [];
          let data;
          let item;

          for (const key in SearchCondition) {
            data = SearchCondition[key];

            item = {
              name: key,
              data,
              label: label[key]
            };

            filterData.push(item);
          }

          this.filterData = filterData;
          /* ----- 筛选条件数据结构改造 end ----- */

          this.tableData = BookInfo;
          this.Total = res.Total;
        })
        .catch(this.globelErrHandle);
    }
  }
}
