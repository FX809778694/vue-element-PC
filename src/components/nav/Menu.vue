<template>
  <ul>
    <slot></slot>
  </ul>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "NavMenu",
  componentName: "NavMenu",
  data() {
    return {
      activeIndex: this.defaultActive
    };
  },
  provide() {
    return {
      rootMenu: this
    };
  },
  props: {
    defaultActive: {
      type: String,
      default: ""
    }
  },
  watch: {
    navActiveIndex(val, oldVal) {
      this.activeIndex = val;
    }
  },
  computed: {
    ...mapState(["loading", "showNav", "Search", "navActiveIndex"])
  },
  mounted() {
    this.$on("item-click", this.handleItemClick);
  },
  methods: {
    ...mapMutations(["setLoading", "setShowNav", "updateSearch"]),
    handleItemClick(item) {
      this.activeIndex = item.index;
    }
  }
};
</script>

<style lang="scss">
@import "../../common/css/_var";

/* 导航栏 */
.nav_wrap {
  width: 100%;
  height: 36px;
  background-color: $theme_color;
  .nav {
    width: 1200px;
    margin: 0 auto;
    li {
      font-size: 16px;
      line-height: 18px;
      padding: 9px 0;
      letter-spacing: 0.8px;
      cursor: pointer;
      > a {
        padding: 0 43px;
        color: #fefefe;
        border-left: 1px solid #ba0909;
      }
    }
    .active {
      background-color: #fff;
      > a {
        border-left: none;
        color: $theme_color;
        background-color: #fff;
      }
    }
    .active + li {
      > a {
        border-left: none;
      }
    }
  }
}
</style>
