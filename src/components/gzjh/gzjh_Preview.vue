<template>
  <div class="c_gzjh_Preview c_ContentMain">
    <!--标题栏-->
<!--    <x-header class="c_header" :left-options="{preventGoBack: true}" title="详情"-->
<!--              @on-click-back="$router.push({path: '/b892eba5fae9493189ac81a510bbbd73'})">-->
<!--    </x-header>-->
    <!--标题栏-->
    <x-header class="c_header" :left-options="{preventGoBack: true}" title="详情"
              @on-click-back="$router.push({path: '/09afd6af90df4e988be93c42cd652cad'})">
    </x-header>
    <group class="c_gzjh_Preview_bodys">
      <cell title="学校" :value="data.ORG_ID_TARGET_MC"></cell>
      <cell title="督导时段" :value="data.YWSJ"></cell>
      <cell title="小组成员" :value="data.JGID_MC"></cell>
      <cell title="确认参加成员" :value="data.CJID_MC"></cell>
      <div class="c_gzjh_Preview_bodys_list">
        <span>督导事项</span>
        <div class="" v-html="data.TXT"></div>
      </div>
    </group>

  </div>
</template>

<script>
  import {XHeader, Group, Cell} from 'vux'

  export default {
    name: 'c_gzjh_Preview',
    data () {
      return {
        contentId: '',
        data: {}
      }
    },
    components: {XHeader, Group, Cell},
    created () {
      this.initPage()
    },
    methods: {
      initPage () {
        let query = this.$route.query
        if (query && query.contentId) {
          this.contentId = query.contentId
          this.$kwz.ajax.ajaxUrl({
            url: 'dd_gzap/doSelectByPrimary/DDGZAP',
            type: 'POST',
            data: {
              CONTENT_ID: this.contentId
            },
            vue: this,
            then (response) {
              this.data = response.data.datas.map
              let date = new Date(this.data.YWSJ.replace(/-/g, '/'))
              let sd = this.data.SD === '1' ? '上午' : '下午'
              this.data.YWSJ = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 ' + sd
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .c_gzjh_Preview_bodys >>> .weui-cells{
    margin-top: 0;
  }

  .c_gzjh_Preview_bodys_list{
    padding: 10px 15px;
    display: inline-block;
  }
  .c_gzjh_Preview_bodys_list div{
    padding: 0 10px;
  }
</style>
