<template>
  <div class="c_gzjh_add c_ContentMain">
    <!--标题栏-->
    <x-header class="c_header" :left-options="{preventGoBack: true}"
              @on-click-back="$router.push({path: '/b892eba5fae9493189ac81a510bbbd73'})">
      {{title}}
      <a slot="right" @click="doSave" v-if="saveBtnShow" v-show="getPermission('dd_gzap/doAdd/DDGZAP')">
        <span class="fa fa-save">&nbsp;保存</span>
      </a>
    </x-header>

    <!--计划列表-->
    <group class="c_FormAdd">
      <cell title="学校" :value="formData.xxName" v-if="contentId"></cell>
      <cell title="学校" is-link  @click.native="toXx" :value="formData.xxName" v-else></cell>
      <datetime title="计划时间" :end-date="endDate" :start-date="startDate"  v-model="formData.YWSJ"></datetime>
      <popup-picker  confirm-text="确定" title="时段" required :data="sdList" :show-name="true" v-model="formData.sdValue"></popup-picker>
      <cell title="随行督学" is-link  @click.native="toSxdx" :value="formData.sxdxName"></cell>

      <div class="c_FormAdd_editor">
          <div class="c_FormAdd_editor_head">督导事项</div>
          <div class="c_gzjh_add_ddsx_content c_FormAdd_editor_content">
            <popup-picker  confirm-text="确定" title="规定任务" required :show-name="true" :data="pgbzList" v-model="formData.pgbzValue"></popup-picker>
            <span>自主任务</span>
            <div>
              <x-textarea :max="4000" v-model="formData.ddsxTxt" :rows="5" class="c_textarea_border"></x-textarea>
            </div>
          </div>
      </div>

    </group>

    <!--随行督学隐藏页-->
    <div v-show="sxdx.sxdxShow" class="c_pickBody">
      <div class="c_pickBody_head clearfix" >
        <x-button mini class="fl" type="primary" plain @click.native="sxdx.sxdxShow = !sxdx.sxdxShow">
          <span class="fa fa-angle-left fa-1x"></span>
          <span class="text-bold">&nbsp;选择</span>
        </x-button>
        <span class="fr" @click.stop="sxdx.sxdxSearchShow = true">
          <span class="fa fa-search">&nbsp;搜索</span>
        </span>
      </div>
      <div class="" v-show="sxdx.sxdxSearchShow" >
        <group title="搜索条件" class="c_searchBody_content">
          <x-input title="姓名" class="c_inputParent_borderB" v-model="sxdx.searchParam.xm" placeholder="请输入随行督学姓名"></x-input>
          <x-button  @click.native.stop="doSxdxSearch(false)">搜索</x-button>
        </group>
        <div class="c_searchBody_mask" @click.stop="sxdx.sxdxSearchShow = !sxdx.sxdxSearchShow"></div>
      </div>
      <div>
        <checklist :options="sxdx.sxdxList" @on-change="sxdxSelect" ></checklist>
      </div>
      <x-button @click.native="doSxdxLoadMore" :disabled="sxdx.moreParam.hasMore">{{sxdx.moreParam.moreName}}</x-button>
    </div>

    <!--学校选择隐藏页-->
    <div v-show="xx.xxShow" class="c_pickBody">
      <div class="c_pickBody_head clearfix" >
        <x-button mini class="fl" type="primary" plain @click.native="xx.xxShow = !xx.xxShow" >
          <span class="fa fa-angle-left fa-1x"></span>
          <span class="text-bold">&nbsp;选择</span>
        </x-button>

        <span class="fr" @click.stop="xx.xxSearchShow = true">
          <span class="fa fa-search">&nbsp;搜索</span>
        </span>
      </div>
      <div class="" v-show="xx.xxSearchShow" >
        <group title="搜索条件" class="c_searchBody_content">
          <x-input title="学校名称" class="c_inputParent_borderB" v-model="xx.searchParam.xxmc" placeholder="请输入学校名称"></x-input>
          <x-button  @click.native.stop="doXxSearch(false)">搜索</x-button>
        </group>
        <div class="c_searchBody_mask" @click.stop="xx.xxSearchShow = !xx.xxSearchShow"></div>
      </div>

      <div>
        <checklist :options="xx.xxList" :max="1" @on-change="xxSelect" ></checklist>
      </div>
      <x-button @click.native="doXxLoadMore" :disabled="xx.moreParam.hasMore">{{xx.moreParam.moreName}}</x-button>
    </div>

  </div>
