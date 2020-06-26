<template>
  <div class="c_ddjs_zgtzs c_ContentMain">
    <!--标题栏-->
<!--    <x-header class="c_header" :left-options="{preventGoBack: true}" @on-click-back="$router.push({path: '/ebc60e699bc642a1871f1e017b979483'})">-->
    <x-header class="c_header" :left-options="{preventGoBack: true}" @on-click-back="$router.push({path: '/f53898d10997419ca2a8185dee802d1b'})">

    督导整改通知书
      <!--<a slot="right" @click="doAdd">-->
        <!--<span class="fa fa-save">&nbsp;保存</span>-->
      <!--</a>-->
    </x-header>

    <!--通知信息-->
    <group label-width="5em" title="通知信息" class="c_ddjs_zgtzs_info">
      <cell title="编号" :value="data.BH" value-align="left"></cell>
      <cell title="单位" :value="data.XXMC" value-align="left" ></cell>
      <div class="c_ddjs_zggz_info_wt">
        <p>经挂牌督导，你单位存在以下问题:</p>
        <p class="text-bold">{{data.XSNR}}</p>
        <p>
          对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发
          <span class="text-bold">{{data.CLQX}}</span>
          日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。
        </p>
      </div>
      <cell title="日期:" :value="data.RQ" value-align="left" ></cell>
      <cell title="状态:" :value="data.CLZTMC" value-align="left" ></cell>
      <div v-if="detailShow">
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

    <!--学校进行处理结果隐藏页-->
    <div  v-show="resultShow" class="c_ddjs_zgtzs_disposeResult c_full_parentImg">
      <span class="text-bold">处理结果</span>
      <div v-html="disposeResultData"></div>
    </div>


  </div>
</template>

<script>
import {XHeader, Group, Cell, XButton, XTextarea, Previewer} from 'vux'
export default {
  name: 'c_ddjs_zgtzs',
  data () {
    return {
      zgxsid: '',
      data: {},
      RESULT: '',
      resultShow: false,
      // 处理结果内容
      disposeResultData: '',
      detailShow: false
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    // 数据预先渲染
    initData () {
      let query = this.$route.query
      if (query && query.contentid) {
        this.zgxsid = query.contentid
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doSelectByPrimary',
          type: 'POST',
          data: {
            ZGXSID: this.zgxsid
          },
          vue: this,
          then (response) {
            let datas = response.data.datas
            if (datas && datas.ZGXSID) {
              this.data = datas
              if (datas.CLZTDM >= '4' && datas.CLZTDM !== '6') {
                this.detailShow = true
                this.resultShow = true
                this.disposeResultData = datas.CLBG
              } else if (datas.CLZTDM === '6') {
                this.detailShow = false
                this.resultShow = true
              }
            }
          }
        })
      }
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
  .c_ddjs_zgtzs_info >>> .weui-cells{
    font-size: 15px;
  }
  .c_ddjs_zggz_info_wt{
    padding:10px 15px;
  }
  .c_ddjs_zgtzs_disposeResult{
    padding:10px 15px;
  }
  .c_ddjs_zgtzs_disposeResult>span{
    font-size: 18px;
  }



</style>
