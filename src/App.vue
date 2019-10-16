<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    mounted () {
      window.onpopstate = () => {
        history.go(1)
      }
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/close.less';
</style>

<style>
  body {
    background-color: #fbf9fe;
  }
</style>
