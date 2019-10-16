<template>
  <div class="c_ListMian">
    <!--标题栏-->
    <x-header class="c_header" :left-options="{preventGoBack: true, showBack: !qywx.type}"
              @on-click-back="$router.push({path: '/workspace'})">
      督导纪实
      <a slot="right" @click="toSearch">
        <span class="fa fa-search"> 搜索</span>
      </a>
    </x-header>

    <!--删除 搜索-->
    <div class="c_addDel">
      <group class="clearfix">
        <x-button v-if="!check.checkboxDelete" @click.native="toDelete" plain mini type="warn"
                  v-show="$kwz.hasAuth('ddjl/deleteddjl', this)" class="fl">删除</x-button>
        <x-button v-else @click.native="doDelete" plain mini type="warn"
                  v-show="$kwz.hasAuth('ddjl/deleteddjl', this)" class="fl">确定删除</x-button>

        <x-button slot="" v-if="addhShow" @click.native="toAdd" plain mini type="primary" :title="$kwz.hasAuth('ddjl/doEdit', this)"
                  v-show="$kwz.hasAuth('ddjl/doEdit', this)" class="fr" >
          <span class="fa fa-plus text_bolder">&nbsp;新增</span>
        </x-button>
        <x-button v-if="check.checkAllBtn" @click.native="checkAll" plain mini type="primary" class="fr">全选</x-button>
        <x-button v-if="check.cancelCheckAllBtn" @click.native="unCheckAll" plain mini type="primary" class="fr">取消全选</x-button>
      </group>

      <!--搜索选项隐藏区 -->
      <div v-if="searchParam.show">
        <div class="c_searchBody_content">
          <popup-picker confirm-text="确定" title="学期" required :data="searchCondition.DM_XQ"
                        :show-name="true" v-model="searchParam.xqValue"></popup-picker>
          <popup-picker confirm-text="确定" title="学段" required :data="searchCondition.DM_XD"
                        :show-name="true" v-model="searchParam.xdValue"></popup-picker>
          <cell title="学校名称" class="c_ddjs_searchShow_xxmc">
            <search :auto-fixed = false class="" placeholder="请输入学校名称" v-model="searchParam.xxmc" auto-scroll-to-top ref="search"></search>
          </cell>
          <x-button type="primary" class="" @click.native="searchList">确定</x-button>
        </div>
        <!--遮罩层-->
        <div class="c_searchBody_mask" @click="toSearch">
        </div>
      </div>

    </div>

    <!--列表-->
    <group class="c_card_lb" v-for="(i,j) in dataList" :key="j" @click.native="toPreview(i.CONTENT_ID)">
      <cell class="c_card_lb_school">
        <div slot="title">
          <input v-show="check.checkboxDelete" type="checkbox" @click.stop="checkValue(i.CONTENT_ID)"
                 :checked="check.checkValue[i.CONTENT_ID]">
          <span class="fa fa-map-marker"></span>&nbsp;{{i.XXMC}}
        </div>
      </cell>
      <cell :title="i.AUTHOR" :value="i.YWSJ"></cell>
      <cell >
        <div slot="title">
          <div v-if="i.STATUS === '2' || i.STATUS === '5'" slot="" class="c_ddjs_lb_xinxi_dispose"
               @click.stop="toZgtz(i.IDS)" >
            <span class="fa fa-hand-o-right">&nbsp;</span>{{i.STATUS_MC}}
          </div>
          <div v-if="i.STATUS === '4'" slot="">
            {{i.STATUS_MC}}
          </div>
          <div v-else-if="i.STATUS ==='3'" slot="" class="c_ddjs_lb_xinxi_dispose" @click.stop="toXsyj(i.IDS)">
            <span class="fa fa-hand-o-right">&nbsp;</span>{{i.STATUS_MC}}
          </div>
        </div>
        <div slot="">
          <x-button mini  @click.stop.native="toDetail(i.CONTENT_ID)" v-show="getPermission('ddjl/doEdit')">编辑</x-button>
        </div>
      </cell>
    </group>
    <x-button @click.native="loadMore" :disabled="moreParam.hasMore">{{moreParam.moreName}}</x-button>
  </div>
</template>

<script>
import { XHeader, XButton, CellFormPreview, Cell, Group, PopupPicker, Search, Scroller } from 'vux'
import { mapGetters } from 'vuex'
export default {
  name: 'c_ddjs',
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
        DM_XQ: []
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
      addhShow: true
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
    // 预览
    toPreview (id) {
      if (!this.check.checkboxDelete && id) {
        this.$router.push({path: '/ddjs/Preview', query: {id}})
      }
    },
    // 去新增
    toAdd () {
      this.$router.push({path: '/ddjs/add', query: {isAdd: 'add'}})
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
    // 删除
    toDelete () {
      this.addhShow = false
      this.check.checkboxDelete = true
      this.check.checkAllBtn = true
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
          url: 'jc_content/doDelete/DDJL',
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
    // 搜索
    searchList () {
      this.searchParam.page = 1
      this.loadData('init')
      this.searchParam.show = !this.searchParam.show
    },
    // 加载列表数据 true加载更多/false初始化
    loadData (type) {
      this.$kwz.ajax.ajaxUrl({
        url: 'ddjl/doSchoolPageList',
        type: 'POST',
        data: {
          page: this.searchParam.page,
          XD: this.searchParam.xdValue[0],
          XQID: this.searchParam.xqValue[0],
          XXMC: this.searchParam.xxmc
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
                this.check.checkValue[datas[i].CONTENT_ID] = false
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
    // 初始化页面 获取列表数据和搜索条件 获取学期id
    loadCondition () {
      // 获取代码表学段
      this.$kwz.loadVueDms('DM_XD', dms => {
        this.searchCondition = dms
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
    toDetail (id) {
      if (!this.check.checkboxDelete && id) {
        this.$router.push({path: '/ddjs/add', query: {contentid: id}})
      }
    },
    // 去整改通知
    toZgtz (contentid) {
      this.$router.push({path: '/ddjs/zgtzs', query: {contentid}})
    },
    // 去协商意见
    toXsyj (contentid) {
      this.$router.push({path: '/ddjs/xsyjs', query: {contentid}})
    },
    // 加载更多事件
    loadMore () {
      this.loadData('more')
    }
  },
  components: {
    XHeader,
    XButton,
    CellFormPreview,
    Cell,
    Group,
    PopupPicker,
    Search,
    Scroller
  }
}
</script>

<style scoped>
  .c_ddjs_searchShow_xxmc{
    padding: 5px 15px;
  }
  .c_ddjs_searchShow_xxmc >>> .weui-search-bar {
    padding: 1px 3px 1px 1px;
  }
  .c_ddjs_searchShow_xxmc >>> .weui-cell__ft{
    width: 70%;
  }
  .c_ddjs_lb_xinxi_dispose{
    color: #145ccd;
    text-decoration:underline;
    display: inline;
  }
</style>
