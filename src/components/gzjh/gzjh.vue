<template>
  <div class="c_ListMian">
    <!--标题栏-->
    <x-header class="c_header" :left-options="{preventGoBack: true, showBack: !qywx.type}" @on-click-back="$router.push({path: '/workspace'})">
      工作计划
      <a slot="right" @click.stop="toSearch">
        <span class="fa fa-search"> 搜索</span>
      </a>
    </x-header>
    <!--删除增加功能区-->
    <div class="c_addDel">
      <group class="clearfix">
        <x-button v-if="!check.checkboxDelete" v-show="getPermission('dd_gzap/doDelete')"
                  @click.stop.native="toDelete" plain mini type="warn" class="fl">删除</x-button>
        <x-button v-else  v-show="getPermission('dd_gzap/doDelete')"
                  @click.stop.native="doDelete" plain mini type="warn" class="fl">确定删除</x-button>

        <x-button slot="" v-if="addhShow" v-show="getPermission('dd_gzap/toAdd')"
                  @click.stop.native="toAdd" plain mini type="primary" class="fr">
          <span class="fa fa-plus text_bolder">&nbsp;新增</span>
        </x-button>
        <x-button v-if="check.checkAllBtn" @click.stop.native="checkAll" plain mini type="primary" class="fr">全选</x-button>
        <x-button v-if="check.cancelCheckAllBtn" @click.stop.native="unCheckAll" plain mini type="primary" class="fr">取消全选</x-button>
      </group>
    </div>

    <!--搜索选项隐藏区 -->
    <div v-if="searchParam.show">
        <div class="c_searchBody_content">
          <popup-picker  confirm-text="确定" title="学期" required :data="searchCondition.DM_XQ"
                         :show-name="true" v-model="searchParam.xqValue"></popup-picker>
          <popup-picker  confirm-text="确定" title="学段" required :data="searchCondition.DM_XD"
                         :show-name="true" v-model="searchParam.xdValue"></popup-picker>
          <cell title="学校名称" class="c_gzjh_searchShow_xxmc">
            <search :auto-fixed = false class="" v-model.trim="searchParam.xxmc"
                    placeholder="请输入学校名称" auto-scroll-to-top ref="search"></search>
          </cell>
          <x-button type="primary" @click.stop.native="searchList">确定</x-button>
      </div>
      <!--遮罩层-->
      <div class="c_searchBody_mask" @click.stop="toSearch">
      </div>
    </div>

    <!--列表-->
    <group class="c_card_lb" v-for="(i,j) in dataList" :key="j"
           @click.stop.native="toDetail(i.CONTENT_ID)" >
      <cell class="c_card_lb_school" :value="i.STATUSMC">
        <div slot="title">
          <input v-show="check.checkboxDelete" type="checkbox" @click.stop="checkValue(i.CONTENT_ID)" :checked="check.checkValue[i.CONTENT_ID]" >
          <span class="fa fa-map-marker"></span>&nbsp;{{i.ORG_ID_TARGET}}
        </div>
      </cell>
      <cell :title="i.JGXM" :value="i.DDSD">
      </cell>
      <cell title=""  class="c_gzjh_lb_ddsx">
        <div slot="" v-html="i.TXT">
        </div>
      </cell>
      <cell v-show="!!i.BZMC" :title="i.BZMC"></cell>
      <cell title="">
        <div slot="" class="c_card_lb_button" >
          <!--<x-button v-if="i.STATUS === '1'" v-show="$kwz.hasAuth('dd_gzap/doDeal', this)"-->
                    <!--@click.stop.native="doDispose(i.CONTENT_ID)" plain mini>处理</x-button>-->
          <x-button v-if="i.STATUS === '1'" v-show="getPermission('dd_gzap/doDeal')"
                    @click.stop.native="doDispose(i.CONTENT_ID)" plain mini>处理</x-button>
          <x-button v-if="addhShow && i.STATUS === '1'" v-show="getPermission('dd_gzap/toUpdate')"
                    @click.stop.native="toUpdate(i.CONTENT_ID)" plain mini>修改</x-button>
          <x-button v-if="addhShow && i.STATUS === '1'"   v-show="getPermission('dd_gzap/doSelectDdjlByGzapid')"
                    @click.stop.native="toDD(i.CONTENT_ID, i.BZID)" plain mini>督导</x-button>
          <x-button v-if="i.ISQS"  v-show="getPermission('dd_gzap/toQs')"
                    @click.stop.native="signForShow = true" plain mini>签收</x-button>
          <!-- <popup-picker  confirm-text="确定" v-if="i.ISQS" :show.sync="signForShow" :show-cell="false" title="TEST" :data="signForList" @on-hide="doRecevie"></popup-picker> -->
        </div>
      </cell>
    </group>
    <x-button @click.stop.native="loadMore" :disabled="moreParam.hasMore">{{moreParam.moreName}}</x-button>
  </div>
