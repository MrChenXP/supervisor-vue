<template>
  <div v-if="loadding">
    <loading :show="true" ></loading>
  </div>
</template>

<script>
import { Loading } from 'vux'
import { mapGetters } from 'vuex'

export default {
  name: 'index',
  data () {
    return {
      code: '',
      openid: '',
      loadding: true
    }
  },
  computed: mapGetters({
    user: 'user',
    wxgzh: 'wxgzh'
  }),
  created () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      this.$kwz.checkLogin(() => {
        this.$router.push('/workspace')
      }, () => {
        if (this.user.name) {
          this.$router.push('/workspace')
        } if (this.wxgzh.openid) {
          this.$router.push('/index')
        } else {
          let params = this.$route.params
          if (params.center) {
            // 中心服务器==》从微信菜单配置过来的 /?center=true
            this.toCenterInit()
          } else if (params.code) {
            // 有code，从微信认证服务器跳转过来的 /?code=xxx&state=wxgzh_  record
            this.code = params.code
            this.toChoseSsxByWxCode()
          } else if (params.OPENID) {
            // 有openid，从中心服务器跳转过来的 /?OPENID=xx
            this.openid = params.OPENID
            // 存入本地
            this.$store.dispatch('wxgzh', {openid: this.openid})
            this.toAuthWxGzhByWxOpenid()
          } else {
            this.loadding = false
          }
        }
      }, this)
    },
    checkGetWxOpenIdTimes () {
      return true
    },
    toCenterInit () {
      if (this.checkGetWxOpenIdTimes()) {
        // 公众号appid
        const appid = 'wxab6080f1b83b6a12'
        // 公众号返回路径
        const redirectUrl = 'http://mgd.qgjydd.cn/'
        // 获取用户信息范围
        const scope = 'snsapi_base'
        let wxUrl = encodeURI(redirectUrl)
        let state = 'wxgzh_'
        let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${wxUrl}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
        window.location.href = url
      }
    },
    toAuthWxGzhByWxOpenid () {
      this.$router.push('/index')
    },
    toSsx () {
      this.$router.push({name: 'choseSsx', params: {openid: this.openid}})
    },
    toChoseSsxByWxCode () {
      if (this.code) {
        this.$kwz.ajax.ajaxUrl({
          url: 'open/loadWxUser',
          data: {
            code: this.code
          },
          type: 'POST',
          vue: this,
          then (response) {
            let datas = response.data.datas
            if (datas && datas.STATE && datas.OPENID) {
              this.openid = datas.OPENID
              if (datas.STATE === '1') {
                let targetUrl = datas.URL
                if (targetUrl) {
                  targetUrl = targetUrl.replace(/\/$/, '')
                  targetUrl += targetUrl.indexOf('?') > 0 ? '&' : '?'
                  targetUrl += 'OPENID=' + datas.OPENID
                  targetUrl += '&state=wxgzh_'
                  window.location.href = targetUrl
                }
              } else {
                if (datas.STATE === '2') {
                  this.$kwz.alert('请重新选择要访问的区县')
                }
                this.toSsx()
              }
            }
          }
        })
      }
    }
  },
  components: {
    Loading
  }
}
</script>