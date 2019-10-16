<template>
  <div class="index c_IndexMain" >

    <!--标题栏-->
    <x-header class="c_header" :left-options="{showBack: !!backId,preventGoBack: true}" @on-click-back="toBack">
      挂牌督导
    </x-header>

    <group>
      <cell value-align="left">
        &nbsp;&nbsp;&nbsp;&nbsp;欢迎使用“全国中小学校责任督学挂牌督导创新县（市、区）工作平台”手机客户端。<br>
        &nbsp;&nbsp;&nbsp;&nbsp;请从列表中，选择访问的区县名称，访问指定的区县工作平台。<br>
      </cell>
    </group>
    <group>
      <cell :is-link="!!i.children" v-for="(i, j) in ssxList" :title="i.SSXMC" :key="j" value="" @click.native="toList(i.ID,i.visit)"></cell>
    </group>
  </div>

</template>

<script>
import { XHeader, Group, Cell, CellBox } from 'vux'
import { mapGetters } from 'vuex'

export default {
  name: 'index',
  data () {
    return {
      _ssxData: {},
      ssxList: [],
      backId: '',
      openid: ''
    }
  },
  computed: mapGetters({
    wxgzh: 'wxgzh'
  }),
  created () {
    this.initOpenid()
  },
  mounted () {
    this.initSsxData()
  },
  methods: {
    initOpenid () {
      let params = this.$route.params
      if (params && params.openid) {
        this.openid = params.openid
      }
    },
    initSsxData () {
      this.$kwz.ajax.ajaxUrl({
        url: 'open/loadSsxAddr',
        type: 'POST',
        vue: this,
        then (response) {
          let datas = response.data.datas
          let treeData = {}
          if (datas && datas.length > 0) {
            for (let i = 0; i < datas.length; i++) {
              datas[i].children = []
              let copy = JSON.parse(JSON.stringify(datas[i]))
              copy.SSXMC += '  (点击访问)'
              copy.children = false
              datas[i].children.push(copy)
              copy.visit = copy.ADDR

              let children = this.treeData(datas, datas[i].ID)
              if (children) {
                datas[i].children = datas[i].children.concat(children)
              }
              treeData[datas[i].ID] = datas[i]
            }
          }
          this._ssxData = treeData
          this.toList()
        }
      })
    },
    treeData (list, pid) {
      if (list && list.length > 0) {
        let children = []
        for (let i = 0; i < list.length; i++) {
          if (list[i].PID === pid) {
            children.push(list[i])
          }
        }
        return children.length < 1 ? false : children
      }
    },
    toList (id, url) {
      if (url) {
        // 如果是微信就绑定微信用户的区县地址
        if (this.$kwz.isWx() && this.openid) {
          this.$kwz.ajax.ajaxUrl({
            url: 'open/bindSsxAddr',
            type: 'POST',
            data: {
              ADDRID: id,
              OPENID: this.openid
            },
            vue: this,
            then (response) {
              url += url.indexOf('?') > 0 ? '&' : '?'
              url += 'OPENID=' + this.openid
              url += '&state=wxgzh_'
              window.location.href = url
            }
          })
        } else {
          window.location.href = url
        }
      } else {
        if (this.$kwz.jsonIsEmpty(this._ssxData)) {
          let ssxList = []
          if (id) {
            ssxList = this._ssxData[id].children
          } else {
            for (let i in this._ssxData) {
              if (!this._ssxData[i].PID) {
                ssxList.push(this._ssxData[i])
              }
            }
          }
          if (ssxList.length > 0) {
            this.backId = id
            this.ssxList = ssxList
          }
        }
      }
    },
    toBack () {
      if (this.backId) {
        let pid = this._ssxData[this.backId].PID
        this.toList(pid)
      } else {
        this.toList()
      }
    }
  },
  components: {
    XHeader,
    Group,
    Cell,
    CellBox
  }
}
</script>
<style>
  .c_index_bottom_tabs{
    position: fixed !important;
    bottom: 0;
    width: 100%;
    z-index: 10;
  }
  .c_index_bottom_tabs .vux-tab-item{
    display: flex !important;
    flex-direction:column;
    justify-content: center;
    align-items: center;
  }
  .c_index_bottom_tabs .vux-tab-item span{
    line-height: 16px;
    display: inline-block;
  }

  .c_index_tab_selected{
    color: #04BE02 !important;
    border-bottom: 3px solid #04BE02 !important;
  }

  .index .c_index_lbBody .weui-cells{
    margin-top: 0;
  }
  .c_index_lbBody_nr{
    display: flex;
    flex-direction: column;
  }
  .c_index_lbBody_nr_tv{
    width: 100%;
  }
  .c_index_lbBody_nr_tv p:first-child{
    width: 80%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .c_index_lbBody_nr_tv p:last-child{
    width: 20%;
  }
  .c_index_lbBody_nr_label p{
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 14px;
    color: gray;
  }

  .c_index_lbz_last{
    width: 100%;
    text-align: center;
  }

</style>