</template>

<script>
import {XHeader, Cell, Search, PopupPicker, XButton, Group, CellFormPreview} from 'vux'
import { mapGetters } from 'vuex'
export default {
  name: 'c_gzjh',
  data () {
    return {
      // 列表参数
      searchParam: {
        show: false,
        xxmc: '',
        xdValue: [''],
        xqValue: [''],
        page: 1
      },
      // 搜索参数条件
      searchCondition: {
        DM_XD: [],
        DM_DD_ZGXSLY: []
      },
      // 控制加载更多按钮
      moreParam: {
        hasMore: false,
        moreName: '加载更多'
      },
      // 单选删除/多选删除
      check: {
        // 选中的值
        checkValue: {},
        // 是否显示全选按钮
        checkAllBtn: false,
        // 是否显示删除按钮
        checkboxDelete: false,
        // 是否显示取消全选按钮
        cancelCheckAllBtn: false
      },
      dataList: [],
      addhShow: true,
      signForShow: false,
      signForList: []
    }
  },
  computed: mapGetters({
    qywx: 'qywx'
  }),
  created () {
    this.loadCondition()
  },
  methods: {
    // 获取功能权限
    getPermission (url) {
      return this.$kwz.hasAuth(url, this)
    },
    // 修改
    toUpdate (contentId) {
      this.$router.push({path: '/gzjh/add', query: {contentId}})
    },
    // 去督导
    toDD (contentId, bzId) {
      this.$router.push({path: '/gzjh/dd', query: {workPlanId: contentId, bzId}})
    },
    // 处理
    doDispose (contentId) {
      if (contentId) {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_gzap/doDeal',
          type: 'POST',
          data: {
            CONTENT_ID: contentId
          },
          vue: this,
          then (response) {
            this.$kwz.alert('操作成功')
            this.searchParam.page = 1
            this.loadData('init')
          }
        })
      }
    },
    // 增加
    toAdd () {
      this.$router.push({path: '/gzjh/add'})
    },
    // 点击选择
    checkValue (id) {
      this.check.checkValue[id] = !this.check.checkValue[id]
    },
    // 取消全选
    unCheckAll () {
      this.check.checkAllBtn = true
      this.check.cancelCheckAllBtn = false
      for (let i in this.check.checkValue) {
        this.check.checkValue[i] = false
      }
    },
    // 全选
    checkAll () {
      this.check.checkAllBtn = false
      this.check.cancelCheckAllBtn = true
      for (let i in this.check.checkValue) {
        this.check.checkValue[i] = true
      }
    },
    // 确认删除
    doDelete () {
      let ids = []
      for (var i in this.check.checkValue) {
        if (this.check.checkValue[i]) {
          ids.push(i)
        }
      }
      if (ids.length > 0) {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_gzap/doDelete',
          type: 'POST',
          data: {
            ids: ids.join(',')
          },
          vue: this,
          then (response) {
            this.$kwz.alert('操作成功')
            this.searchParam.page = 1
            this.loadData('init')
          }
        })
      }
      this.addhShow = true
      this.check.checkboxDelete = this.check.checkAllBtn = this.check.cancelCheckAllBtn = false
    },
    // 删除
    toDelete () {
      this.addhShow = false
      this.check.checkboxDelete = true
      this.check.checkAllBtn = true
    },
    // 搜索
    searchList () {
      this.searchParam.page = 1
      this.loadData('init')
      this.searchParam.show = false
    },
    // 获取列表数据 true加载更多/false初始化
    loadData (type) {
      this.$kwz.ajax.ajaxUrl({
        url: 'dd_gzap/doPageList/DDGZAP',
        type: 'POST',
        data: {
          page: this.searchParam.page,
          XD: this.searchParam.xdValue[0],
          ORG_ID_TARGET: this.searchParam.xxmc,
          XQID: this.searchParam.xqValue[0]
        },
        vue: this,
        then (response) {
          let datas = response.data.datas
          if (type === 'initAgain') {
            if (datas === null || datas.length === 0) {
              this.moreParam.hasMore = true
              this.moreParam.moreName = '已无更多数据'
            }
          } else {
            if (datas && datas.length > 0) {
              for (let i = 0; i < datas.length; i++) {
                let tmp = datas[i]
                this.check.checkValue[tmp.CONTENT_ID] = false
                if (tmp.STATUS === '2') {
                  datas[i].STATUSMC = '已完成'
                } else if (tmp.STATUS === '1') {
                  datas[i].STATUSMC = '未处理'
                }
                datas[i].ISQS = tmp.ISCYR === '1' && tmp.QDZT === '0'
                datas[i].DDSD = tmp.YWSJ ? (tmp.YWSJ.substr(0, 10) + (tmp.SD === '1' ? ' 上午' : ' 下午')) : tmp.YWSJ
                let text = datas[i].TXT
                text = this.$kwz.spiltHtml(text).text
                text = text && text.length > 35 ? text.substr(0, 35) + '...' : text
                datas[i].TXT = text
              }
              this.searchParam.page++
              this.moreParam.hasMore = false
              this.moreParam.moreName = '加载更多'
              if (type === 'more') {
                this.dataList = this.dataList.concat(datas)
              } else {
                this.dataList = datas
              }
              // 需要在进行一次ajax请求，判断还有没有数据
              this.loadData('initAgain')
            } else {
              this.moreParam.hasMore = true
              if (type === 'more') {
                this.moreParam.moreName = '已无更多数据'
              } else {
                this.check.checkValue = {}
                this.dataList = []
                this.moreParam.moreName = '当前无数据'
              }
            }
          }
        }
      })
    },
    // 初始化页面 获取 学段 学期
    loadCondition () {
      // 获取代码表学段
      this.$kwz.loadVueDms('DM_XD', dms => {
        this.searchCondition = dms
        // 获取所有学期
        this.$kwz.ajax.ajaxUrl({
          url: 'jc_xq/doList',
          type: 'POST',
          vue: this,
          then (response) {
            let datas = response.data.datas
            let xqs = [{
              name: '全部',
              value: ''
            }]
            if (datas && datas.length > 0) {
              for (let i = 0; i < datas.length; i++) {
                xqs.push({
                  name: datas[i].XQ_MC,
                  value: datas[i].XQ_ID
                })
              }
              // 获取当前学期
              this.$kwz.ajax.ajaxUrl({
                url: 'jc_xq/getCurXq',
                type: 'POST',
                vue: this,
                then (response) {
                  let datas = response.data.datas
                  if (datas && datas.curXq && datas.curXq.XQ_ID) {
                    this.searchParam.xqValue = [datas.curXq.XQ_ID]
                  }
                  // 事先加载好当前学期 不然会查出所有的数据
                  this.loadData('init')
                }
              })
            }
            this.searchCondition.DM_XQ = [xqs]
          }
        })
      }, this)
    },
    // 搜索框的显示隐藏 提交搜索
    toSearch () {
      this.searchParam.show = !this.searchParam.show
    },
    // 给列表卡添加点击事件 在点击删除按钮后没有效果
    toDetail (contentId) {
      if (!this.check.checkboxDelete && contentId) {
        this.$router.push({path: '/gzjh/Preview', query: {contentId}})
      }
    },
    // 加载更多事件
    loadMore () {
      this.loadData('more')
    }
  },
  components: {
    XHeader,
    Cell,
    Search,
    PopupPicker,
    XButton,
    Group,
    CellFormPreview
  }
}
</script>
<style scoped>
  .c_gzjh_lb_ddsx >>> .weui-cell__ft{
    text-align: left;
    width: 100%;
  }

  .c_gzjh_searchShow_xxmc{
    padding: 5px 15px;
  }
  .c_gzjh_searchShow_xxmc >>> .weui-search-bar {
     padding: 1px 3px 1px 1px;
   }
  .c_gzjh_searchShow_xxmc >>> .weui-cell__ft{
    width: 70%;
  }
</style>
