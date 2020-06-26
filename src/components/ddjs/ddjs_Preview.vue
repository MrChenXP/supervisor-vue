<template>
  <div class="c_ddjs_Preview c_ContentMain">
    <!--标题栏-->
<!--    <x-header class="c_header" :left-options="{preventGoBack: true}" title="督导预览"-->
<!--              @on-click-back="$router.push({path: '/ebc60e699bc642a1871f1e017b979483'})">-->
<!--    </x-header>-->
    <!-- 广西的 -->
    <x-header class="c_header" :left-options="{preventGoBack: true}" title="督导预览"
              @on-click-back="$router.push({path: '/f53898d10997419ca2a8185dee802d1b'})">
    </x-header>
    <div class="c_ddjs_Preview_body">
      <!--标题-->
      <div class="c_ddjs_Preview_title">
        <p class="c_ddjs_Preview_title_first text-bold">
          <span>{{ddjsData.XXMC}}</span>
        </p>
        <p class="c_ddjs_Preview_title_last">
          <span>{{ddjsData.YWSJ}}</span>
          &nbsp;&nbsp;&nbsp;
          <span>{{ddjsData.USERNAME}}</span>
        </p>
      </div>

      <!--工作安排（督导事项）(计划)-->
      <div class="c_ddjs_Preview_gzap c_full_parentImg" v-if="ddsxShow">
        <p class="c_ddjs_Preview_gzap_title text-bold">督导事项</p>
        <div v-html="gzjhData.TXT">
          <!-- <p>这里是工作安排(以前叫督导事项)文字</p> -->
          <!--<img src="../../assets/img/mrtx.jpg">-->
        </div>
      </div>

      <!--督导纪实-->
      <div class="c_ddjs_Preview_gzap c_full_parentImg" v-if="ddjsShow">
        <p class="c_ddjs_Preview_gzap_title text-bold">督导纪实</p>
        <div v-html="ddjsData.DDJS"></div>
      </div>
      <!--评估结果-->
      <div class="c_ddjs_Preview_gzap" v-if="pgbzShow">
        <p class="c_ddjs_Preview_gzap_title text-bold">评估结果</p>
        <p>{{pgbzData.tbmbglData.BZMC}}</p>
        <div v-html="pgbzData.sjsHtml[0]"></div>

      </div>

      <!--亮点(典型经验和做法)-->
      <div class="c_ddjs_Preview_gzap" v-if="dxjyzfShow">
        <p class="c_ddjs_Preview_gzap_title text-bold">亮点</p>
        <div v-html="ddjsData.DXJY"></div>
      </div>

      <!--存在问题-->
      <div class="c_ddjs_Preview_gzap" v-if="wtShow">
        <p class="c_ddjs_Preview_gzap_title text-bold">问题</p>
        <div v-html="ddjsData.CZWT"></div>
      </div>

      <!--整改通知-->
      <div class="c_ddjs_Preview_gzap" v-if="zgtzShow">
        <p class="c_ddjs_Preview_gzap_title text-bold">后续处理意见</p>
        <div v-if="this.zggzData.ZGXSDM ==='1'">
          经挂牌督导，你单位存在以下问题及建议:<br>
          {{zggzData.XSNR}}<br>
          对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发 {{zggzData.CLQX}} 日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。<br>
          <p class="c_ddjs_Preview_gzap_time">{{zggzData.YWSJ}}</p>
        </div>
        <div v-if="this.zggzData.ZGXSDM ==='2'">
          我室责任督学于 {{zggzData.YWSJ}} 对 {{ddjsData.JHXXMC}} 进行了教育督导，发现该学校(幼儿园)存在以下问题及建议:<br>
          {{zggzData.XSNR}}<br>
          请贵科室（中心）予以支持、配合、协调解决!<br>
          <p class="c_ddjs_Preview_gzap_time">{{zggzData.YWSJ}}</p>
        </div>
        <div>
          <span>处理结果:</span>
          <div v-html="zggzData.CLBG"></div>
        </div>
      </div>

      <!--整改报告-->
      <div class="c_ddjs_Preview_gzap" v-if="zgbgShow">
        <p class="c_ddjs_Preview_gzap_title text-bold">整改报告</p>
        <div v-html="zggzData.CZWT"></div>
      </div>
    </div>

  </div>
</template>

