<template>
  <div class="c_ddjs_add c_ContentMain">
    <!--标题栏-->
    <x-header class="c_header" :left-options="{preventGoBack: true}" @on-click-back="toBack">
      <span>工作计划-督导</span>
      <a slot="right" @click="doAdd" v-show="getPermission('ddjl/doEdit')">
        <span class="fa fa-save">&nbsp;保存</span>
      </a>
    </x-header>

    <!--必填项-->
    <group class="c_FormAdd" v-show="!ddpgShow">
      <cell title="工作计划" :value="workPlanName"></cell>
      <cell title="学校(园)" is-link  @click.native="toXx" :value="data.xxName"></cell>
      <cell title="随行督学" is-link @click.native="showSxdx" :value="sxdxName"></cell>
      <datetime :end-date="endDate" :start-date="startDate" v-model="data.YWSJ" title="时间"></datetime>
      <!--督导事项-->
      <div class="c_FormAdd_editor">
        <div  class="c_FormAdd_editor_head clearfix" @click="ddsxShow = !ddsxShow">
          <p>
            督导事项
            <span class="fa fa-sort-desc fr" v-if="!ddsxShow"></span>
            <span class="fa fa-sort-asc fr" v-if="ddsxShow"></span>
          </p>
        </div>
        <div v-show="ddsxShow" class="c_FormAdd_editor_content">

          <div>
            <p class="c_FormAdd_editor_content_text">{{ddsxText}}</p>
          </div>
          <!--图片区-->
          <div class="c_upLoadImg_img">
            <div v-for="(item, index) in previewerListDDSX" :key="index" class="c_gzjh_add_ddsx_imgBody">
              <img class="previewer-demo-img-ddsx" :src="item.src" @click="showImg(index)">
            </div>
            <div>
              <previewer :list="previewerListDDSX" ref="previewer" :options="previewerOptionsDDSX" class="pswp--zoom-allowed"></previewer>
            </div>
          </div>
        </div>
      </div>
      <!--自主任务-->
      <div class="c_FormAdd_editor">
        <div class="c_FormAdd_editor_head clearfix" @click="ddjsListShow = !ddjsListShow">
          <p>
            自主任务
            <span class="fa fa-sort-desc fr" v-if="!ddjsListShow"></span>
            <span class="fa fa-sort-asc fr" v-if="ddjsListShow"></span>
          </p>
        </div>
        <vue-html5-editor  v-show="ddjsListShow" :content="ddjsData" :height="200" @change="updateDdjsData"></vue-html5-editor>

        <cell v-show="ddjsListShow" title="查阅资料(份)">
          <inline-x-number style="display:block;" :min="0" v-model="data.CYZL"  width="50px" button-style="round"></inline-x-number>
        </cell>
        <cell v-show="ddjsListShow" title="列席会议(次)">
          <inline-x-number style="display:block;" :min="0" v-model="data.LXHY" width="50px" button-style="round"></inline-x-number>
        </cell>
        <cell v-show="ddjsListShow" title="座谈走访(次)">
          <inline-x-number style="display:block;" :min="0" v-model="data.ZTZF" width="50px" button-style="round"></inline-x-number>
        </cell>
        <cell v-show="ddjsListShow" title="问卷调查(次)">
          <inline-x-number style="display:block;" :min="0" v-model="data.WJDC"  width="50px" button-style="round"></inline-x-number>
        </cell>
        <cell v-show="ddjsListShow" title="校园巡视(次)">
          <inline-x-number style="display:block;" :min="0" v-model="data.XYXS"  width="50px" button-style="round"></inline-x-number>
        </cell>

      </div>
      <!--要评估-->
      <cell title="规定任务评价" v-if="!!data.BZID && getPermission('dd_ddjl/toPg')" :inline-desc="pgbzMc">
        <div slot="">
          <x-button mini type="warn" v-if="!!data.BZID" @click.native="toDdpg" v-show="getPermission('dd_ddjl/toPg')">要评估</x-button>
        </div>
        <rater v-if="!!pgFz" v-model="pgFz" disabled></rater>
      </cell>

      <div class="c_FormAdd_editor">
        <div class="c_FormAdd_editor_head clearfix" @click="experienceAndPractice =!experienceAndPractice">
          <p>
            典型经验和做法
            <span class="fa fa-sort-desc fr" v-if="!experienceAndPractice"></span>
            <span class="fa fa-sort-asc fr" v-if="experienceAndPractice"></span>
          </p>
        </div>

        <div v-show="experienceAndPractice">
          <x-textarea :max="4000" v-model="data.DXJY" :rows="4" class="c_textarea_border"></x-textarea>
        </div>
      </div>
      <div class="c_FormAdd_editor">
        <div class="c_FormAdd_editor_head clearfix" @click="existIssue =!existIssue">
          <p>
            存在问题
            <span class="fa fa-sort-desc fr" v-if="!existIssue"></span>
            <span class="fa fa-sort-asc fr" v-if="existIssue"></span>
          </p>
        </div>

        <div v-show="existIssue">
          <x-textarea :max="4000" v-model="data.CZWT" :rows="4" class="c_textarea_border"></x-textarea>
        </div>
      </div>
      <popup-picker show-name :data="disposeIdeaList" v-model="disposeIdeaValue" ref="hxText"
                    confirm-text="确定"  @on-change="selectDisposeIdea">
        <div slot="title" :class="{c_ddjs_add_xzbody_disposeIdeaTitle:disposeIdea.BH}">
          <p>后续处理意见</p>
          <p v-if="disposeIdea.BH">
            <span v-if="disposeIdeaValue[0] === '3'">协商意见编号：</span>
            <span v-else>整改编号：</span>
            <span class="c_ddjs_add_xzbody_disposeIdeaTitle_bh">{{disposeIdea.BH}}</span>
          </p>
        </div>
      </popup-picker>
    </group>

    <!--学校选择隐藏页-->
    <div v-show="xx.xxShow" class="c_pickBody">
      <div class="c_pickBody_head clearfix">
        <x-button mini class="fl" type="primary" plain @click.native="xx.xxShow = !xx.xxShow">
          <span class="fa fa-angle-left fa-1x"></span>
          <span class="text-bold" >&nbsp;选择</span>
        </x-button>
        <span class="fr" @click.stop="xx.xxSearchShow = true">
          <span class="fa fa-search">&nbsp;搜索</span>
        </span>
      </div>

      <div class="" v-show="xx.xxSearchShow" >
        <group title="搜索条件" class="c_searchBody_content">
          <x-input title="学校名称" v-model="xx.searchParam.xxmc" class="c_inputParent_borderB" placeholder="请输入学校名称"></x-input>
          <x-button  @click.native.stop="doXxSearch(false)">搜索</x-button>
        </group>
        <div class="c_searchBody_mask" @click.stop="xx.xxSearchShow = !xx.xxSearchShow"></div>
      </div>

      <div>
        <checklist :options="xx.xxList" :max="1" @on-change="xxSelect" ></checklist>
      </div>
      <x-button @click.native="doXxLoadMore" :disabled="xx.moreParam.hasMore">{{xx.moreParam.moreName}}</x-button>
    </div>

    <!--随行督学隐藏页-->
    <div v-show="sxdxShow && !ddpgShow" class="c_pickBody">
      <div class="c_pickBody_head clearfix">
        <x-button mini class="fl" type="primary" plain @click.native="sxdxShow = !sxdxShow" >
          <span class="fa fa-angle-left fa-1x"></span>
          <span class="text-bold" >&nbsp;选择</span>
        </x-button>
        <span class="fr" @click.stop="sxdxSearchShow = true">
          <span class="fa fa-search">&nbsp;搜索</span>
        </span>
      </div>
      <div class="" v-show="sxdxSearchShow">
        <group title="搜索条件" class="c_searchBody_content">
          <x-input title="姓名" v-model="sxdxSearch.xm" class="c_inputParent_borderB" placeholder="请输入随行督学姓名"></x-input>
          <!-- <x-input title="机构" v-model="sxdxSearch.xxmc" placeholder="请输入随行督学机构"></x-input>
          <popup-picker confirm-text="确定" title="督学类型" :show-name="true" :data="sxdxCondition.DM_DD_DXLX" v-model="sxdxSearch.dxlxValue" ></popup-picker> -->
          <x-button @click.native="searchSxdxData">搜索</x-button>
        </group>
        <div class="c_searchBody_mask" @click.stop="sxdxSearchShow = !sxdxSearchShow"></div>
      </div>
      <div>
        <checklist :options="sxdxDataList" @on-change="addSxdx"></checklist>
      </div>
      <x-button @click.native="loadSxdxData(true)" :disabled="sxdxMoreParam.hasMore">{{sxdxMoreParam.moreName}}</x-button>
    </div>

    <!-- 督导整改通知书隐藏页-->
    <div v-if="disposeIdeasShow.bodyShow && !ddpgShow" class="c_ddjs_add_info">
      <!--小问题:4-->
      <group v-if="disposeIdeasShow.smallShow" class="c_ddjs_add_infoBody" label-width="5em" title="向学校现场反馈建议">
        <div class="c_ddjs_add_info_wt">
          <x-textarea :max="4000" :rows="4" v-model="disposeIdea.ZGJY" class="c_textarea_border"></x-textarea>
        </div>
        <div class="c_ddjs_add_infoBody_back">
          <x-button class="fl" mini @click.native="disposeIdeaBack">返回</x-button>
          <x-button class="fr" mini type="primary" @click.native="sendDisposeIdea">发送</x-button>
        </div>
      </group>
      <!--一般问题:2 严重问题:5-->
      <group v-else-if="disposeIdeasShow.midBigShow " label-width="5em" title="督导整改建议" class="c_ddjs_add_infoBody">
        <cell title="编号" class="c_zggz_searchShow_xxmc" v-model="disposeIdea.BH"></cell>
        <cell title="单位" class="c_zggz_searchShow_xxmc" v-model="data.xxName"></cell>
        <cell title="来源渠道" class="c_zggz_searchShow_xxmc" value="经常性督导整改"></cell>

        <div class="c_ddjs_add_info_wt">
          <p>经督导检查，你单位存在以下问题及建议:</p>
          <x-textarea :max="4000" v-model="disposeIdea.XSNR" :rows="4" class="c_textarea_border"></x-textarea>
          <p>
            <span>对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发</span>
            <input type="text" size="3" v-model="disposeIdea.CLQX" required class="c_input_borderB">
            <span>日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。</span>
          </p>

        </div>
        <cell :value="disposeIdea.TIME" class="text-bold"></cell>
        <div class="c_ddjs_add_infoBody_back">
          <x-button class="fl" mini @click.native="disposeIdeaBack">返回</x-button>
          <x-button class="fr" mini type="primary" @click.native="sendDisposeIdea">发送</x-button>
        </div>
      </group>
      <!--复杂问题--向科室发送协商意见:3-->
      <group v-show="disposeIdeasShow.complexShow " label-width="5em" title="督导协商意见书" class="c_ddjs_add_infoBody">
        <cell title="编号" class="c_zggz_searchShow_xxmc" v-model="disposeIdea.BH"></cell>
        <popup-picker title="科室/中心" show-name :data="ksList" v-model="ksValue" ref="ksText"
                      confirm-text="确定"></popup-picker>
        <div class="c_ddjs_add_info_wt">
          <p>
            我室责任督学于
            <span class="text-bold">{{data.YWSJ}}</span>对<span class="text-bold">{{data.xxName}}</span>
            进行了教育督导，发现该学校(幼儿园)存在以下问题及建议：
          </p>
          <x-textarea :max="4000" v-model="disposeIdea.XSNR" :rows="4" class="c_textarea_border"></x-textarea>
          <p>请贵科室（中心）予以支持、配合、协调解决!</p>

        </div>
        <div class="c_ddjs_add_infoBody_back">
          <x-button class="fl" mini @click.native="disposeIdeaBack">返回</x-button>
          <x-button class="fr" mini type="primary" @click.native="sendDisposeIdea">发送</x-button>
        </div>
      </group>
    </div>

    <!--表格内容-->
    <!-- <div v-show="ddpgShow" class="c_ddjs_assess_table" v-html="pgbzTemplate"></div> -->
    <div v-show="ddpgShow" class="c_ddjs_assess_table" id="pgbzContainer" ></div>
  </div>
