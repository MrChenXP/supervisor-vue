<template>
  <div class="c_zggz c_ListMian">
    <!--标题栏-->
    <x-header class="c_header" :left-options="{preventGoBack: true, showBack: !qywx.type}" @on-click-back="$router.push({path: '/workspace'})">
      整改工作
      <a slot="right" @click="searchParam.show = !searchParam.show">
        <span class="fa fa-search"> 搜索</span></a>
    </x-header>

    <!--标题组-->
    <div class="c_zggz_tabs">
      <sticky :offset="46" :check-sticky-support="false">
        <tab :animate=false>
          <tab-item selected>整改</tab-item>
          <tab-item @on-item-click="$router.push({path:'/zggz/xsyj'})">协商</tab-item>
        </tab>
      </sticky>
    </div>

    <!--删除 搜索-->
    <div class="c_zggz_gn c_addDel">
      <group class="clearfix">
        <x-button v-if="!check.checkboxDelete" @click.native="toDelete" plain mini type="warn" class="fl"
                  v-show="$kwz.hasAuth('dd_zgxs/doDeleteBatch/ZGTZ', this)" >删除</x-button>
        <x-button v-else @click.native="doDelete" plain mini type="warn" class="fl"
                  v-show="$kwz.hasAuth('dd_zgxs/doDeleteBatch/ZGTZ', this)">确定删除</x-button>
        <x-button slot="" v-if="addhShow" @click.native="toAdd('add')" plain mini type="primary" class="fr"
                  v-show="$kwz.hasAuth('dd_zgxs/toZgtz/ZGTZ', this)" ><span class="fa fa-plus text_bolder">&nbsp;新增</span></x-button>
        <x-button v-if="check.checkAllBtn" @click.native="checkAll"
                  plain mini type="primary" class="fr">全选</x-button>
        <x-button v-if="check.cancelCheckAllBtn" @click.native="unCheckAll"
                  plain mini type="primary" class="fr">取消全选</x-button>
      </group>

      <!--搜索选项隐藏区 -->
      <div v-if="searchParam.show">
        <div class="c_searchBody_content">
            <cell title="学校名称" class="c_zggz_searchShow_xxmc">
              <search :auto-fixed = false class="" placeholder="请输入学校名称" v-model.trim="searchParam.XXMC" auto-scroll-to-top ref="search"></search>
            </cell>
            <popup-picker confirm-text="确定" title="学段" :data="searchCondition.DM_XD" :show-name="true" v-model="searchParam.xdValue"></popup-picker>
            <popup-picker confirm-text="确定" title="整改类型" :data="searchCondition.DM_DD_ZGXSLY" :show-name="true" v-model="searchParam.zgValue"></popup-picker>
            <x-button type="primary" @click.native="searchList">确定</x-button>
        </div>
        <!--遮罩层-->
        <div class="c_searchBody_mask" @click="searchParam.show = !searchParam.show">
        </div>
      </div>
    </div>

    <!--列表-->
    <div class="c_zggz_lb_all">
      <group class="c_card_lb" v-for="(i, j) in dataList" :key="j" @click.native="toDetail(i.ZGXSID)">
        <cell class="c_card_lb_school">
          <div slot="title">
            <input v-show="check.checkboxDelete" :checked="check.checkValue[i.ZGXSID]"
                   @click="checkValue(i.ZGXSID)" type="checkbox" >
            {{i.XXMC}}
          </div>
          <div slot="" class="c_card_lb_button">
            <x-button mini v-if="i.SFSH" @click.stop.native="toAdd(i.ZGXSID)">审核</x-button>
            <div v-else>
              <x-button mini v-if="i.CLZTDM < '6' && !(i.SFSH && i.CLZTDM === '1')" v-show="getPermission('dd_zgxs/zgtz_deal')"
                        @click.stop.native="doZgxs(i.ZGXSID, 'xx')">处理</x-button>
              <x-button mini v-if="i.CLZTDM < '6'"  v-show="getPermission('dd_zgxs/zgtz_done')"
                        @click.stop.native="doZgxs(i.ZGXSID, 'dx')">验收</x-button>
            </div>
          </div>
        </cell>
        <cell>
          <div slot="title">整改天数：{{i.CLQX}}</div>
          <div slot="">发出时间：<span :class="{c_zggz_lb_red: i.ISCS}">{{i.YWSJ}}</span></div>
        </cell>
        <cell :title="i.ZGXSMC">
          <div slot="">
            {{i.CLZTMC}}
          </div>
        </cell>
      </group>
    </div>
    <x-button @click.native="loadMore" :disabled="moreParam.hasMore">{{moreParam.moreName}}</x-button>
  </div>
