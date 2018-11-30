// The Vue build version to load with the `import` command (runtime-only or
// standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import {
  getItem,
  authorFn
} from "./common/js/util"
/* 自定义主题 */
import '@/common/css/element-variables.scss'

// import 'jquery'
// import 'signalr'
/* es6支持 */
import "babel-polyfill";
import VueLazyload from 'vue-lazyload'
import {
  Pagination,
  Autocomplete,
  Button,
  Input,
  InputNumber,
  Carousel,
  CarouselItem,
  Table,
  TableColumn,
  Checkbox,
  CheckboxGroup,
  Select,
  Option,
  Tooltip,
  Message,
  Popover,
  Form,
  FormItem,
  Dialog,
  Upload,
  Radio,
  Loading,
  DatePicker,
  Collapse,
  CollapseItem,
} from 'element-ui'

import {
  emoji
} from './emojiUtils/emoji.js'
Vue.prototype.emoji = emoji

let bus = new Vue()
Vue.prototype.bus = bus

Vue.use(Pagination)
Vue.use(Autocomplete)
Vue.use(Button)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tooltip)
Vue.use(Popover)
Vue.use(CheckboxGroup)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Dialog)
Vue.use(Upload)
Vue.use(Radio)
Vue.use(DatePicker)
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Loading.directive);


Vue.prototype.$message = Message;

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'http://dtimg.aoshidata.com/common/no-book.png',
  loading: 'http://dtimg.aoshidata.com/common/loading.gif',
  attempt: 1
})

router.beforeEach(function (to, from, next) {
  // console.log(to)
  //判断是否在首页
  if (to.name == "Home") {
    store.commit('updateIsHome', false)
  } else {
    store.commit('updateIsHome', true)
  }
  // 判断是不是在搜索结果页
  if (to.name == "SearchDetail") {
    store.commit('updateIsSearchDetail', true)
  } else {
    store.commit('updateIsSearchDetail', false)
  }
  //判断是否在首页
  if (to.name == "SubAccount" || to.name == "Service" || to.name == "HotWordPage") {
    store.commit('updateShowSearch', false)
  } else {
    store.commit('updateShowSearch', true)
  }

  store.commit('setLoading', true)
  const hasNav = to.meta.hasNav;
  const navIndex = to.meta.index;

  /* 是否隐藏头部导航栏 */
  if (hasNav === false) {
    store.commit('setShowNav', false);
  } else {
    store.commit('setShowNav', true);
  }

  /* 切换导航栏当前项 */
  if (navIndex) store.commit('updateNavIndex', navIndex);

  const User = getItem('BigUser')
  if (!User && to.fullPath !== '/login' && to.fullPath !== '/home') {
    next('/login')
  }

  // 权限处理拦截
  if(User) {
    const channelLimit = User.Function;
    if(!(authorFn(channelLimit, '6')) && to.fullPath === '/multiProduct') {
      next('/home')
    }
    if(!(authorFn(channelLimit, '5')) && to.fullPath === '/keyProducts') {
      next('/home')
    }
    if(!(authorFn(channelLimit, '4')) && to.fullPath === '/material') {
      next('/home')
    }
    if(!(authorFn(channelLimit, '3')) && to.fullPath === '/themeActive') {
      next('/home')
    }
    if(!(authorFn(channelLimit, '2')) && to.fullPath === '/bestSell') {
      next('/home')
    }
    if(!(authorFn(channelLimit, '1')) && to.fullPath === '/newest') {
      next('/home')
    }
  }

  if (/\/http/.test(to.path)) {
    let url = to
      .path
      .split('http')[1]
    window.location.href = `http${url}`
  } else if (/\/www/.test(to.path)) {
    let url = to
      .path
      .split('www')[1]
    window.location.href = `http://www${url}`
  } else {
    next()
  }
})

router.afterEach(function (to) {
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 500);
})

/* eslint-disable no-new */
new Vue({
  el: '#app_wrap',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