</template>

<script>
import {XHeader, Group, PopupPicker, XTextarea, XButton, Cell, XInput, Checklist, Previewer, Datetime, InlineXNumber, XSwitch, Rater} from 'vux'
import { mapGetters } from 'vuex'
export default {
  name: 'ddjs_add',
  components: {XHeader, Group, PopupPicker, XTextarea, XButton, Cell, XInput, Checklist, Previewer, Datetime, InlineXNumber, XSwitch, Rater},
  data () {
    return {
      // 随行督学中搜索的隐藏显示
      sxdxSearchShow: false,
      contentId: '', // 督导纪实id
      BZMC: '', // 评估标准名称
      workPlanId: '', // 传过来的工作计划id
      // 督导数据
      data: {
        BZID: '',
        xxValue: '',
        xxName: '',
        zgValue: ['1'],
        xqValue: [''],
        YWSJ: '',
        DXJY: '',
        CZWT: '',
        CYZL: 0,
        LXHY: 0,
        ZTZF: 0,
        WJDC: 0,
        XYXS: 0,
        ZGXSID: ''
      },
      startDate: '', // 可填写的最小时间,别放在date对象里,而且一定要事先创建好变量
      endDate: '', // 可填写的最大时间,别放在date对象里,而且一定要事先创建好变量
      // 工作计划选择显示隐藏
      wokrPlanShow: false,
      // 选择的工作计划名称
      workPlanName: '',
      // 学校列表
      xxList: [],
      // 随行督学选择显示隐藏
      sxdxShow: false,
      // 随行督学搜索
      sxdxSearch: {
        xxmc: '',
        xm: '',
        dxlxValue: [''],
        page: 1
      },
      sxdxCondition: {},
      // 随行督学“加载更多”参数
      sxdxMoreParam: {
        hasMore: false,
        moreName: '加载更多'
      },
      // 随行督学列表
      sxdxDataList: [],
      // 选择的随行督学
      sxdxId: '',
      // 选择的随行督学名称
      sxdxName: '',
      // 督导纪实显示隐藏
      ddjsListShow: false,
      zglx: [[{value: '1', name: '无'}, {value: '2', name: '发送整改通知书'}]],
      // 督导纪实内容数组
      ddjsData: '',
      // 典型经验和做法显示隐藏
      experienceAndPractice: false,
      // 存在的问题显示隐藏
      existIssue: false,
      // 后续处理意见数据
      disposeIdea: {
        BH: '', // 整改编号
        DW: '', // 需整改单位（学校）
        ORG_ID_TARGET: '', // 单位（学校）id
        TIME: '', // 督导时间
        CLQX: '', // 处理期限
        IS_SB: '0', // 是否上报 0一般问题 1严重问题
        ORG_MC: '', // 科室名称
        XS_ORG_ID: '', // 协商机构id（科室/中心id）
        ZGJY: '', // 整改建议
        XSNR: '',
        ZGXSDM: '',  // 整改协商代码 1：整改通知  2：协商意见
        ZGXSMC: '', // 整改名称 1：整改通知  2：协商意见
        STATUS: '1',
        STATUS_MC: '无意见',
        ZGXSID: '' // 整改协商id
      },
      ksList: [['']], // 科室选择列表
      ksValue: [''],  // 科室列表选择值
      disposeIdeaBh: '', // 显示在页面上的整改通知书编号
      // 后续处理意见显示隐藏
      disposeIdeasShow: {
        bodyShow: false, // 整个后续处理意见显示隐藏
        smallShow: false, // 小问题显示隐藏
        midBigShow: false, // 一般问题、严重问题显示隐藏
        complexShow: false // 复杂问题显示隐藏
      },
      // 后续处理意见各功能显示隐藏
      disposeIdeaList: [[
        {
          name: '无意见',
          value: '1'
        },
        {
          name: '小问题--向学校现场反馈建议',
          value: '4'
        },
        {
          name: '一般问题--向学校发送整改建议',
          value: '2'
        },
        {
          name: '严重问题--向督导办上报整改建议',
          value: '5'
        },
        {
          name: '复杂问题--向科室发送协商意见',
          value: '3'
        }
      ]],
      disposeIdeaValue: ['1'],
      disposeIdeaInit: '', // 修改进来的后续处理意见初始值 以此判断有没有修改
      // 督导事项显示隐藏
      ddsxShow: false,
      // 督导事项内容==》从工作计划中取
      ddsxText: '',
      // 督导事项内容图片==》从工作计划中取
      previewerListDDSX: [],
      // 督导事项内容图片配置==》从工作计划中取
      previewerOptionsDDSX: {
        getThumbBoundsFn (index) {
          let thumbnail = document.querySelectorAll('.previewer-demo-img-ddsx')[index]
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          let rect = thumbnail.getBoundingClientRect()
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
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
      // 学期列表
      // xqList: [],
      // 评估标准列表
      pgbzList: [],
      // 评估标准显示
      ddpgShow: false,
      pgFz: '',
      pgbzMc: '',
      // 评估标准模板
      pgbzVm: {},
      BID: '' // 批次id
    }
  },
  created () {
    this.loadXxList()
  },
  mounted () {
    this.loadWorkPlan()
  },
  computed: {
    ...mapGetters({
      user: 'user'
    })
  },
  methods: {
    // 返回按钮
    toBack () {
      if (this.ddpgShow) {
        this.ddpgShow = false
      } else {
        this.deleteDisposeIdeaId()
        this.$router.push({path: '/b892eba5fae9493189ac81a510bbbd73'})
      }
    },
    // 预先加载数据
    loadWorkPlan () {
      let query = this.$route.query
      if (query && query.workPlanId) {
        this.workPlanId = query.workPlanId
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_gzap/doSelectByPrimary/DDGZAP',
          type: 'POST',
          data: {
            CONTENT_ID: this.workPlanId
          },
          vue: this,
          then (response) {
            let datas = response.data.datas
            if (datas && datas.map) {
              let gzjh = datas.map
              let ywsj = gzjh.YWSJ && gzjh.YWSJ.length > 10 ? gzjh.YWSJ.substr(0, 10) : gzjh.YWSJ
              let mc = (gzjh.ORG_ID_TARGET_MC ? (gzjh.ORG_ID_TARGET_MC + '/') : gzjh.ORG_ID_TARGET_MC) + (ywsj ? (ywsj + '/') : ywsj) + (gzjh.SD === '1' ? '上午' : '下午') + '/' + (gzjh.AUTHOR ? (gzjh.AUTHOR + '/') : gzjh.AUTHOR)
              this.data.YWSJ = this.$kwz.formatDate('yyyy-MM-dd')
              this.data.startDate = this.$kwz.getLimdat(-1)
              this.data.endDate = this.$kwz.formatDate('yyyy-MM-dd')
              this.workPlanName = mc.length > 16 ? (mc.substr(0, 16) + '...') : mc
              this.data.xxValue = gzjh.ORG_ID_TARGET
              this.data.xxName = gzjh.ORG_ID_TARGET_MC
              this.sxdxId = gzjh.CJID
              this.sxdxName = gzjh.CJID_MC
              this.ddsxShow = !!gzjh.TXT
              this.data.xqValue = [gzjh.XQID]

              let ddsx = this.$kwz.spiltHtml(gzjh.TXT)
              this.ddsxText = !ddsx.text && (!ddsx.imgSrcs || ddsx.imgSrcs.length < 1) ? '无' : (ddsx.text || '')

              if (ddsx.imgSrcs && ddsx.imgSrcs.length > 0) {
                let previewerListDDSX = []
                for (let i = 0; i < ddsx.imgSrcs.length; i++) {
                  previewerListDDSX.push({
                    src: this.$kwz.ajax.url(ddsx.imgSrcs[i]),
                    msrc: this.$kwz.ajax.url(ddsx.imgSrcs[i]),
                    rSrc: ddsx.imgSrcs[i],
                    rMsrc: ddsx.imgSrcs[i]
                  })
                }
                this.previewerListDDSX = previewerListDDSX
              }
              if (gzjh.BZID) {
                this.BZMC = gzjh.BZMC
                this.data.BZID = gzjh.BZID
              }
            }
          }
        })
      }
      this.getdateImpose()
    },
    // 获取日期限制
    getdateImpose () {
      let startEnd = this.$kwz.dateImpose('ebc60e699bc642a1871f1e017b979483', this)
      if (!startEnd) {
        setTimeout(() => {
          this.getdateImpose()
        }, 500)
      } else {
        this.startDate = this.$kwz.getLimdat(JSON.parse(startEnd.minDate))
        this.endDate = this.$kwz.getLimdat(JSON.parse(startEnd.maxDate))
        this.data.minDate = startEnd.minDate
        this.data.maxDate = startEnd.maxDate
      }
    },
    // 获取功能权限
    getPermission (url) {
      return this.$kwz.hasAuth(url, this)
    },
    // 保存按钮
    doAdd () {
      // 判断评估有没有被打开
      if (this.ddpgShow) {
        this.pgbzVm.saveData(this, () => {
          this.pgbzMc = this.BZMC + '(分值：' + this.pgbzVm.pgData.FenZhi + '分)'
          let fz = Math.round(this.pgbzVm.pgData.FenZhi)
          this.pgFz = parseInt(fz)
        })
      } else {
        if (!this.data.xxValue) {
          this.$kwz.alert('请选择学校')
          return
        }
        if (!this.data.YWSJ) {
          this.$kwz.alert('时间')
          return
        }
        if (!this.ddjsData) {
          this.$kwz.alert('自主任务不能为空')
          return
        }
        // 如果没学期获取当前学期
        if (this.data.xqValue.length < 1 || !this.data.xqValue[0]) {
          this.$kwz.ajax.ajaxUrl({
            url: 'jc_xq/getCurXq',
            type: 'POST',
            vue: this,
            then (response) {
              let datas = response.data.datas
              if (datas && datas.curXq && datas.curXq.XQ_ID) {
                this.data.xqValue = [datas.curXq.XQ_ID]
                this.saveDdjsToServer()
              }
            }
          })
        } else {
          this.saveDdjsToServer()
        }
      }
    },
    // 保存ajax
    saveDdjsToServer () {
      this.$kwz.ajax.ajaxUrl({
        url: 'ddjl/doEdit',
        type: 'POST',
        data: {
          ORG_ID: this.data.xxValue,
          XXMC: this.data.xxName,
          YWSJ: this.data.YWSJ,
          USERID: this.sxdxId,
          USERID_MC: this.sxdxName,
          DDJS: this.ddjsData,
          CZWT: this.data.CZWT,
          DXJY: this.data.DXJY,
          ZTZF: this.data.ZTZF,
          XYXS: this.data.XYXS,
          CYZL: this.data.CYZL,
          WJDC: this.data.WJDC,
          LXHY: this.data.LXHY,
          GZAP_YWID: this.workPlanId,
          XQID: this.data.xqValue,
          STATUS: this.disposeIdea.STATUS,
          STATUS_MC: this.disposeIdea.STATUS_MC,
          ZGJY: this.disposeIdea.ZGJY,
          ZGXSID: this.disposeIdea.ZGXSID,
          // CONTENT_ID: this.contentId, // 传了就代表是修改
          PGMC: '',
          BZID: this.data.BZID,
          PGID: this.data.pgid ? this.data.pgid : '',
          minDate: this.data.minDate, // 最小时间限制
          maxDate: this.data.maxDate // 最大时间限制
        },
        vue: this,
        then (response) {
          this.$kwz.alert('保存成功')
          this.$router.push({path: '/b892eba5fae9493189ac81a510bbbd73'})
        }
      })
    },
    // 去督导评估
    toDdpg () {
      // 判断评估有没有加载 ，已经加载了就直接打开
      if (!this.$kwz.jsonIsEmpty(this.pgbzVm)) {
        if (this.data.BZID) {
          // 如果没有评估id就去获取(评估需要一点进去就有pgid)
          if (this.data.pgid) {
            this.ddGetMxid()
          } else {
            this.$kwz.ajax.ajaxUrl({
              // 根据标准id查找最新批次
              url: 'jc_batch/selectBatchByMbid/DDPGBZ',
              type: 'POST',
              data: {
                MBID: this.data.BZID
              },
              vue: this,
              then (response) {
                let datas = response.data.datas
                this.BID = datas.BID
                if (datas && this.BID) {
                  // 查找评估记录是否已存在
                  this.$kwz.ajax.ajaxUrl({
                    url: 'jc_pgbzmx/getMbMx/DDPGBZ',
                    type: 'POST',
                    data: {
                      MB_ORG_ID: this.data.xxValue,
                      BID: this.BID
                    },
                    vue: this,
                    then (response) {
                      let datas1 = response.data.datas
                      // 未填报督学
                      let wtbDx = []
                      let sxdx = this.sxdxId ? this.sxdxId.split(',') : []
                      if (sxdx.length > 0) {
                        if (datas1 && datas1.length > 0) {
                          for (let j = 0; j < sxdx.length; j++) {
                            let eSxdx = false
                            for (let i = 0; i < datas1.length; i++) {
                              if (datas1[i].TBR === sxdx[j]) {
                                eSxdx = true
                                break
                              }
                            }
                            if (!eSxdx) {
                              wtbDx.push(sxdx[j])
                            }
                          }
                        } else {
                          wtbDx = sxdx
                        }
                        // 如果存在还未填报的督学==》就新增
                        if (wtbDx.length > 0) {
                          // 新增评估
                          this.$kwz.ajax.ajaxUrl({
                            url: 'jc_pgbzmb/doAddBatch/DDPGBZ',
                            type: 'POST',
                            data: {
                              BID: this.BID,
                              PGMC: datas.BMC,
                              PGLX: '2',
                              MB_ORG_ID: this.data.xxValue,
                              TBR: wtbDx.join(',')
                            },
                            vue: this,
                            then (response) {
                              this.ddGetMxid()
                            }
                          })
                        } else {
                          this.ddGetMxid()
                        }
                      }
                    }
                  })
                }
              }
            })
          }
        } else {
          this.$kwz.alert('工作计划数据有误')
        }
      } else {
        this.ddpgShow = true
      }
    },
    // 获取评估id
    ddGetMxid () {
      this.$kwz.ajax.ajaxUrl({
        url: 'jc_pgbzmx/getMxByTbr/DDPGBZ',
        type: 'POST',
        data: {
          BID: this.data.pgid ? '' : this.BID,
          PGID: this.data.pgid ? this.data.pgid : '',
          tbr: this.user.unicode,
          MB_ORG_ID: this.data.xxValue
        },
        vue: this,
        then (response) {
          let datas = response.data.datas
          if (datas && datas.MXID) {
            this.data.pgid = datas.PGID
            this.data.MXID = datas.MXID
            this.updateDdpg()
          }
        }
      })
    },
    // 更新督导评估
    updateDdpg () {
      if (this.data.MXID) {
        // 获取评估模板
        this.$kwz.ajax.ajaxUrl({
          url: 'jc_pgbz/selectTbmbglByKey',
          type: 'POST',
          data: {
            BZID: this.data.BZID
          },
          vue: this,
          then (response) {
            let datas = response.data.datas
            if (datas && datas.tbmbglData) {
              // this.pgbzTemplate = this.$kwz.formatPgbz(datas.tbmbglData.MBNR)
              // 获取评估详情
              this.$kwz.ajax.ajaxUrl({
                url: 'jc_pgbzmx/doSelectByPrimary/DDJL',
                type: 'POST',
                data: {
                  MXID: this.data.MXID
                },
                vue: this,
                then (response) {
                  let datas1 = response.data.datas
                  let sj
                  if (datas1 && datas1.SJ) {
                    try {
                      sj = JSON.parse(datas1.SJ)
                    } catch (e) {
                      console.error(e)
                    }
                  }
                  let pgbzCom = this.$kwz.formatPgbz(datas.tbmbglData.MBNR, sj)
                  this.pgbzVm = pgbzCom
                  document.getElementById('pgbzContainer').appendChild(pgbzCom.$mount().$el)
                }
              })
              this.ddpgShow = true
            } else {
              this.$kwz.alert('未找到模板，请联系管理员')
            }
          }
        })
      }
    },
    // 显示随行督学选择页面
    showSxdx () {
      this.sxdxShow = !this.sxdxShow
      this.loadSxdxCondition()
      this.searchSxdxData()
    },
    // 加载随行督学搜索条件
    loadSxdxCondition () {
      if (!this.sxdxCondition.DM_DD_DXLX) {
        this.$kwz.loadVueDms('DM_DD_DXLX', dms => {
          this.sxdxCondition = dms
        }, this)
      }
    },
    // 加载随行督学列表数据
    loadSxdxData (type) {
      this.$kwz.ajax.ajaxUrl({
        url: 'jc_group/doDdChoose',
        type: 'POST',
        data: {
          DDJL: 'DDJL',
          page: this.sxdxSearch.page,
          DXLXM: this.sxdxSearch.dxlxValue[0],
          U_USERNAME: this.sxdxSearch.xm,
          ORG_MC: this.sxdxSearch.xxmc
        },
        vue: this,
        then (response) {
          let datas = response.data.datas
          if (datas && datas.length > 0) {
            let sxdxDataList = []
            for (let i = 0; i < datas.length; i++) {
              let sxdx = datas[i]
              sxdxDataList.push({
                value: sxdx.U_USERNAME,
                key: sxdx.U_ID
              })
            }
            this.sxdxSearch.page++
            this.sxdxMoreParam.hasMore = false
            this.sxdxMoreParam.moreName = '加载更多'
            if (type) {
              this.sxdxDataList = this.sxdxDataList.concat(sxdxDataList)
            } else {
              this.sxdxDataList = sxdxDataList
            }
          } else {
            this.sxdxMoreParam.hasMore = true
            if (type) {
              this.sxdxMoreParam.moreName = '已无更多数据'
            } else {
              this.sxdxDataList = []
              this.sxdxMoreParam.moreName = '无数据'
            }
          }
        }
      })
    },
    // 搜索随行督学数据
    searchSxdxData () {
      this.sxdxSearch.page = 1
      this.loadSxdxData()
    },
    // 点击添加随行督学
    addSxdx (value, label) {
      this.sxdxId = value.join(',')
      this.sxdxName = label.join(',')
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
      this.data.xxValue = value.join(',')
      this.data.xxName = label.join(',')
    },
    // 随行督学加载更多
    doXxLoadMore () {
      this.doXxSearch(true)
    },
    // 加载学校列表
    loadXxList () {
      this.$kwz.ajax.ajaxUrl({
        url: 'dd_gzap/getSchool',
        type: 'POST',
        data: {
          DDJL: ''
        },
        vue: this,
        then (response) {
          let datas = response.data.datas
          if (datas && datas.XXLIST && datas.XXLIST.length > 0) {
            let xxList = []
            for (let i = 0; i < datas.XXLIST.length; i++) {
              xxList.push({
                value: datas.XXLIST[i].ORG_ID,
                name: datas.XXLIST[i].ORG_MC
              })
            }
            this.xxList = [xxList]
          }
        }
      })
    },
    // 后续处理意见 选择值 发生改变时触发
    selectDisposeIdea (val) {
      this.disposeIdea.TIME = this.data.YWSJ
      val = parseInt(val[0])
      if (val === 1) { // 无意见时要清除数据 防止保存时上传
        this.disposeIdea.BH = ''
        this.disposeIdea.DW = ''
        this.disposeIdea.ORG_ID_TARGET = ''
        this.disposeIdea.TIME = ''
        this.disposeIdea.XSNR = ''
        this.disposeIdea.CLQX = ''
        this.disposeIdea.IS_SB = '0'
        this.disposeIdea.XS_ORG_ID = ''
        this.disposeIdea.ZGJY = ''
        this.disposeIdea.STATUS = '1'
        this.disposeIdea.STATUS_MC = '无意见'
        this.deleteDisposeIdeaId()
      } else {
        this.disposeIdeasShow.bodyShow = true
        if (val === 4) {
          this.disposeIdeasShow.smallShow = true
        } else if (val === 2 || val === 5) {
          this.disposeIdeasShow.midBigShow = true
          this.getBh()
        } else {
          this.disposeIdeasShow.complexShow = true
          this.getBh()
          this.getKs()
        }
      }
    },
    // 获取编号
    getBh () {
      if (!this.disposeIdea.BH) {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/getNowTimeString',
          type: 'POST',
          vue: this,
          then (response) {
            let datas = response.data.datas
            if (datas.BH) {
              this.disposeIdea.BH = datas.BH
              let date = new Date()
              this.disposeIdea.TIME = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
            }
          }
        })
      }
    },
    // 获取协商科室
    getKs () {
      this.$kwz.ajax.ajaxUrl({
        url: 'ddjl/getKsList',
        type: 'post',
        vue: this,
        then (respose) {
          this.ksList = [[]]
          let datas = respose.data.datas.KSLIST
          let kss = {
            name: '',
            value: ''
          }
          for (let i = 0; i < datas.length; i++) {
            kss.name = datas[i].ORG_MC
            kss.value = datas[i].ORG_ID
            this.ksList[0].push(kss)
          }
        }
      })
    },
    // 后续处理意见发送
    sendDisposeIdea () {
      let val = parseInt(this.disposeIdeaValue[0])
      this.disposeIdea.DW = this.data.xxName
      if (val === 4) {
        if (!this.disposeIdea.ZGJY) {
          this.$kwz.alert('意见不能为空')
          return
        }
        this.disposeIdea.STATUS = '4'
        this.disposeIdea.STATUS_MC = '小问题--向学校现场反馈建议'
        this.deleteDisposeIdeaId()
      } else if (val === 2 || val === 5) {
        if (!/^[1-9]\d{0,2}$/.test(this.disposeIdea.CLQX)) {
          this.$kwz.alert('处理期限不能为空，且必须为数字')
          return
        } else if (!this.disposeIdea.XSNR) {
          this.$kwz.alert('问题及意见不能为空')
          return
        } else if (!this.disposeIdea.DW || !this.data.YWSJ) {
          this.$kwz.alert('学校或时间没填')
          return
        }
        this.disposeIdea.ORG_ID_TARGET = this.data.xxValue
        this.disposeIdeaBh = this.disposeIdea.BH
        this.disposeIdea.ZGXSMC = '整改通知'
        this.disposeIdea.ZGXSDM = '1'
        this.disposeIdea.STATUS = this.disposeIdeaValue[0]
        this.disposeIdea.STATUS_MC = val === 2 ? '一般问题--向学校发送整改建议' : '严重问题--向督导办上报整改建议'
        this.disposeIdea.IS_SB = val === 2 ? '0' : '1'
        this.deleteDisposeIdeaId('send') // 在删除id函数回调里执行发送
      } else {
        this.disposeIdea.XS_ORG_ID = this.ksValue[0]
        this.disposeIdea.ORG_MC = this.$refs.ksText.getNameValues()
        this.disposeIdea.DW = this.data.xxName
        this.disposeIdea.ORG_ID_TARGET = this.data.xxValue
        this.disposeIdea.ZGXSMC = '协商意见'
        this.disposeIdea.ZGXSDM = '2'
        this.disposeIdea.STATUS = '3'
        this.disposeIdea.STATUS_MC = '复杂问题--向科室发送协商意见'
        if (!this.disposeIdea.ORG_MC) {
          this.$kwz.alert('科室不能为空')
          return
        } else if (!this.disposeIdea.XSNR) {
          this.$kwz.alert('问题及意见不能为空')
          return
        } else if (!this.disposeIdea.DW || !this.data.YWSJ) {
          this.$kwz.alert('学校或时间没填')
          return
        }
        this.deleteDisposeIdeaId('send') // 在删除id函数回调里执行发送
      }
      this.deleteDisposeIdea()
    },
    // 后续理意见返回
    disposeIdeaBack () {
      let val = parseInt(this.disposeIdeaValue[0])
      this.disposeIdeasShow.bodyShow = false
      if (val === 4) {
        this.disposeIdeasShow.smallShow = false
        if (!this.disposeIdea.ZGJY) {
          this.disposeIdeaValue = ['1']
        }
      } else if (val === 2 || val === 5) {
        if ((!this.disposeIdea.CLQX && !this.disposeIdea.XSNR && val === 2)) {
          this.disposeIdeaValue = ['1']
        }
        this.disposeIdeasShow.midBigShow = false
      } else {
        if (!this.disposeIdea.XSNR) {
          this.disposeIdeaValue = ['1']
        }
        this.disposeIdeasShow.complexShow = false
      }
      this.deleteDisposeIdea()
    },
    // 删除后续处理意见变量值 根据当前后续处理意见选择情况
    deleteDisposeIdea () {
      let val = parseInt(this.disposeIdeaValue[0])
      this.disposeIdeasShow.bodyShow = false
      if (val === 1) {
        this.disposeIdeasShow.smallShow = false
        this.disposeIdea.BH = ''
        this.disposeIdea.DW = ''
        this.disposeIdea.ORG_ID_TARGET = ''
        this.disposeIdea.TIME = ''
        this.disposeIdea.XSNR = ''
        this.disposeIdea.CLQX = ''
        this.disposeIdea.IS_SB = '0'
        this.disposeIdea.XS_ORG_ID = ''
        this.disposeIdea.ORG_MC = ''
        this.disposeIdea.ZGXSDM = ''
        this.disposeIdea.ZGXSMC = ''
        this.disposeIdea.ZGJY = ''
      } else if (val === 4) {
        this.disposeIdeasShow.smallShow = false
        this.disposeIdea.BH = ''
        this.disposeIdea.TIME = ''
        this.disposeIdea.XSNR = ''
        this.disposeIdea.CLQX = ''
        this.disposeIdea.IS_SB = '0'
        this.disposeIdea.XS_ORG_ID = ''
        this.disposeIdea.ORG_MC = ''
        this.disposeIdea.ZGXSDM = ''
        this.disposeIdea.ZGXSMC = ''
      } else if (val === 2 || val === 5) {
        this.disposeIdeasShow.midBigShow = false
        this.disposeIdea.IS_SB = val === 2 ? '0' : '1'
        this.disposeIdea.XS_ORG_ID = ''
        this.disposeIdea.ZGJY = ''
        this.disposeIdea.ORG_MC = ''
      } else {
        this.disposeIdeasShow.complexShow = false
        this.disposeIdea.CLQX = ''
        this.disposeIdea.ZGJY = ''
        this.disposeIdea.IS_SB = '0'
      }
    },
    // 发送处理意见ajax 判断是协商还是整改
    saveDisposeIdea () {
      let contenId = this.contentId ? this.contentId : ''
      if (this.disposeIdeaValue[0] !== '3') {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doAdd',
          type: 'POST',
          vue: this,
          data: {
            ORG_ID_TARGET: this.disposeIdea.ORG_ID_TARGET,
            BH: this.disposeIdea.BH,
            ZGXSLYMC: '经常性督导整改',
            CLQX: this.disposeIdea.CLQX,
            ZGXSLY: '1',
            ZGXSDM: this.disposeIdea.ZGXSDM,
            XSNR: this.disposeIdea.XSNR,
            ZGXSMC: this.disposeIdea.ZGXSMC,
            YWSJ: this.data.YWSJ,
            YWID: contenId,
            IS_SB: this.disposeIdea.IS_SB // 是否上报
          },
          then (response) {
            this.disposeIdea.ZGXSID = response.data.datas.ZGXSID
            this.$kwz.alert('发送成功')
          }
        })
      } else {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doAdd',
          type: 'POST',
          vue: this,
          data: {
            ORG_ID_TARGET: this.disposeIdea.ORG_ID_TARGET,
            BH: this.disposeIdea.BH,
            ZGXSLYMC: '经常性督导整改',
            XS_ORG_ID: this.disposeIdea.XS_ORG_ID,
            ZGXSLY: '1',
            ZGXSDM: this.disposeIdea.ZGXSDM,
            ZGXSMC: this.disposeIdea.ZGXSMC,
            XSNR: this.disposeIdea.XSNR,
            YWSJ: this.data.YWSJ,
            YWID: contenId
          },
          then (response) {
            this.disposeIdea.ZGXSID = response.data.datas.ZGXSID
            this.$kwz.alert('发送成功')
          }
        })
      }
    },
    // 删除后续处理意见id
    deleteDisposeIdeaId (val) {
      if (this.disposeIdea.ZGXSID || val === 'send') {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doDelete',
          type: 'POST',
          vue: this,
          data: {
            ZGXSID: this.disposeIdea.ZGXSID
          },
          then (response) {
            if (response.data.statusCode === '200') {
              this.disposeIdea.ZGXSID = ''
              if (val === 'send') {
                this.saveDisposeIdea()
              }
            }
          }
        })
      }
    },
    // 图片
    showImg (index) {
      this.$refs.previewer.show(index)
      this.zgtzsShow = false
    },
    // 实时更新督导纪实处理结果内容
    updateDdjsData (val) {
      this.ddjsData = val
    }
  }
}
</script>

<style scoped>
  .c_ddjs_add {
    overflow: hidden !important;
  }

  .c_ddjs_add_xzbody_disposeIdeaTitle{
    font-size: 12px;
  }
  .c_ddjs_add_xzbody_disposeIdeaTitle p:first-child{
    font-size: 14px;
  }
  .c_ddjs_add_xzbody_disposeIdeaTitle_bh{
    color: #145ccd;
  }

  .c_ddjs_add_info {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(144, 144, 144, 0.62);
    height: 100vh;
    width: 100vw;
    z-index: 15;
  }
  .c_ddjs_add_info >>> .weui-cells .weui-cell .weui-cell__ft {
    padding-left: 10px;
  }
  .c_ddjs_add_info >>> .weui-cells {
    font-size: 15px;
  }
  .c_ddjs_add_infoBody {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 20;
    background: white;
  }
  .c_ddjs_add_info_wt {
    padding: 10px 15px;

  }
  .c_ddjs_add_infoBody_back button {
    margin: 5px;
  }

  .c_ddjs_add_saveBack button{
    margin: 5px 10px;
  }
</style>
