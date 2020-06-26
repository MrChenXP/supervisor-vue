<template>
  <div class="c_zggz_xsyj c_ListMian">
    <!--标题栏-->
    <x-header class="c_header" :left-options="{preventGoBack: true, showBack: !qywx.type}" @on-click-back="$router.push({path: '/workspace'})">
      整改工作
      <a slot="right" @click="toSearch">
        <span class="fa fa-search"> 搜索</span>
      </a>
    </x-header>

    <!--标题组-->
<!--    <div class="c_zggz_xsyj_tabs">-->
<!--      <sticky :offset="46" :check-sticky-support="false">-->
<!--        <tab :animate=false>-->
<!--          <tab-item @on-item-click="$router.push({path:'/3758a16aa4e14b3d87bb1f9c7e2fc509'})">整改</tab-item>-->
<!--          <tab-item selected>协商</tab-item>-->
<!--        </tab>-->
<!--      </sticky>-->
<!--    </div>-->
<!--    广西的-->
    <div class="c_zggz_xsyj_tabs">
      <sticky :offset="46" :check-sticky-support="false">
        <tab :animate=false>
          <tab-item @on-item-click="$router.push({path:'/22f9ea002d1841459915b57d043891a3'})">整改</tab-item>
          <tab-item selected>协商</tab-item>
        </tab>
      </sticky>
    </div>

    <!--删除 搜索-->
    <div class="c_zggz_xsyj_gn c_addDel">
      <group class="c_zggz_xsyj_gn_button clearfix">

        <x-button v-if="!check.checkboxDelete" v-show="getPermission('dd_zgxs/doDeleteBatch/XSYJ')"
                  @click.native="toDelete" plain mini type="warn" class="fl">删除</x-button>
        <x-button v-else @click.native="doDelete"  v-show="getPermission('dd_zgxs/doDeleteBatch/XSYJ')"
                  plain mini type="warn" class="fl">确定删除</x-button>
        <x-button slot="" v-if="addhShow"  v-show="getPermission('dd_zgxs/toZgtz/XSYJ')"
                  @click.native="toAdd('add')"   plain mini type="primary" class="fr">
          <span class="fa fa-plus text_bolder">&nbsp;新增</span>
        </x-button>
        <x-button v-if="check.checkAllBtn" @click.native="checkAll"  v-show="getPermission('dd_zgxs/doDeleteBatch/XSYJ')"
                  plain mini type="primary" class="fr">全选</x-button>
        <x-button v-if="check.cancelCheckAllBtn" @click.native="unCheckAll"  v-show="getPermission('dd_zgxs/doDeleteBatch/XSYJ')"
                  plain mini type="primary" class="fr">取消全选</x-button>
      </group>

      <!--搜索选项隐藏区 -->
      <div v-if="searchParam.show">
          <div class="c_searchBody_content">
            <popup-picker confirm-text="确定" title="学段" :data="searchCondition.DM_XD" :show-name="true" v-model="searchParam.xdValue"></popup-picker>
            <popup-picker confirm-text="确定" title="科室" :data="searchCondition.ksList" :show-name="true" v-model="searchParam.ksValue"></popup-picker>
            <popup-picker confirm-text="确定" title="整改类型" :data="searchCondition.DM_DD_ZGXSLY" :show-name="true" v-model="searchParam.zgValue"></popup-picker>
            <popup-picker confirm-text="确定" title="状态" :data="searchCondition.ztList" :show-name="true" v-model="searchParam.ztValue"></popup-picker>
            <x-button type="primary" @click.native="searchList">确定</x-button>
          </div>
        <!--遮罩层-->
        <div class="c_searchBody_mask" @click="toSearch"></div>
      </div>

    </div>

    <!--列表-->
    <div class="c_zggz_xsyj_lb_all">
    <group class="c_card_lb"  v-for="(i,j) in dataList" :key="j" @click.native="toDetail(i.ZGXSID)" >
      <cell  class="c_card_lb_school">
        <div slot="title">
          <input v-show="check.checkboxDelete" :checked="check.checkValue[i.ZGXSID]"
                 @click="checkValue(i.ZGXSID)" type="checkbox" >
          {{i.XXMC}}
        </div>
        <div slot="" class="c_card_lb_button">
          <x-button mini v-if="getPermission('dd_zgxs/zgtz_sh') && i.CLZTDM < '22' "
                    @click.stop.native="toAdd(i.ZGXSID)">审核</x-button>
          <div v-else>
            <x-button mini v-if="i.CLZTDM < '26' && i.CLZTDM >= '22'" v-show="getPermission('dd_zgxs/zgtz_deal')"
                      @click.stop.native="doXsyj(i.ZGXSID, 'xx')">处理</x-button>
            <x-button mini v-if="i.CLZTDM < '26'"  v-show="getPermission('dd_zgxs/zgtz_done')"
                      @click.stop.native="doXsyj(i.ZGXSID, 'dx')">验收</x-button>
          </div>
        </div>
      </cell>
      <cell :title="i.ORG_MC"  :value="i.YWSJ"></cell>
      <cell :title="i.ZGXSLYMC" :value="i.CLZTMC"></cell>
      <!--<cell-form-preview :list="i.content" class="c_zggz_xsyj_lb_xinxi"></cell-form-preview>-->
    </group>
    </div>
    <x-button @click.native="loadMore" :disabled="moreParam.hasMore">{{moreParam.moreName}}</x-button>
  </div>
