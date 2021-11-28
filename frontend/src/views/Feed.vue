<template>
<div id="feed">
  <createPost/>
  <post/>
</div>
</template>

<script>
import createPost from "../components/createPost.vue"
import post from "../components/post.vue"
export default {
  name : 'feed',
  components : {
    createPost,
    post

  }
}
</script>

<style lang="scss">
</style>