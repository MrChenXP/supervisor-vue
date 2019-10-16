<template>
  <div class="c_news c_ContentMain">
    <!--标题栏-->
    <x-header class="c_header" :left-options="{preventGoBack: true}" @on-click-back="toBack">
      {{TITLE}}
    </x-header>

    <!--标题和信息-->
    <header class="c_news_center">
      <h1>{{NEWS.bt}}</h1>
      <address  class="c_news_header_xx">
        <span>来源：{{NEWS.ly}}</span>
        <span>作者：{{NEWS.zz}}</span>
        <span>浏览次数：{{NEWS.llcs}}</span>
        <br>
        <span>时间：{{NEWS.time}}</span>
      </address>
    </header>

    <!--文章-->
    <div v-html="NEWS.body" class="c_news_center">
    </div>
    <footer class="c_news_center clearfix">
      <x-button class="fl" mini :disabled="topDisabled" @click.native="prevNews">上一页</x-button>
      <x-button class="fr" mini :disabled="bottomDisabled" @click.native="nextNews">下一页</x-button>
    </footer>
  </div>
</template>

<script>
  import {XHeader, XButton} from 'vux'
  export default {
    name: 'c_news',
    data () {
      return {
        TITLE: '',
        fromParam: {},
        PARAM: {
        },
        NEXT: '',
        PREV: '',
        NEWS: {
          bt: '',
          ly: '',
          zz: '',
          time: '',
          llcs: '',
          body: ''
        },
        topDisabled: true,
        bottomDisabled: false
      }
    },
    methods: {
      toBack () {
        if (this.fromParam.from === 'LIST') {
          this.$router.push({path: '/index/moreNews', query: {btmc: this.fromParam.btmc, ywlx: this.fromParam.ywlx}})
        } else {
          this.$router.push({path: '/index'})
        }
      },
      nextNews () {
        if (this.NEXT) {
          this.PARAM.id = this.NEXT
          this.loadNews()
        }
      },
      prevNews () {
        if (this.PREV) {
          this.PARAM.id = this.PREV
          this.loadNews()
        }
      },
      loadData () {
        let query = this.$route.query
        this.fromParam = query
        this.TITLE = query.btmc
        if (query.id) {
          this.PARAM.id = query.id
          this.loadNews()
        }
      },
      loadNews () {
        if (this.PARAM && this.PARAM.id) {
          this.$kwz.ajax.ajaxUrl({
            url: 'jc_mobile/open/getContent',
            type: 'POST',
            data: {
              CONTENTID: this.PARAM.id
            },
            vue: this,
            then (response) {
              let datas = response.data.datas
              if (datas) {
                this.NEWS.bt = datas.TITLE
                this.NEWS.ly = datas.LY || '本站原创'
                this.NEWS.zz = datas.AUTHOR
                this.NEWS.time = datas.RELEASE_DATE
                this.NEWS.llcs = datas.DJS
                this.NEWS.body = datas.TXT
              }
              this.bottomDisabled = this.topDisabled = true
              if (datas.nextCONTENT_ID) {
                this.NEXT = datas.nextCONTENT_ID
                this.bottomDisabled = false
              }
              if (datas.preCONTENT_ID) {
                this.PREV = datas.preCONTENT_ID
                this.topDisabled = false
              }
            }
          })
        }
      }
    },
    mounted () {
      this.loadData()
    },
    components: {
      XButton,
      XHeader
    }
  }
</script>
<style scoped>
  .c_news{
    width: 100vw;
  }
  .c_news_center{
    margin: 0 5px;
    width: 100%;
  }
  header h1{
    font-size: 20px;
  }
  header{
    text-align: center;
  }
  .c_news_header_xx span{
    margin-right: 10px;
  }
  footer button{
    margin: 10px auto !important;
  }
</style>
