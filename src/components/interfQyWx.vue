<template>
  <div >
    <loading :show="loadding" ></loading>
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
      userid: '',
      loadding: true,
      menuid: '',
      agentid: ''
    }
  },
  computed: mapGetters({
    user: 'user',
    qywx: 'qywx'
  }),
  created () {
    this.init()
  },
  methods: {
    // 进入这个页面的情况有以下几种：
    // 1. 从企业微信跳转过来的，/?menuid=sdfdf&agentid=aad&state=qywx_
    // 2. 从腾讯认证服务器跳转过来的/code=sfewf&state=qywx_{menuid}_agentid
    init () {
      let params = this.$route.params
      if (params && params.menuid) {
        this.menuid = params.menuid
      }
      // 检查是否登陆
      this.$kwz.checkLogin(() => {
        this.doAuthIn()
      }, () => {
        if (params) {
          if (this.menuid) {
            if (this.user.name) {
              this.toMenu()
            } else {
              this.toGetQyWxCode()
            }
          } else if (params.code) {
            this.code = params.code
            let state = params.state
            let paramsArray = state ? state.split('_') : []
            if (paramsArray.length > 2) {
              this.menuid = paramsArray[1]
              this.agentid = paramsArray[2]
            }
            this.toAuthQyWx()
          }
        } else {
          this.loadding = false
        }
      }, this)
    },
    toGetQyWxCode () {
      if (!this.$kwz.ajaxInited) {
        let _this = this
        setTimeout(function () {
          _this.toGetQyWxCode()
        }, 500)
      } else {
        if (this.checkGetWxOpenIdTimes()) {
  //       龙华(高新)(挂牌督导)
  //        const redirectUrl = 'http://mgd.qgjydd.cn/' // 公众号返回路径domain
  //        const corpid = 'ww0855eef0a3995494' // 企业号corpid
  //       江西
  //        const redirectUrl = 'http://ddwx.jxedu.gov.cn/' // 公众号返回路径domain
  //        const corpid = 'wwd5d28e63b0a86cab' // 企业号corpid
  //       广东dc(广东省教育督导)
  //         const redirectUrl = 'http://dcwx.gdedu.gov.cn/' // 公众号返回路径
  //         const corpid = 'wwc7d621daaf66bf60' // 企业号corpid
            // 获取用户信息范围
          // const redirectUrl = this.$kwz.domain // domain
          // const corpid = this.$kwz.corid // corid
//          alert('this.$kwz.domain ' + this.$kwz.domain)
//          alert('this.$kwz.corid ' + this.$kwz.corid)
//          alert('interfQyWx redirectUrl(domain) ' + redirectUrl)
//          alert('interfQyWx corpid ' + corpid)
          const scope = 'snsapi_base'
          let wxUrl = encodeURI(redirectUrl)
          let state = `qywx_${this.menuid}_${this.agentid}`
          let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${corpid}&redirect_uri=${wxUrl}&response_type=code&scope=${scope}&agentid=${this.agentid}&state=${state}#wechat_redirect`
          window.location.href = url
        }
      }
    },
    // 登录完加载数据
    loadData () {
      this.loadding = false
      this.$kwz.ajax.ajaxUrl({
        url: 'open/loadInfos',
        vue: this,
        type: 'POST',
        then (response) {
          let datas = response.data.datas
          if (datas) {
            let user = {
              name: datas.name,
              tx: datas.tx,
              ddlx: datas.ddlx,
              zw: datas.zw
            }
            this.$store.dispatch('login', user)
          }
        }
      })
    },
    doAuthIn () {
      this.$store.dispatch('qywx', {'type': true})
      // 加载数据
      this.loadData()
      this.$router.push('/' + this.menuid)
    },
    toAuthQyWx () {
      if (this.code && this.menuid) {
        this.$kwz.ajax.ajaxUrl({
          url: 'open/doQxWxUserIdLogin',
          type: 'POST',
          data: {
            CODE: this.code,
            MENUID: this.menuid
          },
          vue: this,
          then (response) {
            let datas = response.data.datas
            if (datas && datas.wxQyWxLogin === 'true') {
              // 重新初始化kwz token
              this.$kwz.initToken()
              this.doAuthIn()
            } else {
              this.$kwz.alert('授权失败，请联系管理员')
            }
          }
        })
      } else {
        this.$kwz.alert('非法访问')
      }
    },
    toMenu () {
      this.$router.push('/' + this.menuid)
    },
    checkGetWxOpenIdTimes () {
      return true
    }
  },
  components: {
    Loading
  }
}
</script>
