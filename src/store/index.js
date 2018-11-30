import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  loading: false,
  showNav: true,
  Search: '',
  navActiveIndex: "1",
  mainAccount: false,
  isLogin: false,
  UserName: "",
  UserId: "",
  noBook: "http://dtimg.aoshidata.com/common/no-book.png",
  isHome: false,
  showSearch: true,
  importData: {}, // 导入搜索的数据
  isImport: false, //是否是导入搜索
  isSearchDetail: false,
  clickSignAll: false, // 导出全部按钮点击
  clickSignSelect: false, // 导出选中点击
  isStock: false, // 是否显示库存
}

export default new Vuex.Store({
  state,
  mutations
})
