<template>
  <section>
    <head-top></head-top>
    <router-view></router-view>
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import HeadTop from "@/components/HeadTop";

export default {
  name: "Index",
  componentName: "Index",
  data() {
    return {};
  },
  components: {
    HeadTop
  },
  computed: {
    ...mapState(["loading", "showNav"])
  },
  created() {},
  methods: {
    ...mapMutations(["setLoading", "setShowNav"])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
