<template>
  <div class="c_ddjs_xsyj c_ContentMain">
    <!--标题栏-->
    <x-header class="c_header" :left-options="{preventGoBack: true}" @on-click-back="$router.push({path: '/ebc60e699bc642a1871f1e017b979483'})">
      督导协商意见书
    </x-header>

    <!--意见内容-->
    <group label-width="5em" title="意见内容" class="c_ddjs_xsyj_info">
      <cell title="编号" :value="data.BH" value-align="left"></cell>
      <cell title="科室 /中心" :value="data.XS_ORG" value-align="left" ></cell>
      <div class="c_ddjs_xsyj_info_wt">
        <p>
          我室
          <span class="text-bold">{{data.AUTHOR}}</span>
          责任督学 于
          <span class="text-bold">{{data.RQ}}</span>
          对
          <span class="text-bold">{{data.XXMC}}</span>
          进行了教育督导，发现该学校(幼儿园)存在以下问题:
        </p>
        <p class="text-bold">{{data.XSNR}}</p>
        <p>
          请贵科室（中心）予以支持、配合、协调解决!
        </p>
      </div>
      <cell title="日期:" :value="data.RQ" value-align="left" ></cell>
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

    <!--处理结果隐藏页-->
    <div class="c_ddjs_zgtzs_disposeResult c_full_parentImg" v-if="resultShow" >
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
  name: 'c_ddjs_xsyj',
  data () {
    return {
      ZGXSID: '',
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
    initData () {
      let query = this.$route.query
      if (query && query.contentid) {
        this.ZGXSID = query.contentid
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doSelectByPrimary',
          type: 'POST',
          data: {
            ZGXSID: this.ZGXSID
          },
          vue: this,
          then (response) {
            let datas = response.data.datas
            if (datas && datas.ZGXSID) {
              this.data = datas
              if (datas.CLZTDM >= '24' && datas.CLZTDM !== '26') {
                this.detailShow = true
                this.resultShow = true
              } else if (datas.CLZTDM === '26') {
                // 如果已经整改完成
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
<style scoped>
  .c_ddjs_xsyj_info >>> .weui-cells{
    font-size: 15px;
  }
  .c_ddjs_xsyj_info_wt{
    padding:10px 15px;
  }
  .c_ddjs_zgtzs_disposeResult{
    padding:10px 15px;
  }
  .c_ddjs_zgtzs_disposeResult>span{
    font-size: 18px;
  }

</style>
