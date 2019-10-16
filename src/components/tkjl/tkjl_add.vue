<template>
  <div class="c_tkjl_add c_ContentMain">
    <!--标题栏-->
    <x-header class="c_header" :left-options="{preventGoBack: true}"
              @on-click-back="$router.push({path: '/cd5235ad9e2d463a9af919de06dcfb06'})">
      {{title}}
      <a slot="right" @click="doSave" v-show="getPermission('jc_pgbzmx/doAddTkjl/TKJL')">
        <span class="fa fa-save">&nbsp;保存</span>
      </a>
    </x-header>

    <!--记录列表-->
    <group class="c_FormAdd">
      <cell title="学校" :value="formData.MB_ORG_MC" v-if="formData.MXID"></cell>
      <cell title="学校" :value="formData.MB_ORG_MC" v-else is-link  @click.native="toXx" ></cell>
      <cell title="听课日期" :value="formData.YWSJ" v-if="formData.MXID"></cell>
      <datetime title="听课日期" v-else :end-date="endDate" :start-date="startDate"  v-model="formData.YWSJ" ></datetime>
      <x-input title="听课班级" required v-model="formData.BJ"
               text-align="right" placeholder="请填写班级"></x-input>
      <x-input title="听课学科" required v-model="formData.XK"
               text-align="right" placeholder="请填写学科"></x-input>
      <x-input title="听课教师" required v-model="formData.JSMC"
               text-align="right" placeholder="请填写教师名称"></x-input>
      <div class="c_FormAdd_editor">
        <div class="c_FormAdd_editor_head clearfix" @click="gcjlShow = !gcjlShow">
          <p>
            过程记录
            <span class="fa fa-sort-desc fr" v-if="!gcjlShow"></span>
            <span class="fa fa-sort-asc fr" v-if="gcjlShow"></span></p>
        </div>
        <div>
          <vue-html5-editor  v-show="gcjlShow" :content="formData.GCJL"
                             :height="200" @change="updateDdjsData"></vue-html5-editor>
        </div>
      </div>
      <cell title="定性评价" :value="formData.FZ">
        <div slot="">
          <rater v-model="formData.FZ"></rater>
        </div>
      </cell>
      <div class="c_FormAdd_editor">
        <div  class="c_FormAdd_editor_head clearfix" @click="zhpjShow =!zhpjShow">
          综合评价
          <span class="fa fa-sort-desc fr" v-if="!zhpjShow"></span>
          <span class="fa fa-sort-asc fr" v-if="zhpjShow"></span>
        </div>
        <div v-show="zhpjShow">
          <x-textarea :max="4000" v-model="formData.ZHPJ" :rows="4" class="c_textarea_border"></x-textarea>
        </div>
      </div>
    </group>

    <!--学校选择隐藏页-->
    <div v-show="xx.show" class="c_pickBody">
      <div class="c_pickBody_head clearfix" >
        <x-button mini class="fl" type="primary" plain @click.native="xx.show = !xx.show" >
          <span class="fa fa-angle-left fa-1x"></span>
          <span class="text-bold">&nbsp;选择</span>
        </x-button>

        <span class="fr" @click.stop="xx.SearchShow = !xx.SearchShow">
          <span class="fa fa-search">&nbsp;搜索</span>
        </span>
      </div>

      <div class="" v-show="xx.SearchShow" >
        <group title="搜索条件" class="c_searchBody_content">
          <x-input title="学校名称" class="c_inputParent_borderB" v-model="xx.XXMC" placeholder="请输入学校名称"></x-input>
          <x-button  @click.native.stop="doXxSearch(false)">搜索</x-button>
        </group>
        <div class="c_searchBody_mask" @click.stop="xx.SearchShow = !xx.SearchShow"></div>
      </div>

      <div>
        <checklist :options="xx.xxList" :max="1" @on-change="xxSelect" ></checklist>
      </div>
    </div>
  </div>
</template>

