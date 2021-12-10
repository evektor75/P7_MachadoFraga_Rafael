<template>
  <div id="app">
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
html {
  background-color: #FFAE9D!important;
}

</style>
