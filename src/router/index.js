import Vue from "vue";
import Router from "vue-router";

const App = () =>
  import ("@/App.vue");
const Index = () =>
  import ("@/pages/Index.vue");
/* 首页 */
const Home = () =>
  import ("@/pages/Home.vue");
const Login = () =>
  import ("@/pages/Login.vue");
const ShopCart = () =>
  import ("@/pages/ShopCart.vue");
const SearchDetail = () =>
  import ("@/pages/searchDetail/SearchDetail.vue");
const DetailPage = () =>
  import ("@/pages/DetailPage.vue");
const ThemeActive = () =>
  import ("@/pages/ThemeActive.vue");
const SubAccount = () =>
  import ("@/pages/SubAccount.vue");
const MultiProduct = () =>
  import ("@/pages/polyBasic/MultiProduct.vue");
const MyOrder = () =>
  import ("@/pages/MyOrder.vue");
const OrderDetail = () =>
  import ("@/pages/OrderDetail.vue");
const BestSell = () =>
  import ("@/pages/bestSell/BestSell.vue");
const Newest = () =>
  import ("@/pages/newest/Newest.vue");
const Material = () =>
  import ("@/pages/material/Material.vue");
const KeyProducts = () =>
  import ("@/pages/keyProducts/KeyProducts.vue");
const ThemeActiveLeaf = () =>
  import ("@/pages/themeActiveLeaf/ThemeActiveLeaf.vue");
const Service = () =>
  import ("@/pages/Service.vue");

const HotWordPage = () =>
  import ("@/pages/hotWordPage/HotWordPage.vue");

Vue.use(Router);

export default new Router({
  routes: [{
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        hasNav: false
      }
    },
    {
      path: "/index",
      name: "Index",
      component: Index,
      redirect: {
        path: "/home"
      },
      children: [{
          path: "/home",
          name: "Home",
          component: Home,
          meta: {
            index: "1"
          }
        },
        {
          path: "/shopCart",
          name: "ShopCart",
          component: ShopCart,
          meta: {
            hasNav: false
          }
        },
        {
          path: "/subAccount",
          name: "SubAccount",
          component: SubAccount,
          meta: {
            hasNav: false
          }
        },
        {
          path: "/searchDetail",
          name: "SearchDetail",
          component: SearchDetail,
          meta: {
            hasNav: false
          }
        },
        {
          path: "/themeActive",
          name: "ThemeActive",
          component: ThemeActive,
          meta: {
            index: "4"
          }
        },
        {
          path: "/themeActiveLeaf/:activeId",
          name: "ThemeActiveLeaf",
          component: ThemeActiveLeaf
        },
        {
          path: "/multiProduct/:type",
          name: "MultiProduct",
          component: MultiProduct,
          meta: {
            index: "7"
          }
        },
        {
          path: "/bestSell/:type",
          name: "BestSell",
          component: BestSell,
          meta: {
            index: "3"
          }
        },
        {
          path: "/newest/:type",
          name: "Newest",
          component: Newest,
          meta: {
            index: "2"
          }
        },
        {
          path: "/material/:type",
          name: "Material",
          component: Material,
          meta: {
            index: "5"
          }
        },
        {
          path: "/keyProducts/:type",
          name: "KeyProducts",
          component: KeyProducts,
          meta: {
            index: "6"
          }
        },
        {
          path: "/myOrder",
          name: "MyOrder",
          component: MyOrder,
          meta: {
            hasNav: false
          }
        },
        {
          path: "/orderDetail/:id",
          name: "OrderDetail",
          component: OrderDetail,
          meta: {
            hasNav: false
          }
        },
        {
          path: "/book/:channel/:category/:id",
          name: "DetailPage",
          component: DetailPage,
          meta: {
            hasNav: true
          }
        },
        {
          path: "/service/:channel",
          name: "Service",
          component: Service,
          meta: {
            hasNav: false
          }
        },
        {
          path: "/hotWordPage/:searchText",
          name: "HotWordPage",
          component: HotWordPage,
          meta: {
            hasNav: false
          }
        },
      ]
    },
    {
      path: "*",
      redirect: "/home"
    }
  ]
});
