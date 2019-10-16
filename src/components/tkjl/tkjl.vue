<template>
  <div class="c_ListMian ">
    <!--标题栏-->
    <x-header class="c_header" :left-options="{preventGoBack: true, showBack: !qywx.type}"
              @on-click-back="$router.push({path: '/workspace'})">
      听课记录
      <a slot="right" @click="searchParam.show = !searchParam.show">
        <span class="fa fa-search">&nbsp;搜索</span>
      </a>
    </x-header>

    <!--删除 搜索-->
    <div class="c_addDel">
      <group class="clearfix">
        <x-button v-if="!check.checkboxDelete" @click.native="toDelete" plain mini type="warn" class="fl"
                  v-show="$kwz.hasAuth('jc_pgbzmx/doDelete/TKJL', this)" >删除</x-button>
        <x-button v-else @click.native="doDelete" plain mini type="warn" class="fl"
                  v-show="$kwz.hasAuth('jc_pgbzmx/doDelete/TKJL', this)">确定删除</x-button>
        <x-button slot="" v-if="addhShow" @click.stop.native="toAdd('add')" plain mini type="primary" class="fr"
                  v-show="$kwz.hasAuth('jc_pgbzmx/toAdd', this)"><span class="fa fa-plus text_bolder">&nbsp;新增</span></x-button>
        <x-button v-if="check.checkAllBtn" @click.native="checkAll"
                  plain mini type="primary" class="fr">全选</x-button>
        <x-button v-if="check.cancelCheckAllBtn" @click.native="unCheckAll"
                  plain mini type="primary" class="fr">取消全选</x-button>
      </group>
    </div>
    <!--搜索选项隐藏区 -->
    <div v-if="searchParam.show" class="">
      <div>
        <div class="c_searchBody_content">
          <x-input title="学校名称" class="c_inputParent_borderB" placeholder="请输入学校名称" v-model="searchParam.XXMC"></x-input>
          <datetime title="时间范围" :min-year = "1900" :max-year = "2200"
                    v-model="searchParam.start_time"></datetime>
          <datetime class="c_tkjl_search_endTime" v-model="searchParam.end_time" :min-year = "1900" :max-year = "2200">
            <div slot="title">至</div>
          </datetime>
          <x-button type="primary" @click.native="searchList">确定</x-button>
        </div>
      </div>
      <div class="c_searchBody_mask" @click.stop="searchParam.show = !searchParam.show"></div>
    </div>

    <!--列表-->
    <group class="c_card_lb" v-for="(i,j) in dataList" :key="j"  @click.native="toDetail(i.MXID,i.ISNEW)">
      <cell class="c_card_lb_school">
        <div slot="title">
          <input v-show="check.checkboxDelete" :checked="check.checkValue[i.MXID]"
                 @click="checkValue(i.MXID)" type="checkbox" >
          <span class="fa fa-map-marker"></span>&nbsp;{{i.XXMC}}
        </div>
        <div slot="" class="c_card_lb_button">
          <x-button mini @click.stop.native="toAdd(i.MXID,i.ISNEW)"
                    v-show="getPermission('jc_pgbz/toUpdate') && i.SELF ==='1'">修改</x-button>
        </div>
      </cell>
      <cell :title="i.XZRMC" :value="i.DDSJ"></cell>
    </group>

    <x-button @click.native="loadMore" :disabled="moreParam.hasMore">{{moreParam.moreName}}</x-button>

  </div>
</template>

<script>
  import {XHeader, Group, XButton, XInput, Cell, Datetime} from 'vux'
  import { mapGetters } from 'vuex'
  export default {
    name: 'c_tkjl',
    data () {
      return {
        searchParam: {
          show: false, // 搜索显示隐藏
          XXMC: '', // 学校
          start_time: '', // 开始时间
          end_time: '', // 结束时间
          page: 1 // 页
        },
        // 单选删除/多选删除
        check: {
          checkValue: {}, // 选中的值
          checkAllBtn: false, // 是否显示全选按钮
          checkboxDelete: false, // 是否显示删除按钮
          cancelCheckAllBtn: false // 是否显示取消全选按钮
        },
        addhShow: true, // 新增显示隐藏
        // 控制加载更多按钮
        moreParam: {
          hasMore: false, // 是否可选
          moreName: '加载更多' // 显示的值
        },
        dataList: []
      }
    },
    components: {XHeader, Group, XButton, XInput, Cell, Datetime},
    computed: mapGetters({
      qywx: 'qywx'
    }),
    created () {
      this.loadCondition()
      this.$kwz.hasAuth('jc_pgbz/toUpdate', this)
    },
    methods: {
      // 初始化页面
      loadCondition () {
        this.loadData()
      },
      // 判断按钮权限
      getPermission (url) {
        return this.$kwz.hasAuth(url, this)
      },
      // 搜索确定
      searchList () {
        this.searchParam.show = !this.searchParam.show
        this.searchParam.page = 1
        this.loadData('init')
      },
      // 加载列表数据 more加载更多/init初始化
      loadData (type) {
        this.$kwz.ajax.ajaxUrl({
          url: 'jc_pgbzmx/doSchoolPageList/TKJL',
          type: 'POST',
          data: {
            XXMC: this.searchParam.XXMC,
            start_time: this.searchParam.start_time,
            end_time: this.searchParam.end_time,
            MB_ORG_ID: '', // 后端不知道是什么 先传''
            page: this.searchParam.page
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
                  this.check.checkValue[tmp.MXID] = false
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
            url: 'jc_pgbzmx/doDelete/TKJL',
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
      // 去增加页面
      toAdd (id, isNew) {
        if (id !== 'add') { // 不是新增就是修改
          if (isNew === 1) {
            this.$router.push({path: '/tkjl/add', query: {id: id}})
          } else {
            this.$router.push({path: '/tkjl/oldChange', query: {id: id}})
          }
        } else {
          this.$router.push({path: '/tkjl/add'})
        }
      },
      // 给列表卡添加点击事件 在点击删除按钮后没有效果
      toDetail (id, isNew) {
        if (!this.check.checkboxDelete && id) {
          this.$router.push({path: '/tkjl/preview', query: {id: id, isNew: isNew}})
        }
      },
      // 加载更多事件
      loadMore () {
        this.loadData('more')
      }
    }
  }
</script>

<style scoped>
  .c_tkjl_search_endTime >>> div:first-child{
    width: 64px;
    text-align: right;
  }
</style>