<script>
  import {XHeader, Group, Cell, Datetime, XInput, XTextarea, Rater, Checklist, XButton} from 'vux'

  export default {
    name: 'c_tkjl_add',
    components: {XHeader, Group, Cell, Datetime, XInput, XTextarea, Rater, Checklist, XButton},
    data () {
      return {
        title: '新增听课记录', // 标题
        // 听课记录表单数据
        formData: {
          'MB_ORG_ID': '', // 学校id
          'YWSJ': '', // 业务时间
          'JSMC': '', // 教师名称
          'BJ': '', // 班级
          'XK': '', // 学科
          'GCJL': '', // 过程记录
          'FZ': 0, // 分值 定性评价
          'ZHPJ': '', // 综合评价
          'MB_ORG_MC': '', // 学校名称
          'MXID': '' // 此条记录的ID
        },
        startDate: '', // 可填写的最小时间,别放在date对象里,而且一定要事先创建好变量
        endDate: '', // 可填写的最大时间,别放在date对象里,而且一定要事先创建好变量
        gcjlShow: true, // 过程记录显示隐藏
        zhpjShow: true, // 综合评价显示隐藏
        // 选择学校页面数据
        xx: {
          show: false,
          page: '1',
          XXMC: '', // 学校名称
          SearchShow: false,
          xxList: [], // 供搜索使用的学校列表
          xxLsttS: [] // 给checklist用的学校列表
        }
      }
    },
    created () {
      this.initPage()
      window.scrollTo(0, 0)
    },
    methods: {
      // 初始化页面
      initPage () {
//        if (!this.formData.GCJL) {
//          this.formData.GCJL = '建议拍照上传记录表' // 上传的时候判断，并删掉这个
//        }
        let query = this.$route.query
        if (query && query.id) {
          this.title = '修改听课记录'
          this.formData.MXID = query.id
          this.$kwz.ajax.ajaxUrl({
            url: 'jc_pgbzmx/doSelectByPrimary/TKJL',
            type: 'POST',
            data: {
              MXID: this.formData.MXID
            },
            vue: this,
            then (response) {
              let datas = response.data.datas
              this.formData = datas
              this.formData.YWSJ = (datas.YWSJ.substr(0, 10))
            }
          })
        } else {
          this.formData.YWSJ = this.$kwz.formatDate()
        }
        this.getdateImpose()
      },
      // 获取日期限制
      getdateImpose () {
        let startEnd = this.$kwz.dateImpose('cd5235ad9e2d463a9af919de06dcfb06', this)
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
      },      // 实时更新 过程记录内容
      updateDdjsData (val) {
        this.formData.GCJL = val
      },
      // 打开学校页面
      toXx () {
        this.xx.show = !this.xx.xxShow
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_gzap/getSchool',
          type: 'POST',
          vue: this,
          data: {
            'DDJL': 'DDJL'
          },
          then (response) {
            let datas = response.data.datas.XXLIST
            if (datas && datas.length > 0) {
              let xxList = []
              for (let i = 0; i < datas.length; i++) {
                xxList.push({
                  value: datas[i].ORG_MC,
                  key: datas[i].ORG_ID
                })
              }
              this.xx.xxList = xxList
              this.xx.xxListS = xxList
            }
          }
        })
      },
      // 搜索学校
      doXxSearch () {
        let list = this.xx.xxListS.filter(function (val, index, arr) {
          return val.value.indexOf(this.xx.XXMC) > -1
        }, this)
        if (list) {
          this.xx.xxList = list
        }
      },
      // 选择学校
      xxSelect (value, label) {
        this.formData.MB_ORG_ID = value.join(',')
        this.formData.MB_ORG_MC = label.join(',')
      },
      // 点击保存按钮
      doSave () {
        if (!this.formData.MB_ORG_ID || !this.formData.YWSJ || !this.formData.BJ || !this.formData.XK || !this.formData.JSMC) {
          this.$kwz.alert('学校，听课日期，听课班级，听课学科，听课教师中不能有空')
          return false
        } else if (!this.formData.GCJL || this.formData.FZ < 1 || !this.formData.ZHPJ) {
          this.$kwz.alert('过程记录，定性评价，定性评价中不能有空')
          return false
        }
        if (this.formData.MXID) {
          this.doUpdate()
        } else {
          this.doAdd()
        }
      },
      // 保存
      doAdd () {
        this.$kwz.ajax.ajaxUrl({
          url: 'jc_pgbzmx/doAddTkjl/TKJL',
          type: 'POST',
          vue: this,
          data: {
            'XXMC': this.formData.MB_ORG_ID, // 字段名是学校名称 传的其实是学校id(后端取错
            'YWSJ': this.formData.YWSJ, // 业务时间
            'JSMC': this.formData.JSMC, // 教师名称
            'BJ': this.formData.BJ, // 班级
            'XK': this.formData.XK, // 学科
            'GCJL': this.formData.GCJL, // 过程记录
            'FZ': String(this.formData.FZ), // 分值 定性评价 12345字符串数值 0就是没填，不能提交
            'ZHPJ': this.formData.ZHPJ, // 综合评价
            minDate: this.formData.minDate,
            maxDate: this.formData.maxDate
          },
          then (response) {
            this.$kwz.alert('保存成功')
            this.$router.push({path: '/cd5235ad9e2d463a9af919de06dcfb06'})
          }
        })
      },
      // 修改
      doUpdate () {
        this.$kwz.ajax.ajaxUrl({
          url: 'jc_pgbzmx/doUpdateTkjl/TKJL',
          type: 'POST',
          vue: this,
          data: {
            'XXMC': this.formData.MB_ORG_ID, // 字段名是学校名称 传的其实是学校id(后端取错名
            'YWSJ': this.formData.YWSJ, // 业务时间
            'JSMC': this.formData.JSMC, // 教师名称
            'BJ': this.formData.BJ, // 班级
            'XK': this.formData.XK, // 学科
            'GCJL': this.formData.GCJL, // 过程记录
            'FZ': String(this.formData.FZ), // 分值 定性评价 12345字符串数值 0就是没填，不能提交
            'ZHPJ': this.formData.ZHPJ, // 综合评价
            'MXID': this.formData.MXID,
            minDate: this.formData.minDate,
            maxDate: this.formData.maxDate
          },
          then (response) {
            this.$kwz.alert('保存成功')
            this.$router.push({path: '/cd5235ad9e2d463a9af919de06dcfb06'})
          }
        })
      }

    }
  }
</script>

<style scoped>
  .c_ddjs_add {
    overflow: hidden !important;
  }
</style>
