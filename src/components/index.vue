<template>
  <div class="index c_IndexMain">

    <!--标题栏-->
    <x-header class="c_header" :left-options="{showBack: false}" >
      江西省督导平台
      <a slot="right" @click="$router.push({path: '/workspace'})">
        <span class="fa fa-exchange"></span>
      </a>
    </x-header>
    <!--底部导航-->
    <tab class="c_index_bottom_tabs"  custom-bar-width="0">
      <tab-item class="tab-item " selected @on-item-click="link('/index',$event)">
        <span class="fa fa-home"></span>
        <span>首页</span>
      </tab-item>
      <tab-item class="tab-item " v-if="user.name" @on-item-click="link('/workspace',$event)">
        <span class="fa fa-cubes"></span>
        <span>工作区</span>
      </tab-item>
      <tab-item class="tab-item " @on-item-click="link('/my',$event)">
        <span class="fa fa-user"></span>
        <span>我的</span>
      </tab-item>
    </tab>

    <!-- banner -->
    <swiper :list="swiperList" :aspect-ratio="9/16" :auto=true :loop=true> </swiper>

    <!-- 标题组 -->
    <div style="height:44px;" class="c_index_lbt">
      <sticky :offset="46" :check-sticky-support="false">
        <tab  :line-width="0" active-color="#000000" default-color="#000000">
          <tab-item  v-for="(i,j) in lbt"  v-bind:key="i.j"
                     :class="{c_index_tab_selected: itemSelected==j}"
                     @on-item-click="changeScroll(j)" >
            {{i.name}}
          </tab-item>
        </tab>
      </sticky>
    </div>

    <!-- 列表组 -->
    <group  v-for="(i,j,y) in lbBody_datas" v-bind:key="y" class="c_index_lbBody">
      <cell v-if="y" :title="i.bt" if-link ></cell>
      <cell-box class="c_index_lbBody_nr" v-for="(lb,y) in i.body" v-bind:key="y" @click.native="showDetail(lb.CONTENT_ID,i.bt)" >
        <div class="c_index_lbBody_nr_tv">
          <p class="fl">{{lb.TITLE}}</p>
          <p class="fr">{{lb.YWSJSJ}}</p>
        </div>
        <div class="c_index_lbBody_nr_label" >
          <p>{{lb.SHORT_TITLE}}</p>
        </div>
      </cell-box>
      <cell-box @click.native="showList(i.ywlx,i.bt)" >
        <div class="c_index_lbz_last">
          <span class="fa fa-hand-o-right"></span>查看更多
        </div>
      </cell-box>
    </group>

  </div>

</template>

