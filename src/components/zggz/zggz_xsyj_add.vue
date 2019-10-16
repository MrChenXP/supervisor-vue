<template>
  <div class="c_zggz_xsyj_add c_ContentMain">
    <!--标题栏-->
    <x-header class="c_header" :left-options="{preventGoBack: true}" @on-click-back="$router.push({path: '/zggz/xsyj'})">
      新增协商意见书
      <a slot="right" @click="fn_ddjs_send">
        <span v-if="!formData.ZGXSID" class="fa fa-send" v-show="getPermission('dd_zgxs/doAddtzyj')">&nbsp;发送</span>
        <span class="fa fa-send" v-else v-show="getPermission('dd_zgxs/xsyj_sh')">&nbsp;审核</span>
      </a>
    </x-header>

    <!--通知信息-->
    <group label-width="5em" class="c_FormAdd">
      <x-input v-if="!formData.ZGXSID" title="编号" v-model="formData.BH"></x-input>
      <cell v-else title="编号" :value="formData.BH"></cell>
      <popup-picker v-if="!formData.ZGXSID" confirm-text="确定" title="学校/单位" :show-name="true"
                    :data="xxList" v-model="formData.XXMC"></popup-picker>
      <cell v-else title="学校/单位" v-model="formData.XXMC[0]"></cell>
      <popup-picker v-if="!formData.ZGXSID" confirm-text="确定" title="科室/中心" :show-name="true"
                    :data="ksList" v-model="formData.XS_ORG"></popup-picker>
      <cell v-else title="科室/中心" v-model="formData.XS_ORG[0]"></cell>
      <datetime v-if="!formData.ZGXSID" :end-date="endDate" :start-date="startDate" v-model="formData.YWSJ" title="时间"></datetime>
      <cell v-else title="时间" v-model="formData.YWSJ"></cell>
      <div class="c_FormAdd_editor">
        <div class="c_FormAdd_editor_head">
          <span>我室
            责任督学 <span class="text_bolder">{{user.name}}</span> 于</span>
          <span class="text_bolder">{{YWSJDX}}</span>
          <span>对 该校(幼儿园)进行了教育督导，发现该学校(幼儿园)存在以下问题：</span>
        </div>
        <div class="c_FormAdd_editor_content">
          <x-textarea :max="4000" v-model="formData.XSNR" :rows="5" class="c_textarea_border"></x-textarea>
        </div>
        <p>请贵科室（中心）予以支持、配合、协调解决!</p>
      </div>
    </group>
  </div>
</template>

