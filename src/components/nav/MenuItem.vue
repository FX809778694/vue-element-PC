<template>
  <li
    :class="{'active': active}"
    class="fl"
    @click="handleItemClick"
  >
    <slot></slot>
  </li>
</template>

<script>
import Menu from "./menu-mixin";
import Emitter from "@/common/js/emitter";

export default {
  name: "MenuItem",
  componentName: "MenuItem",
  mixins: [Menu, Emitter],
  props: {
    index: {
      type: String,
      required: true
    },
    disabled: Boolean
  },
  computed: {
    active: function() {
      return this.rootMenu.activeIndex === this.index;
    }
  },
  methods: {
    handleItemClick() {
      if (!this.disabled) {
        /* 派发组件自身点击事件至父组件 */
        this.dispatch("NavMenu", "item-click", this);
        /* 触发组件自定义点击事件 */
        this.$emit("click", this);
      }
    }
  }
};
</script>

<style lang="scss">
</style>