</template>

<script>
import {XHeader, Tab, TabItem, Sticky, Group, XButton, PopupPicker, Search, Cell, CellFormPreview} from 'vux'
import {mapGetters} from 'vuex'
export default {
  name: 'c_zggz_xsyj',
  data () {
    return {
      // 列表参数
      searchParam: {
        show: false,
        xdValue: [''],
        zgValue: [''],
        ksValue: [''],
        ztValue: [''],
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
      // 列表数据
      dataList: [],
      addhShow: true
    }
  },
  computed: mapGetters({
    qywx: 'qywx'
  }),
  created () {
    this.loadCondition()
    this.loadData('init')
  },
  methods: {
    // 判断按钮权限
    getPermission (url) {
      return this.$kwz.hasAuth(url, this)
    },
    // 去新增
    toAdd (val) {
      if (val !== 'add') { // 不是新增就是审核
        this.$router.push({path: '/zggz/xsyj/add', query: {id: val}})
      } else {
        this.$router.push({path: '/zggz/xsyj/add'})
      }
    },
    // 列表功能 处理/验收
    doXsyj (val, status) {
      if (status === 'xx') {
        // 学校处理 进入整改页面
        this.$router.push({path: '/zggz/xsyj/xsyjs', query: {id: val, SF: status}})
      } else if (status === 'dx') {
        // 督学验收  进入整改页面
        this.$router.push({path: '/zggz/xsyj/xsyjs', query: {id: val, SF: status}})
      }
    },
    // 点击选择
    checkValue (id) {
      this.check.checkValue[id] = !this.check.checkValue[id]
    },
    // 全选
    checkAll () {
      this.check.checkAllBtn = false
      this.check.cancelCheckAllBtn = true
      for (let i in this.check.checkValue) {
        this.check.checkValue[i] = true
      }
    },
    // 取消全选
    unCheckAll () {
      this.check.checkAllBtn = true
      this.check.cancelCheckAllBtn = false
      for (let i in this.check.checkValue) {
        this.check.checkValue[i] = false
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
          url: 'dd_zgxs/doDeleteBatch/ZGTZ',
          type: 'POST',
          data: {
            ids: ids.join(',')
          },
          vue: this,
          then (response) {
            this.$kwz.alert('操作成功', undefined, () => {
              this.loadData('init')
            })
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
    // 搜索列表
    searchList () {
      this.searchParam.show = false
      this.searchParam.page = 1
      this.loadData('init')
    },
    initData () {
      this.loadData('init')
    },
    // 渲染列表 true加载更多/false初始化
    loadData (type) {
      this.$kwz.ajax.ajaxUrl({
        url: 'dd_zgxs/doPageList/xsyj',
        type: 'POST',
        data: {
          page: this.searchParam.page,
          XS_ORG_ID: this.searchParam.ksValue[0],
          XD: this.searchParam.xdValue[0],
          ZGXSLY: this.searchParam.zgValue[0],
          CLZTDM: this.searchParam.ztValue[0]
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
                this.check.checkValue[datas[i].ZGXSID] = false
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
                this.moreParam.moreName = '无数据'
              }
            }
          }
        }
      })
    },
    // 加载条件
    loadCondition () {
      this.$kwz.loadVueDms('DM_DD_ZGXSLY,DM_XD', dms => {
        this.searchCondition = dms
        this.searchCondition.ztList = [[{name: '全部', value: ''}, {name: '督学发出', value: '1'}, {name: '科室处理完毕', value: '2'}]]
        this.searchCondition.ksList = []
        this.$kwz.ajax.ajaxUrl({
          url: 'ddjl/getKsList',
          type: 'POST',
          vue: this,
          then (response) {
            let datas = response.data.datas
            if (datas && datas.KSLIST && datas.KSLIST.length > 0) {
              let ksList = []
              for (let i = 0; i < datas.KSLIST.length; i++) {
                ksList.push({
                  name: datas.KSLIST[i].ORG_MC,
                  value: datas.KSLIST[i].ORG_ID
                })
              }
              this.searchCondition.ksList.push(ksList)
            }
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
        this.$router.push({path: '/zggz/xsyj/xsyjs', query: {id}})
      }
    },
    // 加载更多事件
    loadMore () {
      this.loadData('more')
    }
  },
  components: {
    XHeader,
    Tab,
    TabItem,
    Sticky,
    Group,
    XButton,
    Search,
    Cell,
    PopupPicker,
    CellFormPreview
  }
}
</script>

<style scoped>
  .c_zggz_xsyj{
    padding-top: 0;
  }
  .c_zggz_xsyj_tabs{
    height: 44px;
  }

  .c_zggz_xsyj_gn{
    top: 90px;
  }

  .c_zggz_xsyj_lb_all{
    padding-top: 41px;
  }

</style>