<script>
import { XHeader, Swiper, Tab, TabItem, Group, Cell, CellBox, Sticky } from 'vux'
import { mapGetters } from 'vuex'
import defaultPng from '@/assets/img/defaults.png'
export default {
  name: 'index',
  data () {
    return {
      setTabFixed: false,
      // 图片新闻
      swiperList: [
      ],
      // 标题
      lbt: [],
      // 标题+内容
      lbBody_datas: {},
      itemSelected: 0
    }
  },
  computed: mapGetters({
    user: 'user',
    wx: 'wx'
  }),
  methods: {
    link (url, event) {
      this.$router.push({ path: url })
    },
    // 列表组滚动到标题时 标题组对应标题改变样式 列表组偏移值固定46+44
    handleScroll () {
      // 滚动距离
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // 窗口可视范围的高度 不兼容ie
      let height = document.documentElement.clientHeight
      let rheight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      )
      // 窗口可视范围的高度
      // 滚动条距离底部的高度
      let bheight = rheight - scrollTop - height
      let oLbBody = document.querySelectorAll('.c_index_lbBody')
      // 列表组
      let ol = oLbBody.length
      for (let x = 0; x < ol; x++) {
        // 若果滚动值 达到列表组偏移值 标题组改变样式
        if (scrollTop >= oLbBody[x].offsetTop - 46 - 44) {
          this.itemSelected = x
        } else if (bheight === 0) {
          this.itemSelected = ol - 1
        }
      }
      // 给最后一个div加百分百高
      let lastHeight = height - 46 - 44 - 44
      if (oLbBody[ol - 1]) {
        oLbBody[ol - 1].style.height = lastHeight + 'px'
      }
    },
    // 击标题组对应标题 页面滚动到对应列表组
    changeScroll (i) {
      this.itemSelected = i
      let oLbBody = document.querySelectorAll('.c_index_lbBody')
      let itemOffsetTop = oLbBody[i].offsetTop - 46 - 44
      // 点击改变滚动值 监听了滚动事件会调用handleScroll 标题组对应标题也会改变样式
      window.scrollTo(0, itemOffsetTop)
    },
    // 加载数据
    loadData () {
      this.$kwz.ajax.ajaxUrl({
        url: 'jc_mobile/open/getYkXtsz',
        type: 'POST',
        vue: this,
        then: response => {
          let datas = response.data.datas
          if (datas) {
            // 首页图片新闻
            let ykpic = []
            if (datas.YKPIC && datas.YKPIC.length > 0) {
              for (let i = 0; i < datas.YKPIC.length; i++) {
                ykpic.push({
                  url: 'javascript:void(0)',
                  img: this.$kwz.ajax.url() + 'index/visit/doDownload?F_ID=' + datas.YKPIC[i].F_ID,
                  title: datas.YKPIC[i].SHORT_TITLE
                })
              }
            } else {
              ykpic.push({
                url: 'javascript:void(0)',
                img: defaultPng,
                title: ''
              })
            }
            this.swiperList = this.swiperList.concat(ykpic)
            let tlb = []
            let tlbc = {}
            if (datas.YKINFO && datas.YKINFO.length > 0) {
              for (let i = 0; i < datas.YKINFO.length; i++) {
                let mk = datas.YKINFO[i]
                tlb.push({
                  name: mk.YWMC,
                  id: mk.PRO_ID,
                  url: mk.YWLX
                })
                tlbc[mk.YWLX] = {
                  ywlx: mk.YWLX,
                  id: mk.PRO_ID,
                  bt: mk.YWMC,
                  body: mk.CONTENT
                }
              }
            } else {
              tlb.push({name: '暂无新闻'})
            }
            this.lbBody_datas = tlbc
            this.lbt = tlb
          }
        }
      })
    },
    showDetail (id, btmc) {
      if (id) {
        this.$router.push({path: '/index/news', query: {id, btmc, from: 'INDEX'}})
      }
    },
    showList (ywlx, btmc) {
      if (ywlx) {
        this.$router.push({path: '/index/moreNews', query: {ywlx, btmc}})
      }
    }
  },
  mounted () {
    // 监听滚动事件
    window.addEventListener('scroll', this.handleScroll)
    this.loadData()
  },
  components: {
    Swiper,
    Tab,
    TabItem,
    Group,
    Cell,
    CellBox,
    Sticky,
    XHeader
  }
}
</script>
<style>
  .c_index_bottom_tabs{
    position: fixed !important;
    bottom: 0;
    width: 100%;
    z-index: 10;
  }
  .c_index_bottom_tabs .vux-tab-item{
    display: flex !important;
    flex-direction:column;
    justify-content: center;
    align-items: center;
  }
  .c_index_bottom_tabs .vux-tab-item span{
    line-height: 16px;
    display: inline-block;
  }

  .c_index_tab_selected{
    color: #04BE02 !important;
    border-bottom: 3px solid #04BE02 !important;
  }

  .index .c_index_lbBody .weui-cells{
    margin-top: 0;
  }
  .c_index_lbBody_nr{
    display: flex;
    flex-direction: column;
  }
  .c_index_lbBody_nr_tv{
    width: 100%;
  }
  .c_index_lbBody_nr_tv p:first-child{
    width: 80%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .c_index_lbBody_nr_tv p:last-child{
    width: 20%;
  }
  .c_index_lbBody_nr_label p{
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 14px;
    color: gray;
  }

  .c_index_lbz_last{
    width: 100%;
    text-align: center;
  }

</style>
