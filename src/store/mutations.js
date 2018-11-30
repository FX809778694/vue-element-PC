export default {
  setLoading(state, val) {
    state.loading = val
  },
  setShowNav(state, val) {
    state.showNav = val
  },
  updateSearch(state, val) {
    state.Search = val;
  },
  updateNavIndex(state, val) {
    state.navActiveIndex = val;
  },
  upMainAccount(state, val) {
    state.mainAccount = val;
  },
  updateLoginStatus(state, val) {
    state.isLogin = val;
  },
  updateUserName(state, val) {
    state.UserName = val;
  },
  updateUserId(state, val) {
    state.UserId = val;
  },
  updateIsHome(state, val) {
    state.isHome = val;
  },
  updateShowSearch(state, val) {
    state.showSearch = val;
  },
  updateImportData(state, val) {
    state.importData = val;
  },
  updateIsImport(state, val) {
    state.isImport = val;
  },
  updateIsSearchDetail(state, val) {
    state.isSearchDetail = val;
  },
  updateClickSignAll(state, val) {
    state.clickSignAll = val;
  },
  updateClickSignSelect(state, val) {
    state.clickSignSelect = val;
  },
  updateIsStock(state, val) {
    state.isStock = val;
  },
}