</template>

<script>
import {XHeader, Group, PopupPicker, Cell, Datetime, XInput, XButton, Checklist, XTextarea, Previewer} from 'vux'
import {mapGetters} from 'vuex'
export default {
  name: 'c_gzjh_add',
  data () {
    return {
      // 标题
      title: '新增工作计划',
      // 保存按钮是否显示，当展示督学选择列表等时，隐藏
      saveBtnShow: true,
      // 搜索按钮是否显示，当展示督学选择列表等时，点击搜索，展示搜索框
      conditionBtnShow: false,
      // 表单数据
      formData: {
        xxName: '',
        xxId: '',
        YWSJ: '',
        sdValue: [],
        sxdxName: '',
        sxdxId: '',
        ddsxTxt: '',
        pgbzValue: [],
        remark: '',
        xqid: ''
      },
      startDate: '', // 可填写的最小时间,别放在date对象里,而且一定要事先创建好变量
      endDate: '', // 可填写的最大时间,别放在date对象里,而且一定要事先创建好变量
      // 时段列表数据
      sdList: [],
      // 督导纪实图片
      ddjsImageList: [],
      ddjsImageListOptions: {
      },
      // 评估标准数据列表
      pgbzList: [],
      // 随行督学选择
      sxdx: {
        // 是否显示
        sxdxShow: false,
        sxdxSearchShow: false,
        // 搜索条件值
        searchParam: {
          xm: '',
          xxmc: '',
          dxlxValue: [],
          page: 1
        },
        // 搜索条件
        searchCondition: {
          DM_DD_DXLX: []
        },
        // 数据列表
        sxdxList: [],
        // 加载更多相关控制
        moreParam: {
          moreName: '',
          hasMore: ''
        }
      },
      // 学校选择
      xx: {
        // 是否显示
        xxShow: false,
        xxSearchShow: false,
        // 搜索条件值
        searchParam: {
          xxmc: '',
          page: 1
        },
        // 搜索条件
        searchCondition: {
        },
        // 数据列表
        xxList: [],
        // 加载更多相关控制
        moreParam: {
          moreName: '',
          hasMore: ''
        }
      },
      contentId: ''
    }
  },
  computed: mapGetters({
    user: 'user'
  }),
  created () {
    this.initPage()
    this.initFormData()
  },
  methods: {
    // 初始化页面
    initPage () {
      // 时段代码
      this.$kwz.loadVueDms('DM_SD', dms => {
        this.sdList = dms.DM_SD
      }, this)
      // 评估标准
      this.$kwz.ajax.ajaxUrl({
        url: 'dd_gzap/doSelectPgbz/DDPGBZ',
        type: 'POST',
        data: {
          'YWLX': 'DDPGBZ',
          'DDPGBZ': 'DDPGBZ'
        },
        vue: this,
        then (response) {
          let datas = response.data.datas
          let pgbzList = []
          if (datas && datas.length > 0) {
            for (let i = 0; i < datas.length; i++) {
              pgbzList.push({
                name: datas[i].BZMC,
                value: datas[i].BZID
              })
            }
          } else {
            pgbzList.push({
              name: '暂无记录',
              value: ''
            })
          }
          this.pgbzList = [pgbzList]
        }
      })
      // 加载当前学期
      this.$kwz.ajax.ajaxUrl({
        url: 'jc_xq/getCurXq',
        type: 'POST',
        vue: this,
        then (response) {
          let datas = response.data.datas
          if (datas && datas.curXq) {
            this.formData.xqid = datas.curXq.XQ_ID
          }
        }
      })
    },
    // 获取日期限制
    getdateImpose () {
      let startEnd = this.$kwz.dateImpose('b892eba5fae9493189ac81a510bbbd73', this)
      if (!startEnd) {
        setTimeout(() => {
          this.getdateImpose()
        }, 500)
      } else {
        this.startDate = this.$kwz.getLimdat(JSON.parse(startEnd.minDate))
        this.endDate = this.$kwz.getLimdat(JSON.parse(startEnd.maxDate))
        this.formData.minDate = startEnd.minDate
        this.formData.maxDate = startEnd.maxDate
      }
    },
    // 获取功能权限
    getPermission (url) {
      return this.$kwz.hasAuth(url, this)
    },
    // 判断路由加载工作计划数据
    initFormData () {
      let query = this.$route.query
      if (query && query.contentId) {
        this.title = '修改工作计划'
        this.contentId = query.contentId
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_gzap/doSelectByPrimary/DDGZAP',
          type: 'POST',
          data: {
            CONTENT_ID: this.contentId
          },
          vue: this,
          then (response) {
            let datas = response.data.datas
            if (datas && datas.map) {
              let formData = datas.map
              this.formData.xxName = formData.ORG_ID_TARGET_MC
              this.formData.xxId = formData.ORG_ID_TARGET
              this.formData.YWSJ = (formData.YWSJ && formData.YWSJ.length > 10 ? formData.YWSJ.substr(0, 10) : '')
              this.formData.sdValue = [formData.SD]
              this.formData.sxdxName = formData.CJID_MC
              this.formData.sxdxId = formData.CJID
              this.formData.pgbzValue = [formData.BZID]

              let ddsx = this.$kwz.spiltHtml(formData.TXT)
              this.formData.ddsxTxt = ddsx.text || ''
              if (ddsx.imgSrcs && ddsx.imgSrcs.length > 0) {
                let ddjsImageList = []
                for (let i = 0; i < ddsx.imgSrcs.length; i++) {
                  let img = ddsx.imgSrcs[i]
                  ddjsImageList.push({
                    src: this.$kwz.ajax.url(img),
                    msrc: this.$kwz.ajax.url(img),
                    rSrc: img,
                    rMsrc: img
                  })
                }
                this.ddjsImageList = ddjsImageList
              }
            }
          }
        })
      } else {
        this.formData.YWSJ = this.$kwz.formatDate()
        this.formData.sdValue = ['1']
      }
      this.getdateImpose()
    },
    // 点击保存按钮
    doSave () {
      if (!this.formData.xxId) {
        this.$kwz.alert('请选择学校')
        return
      }
      if (!this.formData.YWSJ) {
        this.$kwz.alert('请选择计划时间')
        return
      }
      if (this.formData.sdValue.length < 1 || !this.formData.sdValue[0]) {
        this.$kwz.alert('请选择时段')
        return
      }
      if (this.contentId) {
        this.doUpdate()
      } else {
        this.doAdd()
      }
    },
    // 打开随行督学选择列表
    toSxdx () {
      this.sxdx.sxdxShow = !this.sxdx.sxdxShow
      // this.doSxdxCondition()
      this.doSxdxSearch()
    },
    // 随行督学搜索条件
    doSxdxCondition () {
      this.$kwz.loadVueDms('DM_DD_DXLX', dms => {
        this.sxdx.searchCondition = dms
      }, this)
    },
    // 搜索随行督学
    doSxdxSearch (type) {
      if (!type) {
        this.sxdx.searchParam.page = 1
      }
      this.$kwz.ajax.ajaxUrl({
        url: 'jc_group/doDdChoose',
        type: 'POST',
        vue: this,
        data: {
          DDJL: 'DDJL',
          page: this.sxdx.searchParam.page,
          DXLXM: this.sxdx.searchParam.dxlxValue[0],
          U_USERNAME: this.sxdx.searchParam.xm,
          ORG_MC: this.sxdx.searchParam.xxmc,
          EXCEPT: '3'
        },
        then (response) {
          let datas = response.data.datas
          if (datas && datas.length > 0) {
            let dxList = []
            for (let i = 0; i < datas.length; i++) {
              dxList.push({
                value: datas[i].U_USERNAME,
                key: datas[i].U_ID
              })
            }
            this.sxdx.searchParam.page++
            this.sxdx.moreParam.hasMore = false
            this.sxdx.moreParam.moreName = '加载更多'
            if (type) {
              this.sxdx.sxdxList = this.sxdx.sxdxList.concat(dxList)
            } else {
              this.sxdx.sxdxList = dxList
            }
          } else {
            this.sxdx.moreParam.hasMore = true
            if (type) {
              this.sxdx.moreParam.moreName = '已无更多数据'
            } else {
              this.sxdx.sxdxList = []
              this.sxdx.moreParam.moreName = '无数据'
            }
          }
        }
      })
      this.sxdx.sxdxSearchShow = false
    },
    // 随行督学选择
    sxdxSelect (value, label) {
      this.formData.sxdxId = value.join(',')
      this.formData.sxdxName = label.join(',')
    },
    // 随行督学加载更多
    doSxdxLoadMore () {
      this.doSxdxSearch(true)
    },
    // 打开学校选择列表
    toXx () {
      this.xx.xxShow = !this.xx.xxShow
      this.doXxSearch()
    },
    // 搜索学校
    doXxSearch (type) {
      if (!type) {
        this.xx.searchParam.page = 1
      }
      this.$kwz.ajax.ajaxUrl({
        url: 'dd_gzap/getSchoolPage',
        type: 'POST',
        vue: this,
        data: {
          DDJL: 'DDJL',
          page: this.xx.searchParam.page,
          ORG_MC: this.xx.searchParam.xxmc
        },
        then (response) {
          let datas = response.data.datas
          if (datas && datas.length > 0) {
            let xxList = []
            for (let i = 0; i < datas.length; i++) {
              xxList.push({
                value: datas[i].ORG_MC,
                key: datas[i].ORG_ID
              })
            }
            this.xx.searchParam.page++
            this.xx.moreParam.hasMore = false
            this.xx.moreParam.moreName = '加载更多'
            if (type) {
              this.xx.xxList = this.xx.xxList.concat(xxList)
            } else {
              this.xx.xxList = xxList
            }
          } else {
            this.xx.moreParam.hasMore = true
            if (type) {
              this.xx.moreParam.moreName = '已无更多数据'
            } else {
              this.xx.xxList = []
              this.xx.moreParam.moreName = '无数据'
            }
          }
        }
      })
      this.xx.xxSearchShow = false
    },
    // 随行督学选择
    xxSelect (value, label) {
      this.formData.xxId = value.join(',')
      this.formData.xxName = label.join(',')
    },
    // 随行督学加载更多
    doXxLoadMore () {
      this.doXxSearch(true)
    },
    // 新增
    doAdd () {
      let params = this.commonParam()
      this.$kwz.ajax.ajaxUrl({
        url: 'dd_gzap/doAdd/DDGZAP',
        type: 'POST',
        data: params,
        vue: this,
        then (response) {
          this.$kwz.alert('保存成功')
          this.$router.push({path: '/b892eba5fae9493189ac81a510bbbd73'})
        }
      })
    },
    // 修改
    doUpdate () {
      this.$kwz.ajax.ajaxUrl({
        url: 'dd_gzap/doUpdate',
        type: 'POST',
        data: {
          CONTENT_ID: this.contentId,
          XQID: this.formData.xqid,
          ORG_ID: this.formData.xxId,
          JGID: this.formData.sxdxId,
          JGID_MC: this.formData.sxdxName,
          YWSJ: this.formData.YWSJ,
          SD: this.formData.sdValue[0],
          TXT: this.formData.ddsxTxt,
          BZID: this.formData.pgbzValue[0],
          minDate: this.formData.minDate,
          maxDate: this.formData.maxDate
        },
        vue: this,
        then (response) {
          this.$kwz.alert('保存成功')
          this.$router.push({path: '/b892eba5fae9493189ac81a510bbbd73'})
        }
      })
    },
    commonParam () {
      let content = [this.formData.ddsxTxt]
      if (this.ddjsImageList.length > 0) {
        for (let i = 0; i < this.ddjsImageList.length; i++) {
          content.push('<img src="' + this.ddjsImageList[i].rSrc + '" >')
        }
      }
      let params = {
        CONTENT_TYPE: 'DDGZAP',
        XQID: this.formData.xqid,
        STATUS: '1',
        GROUP_ARR: `[{
          "xxid": "${this.formData.xxId}",
          "xxmc": "${this.formData.xxName}",
          "jgid": "${this.formData.sxdxId}",
          "jgmc": "${this.formData.sxdxName}",
          "ywsj": "${this.formData.YWSJ}",
          "sd": "${this.formData.sdValue[0]}",
          "minDate": ${this.formData.minDate},
          "maxDate": ${this.formData.maxDate}
        }]`,
        TXT: content.join('<br>'),
        REMARK: this.formData.remark,
        BZID: this.formData.pgbzValue[0],
        ORG_ID: this.formData.xxId,
        AUTHOR: this.user.name
      }
      return params
    }
  },
  components: {
    XHeader,
    Group,
    PopupPicker,
    Cell,
    Datetime,
    XInput,
    XButton,
    Checklist,
    XTextarea,
    Previewer
  }
}
</script>

<style scoped>
  .c_gzjh_add_ddsx_content{
    margin: 10px 15px;
    border-top: 1px solid #D9D9D9;
    padding: 0;
  }

  .c_gzjh_add_saveBack button{
    margin: 5px 10px;
  }
</style>