<script>
import {XHeader, Group, Cell, XButton, Search, XInput, Datetime, XTextarea, PopupPicker} from 'vux'
import {mapGetters} from 'vuex'
export default {
  name: 'c_zggz_xsyj_add',
  data () {
    return {
      formData: {
        BH: '',
        XXMC: [''],
        XS_ORG: [''],
        YWSJ: '',
        XSNR: '',
        ZGXSID: ''
      },
      startDate: '', // 可填写的最小时间,别放在date对象里,而且一定要事先创建好变量
      endDate: '', // 可填写的最大时间,别放在date对象里,而且一定要事先创建好变量
      ksList: [],
      xxList: []
    }
  },
  computed: {
    ...mapGetters({
      user: 'user'
    }),
    YWSJDX: {
      get () {
        if (this.formData.YWSJ) {
          let YWSJdx = this.formData.YWSJ.split('-')
          return `${YWSJdx[0]}年${YWSJdx[1]}月${YWSJdx[2]}日`
        }
        return ''
      }
    }
  },
  created () {
    this.initPage()
  },
  methods: {
    // 判断来源(是否是审核) 获取id并预先加载数据
    initPage () {
      if (this.$route.query && this.$route.query.id) {
        this.formData.ZGXSID = this.$route.query.id
        this.loadData()
      } else {
        this.loadBh()
        this.loadKsList()
        this.loadXxList()
        // 默认当前时间
        this.formData.YWSJ = !this.formData.YWSJ ? this.$kwz.formatDate() : this.formData.YWSJ
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
        this.formData.minDate = startEnd.minDate
        this.formData.maxDate = startEnd.maxDate
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
          ZGXSID: this.formData.ZGXSID
        },
        vue: this,
        then (response) {
          let datas = response.data.datas
          this.formData.BH = datas.BH
          this.formData.XXMC[0] = datas.XXMC
          this.formData.YWSJ = datas.YWSJ
          this.formData.XSNR = datas.XSNR
          this.formData.XS_ORG[0] = datas.XS_ORG
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
            this.formData.BH = datas.BH
          }
        }
      })
    },
    // 加载科室选择列表
    loadKsList () {
      this.$kwz.ajax.ajaxUrl({
        url: 'ddjl/getKsList',
        type: 'POST',
        vue: this,
        then (response) {
          let datas = response.data.datas
          let ksList = []
          if (datas && datas.KSLIST && datas.KSLIST.length > 0) {
            for (let i = 0; i < datas.KSLIST.length; i++) {
              ksList.push({
                value: datas.KSLIST[i].ORG_ID,
                name: datas.KSLIST[i].ORG_MC
              })
            }
          } else {
            ksList.push({
              name: '暂无数据',
              value: ''
            })
          }
          this.ksList.push(ksList)
        }
      })
    },
    // 加载学校选择列表
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
    // 点击处理事件
    fn_ddjs_send () {
      if (this.formData.XXMC.length < 1 || !this.formData.XXMC[0]) {
        this.$kwz.alert('请选择学校')
        return
      }
      if (this.formData.XS_ORG.length < 1 || !this.formData.XS_ORG[0]) {
        this.$kwz.alert('请选择科室')
        return
      }
      if (!this.formData.YWSJ) {
        this.$kwz.alert('请选择时间')
        return
      }
      if (!this.formData.XSNR) {
        this.$kwz.alert('请填写问题')
        return
      }
      this.saveZgtzs()
    },
    // 发送/审核 ajax 有整改id就是审核
    saveZgtzs () {
      if (this.formData.ZGXSID) {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doUpdate/XSYJ',
          type: 'POST',
          data: {
            CMS_LMTYPE: '1',
            ZGXSID: this.formData.ZGXSID,
            CLLX: '22',
            XSNR: this.formData.XSNR
          },
          vue: this,
          then (response) {
            this.$router.push({path: '/zggz/xsyj'})
            this.$kwz.alert('审核成功')
          }
        })
      } else {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doAddtzyj',
          type: 'POST',
          data: {
            BH: this.formData.BH,
            ZGXSDM: '2',
            ZGXSMC: '协商意见',
            ZGXSLY: '3',
            ZGXSLYMC: '其他整改',
            ORG_ID_TARGET: this.formData.XXMC[0],
            XS_ORG_ID: this.formData.XS_ORG[0],
            YWSJ: this.formData.YWSJ,
            XSNR: this.formData.XSNR,
            YWID: '',
            minDate: this.formData.minDate,
            maxDate: this.formData.maxDate
          },
          vue: this,
          then (response) {
            this.$kwz.alert('发送成功')
            this.$router.push({path: '/zggz/xsyj'})
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
    PopupPicker
  }
}
</script>
<style scoped>
  /*替代c_FormAdd*/
  /*.c_zggz_xsyj_add_info >>> .weui-cells .weui-cell .weui-cell__ft{*/
    /*padding-left: 10px;*/
  /*}*/
  /*.c_zggz_xsyj_add_info >>> .weui-cells{*/
    /*font-size: 15px;*/
  /*}*/
  .c_zggz_searchShow_xxmc >>> .weui-search-bar {
    padding: 1px 3px 1px 1px;
  }
  .c_zggz_searchShow_xxmc >>> .weui-cell__ft{
    width: 70%;
  }

</style>
