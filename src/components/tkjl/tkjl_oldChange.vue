<template>
  <div class="c_oldChange c_ContentMain">
    <!--标题栏-->
<!--    <x-header class="c_header" :left-options="{preventGoBack: true}" title="修改听课记录"-->
<!--              @on-click-back="$router.push({path: '/cd5235ad9e2d463a9af919de06dcfb06'})">-->
<!--      <a slot="right" @click="doSave">-->
<!--        <span class="fa fa-save">&nbsp;保存</span>-->
<!--      </a>-->
<!--    </x-header>-->
    <!--广西的-->
    <x-header class="c_header" :left-options="{preventGoBack: true}" title="修改听课记录"
              @on-click-back="$router.push({path: '/ce050b1fa4514189aa92852ae2e032de'})">
      <a slot="right" @click="doSave">
        <span class="fa fa-save">&nbsp;保存</span>
      </a>
    </x-header>
    <div v-html="tbmbglData.MBNR" class="c_tkjl_Preview_old"></div>
  </div>
</template>

<script>
  import {XHeader} from 'vux'

  export default {
    name: 'c_oldChange',
    components: {XHeader},
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
              this.formData.YWSJ = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
              this.getTemplate()
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
      },
      // 保存
      doSave () {
        let SJ = {}
        for (let val in this.formData.SJ) {
          try {
            let n = 'input[name *="' + val + '"],textarea[name *="' + val + '"]'
            let obj = document.querySelector(n)
            SJ[obj.name] = obj.value
          } catch (err) {
//            console.error(err)
          }
        }
        let oFz = document.getElementById('input_total')
        this.$kwz.ajax.ajaxUrl({
          url: 'jc_pgbzmx/doAddOrUpdate/TKJL',
          type: 'POST',
          data: {
            MXID: this.formData.MXID,
            SJ: JSON.stringify(SJ),
            FZ: oFz ? oFz.value : ''
          },
          vue: this,
          then (response) {
            this.$kwz.alert('保存成功')
            this.$router.push({path: '/cd5235ad9e2d463a9af919de06dcfb06'})
          }
        })
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
