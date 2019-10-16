<template>
  <div class="c_userData c_ContentMain">

    <!--标题栏-->
    <x-header class="c_header"
              :left-options="{preventGoBack: true}"
              @on-click-back="$router.push({path: '/my'})">
      个人设置
      <a @click="fn_userSet_save" slot="right">保存</a>
    </x-header>

    <!--基本信息-->
    <group title="基本信息" class="c_userData_gnBody">
      <x-input title="头像" required >
        <div slot="right" class="c_userData_txsc">
          <input type="file" class="c_userData_txsc_file" accept = 'image/*'>
          <span class="tip">点击修改头像</span>
        </div>
      </x-input>
      <x-input title="姓名" required v-model="data.XM"></x-input>
      <x-input title="年龄" placeholder-align="right" required v-model="data.AGE"></x-input>
      <popup-picker confirm-text="确定" title="性别" required :show-name="true" :data="dm.DM_XB" v-model="data.XBM" ></popup-picker>
      <popup-picker confirm-text="确定" title="督学类型" required :show-name="true" :data="dm.DM_DD_DXLX" v-model="data.DXLXM" ></popup-picker>
      <x-input type="number" required title="联系电话" v-model="data.DH"></x-input>
      <x-input type="email" title="电子邮件" v-model="data.EMAIL"></x-input>
      <popup-picker confirm-text="确定" title="身份证件类型" :show-name="true" :data="dm.DM_SFZJLX" v-model="data.SFZJLXM" ></popup-picker>
      <x-input type="number" placeholder-align="right" title="身份证件号" v-model="data.SFZJH"></x-input>
      <popup-picker confirm-text="确定" title="民族" :show-name="true" :data="dm.DM_MZ" v-model="data.MZM" ></popup-picker>
      <datetime :min-year = "1900" :max-year = "2020" v-model="data.BIRTH" title="出生年月" ></datetime>
    </group>

    <!--学历信息-->
    <group title="学历信息" class="c_userData_gnBody">
      <popup-picker confirm-text="确定" title="学历" :show-name="true" :data="dm.DM_XLCC" v-model="data.XL" ></popup-picker>
      <popup-picker confirm-text="确定" title="学段" :show-name="true" :data="dm.DM_XD" v-model="data.XD" ></popup-picker>
      <popup-picker confirm-text="确定" title="学位" :show-name="true" :data="dm.DM_XW" v-model="data.XW" ></popup-picker>
      <popup-picker confirm-text="确定" title="专业" :show-name="true" :data="dm.DM_XW" v-model="data.ZY" ></popup-picker>
      <popup-picker confirm-text="确定" :show-name="true" title="专业技术职称" :data="dm.DM_ZYJSDJ " v-model="data.ZYJSZC" ></popup-picker>
    </group>

    <!--工作信息-->
    <group title="工作信息" class="c_userData_gnBody">
      <datetime :min-year = "1900" :max-year = "2020" v-model="data.WORKTIME" title="参加工作年限" ></datetime>
      <popup-picker confirm-text="确定" title="任教学科" :show-name="true" :data="dm.DM_XK" v-model="data.XK" ></popup-picker>
      <popup-picker confirm-text="确定" title="职务" :show-name="true" :data="dm.DM_ZW" v-model="data.ZW" ></popup-picker>
      <x-input type="text" title="工作单位" v-model="data.WORKUNIT"></x-input>
      <x-input type="number" title="在岗年限" v-model="data.CJNX"></x-input>
    </group>

    <group title="个人简介(1000字以内)" class="c_userData_gnBody">
      <x-textarea  :show-counter="true" v-model="data.JL" class="c_textarea_border"></x-textarea>
    </group>
  </div>
</template>

<script>
import { XHeader, Tab, TabItem, Cell, CellBox, Group, PopupPicker, XInput, Datetime, XTextarea, XButton } from 'vux'
export default {
  name: 'userData',
  data () {
    return {
      data: {
      },
      dm: {
      }
    }
  },
  mounted () {
    this.loadData()
  },
  created () {
    this.loadDms()
  },
  components: {
    Cell,
    CellBox,
    Group,
    PopupPicker,
    XInput,
    Datetime,
    XTextarea,
    XButton,
    XHeader,
    Tab,
    TabItem
  },
  methods: {
    loadLoginUser () {

    },
    // 保存数据
    fn_userSet_save () {
      if (!this.data.XM) {
        this.$kwz.alert('姓名不能为空')
        return
      }
      if (!this.data.XBM) {
        this.$kwz.alert('性别不能为空')
        return
      }
      if (!this.data.AGE) {
        this.$kwz.alert('年龄不能为空')
        return
      }
      if (!this.data.DXLXM) {
        this.$kwz.alert('责任督学不能为空')
        return
      }
      if (!this.data.DH) {
        this.$kwz.alert('联系电话不能为空')
        return
      }
      let param = {}
      for (let i in this.data) {
        if (this.data[i] instanceof Array) {
          param[i] = this.data[i][0]
        } else {
          param[i] = this.data[i]
        }
      }
      this.$kwz.ajax.ajaxUrl({
        url: 'dd_dxgl/doUpdateGrzl',
        type: 'POST',
        data: param,
        vue: this,
        then (response) {
          this.$kwz.alert('保存成功', undefined, () => {
            this.loadData()
            this.loadLoginUser()
          })
        }
      })
    },
    // 加载代码
    loadDms () {
      this.$kwz.loadVueDms('DM_XD,DM_MZ,DM_XB,DM_XK,DM_ZW,DM_XLCC,DM_SFZJLX,DM_ZYJSDJ,DM_DD_DXLX,DM_XWCC', dms => {
        this.dm = dms
      }, this)
    },
    // 加载数据
    loadData () {
      this.$kwz.ajax.ajaxUrl({
        url: 'dd_dxgl/selectByPrimaryKeyGrzl',
        type: 'POST',
        then (response) {
          let datas = response.data.datas
          if (datas) {
            datas.XBM = [datas.XBM]
            datas.DXLXM = [datas.DXLXM]
            datas.SFZJLXM = [datas.SFZJLXM]
            datas.MZM = [datas.MZM]
            datas.XL = [datas.XL]
            datas.XD = [datas.XD]
            datas.XW = [datas.XW]
            datas.ZYJSZC = [datas.ZYJSZC]
            datas.XK = [datas.XK]
            datas.ZW = [datas.ZW]

            this.data = datas
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .c_userData{
    overflow: hidden !important;
  }

  .c_userData_gnBody {
    background: white;
    border-bottom: 2px solid #d0d0d0;
  }
  .c_userData_gnBody >>> .weui-cells__title {
    margin-top: 0;
  }

  .c_userData_txsc{
    position: relative;
    width: 100px;
    padding: 2px ;
    border: 1px solid black;
    border-radius: 5px;
    color: #000000;
    font-size: 14px;
    text-align: center;
    overflow: hidden;
    box-sizing: border-box;
  }
  .c_userData_txsc span{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .c_userData_txsc_file{
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer;
  }
</style>
