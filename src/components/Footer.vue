<template>
  <footer class="footer-wrap">
    <p>Copyright(C)湖北新华书店（集团）版权所有  违者必究 | <a>联系我们</a></p>
  </footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style lang="scss" scoped>
@import "../common/css/_var";

/* 网站底部 */
.footer-wrap {
  width: 100%;
  height: 50px;
  margin-top: 30px;
   background: $bg_color_ed;
   border-bottom: 1px solid $bg_color_ed;
  text-align: center;
  line-height: 50px;
  & p {
    color: $font_color_999;
  }
  & a {
    color: $btn-color;
    text-decoration: none;
    cursor: pointer;
  }
}
</style>
