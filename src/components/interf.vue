<template>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'index',
  data () {
    return {
    }
  },
  computed: mapGetters({
    user: 'user'
  }),
  created () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      if (this.$kwz.isWx()) {
        let urlParam = this.$kwz.formatGetParam(window.location.href)
        // 微信访问
        if (/^qywx_.*$/.test(urlParam.state)) {
          // 企业微信访问 企业微信带后缀 state=gzh_
          this.$router.push({name: 'interfQyWx', params: urlParam})
        } else if (/^wxgzh_.*$/.test(urlParam.state)) {
          // 微信公众号访问 微信公众号带后缀 state=wxgzh_
          this.$router.push({name: 'interfWx', params: urlParam})
        }
      } else {
        // 普通浏览器网页访问
        if (this.user.name) {
          // 如果已登陆就跳到workspace
          this.$router.push('/workspace')
        } else {
          // 如果未登录就跳到首页
          this.$router.push('/index')
        }
      }
    }
  },
  components: {
  }
}
</script>