<script>
  import { XHeader } from 'vux'

  export default {
    name: 'c_ddjs_Preview',
    components: {
      XHeader
    },
    data () {
      return {
        pgbzShow: false,
        ddsxShow: false,
        ddjsShow: false,
        dxjyzfShow: false,
        wtShow: false,
        zgtzShow: false,
        zgbgShow: false,
        formData: {
          CONTENT_ID: ''
        },
        // 督导纪实相关数据
        ddjsData: {},
        // 工作计划相关数据
        gzjhData: {},
        // 整改工作相关数据
        zggzData: {},
        // 评估工作相关数据
        pgbzData: {}
      }
    },
    created () {
      this.initPage()
    },
    methods: {
      initPage () {
        let query = this.$route.query
        if (query && query.id) {
          this.formData.CONTENT_ID = query.id
          this.loadDDjsData()
        }
      },
      // 加载督导纪实
      loadDDjsData () {
        this.$kwz.ajax.ajaxUrl({
          url: 'ddjl/doSelectByPrimaryKey',
          type: 'POST',
          data: {
            CONTENT_ID: this.formData.CONTENT_ID
          },
          vue: this,
          then (response) {
            let datas = response.data.datas
            if (datas && datas.CONTENT_ID) {
              if (datas.DDJS) {
                datas.DDJS = datas.DDJS.replace(/<img\s{1}/gim, (a) => {
                  return a + 'width="100%"'
                })
              }
              this.ddjsData = datas
              this.ddjsShow = !!datas.DDJS
              this.dxjyzfShow = !!datas.DXJY
              this.wtShow = !!datas.CZWT
              this.loadZgxsData()
              this.loadGzjhData()
            }
          }
        })
      },
      // 加载工作计划
      loadGzjhData () {
        if (this.ddjsData.GZAP_YWID) {
          this.$kwz.ajax.ajaxUrl({
            url: 'dd_gzap/doSelectByPrimary/DDGZAP',
            type: 'POST',
            data: {
              CONTENT_ID: this.ddjsData.GZAP_YWID
            },
            vue: this,
            then (response) {
              let datas = response.data.datas
              if (datas && datas.map && datas.map.CONTENT_ID) {
                this.gzjhData = datas.map
                this.ddsxShow = !!datas.map.TXT
                this.loadPgbzData()
              }
            }
          })
        }
      },
      // 加载后续处理意见
      loadZgxsData () {
        if (this.ddjsData.CONTENT_ID) {
          this.$kwz.ajax.ajaxUrl({
            url: 'dd_zgxs/selectZgxsList',
            type: 'POST',
            data: {
              CONTENT_ID: this.ddjsData.CONTENT_ID
            },
            vue: this,
            then (response) {
              let datas = response.data.datas
              if (datas && datas.length > 0) {
                let zgxs = datas[0]
                // ios只支持(yyyy/mm/dd)这种格式日期 所以要正则-换成/ 否则ios获取的时间是NaN
                let oDate = new Date(zgxs.YWSJ.replace(/-/g, '/'))
                zgxs.YWSJ = `${oDate.getFullYear()}年${oDate.getMonth() + 1}月${oDate.getDate()}日`
                this.zggzData = zgxs
                this.zgtzShow = !!zgxs.ZGXSID
              }
            }
          })
        }
      },
      // 加载评估标准数据
      loadPgbzData () {
        let pgdx = this.ddjsData.USERID ? this.ddjsData.USERID.split(',') : []
        if (this.gzjhData.BZID && this.ddjsData.PGID && pgdx.length > 0) {
          // 取模板数据
          this.$kwz.ajax.ajaxUrl({
            url: 'jc_pgbz/selectTbmbglByKey',
            type: 'POST',
            data: {
              BZID: this.gzjhData.BZID
            },
            vue: this,
            then (response) {
              let datas = response.data.datas
              if (datas && datas.tbmbglData) {
                this.pgbzData = datas
                let pgdx = this.ddjsData.USERID.split(',')
                // 取所有督学的打分数据
                let ajaxParam = []
                for (let i = 0; i < pgdx.length; i++) {
                  ajaxParam.push({
                    url: 'jc_pgbzmx/getMxByTbr/DDPGBZ',
                    type: 'POST',
                    data: {
                      PGID: this.ddjsData.PGID,
                      tbr: pgdx[i],
                      MB_ORG_ID: this.ddjsData.ORG_ID
                    }
                  })
                }
                // 合并加载打分数据
                let _this = this
                this.$kwz.ajax.ajaxAll(ajaxParam, function () {
//                  第一次进并不会显示评估，是ajax.ajaxAll--axios.all/axios.spread这两个方法用错了
//                  所以暂时屏蔽评估结果
                  let sjsHtml = []
                  if (arguments && arguments.length > 0) {
                    for (let i = 0; i < arguments.length; i++) {
                      let res = arguments[i].data.datas
                      if (res && res.SJ) {
                        try {
                          let sj = JSON.parse(res.SJ)
                          sjsHtml.push(_this.$kwz.formatPgbzHtml(_this.pgbzData.tbmbglData.MBNR, sj))
                        } catch (e) {
                          console.error(e)
                        }
                      }
                    }
                  }
                  _this.pgbzData.sjsHtml = sjsHtml
                  _this.pgbzShow = !!sjsHtml.length // 评估结果显示隐藏
                })
              }
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .c_ddjs_Preview_body{
    padding: 15px;
  }
  .c_ddjs_Preview_body img{
    max-width: 100%;
  }

  .c_ddjs_Preview_title_first span{
    font-size: 20px;
  }
  .c_ddjs_Preview_title_last span{
    font-size: 14px;
  }
  .c_ddjs_Preview_title_last span:last-child{
    color: #9BB7E1;
  }

  .c_ddjs_Preview_gzap{
    margin-top: 10px;
    word-wrap: break-word;
  }
  .c_ddjs_Preview_gzap_title{
    font-size: 18px;
  }


  .c_ddjs_Preview_gzap_time{
    text-align: right;
  }
</style>
