<template>
  <div id="app">
    <top/>
      <transition mode="out-in" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
      <router-view/>
      </transition>
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
@import url('https://fonts.googleapis.com/css?family=Numans');
html,
body {
	background-color: #FFAE9D!important;
	opacity: 0.85;
	background-size: cover;
	background-repeat: no-repeat;
	height: 100%;
  min-width:375px;
	font-family: 'Numans'!important, sans-serif;
}

</style>
