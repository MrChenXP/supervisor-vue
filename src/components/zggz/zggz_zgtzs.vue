<template>
  <div class="c_zggz_zgtzs c_ContentMain">
    <!--标题栏-->
    <x-header class="c_header" :left-options="{preventGoBack: true}" @on-click-back="$router.push({path: '/3758a16aa4e14b3d87bb1f9c7e2fc509'})">
      整改通知书
      <a slot="right" @click="fn_zggz_zgtzs_dispose" v-if="clickSHOw" v-show="getPermission('dd_zgxs/doUpdate/ZGTZ')">
        <span class="fa fa-save">&nbsp;处理</span>
      </a>
      <a slot="right" @click="changeStatue('6')" v-if="data.CLZTDM < '6'" v-show="this.SF === 'dx' && getPermission('dd_zgxs/doUpdate/ZGTZ')">
        <span class="fa fa-save">&nbsp;确认整改完成</span>
      </a>
    </x-header>

    <!--意见内容-->
    <group label-width="5em" class="c_FormAdd">
      <cell title="编号" :value="data.BH" value-align="left"></cell>
      <cell title="单位" :value="data.XXMC" value-align="left" ></cell>
      <div class="c_FormAdd_editor">
        <div class="c_FormAdd_editor_head">
          <p>经督导检查，你单位存在以下问题:</p>
        </div>
        <div class="c_FormAdd_editor_content">
          <p class="text-bold">{{data.XSNR}}</p>
        </div>
        <p>
          对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发
          <span class="text-bold">{{data.CLQX}}</span>
          日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。
        </p>
      </div>
      <cell title="日期:" :value="data.RQ" value-align="left" ></cell>
      <cell title="处理状态" :value="data.CLZTMC" value-align="left" ></cell>
      <div v-if="clickSHOw ">
        <x-button v-if="!resultShow" @click.native="resultShow=!resultShow" >
          点击进行处理
          <span class="fa fa-sort-down"></span>
        </x-button>
        <x-button v-if="resultShow" @click.native="resultShow=!resultShow" >
          点击收起
          <span class="fa fa-sort-up"></span>
        </x-button>
      </div>
    </group>

    <!--处理结果隐藏页-->
    <div class="c_upLoadEditor" v-if="resultShow" >
      <span>处理结果</span>
      <vue-html5-editor :content="disposeResultData" :height="200" @change="updateResultData"></vue-html5-editor>
    </div>

    <!--整改完成后 事先加载处理结果数据-->
    <div class="c_upLoadEditor" v-if="detailShow" >
      <span>处理结果</span>
      <div>
        <div v-html="data.CLBG"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {XHeader, Group, Cell, XButton, XTextarea, Previewer} from 'vux'
import {mapGetters} from 'vuex'
export default {
  name: 'c_zggz_zgtzs',
  data () {
    return {
      data: {
      },
      // 已处理的详情页显示隐藏
      detailShow: false,
      clickSHOw: false, // 处理结果按钮
      // 编辑页显示隐藏
      resultShow: false,
      // 上传处理结果内容
      disposeResultData: '',
      // 身份存储
      SF: ''
    }
  },
  computed: mapGetters({
    user: 'user'
  }),
  mounted () {
    this.initData()
  },
  methods: {
    // 判断整改通知书id 并预先加载数据
    initData () {
      if (this.$route.query && this.$route.query.id) {
        this.data.ZGXSID = this.$route.query.id
        this.SF = this.$route.query.SF
        this.loadData()
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
          if (datas && datas.ZGXSID) {
            this.data = datas
            if (datas.CLBG !== null) {
              this.disposeResultData = datas.CLBG
            }
            if (this.SF === 'xx' && datas.CLZTDM < '6') {
              this.clickSHOw = true
            }
            if (this.SF === 'dx' || datas.CLZTDM === '6') {
              this.detailShow = true
            }
          }
          if (this.SF) { // 如果是处理/验收进来的
            if (this.data.CLZTDM <= '3' && this.SF === 'xx') {
              this.changeStatue('3')
            } else if (this.data.CLZTDM === '4' && this.SF === 'dx') {
              this.changeStatue('5')
            }
          } else {
            this.detailShow = true
          }
        }
      })
    },
    // 改变处理状态
    changeStatue (status) {
      this.$kwz.ajax.ajaxUrl({
        url: 'dd_zgxs/doUpdate/ZGTZ',
        type: 'POST',
        data: {
          CMS_LMTYPE: '2',
          ZGXSID: this.data.ZGXSID,
          CLLX: status
        },
        vue: this,
        then (response) {
          if (status === '6') {
            this.$router.push({path: '/3758a16aa4e14b3d87bb1f9c7e2fc509'})
          }
        }
      })
    },
    // 点击处理事件
    fn_zggz_zgtzs_dispose () {
      if (!this.data.disposeResultData) {
        this.$kwz.alert('请填写处理结果')
        return
      }
      this.$kwz.ajax.ajaxUrl({
        url: 'dd_zgxs/doUpdate/ZGTZ',
        type: 'POST',
        data: {
          CLBG: this.data.disposeResultData,
          CMS_LMTYPE: '2',
          IS_PHONE: '2',     // 标记此内容是来自手机端
          ZGXSID: this.data.ZGXSID,
          CLLX: '4'
        },
        vue: this,
        then (response) {
          this.$kwz.alert('保存成功')
          this.$router.push({path: '/3758a16aa4e14b3d87bb1f9c7e2fc509'})
        }
      })
    },
    // 实时更新处理结果内容
    updateResultData (val) {
      this.data.disposeResultData = val
    }
  },
  components: {
    Group,
    XHeader,
    Cell,
    XButton,
    Previewer,
    XTextarea
  }
}
</script>
<style>


</style>
<style scoped>
  /*替代c_FormAdd*/
  /*.c_zggz_zgtzs_info   >>> .weui-cells .weui-cell .weui-cell__ft{*/
    /*padding-left: 10px;*/
  /*}*/
  /*.c_zggz_zgtzs_info >>> .weui-cells{*/
    /*font-size: 15px;*/
  /*}*/
  .c_zggz_zgtzs_info_wt{
    padding:10px 15px;
  }



</style>
