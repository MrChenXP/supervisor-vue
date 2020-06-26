<template>
  <div class="c_tkjl_Preview c_ContentMain">
    <!--标题栏-->
<!--    <x-header class="c_header" :left-options="{preventGoBack: true}" title="详情"-->
<!--              @on-click-back="$router.push({path: '/cd5235ad9e2d463a9af919de06dcfb06'})">-->
<!--    </x-header>-->
    <!--广西的-->
    <x-header class="c_header" :left-options="{preventGoBack: true}" title="详情"
              @on-click-back="$router.push({path: '/ce050b1fa4514189aa92852ae2e032de'})">
    </x-header>
    <group v-if="query.isNew === 1" class="c_FormAdd">
      <cell title="学校" :value="formData.MB_ORG_MC"></cell>
      <cell title="听课日期" :value="formData.YWSJ"></cell>
      <cell title="授课教师" :value="formData.JSMC"></cell>
      <cell title="听课班级" :value="formData.BJ"></cell>
      <cell title="听课学科" :value="formData.XK"></cell>
      <div class="c_FormAdd_editor">
        <div class="c_FormAdd_editor_head">
          <span>过程记录</span>
        </div>
        <div class="c_FormAdd_editor_content" v-html="formData.GCJL"></div>
      </div>
      <cell title="定性评价" :value="formData.FZ">
        <div>
          <rater v-model="formData.FZ" disabled></rater>
        </div>
      </cell>
      <div class="c_FormAdd_editor">
        <div class="c_FormAdd_editor_head">
          <span>综合评价</span>
        </div>
        <div class="c_FormAdd_editor_content">{{formData.ZHPJ}}</div>
      </div>
    </group>
    <div v-else v-html="tbmbglData.MBNR" class="c_tkjl_Preview_old"></div>
  </div>
</template>

<script>
  import {XHeader, Group, Cell, Rater} from 'vux'

  export default {
    name: 'c_tkjl_Preview',
    components: {XHeader, Group, Cell, Rater},
    data () {
      return {
        // 数据
        formData: {
          MXID: ''
        },
        tbmbglData: {}, // 老记录模板数据
        query: ''
      }
    },
    created () {
      this.initPage()
    },
    methods: {
      // 初始化页面
      initPage () {
        this.query = this.$route.query
        if (this.query && this.query.id) {
          this.formData.MXID = this.query.id
          this.$kwz.ajax.ajaxUrl({
            url: 'jc_pgbzmx/doSelectByPrimary/TKJL',
            type: 'POST',
            data: {
              MXID: this.formData.MXID
            },
            vue: this,
            then (response) {
              this.formData = response.data.datas
              let date = new Date(this.formData.YWSJ.replace(/-/g, '/'))
              this.formData.YWSJ = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 '
              if (this.query.isNew !== 1) {
                this.getTemplate()
              }
              this.formData.SJ = JSON.parse(this.formData.SJ)
            }
          })
        }
      },
      // 获取老记录模板
      getTemplate () {
        this.$kwz.ajax.ajaxUrl({
          url: 'jc_pgbz/selectTbmbglByKey',
          type: 'POST',
          data: {
            BZID: this.formData.BZID
          },
          vue: this,
          then (response) {
            this.tbmbglData = response.data.datas.tbmbglData
          }
        })
      },
      // 将SJ值放进input框里
      setInput () {
        for (let val in this.formData.SJ) {
          try {
            let n = 'input[name *="' + val + '"],textarea[name *="' + val + '"]'
            let obj = document.querySelector(n)
            if (obj.tagName === 'INPUT') {
              obj.value = this.formData.SJ[val]
            } else if (obj.tagName === 'TEXTAREA') {
              obj.innerHTML = this.formData.SJ[val]
            }
          } catch (err) {
//            console.error(err)
          }
        }
      }
    },
    updated () {
      this.setInput()
    }
  }
</script>

<style scoped>
.c_tkjl_Preview_old >>> td{
  border: solid 1px black !important;
}
.c_tkjl_Preview_old >>> table{
  border-collapse: collapse;
}
</style>