</template>

<script>
import {XHeader, Tab, TabItem, Sticky, Group, XButton, PopupPicker, Search, Cell, CellFormPreview} from 'vux'
import {mapGetters} from 'vuex'
export default {
  name: 'c_zggz',
  data () {
    return {
      // 列表参数
      searchParam: {
        show: false,
        XXMC: '',
        xdValue: [''],
        zgValue: [''],
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
      addhShow: true
    }
  },
  computed: mapGetters({
    user: 'user',
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
    // 列表功能 处理/验收
    doZgxs (val, status) {
      if (status === 'xx') {
        // 学校处理 进入整改页面
        this.$router.push({path: '/zggz/zgtzs', query: {id: val, SF: status}})
      } else if (status === 'dx') {
        // 督学验收  进入整改页面
        this.$router.push({path: '/zggz/zgtzs', query: {id: val, SF: status}})
      }
    },
    // 去增加页面
    toAdd (val) {
      if (val !== 'add') { // 不是新增就是审核
        this.$router.push({path: '/zggz/add', query: {id: val}})
      } else {
        this.$router.push({path: '/zggz/add'})
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
          url: 'dd_zgxs/doDeleteBatch/ZGTZ',
          type: 'POST',
          data: {
            ids: ids.join(',')
          },
          vue: this,
          then (response) {
            this.$kwz.alert('操作成功')
            this.loadData('init')
          }
        })
      }
      this.addhShow = true
      this.check.checkboxDelete = this.check.checkAllBtn = this.check.cancelCheckAllBtn = false
    },
    // 搜索
    searchList () {
      this.searchParam.show = false
      this.searchParam.page = 1
      this.loadData('init')
    },
    // 加载列表数据 more加载更多/init初始化
    loadData (type) {
      this.$kwz.ajax.ajaxUrl({
        url: 'dd_zgxs/doPageList/zgtz',
        type: 'POST',
        data: {
          page: this.searchParam.page,
          XD: this.searchParam.xdValue[0],
          XXMC: this.searchParam.XXMC,
          ZGXSLY: this.searchParam.zgValue[0]
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
                this.check.checkValue[tmp.ZGXSID] = false
                datas[i].ISCS = this.countCs(tmp.YWSJ, tmp.CLQX)
                datas[i].SFZGXX = (this.user.orgid === tmp.ORG_ID_TARGET) // 确认是否是学校 暂时失效
                datas[i].SFDX = (this.user.orgid === tmp.ORG_ID)  // 确认是否时督学 暂时失效
                datas[i].SFSH = tmp.CLZTDM === '1' && tmp.IS_SB === '1' // 判断是否有审核功能
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
      }, this)
    },
    // 给列表卡添加点击事件 在点击删除按钮后没有效果
    toDetail (id) {
      if (!this.check.checkboxDelete && id) {
        this.$router.push({path: '/zggz/zgtzs', query: {id}})
      }
    },
    // 加载更多事件
    loadMore () {
      this.loadData('more')
    },
    // 判断时间有没有超时
    countCs (fcsj, cs) {
      try {
        // 获取 发出时间 将其变为毫秒
        let zggzTime = fcsj + ' 23:59:59'
        let oDateSend = new Date(zggzTime)
        let oDateSendS = oDateSend.getTime()
        // 获取整改天数毫秒
        let zggzTianShu = cs * 86400000
        let oDateTianShuS = oDateSendS + zggzTianShu
        // 获取当前时间毫秒
        let oDate = new Date()
        let oDateS = oDate.getTime()
        let gap = oDateTianShuS - oDateS
        return gap < 0
      } catch (e) {
        return false
      }
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
  .c_zggz{
    padding-top: 0;
  }



  .c_zggz_tabs{
    height: 44px;
  }

  .c_zggz_gn{
    top: 90px;
  }

  .c_zggz_searchShow_xxmc >>> .weui-search-bar {
    padding: 1px 3px 1px 1px;
  }
  .c_zggz_searchShow_xxmc >>> .weui-cell__ft{
    width: 70%;
  }

  .c_zggz_lb_all{
    padding-top: 41px;
  }
  .c_zggz_lb_red{
    color: red;
  }
</style>
