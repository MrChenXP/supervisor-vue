<template>
  <div class="c_zggz_xsyjs c_ContentMain">
    <!--标题栏-->
    <x-header class="c_header" :left-options="{preventGoBack: true}" @on-click-back="$router.push({path: '/zggz/xsyj'})">
      协商意见书
      <a slot="right" @click="fn_zggz_xsyjs_dispose" v-if="!detailShow" v-show="getPermission('dd_zgxs/doUpdate/XSYJ')">
        <span class="fa fa-save">&nbsp;处理</span>
      </a>
      <a slot="right" @click="changeStatue('26')" v-if="data.CLZTDM < '26'" v-show="this.SF === 'dx' && getPermission('dd_zgxs/doUpdate/XSYJ')">
        <span class="fa fa-save">&nbsp;确认整改完成</span>
      </a>
    </x-header>

    <!--意见内容-->
    <group label-width="5em" class="c_FormAdd">
      <cell title="编号" :value="data.BH" value-align="left"></cell>
      <cell title="单位" :value="data.XXMC" value-align="left" ></cell>
      <div class="c_FormAdd_editor">
        <div>
          <p>
            我室
            <span class="text-bold">{{data.AUTHOR}}</span>
            责任督学于
            <span class="text-bold">{{data.RQ}}</span>
            对
            <span class="text-bold">{{data.XXMC}}</span>
            进行了教育督导，发现该学校(幼儿园)存在以下问题：
          </p>
        </div>
        <div class="c_FormAdd_editor_content">
          <p class="text-bold">{{data.XSNR}}</p>
        </div>
        <p>请贵科室（中心）予以支持、配合、协调解决!</p>
      </div>
      <cell title="日期:" :value="data.RQ" value-align="left" ></cell>
      <div v-if="clickSHOw">
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
    <div class="c_upLoadEditor" v-else-if="detailShow" >
      <span>处理结果</span>
      <div>
        <div v-html="data.CLBG"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {XHeader, Group, Cell, XButton, XTextarea, Previewer} from 'vux'
export default {
  name: 'c_zggz_xsyjs',
  data () {
    return {
      data: {
      },
      // 已处理的详情页显示隐藏
      detailShow: false,
      // 编辑页显示隐藏
      resultShow: false,
      clickSHOw: false, // 处理结果按钮
      resultText: '',
      // 上传处理结果内容
      disposeResultData: '',
      // 身份存储
      SF: ''
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    // 判断协商意见书id并预先加载数据
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
    // 事先加载数据
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
          datas.IS_PHONE = '2'
          if (datas && datas.ZGXSID) {
            this.data = datas
            if (datas.CLBG != null) {
              this.disposeResultData = datas.CLBG
            }
            if (this.SF === 'xx' && datas.CLZTDM < '26') {
              this.clickSHOw = true
            }
            if (this.SF === 'dx' || datas.CLZTDM === '26') {
              this.detailShow = true
            }
          }
          if (this.SF) { // 如果是处理/验收进来的
            if (this.data.CLZTDM <= '23' && this.SF === 'xx') {
              this.changeStatue('23')
            } else if (this.data.CLZTDM === '24' && this.SF === 'dx') {
              this.changeStatue('25')
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
        url: 'dd_zgxs/doUpdate/XSYJ',
        type: 'POST',
        data: {
          CMS_LMTYPE: '1',
          ZGXSID: this.data.ZGXSID,
          CLLX: status
        },
        vue: this,
        then (response) {
          if (status === '26') {
            this.$router.push({path: '/zggz/xsyj'})
          }
        }
      })
    },
    // 点击处理事件
    fn_zggz_xsyjs_dispose () {
      if (!this.disposeResultData) {
        this.$kwz.alert('请填写处理结果')
        return
      }
      this.$kwz.ajax.ajaxUrl({
        url: 'dd_zgxs/doUpdate/XSYJ',
        type: 'POST',
        data: {
          CLBG: this.disposeResultData,
          CMS_LMTYPE: '1',
          IS_PHONE: '2',     // 标记此内容是来自手机端
          ZGXSID: this.data.ZGXSID,
          CLLX: '24'
        },
        vue: this,
        then (response) {
          this.$kwz.alert('保存成功')
          this.$router.push({path: '/zggz/xsyj'})
        }
      })
    },
    // 实时更新处理结果内容
    updateResultData (val) {
      this.disposeResultData = val
    }
  },
  components: {
    Group,
    XHeader,
    Cell,
    XButton,
    XTextarea,
    Previewer
  }
}
</script>
<style>

</style>
<style scoped>
  .c_zggz_xsyjs_info >>> .weui-cells .weui-cell .weui-cell__ft{
    padding-left: 10px;
  }
  .c_zggz_xsyjs_info >>> .weui-cells{
    font-size: 15px;
  }
  .c_zggz_xsyjs_info_wt{
    padding:10px 15px;
  }
</style>
