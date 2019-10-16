<template>
  <div class="moreNews c_ContentMain">
    <!--标题栏-->
    <x-header class="c_header"
              :left-options="{preventGoBack: true}"
              @on-click-back="$router.push({path: '/index'})">
      {{TITLE}}
      <a slot="right" @click="searchShow = !searchShow">
        <span class="fa fa-search"></span> 搜索
      </a>
    </x-header>

    <!--搜索-->
    <div class="c_moreNews_Search" v-show="searchShow"  @click="searchShow = !searchShow;">
      <group class="c_moreNews_Search_group" @click.native="fn_moreNews_stopUP">
        <x-input title="标题" v-model="searchParam.bt"></x-input>
        <x-input title="作者" v-model="searchParam.zz"></x-input>
        <x-button @click.native="fn_moreNews">搜索</x-button>
      </group>
    </div>


    <group class="c_moreNews_list" v-for="(i,j) in listData" :key="j" >
      <cell :title="i.TITLE"></cell>
      <cell-form-preview :list="i.content" class="" @click.native="fn_news(i.CONTENT_ID)"></cell-form-preview>
    </group>
    <x-button @click.native="fn_moreNews_jzgd" :disabled="moreParam.hasMore" >{{moreParam.moreName}}</x-button>
  </div>
</template>

<script>
import {XHeader, Group, XInput, XButton, Cell, CellFormPreview} from 'vux'
export default {
  name: 'moreNews',

  components: {
    XHeader,
    Group,
    XInput,
    XButton,
    Cell,
    CellFormPreview
  },
  data () {
    return {
      searchShow: false,
      TITLE: '',
      searchParam: {
        page: 1,
        bt: '',
        zz: ''
      },
      listData: [],
      moreParam: {
        hasMore: false,
        moreName: '加载更多'
      }
    }
  },
  created () {
    // 解决进入此页面 自动滚动bug
    window.scrollTo(0, 0)
  },
  mounted () {
    this.loadData()
  },
  methods: {
    // 页面初始化
    loadData () {
      if (this.$route.query.btmc) {
        this.TITLE = this.$route.query.btmc
      }
      if (this.$route.query.ywlx) {
        this.searchParam.ywlx = this.$route.query.ywlx
        this.loadList()
      }
    },
    // 搜索
    fn_moreNews () {
      this.searchParam.page = 1
      this.loadList()
    },
    // 新闻详情页
    fn_news (id) {
      if (id) {
        this.$router.push({path: '/index/news', query: {id, btmc: this.TITLE, from: 'LIST', ywlx: this.searchParam.ywlx}})
      }
    },
    // 加载更多
    fn_moreNews_jzgd () {
      this.loadList(true)
    },
    fn_moreNews_stopUP (ev) {
      ev.stopPropagation()
    },
    // 加载更多/初始加载
    loadList (type) {
      this.$kwz.ajax.ajaxUrl({
        url: 'jc_content/open/doCmsFbPageList/' + this.searchParam.ywlx,
        data: {
          page: this.searchParam.page,
          TITLE: this.searchParam.bt,
          AUTHOR: this.searchParam.zz
        },
        vue: this,
        then (response) {
          let datas = response.data.datas
          if (datas && datas.length > 0) {
            let length = datas.length
            for (let i = 0; i < length; i++) {
              datas[i].content = [
                {
                  label: '作者',
                  value: datas[i].AUTHOR
                },
                {
                  label: '时间',
                  value: datas[i].TSSJ
                },
                {
                  label: '归属机构',
                  value: datas[i].ORG_MC
                }
              ]
            }
            this.searchParam.page ++
            this.moreParam.hasMore = false
            this.moreParam.moreName = '加载更多'
            if (type) {
              this.listData = this.listData.concat(datas)
            } else {
              this.listData = datas
            }
          } else {
            this.moreParam.hasMore = true
            if (type) {
              this.moreParam.moreName = '已无更多记录'
            } else {
              this.listData = []
              this.moreParam.moreName = '已记录'
            }
          }
        }
      })
    }
  }
}
</script>
<style>
.c_moreNews_list .weui-cells {
  margin-top: 0;
  width: 100%;
}
.c_moreNews_list .weui-cells .weui-cell{
  width: 100%;
  box-sizing: border-box;
  padding:3px 15px;
}
.c_moreNews_list .weui-cells .weui-cell .vux-cell-bd{
  width: 100%;
}
.c_moreNews_list .weui-cells .weui-cell:first-child .vux-cell-bd p{
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 15px;
}
.c_moreNews_list .weui-cells .weui-cell:last-child .weui-form-preview__bd .weui-form-preview__item{
  line-height: 1.3;
  font-size: 13px;
}
.c_moreNews_Search_group .vux-no-group-title{
  width: 95%;
  position: fixed;
  margin-top: 0;
  z-index: 20;
  top:46px;
  left: 2.5%;
  box-shadow: 0 0 5px 1px #a8a8a8;
  background: white;
  color: black;
  border-radius: 5px;
}
</style>
<style scoped>
  .c_moreNews_Search{
    width: 100vw;
    height: 100vh;
    z-index: 10;
    background: rgba(0, 0, 0,0.5);
    position: fixed;
    top: 0;
    left: 0;
  }
</style>
