<template>
  <div class="workspace c_IndexMain">

    <!--标题栏-->
    <x-header class="c_header" :left-options="{showBack: false}" >
      江西省督导平台
    </x-header>
    <!--底部导航-->
    <tab class="c_workspace_bottom_tab"  custom-bar-width="0">
      <tab-item class="tab-item" @on-item-click="link('/index',$event)">
        <span class="fa fa-home"></span>
        <span>首页</span>
      </tab-item>
      <tab-item class="tab-item" v-if="user.name" selected @on-item-click="link('/workspace',$event)">
        <span class="fa fa-cubes"></span>
        <span>工作区</span>
      </tab-item>
      <tab-item class="tab-item" @on-item-click="link('/my',$event)">
        <span class="fa fa-user"></span>
        <span>我的</span>
      </tab-item>
    </tab>

    <!--公告-->
    <group v-if="false">
      <cell title="统计数据">
        <marquee>
          <marquee-item v-for="i in 5" :key="i" >第{{i}}条信息</marquee-item>
        </marquee>
      </cell>
    </group>

    <!-- 功能标题组 -->
    <div style="height:44px;" class="">
      <sticky :offset="46" :check-sticky-support="false">
        <tab  :line-width="0" active-color="#000000">
          <tab-item  v-for="(i,j) in gnbtz"  v-bind:key="i.j" :class="{c_workspace_tab_selected: itemSelected==j}" @on-item-click="changeScroll(j)" >
            {{i.PRO_MC}}
          </tab-item>
        </tab>
      </sticky>
    </div>
    <!--功能列表组-->
    <div v-for="(x,y,z) in gnlbz_datas" v-bind:key="z" class="c_workspace_gnBody"
         :style="gnlbz_datas_length-1==z?style:null">
      <group-title v-if="z">{{x.PRO_MC}}</group-title>
      <grid :show-lr-borders="false" :show-vertical-dividers="false" :cols="4">
        <grid-item v-for="(i,j) in x.children" :label="i.PRO_MC" :key="j" :link="i.FUN_PATH">
          <span slot="icon" :class="[i.PRO_PIC,'fa-2x']"></span>
        </grid-item>
      </grid>
    </div>
  </div>
</template>

<script>
import {XHeader, Tab, TabItem, Grid, GridItem, GroupTitle, Group, Cell, Marquee, MarqueeItem, Sticky} from 'vux'
import {mapGetters} from 'vuex'
import {VUE_MENU_ID} from '@/router/index'
export default {
  name: 'workspace',
  data () {
    return {
      gnbtz: [],
      gnlbz_datas: [],
      itemSelected: 0,
      style: '',
      gnlbz_datas_length: 0
    }
  },
  components: {
    Grid,
    GridItem,
    GroupTitle,
    Group,
    Cell,
    Marquee,
    MarqueeItem,
    Sticky,
    Tab,
    TabItem,
    XHeader
  },
  methods: {
    loadMenus () {
      this.$kwz.ajax.ajaxUrl({
        url: 'open/loadMenus',
        type: 'POST',
        vue: this,
        then (response) {
          let data = response.data.datas
          if (data._menus_ && data._menus_.children && data._menus_.children.length > 0) {
            let dataMenus = []
            let menus = data._menus_.children
            if (menus && menus.length > 0) {
              let length = menus.length
              for (let i = 0; i < length; i++) {
                let topMenu = menus[i]
                if (topMenu.children && topMenu.children.length > 0) {
                  let secondChildren = []
                  let length2 = topMenu.children.length
                  for (let j = 0; j < length2; j++) {
                    let sencondMenu = topMenu.children[j]
                    if (VUE_MENU_ID[sencondMenu.PRO_ID]) {
                      sencondMenu.FUN_PATH = '/' + sencondMenu.PRO_ID
                      secondChildren.push(sencondMenu)
                    }
                  }
                  if (secondChildren.length > 0) {
                    topMenu.children = secondChildren
                    dataMenus.push(topMenu)
                  }
                }
              }
            }
            this.gnbtz = dataMenus
            this.gnlbz_datas = dataMenus
          }
          if (data.writePath) { this.$store.dispatch('auths', data.writePath) }
          if (data._menus_.children) { this.$store.dispatch('menus', data._menus_.children) }
        }
      })
    },
    // 底部导航点击后 跳转页面、svg变换样式(固定绿色字体)
    link (url, event) {
      this.$router.push({path: url})
    },
    // 点击标题组对应标题 页面滚动到对应列表组
    changeScroll (i) {
      this.itemSelected = i
      let oGnBody = document.querySelectorAll('.c_workspace_gnBody')
      let itemOffsetTop = oGnBody[i].offsetTop - 46 - 44
      // 点击改变滚动值 监听了滚动事件会调用handleScroll 标题组对应标题也会改变样式
      window.scrollTo(0, itemOffsetTop)
    },
    // 列表组滚动到标题时 标题组对应标题改变样式 列表组偏移值固定46+44
    fn_workspace_handleScroll () {
      // 滚动距离
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // 窗口可视范围的高度 不兼容ie
      let height = document.documentElement.clientHeight
      // 窗口可视范围的高度
      let rheight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
      // 滚动条距离底部的高度
      let bheight = rheight - scrollTop - height
      let oGnBody = document.querySelectorAll('.c_workspace_gnBody')
      let ol = oGnBody.length
      for (let x = 0; x < ol; x++) {
        // 若果滚动值 达到列表组偏移值 标题组改变样式
        if (scrollTop >= (oGnBody[x].offsetTop - 46 - 44)) {
          this.itemSelected = x
        } else if (bheight === 0) {
          this.itemSelected = ol - 1
        }
      }
      // 给最后一个div加百分百高
      let lastHeight = height - 46 - 44 - 44
      this.gnlbz_datas_length = Object.keys(this.gnlbz_datas).length
      this.style = `height:${lastHeight}px`
    }
  },
  computed: mapGetters({
    user: 'user'
  }),
  mounted () {
    // 监听滚动事件
    window.addEventListener('scroll', this.fn_workspace_handleScroll)
  },
  created () {
    this.loadMenus()
  }
}
</script>
<style scoped>
  .c_workspace_bottom_tab{
    position: fixed !important;
    bottom: 0;
    width: 100%;
    z-index: 10;
  }
  .c_workspace_bottom_tab .vux-tab-item{
    display: flex !important;
    flex-direction:column;
    justify-content: center;
    align-items: center;
  }
  .c_workspace_bottom_tab .vux-tab-item span{
    line-height: 16px;
    display: inline-block;
  }



  .c_workspace_tab_selected{
    color: #04BE02 !important;
    border-bottom: 3px solid #04BE02 !important;
  }

  .c_workspace_gnBody {
    overflow: hidden;
    background: white;
    border-radius: 3px 3px 3px 3px;
  }
</style>
