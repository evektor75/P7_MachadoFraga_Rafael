<template>
  <div id="app" class="container-fluid">
    <top />
      <router-view/>
  </div>
</template>

<script>
import top from "./components/top.vue";

export default {
  components: {
    top
  },
};
</script>

<style lang="scss">

</style>
