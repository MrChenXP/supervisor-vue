<template>
  <div class="c_zgtz_add c_ContentMain">
    <!--标题栏-->
<!--    <x-header class="c_header" :left-options="{preventGoBack: true}" @on-click-back="$router.push({path: '/3758a16aa4e14b3d87bb1f9c7e2fc509'})">-->
<!--      新增整改通知书-->
<!--      <a slot="right" @click="fn_ddjs_send">-->
<!--        <span v-if="!data.ZGXSID" class="fa fa-send" -->
<!--          v-show="getPermission('dd_zgxs/doAddtzyj')">&nbsp;发送</span>-->
<!--        <span class="fa fa-send" v-else -->
<!--          v-show="getPermission('dd_zgxs/zgtz_sh')">&nbsp;审核</span>-->
<!--      </a>-->
<!--    </x-header>-->

    <!--广西的-->
    <x-header class="c_header" :left-options="{preventGoBack: true}" @on-click-back="$router.push({path: '/22f9ea002d1841459915b57d043891a3'})">
      新增整改通知书
      <a slot="right" @click="fn_ddjs_send">
        <span v-if="!data.ZGXSID" class="fa fa-send"
              v-show="getPermission('dd_zgxs/doAddtzyj')">&nbsp;发送</span>
        <span class="fa fa-send" v-else
              v-show="getPermission('dd_zgxs/zgtz_sh')">&nbsp;审核</span>
      </a>
    </x-header>

    <!--通知信息-->
    <group label-width="5em" class="c_FormAdd">
      <cell title="编号" :value="data.BH"></cell>
      <cell v-if="!data.ZGXSID" title="学校" is-link  @click.native="toXx" v-model="data.XXMC"></cell>
      <cell v-else title="学校" v-model="data.XXMC"></cell>
      <datetime v-if="!data.ZGXSID" title="时间" :end-date="endDate" :start-date="startDate" v-model="data.YWSJ"></datetime>
      <cell v-else title="时间" v-model="data.YWSJ"></cell>
      <cell title="督学" :value="user.name"></cell>
      <!--<popup-picker confirm-text="确定" title="来源渠道" :data="zgList" :show-name="true" v-model="data.zgValue"></popup-picker>-->
      <div class="c_FormAdd_editor">
        <div class="c_FormAdd_editor_head"><span>经督导检查，你单位存在以下问题:</span></div>
        <div class="c_FormAdd_editor_content">
          <x-textarea :max="4000" v-model="data.XSNR" :rows="5" class="c_textarea_border"></x-textarea>
        </div>
        <p>
          <span>对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发</span>
          <inline-x-number button-style="round" v-model="data.CLQX" :min="1"  width="30px" ></inline-x-number>
          <!-- <input type="text" size="4" :value="data.CLQX" required> -->
          <span>日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。</span>
        </p>
      </div>
    </group>

    <!--学校选择隐藏页-->
    <div v-show="xx.xxShow" class="c_pickBody">
      <div class="c_pickBody_head clearfix" >
        <x-button mini class="fl" type="primary" plain @click.native="xx.xxShow = !xx.xxShow">
          <span class="fa fa-angle-left fa-1x"></span>
          <span class="text-bold" >&nbsp;选择</span>
        </x-button>
        <span class="fr" @click.stop="xx.xxSearchShow = !xx.xxSearchShow">
          <span class="fa fa-search">&nbsp;搜索</span>
        </span>
      </div>

      <div class="" v-show="xx.xxSearchShow">
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
import {XHeader, Group, Cell, XButton, Search, XInput, Datetime, XTextarea, PopupPicker, Checklist, InlineXNumber} from 'vux'
import {mapGetters} from 'vuex'
export default {
  name: 'c_zgtz_add',
  data () {
    return {
      // 表单数据
      data: {
        BH: '',
        ORG_ID_TARGET: '',  // 学校id
        XXMC: '', // 学校名称
        YWSJ: '', // 业务时间
        XSNR: '', // 协商内容
        CLQX: 3, // 处理期限
        zgValue: [],
        ZGXSID: ''
      },
      startDate: '', // 可填写的最小时间,别放在date对象里,而且一定要事先创建好变量
      endDate: '', // 可填写的最大时间,别放在date对象里,而且一定要事先创建好变量
      xxList: [],
      zgList: [],
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
      }
    }
  },
  computed: mapGetters({
    user: 'user'
  }),
  created () {
    this.initPage()
  },
  methods: {
    // 判断来源(是否是审核) 获取id并预先加载数据
    initPage () {
      if (this.$route.query && this.$route.query.id) {
        this.data.ZGXSID = this.$route.query.id
        this.loadData()
      } else {
        this.loadBh()
        // 默认当前时间
        this.data.YWSJ = !this.data.YWSJ ? this.$kwz.formatDate() : this.data.YWSJ
        // 加载整改类型代码
        this.$kwz.loadVueDms('DM_DD_ZGXSLY', dms => {
          this.zgList = dms.DM_DD_ZGXSLY
        }, this)
      }
      this.getdateImpose()
    },
    // 获取日期限制
    getdateImpose () {
      let startEnd = this.$kwz.dateImpose('3758a16aa4e14b3d87bb1f9c7e2fc509', this)
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
    // 预先加载数据
    loadData () {
      this.$kwz.ajax.ajaxUrl({
        url: 'dd_zgxs/doSelectByPrimary',
        type: 'POST',
        data: {
          ZGXSID: this.data.ZGXSID
        },
        vue: this,
        then (response) {
          let datas = response.data.datas
          this.data.BH = datas.BH
          this.data.XXMC = datas.XXMC
          this.data.YWSJ = datas.YWSJ
          this.data.XSNR = datas.XSNR
          this.data.CLQX = datas.CLQX
        }
      })
    },
    // 加载编号
    loadBh () {
      this.$kwz.ajax.ajaxUrl({
        url: 'dd_zgxs/getNowTimeString',
        type: 'POST',
        vue: this,
        then (response) {
          let datas = response.data.datas
          if (datas && datas.BH) {
            this.data.BH = datas.BH
          }
        }
      })
    },
    // 加载学校
    loadXxList () {
      this.$kwz.ajax.ajaxUrl({
        url: 'jc_org/open/doOrgList',
        type: 'POST',
        data: {
          ORG_DJ: '80',
          EXCEPT: '10',
          CONDITION: ''
        },
        vue: this,
        then (response) {
          let datas = response.data.datas
          let xxList = []
          if (datas && datas.length > 0) {
            for (let i = 0; i < datas.length; i++) {
              xxList.push({
                value: datas[i].ORG_ID,
                name: datas[i].ORG_MC
              })
            }
          } else {
            xxList.push({
              name: '暂无数据',
              value: ''
            })
          }
          this.xxList.push(xxList)
        }
      })
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
      this.data.ORG_ID_TARGET = value.join(',')
      this.data.XXMC = label.join(',')
    },
    // 随行督学加载更多
    doXxLoadMore () {
      this.doXxSearch(true)
    },
    // 点击发送事件
    fn_ddjs_send () {
      if (!this.data.XXMC) {
        this.$kwz.alert('请选择学校')
        return
      }
      if (!this.data.YWSJ) {
        this.$kwz.alert('请选择时间')
        return
      }
      if (!this.data.XSNR) {
        this.$kwz.alert('请填写问题')
        return
      }
      if (!this.data.CLQX) {
        this.$kwz.alert('请填写整改期限')
        return
      } else if (isNaN(this.data.CLQX)) {
        this.$kwz.alert('整改期限必须为数字')
        return
      }
      this.saveZgtzs()
    },
    // 发送/审核ajax 有整改id就是审核
    saveZgtzs () {
      if (this.data.ZGXSID) {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doUpdate/ZGTZ',
          type: 'POST',
          data: {
            CMS_LMTYPE: '2',
            ZGXSID: this.data.ZGXSID,
            CLLX: '2',
            XSNR: this.data.XSNR,
            CLQX: this.data.CLQX
          },
          vue: this,
          then (response) {
            this.$router.push({path: '/3758a16aa4e14b3d87bb1f9c7e2fc509'})
            this.$kwz.alert('审核成功')
          }
        })
      } else {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doAddtzyj',
          type: 'POST',
          data: {
            BH: this.data.BH,
            YWID: '',
            ZGXSDM: '1',
            ZGXSMC: '整改通知',
            ZGXSLY: 3, // 先写死整改来源
//          ZGXSLYMC: this.$kwz.getPopupName(this.zgList, this.data.zgValue[0], 'value', 'name'), //如果不是写死在注释回来
            ZGXSLYMC: '其他整改',
            ORG_ID_TARGET: this.data.ORG_ID_TARGET,
            CLQX: this.data.CLQX,
            YWSJ: this.data.YWSJ,
            XSNR: this.data.XSNR,
            minDate: this.data.minDate,
            maxDate: this.data.maxDate
          },
          vue: this,
          then (response) {
            this.$router.push({path: '/3758a16aa4e14b3d87bb1f9c7e2fc509'})
            this.$kwz.alert('发送成功')
          }
        })
      }
    }
  },
  components: {
    XHeader,
    Group,
    Cell,
    XButton,
    Search,
    XInput,
    Datetime,
    XTextarea,
    PopupPicker,
    Checklist,
    InlineXNumber
  }
}
</script>
<style>

</style>
<style scoped>
  /*替代c_FormAdd*/
  /*.c_zgtz_add_info >>> .weui-cells .weui-cell .weui-cell__ft{*/
    /*padding-left: 10px;*/
  /*}*/
  /*.c_zgtz_add_info >>> .weui-cells{*/
    /*font-size: 15px;*/
  /*}*/
  .c_zggz_searchShow_xxmc >>> .weui-search-bar {
    padding: 1px 3px 1px 1px;
  }
  .c_zggz_searchShow_xxmc >>> .weui-cell__ft{
    width: 70%;
  }


</style>
