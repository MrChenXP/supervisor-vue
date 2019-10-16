<template>
  <div class="my c_IndexMain">

    <!--标题栏-->
    <x-header class="c_header" :left-options="{showBack: false}" >
      江西省督导平台
    </x-header>
    <!--底部导航-->
    <tab class="c_my_bottom_tab" custom-bar-width="0">
      <tab-item class="tab-item" @on-item-click="link('/index',$event)">
        <span class="fa fa-home"></span>
        <span>首页</span>
      </tab-item>
      <tab-item class="tab-item" v-if="user.name" @on-item-click="link('/workspace',$event)">
        <span class="fa fa-cubes"></span>
        <span>工作区</span>
      </tab-item>
      <tab-item class="tab-item" selected @on-item-click="link('/my',$event)">
        <span class="fa fa-user"></span>
        <span>我的</span>
      </tab-item>
    </tab>

    <!--用户简略信息-->
    <flexbox class="c_my_zl">
      <flexbox-item>
        <div class="flex-demo c_my_zl_xx" v-if="user.name">
          <p>{{user.name}}</p>
          <p>{{user.ddlx}}</p>
          <p>{{user.zw}}</p>
        </div>
        <div class="flex-demo c_my_zl_xx" v-else>
          <p>您还未登录</p>
        </div>
      </flexbox-item>
      <flexbox-item><div class="flex-demo c_my_tx" >
        <div v-if="user.tx">
          <img :src="user.tx" width="140" height="200"/>
        </div>
        <div v-else>
          <img :src="mrtx" width="140" height="200"/>
        </div>
      </div></flexbox-item>
    </flexbox>

    <!-- 功能区 -->
    <group>
      <cell title="个人设置" is-link v-if="user.name"
            @click.native="$router.push({path:'/my/mySet'})"></cell>
    </group>
    <!-- <group>
      <cell title="学校设置" is-link v-if="user.name"
            @click.native="$router.push({path:'/schoolSet'})"></cell>
    </group> -->
    <group>
      <x-button v-if="!user.name" type="primary" @click.native="loginDisplay = true">登录</x-button>
      <x-button v-else type="warn"  @click.native="exitLogin">退出</x-button>
    </group>
    <group>
      <popup-picker confirm-text="确定" title="切换机构" :data="jiGouList" :show-name="true" v-model="jiGouValue" @on-change="changeOrg"></popup-picker>
    </group>


    <!-- 登录隐藏区 -->
    <div>
      <div v-if="loginDisplay">
        <!--遮罩层-->
        <div class="c_my_wdlHint_body"  @click="loginDisplay = false">
        </div>
        <div class="c_my_login"  @keyup.enter="login">
          <group>
              <x-input title="账号" placeholder="请填写登录用户名" required v-model="login_username"></x-input>
              <x-input title="密码" v-model="login_pwd" type="password" placeholder="请填写登录密码" required ></x-input>
              <x-switch v-if="wxgzh.openid" title="自动登陆" v-model="wx_auto_login"></x-switch>
          </group>
          <div>
            <x-button type="primary" @click.native="login">登录</x-button>
            <x-button @click.native="loginDisplay = false">取消</x-button>
          </div>
        </div>
      </div>

      <!--账号密码错误 弹出隐藏区-->
      <div v-if="cwTishi" class="c_my_cuowutishi">
        <p>账号或者密码错误</p>
        <br>
        <x-button  @click.native="tsyc">确定</x-button>
      </div>
    </div>
  </div>
</template>

<script>
import {XHeader, Tab, TabItem, Flexbox, FlexboxItem, Cell, CellBox, Group, XButton, XSwitch, TransferDom, XInput, PopupPicker, InlineXSwitch} from 'vux'
import {mapGetters} from 'vuex'
import mrtx from '../assets/img/mrtx.jpg'
export default {
  name: 'my',
  data () {
    return {
      mrtx: mrtx,
      loginDisplay: false,
      cwTishi: false,
      login_username: '',
      login_pwd: '',
      wx_auto_login: true,
      jiGouList: [],
      jiGouValue: ['']
    }
  },
  computed: mapGetters({
    user: 'user',
    wxgzh: 'wxgzh'
  }),
  mounted () {
    this.loadJg()
    this.loginWx()
  },
  methods: {
    // 微信自动登陆
    loginWx () {
      if (this.wxgzh && this.wxgzh.openid) {
        this.$kwz.ajax.ajaxUrl({
          url: 'open/doWxOpenidLogin',
          type: 'POST',
          data: {
            OPENID: this.wxgzh.openid
          },
          vue: this,
          then (response) {
            let datas = response.data.datas
            if (datas && datas.wxLogin === 'true') {
              this.loginDisplay = false
              // 重新初始化kwz token
              this.$kwz.initToken()
              // 加载数据
              this.loadData()
              // 清除openid信息
              this.$store.dispatch('wxgzh_out')
            }
          }
        })
      }
    },
    changeOrg () {
      if (this.jiGouValue.length > 0 && this.jiGouValue[0]) {
        this.$kwz.ajax.ajaxUrl({
          url: 'index/resetOrgRole',
          type: 'POST',
          data: {
            ORG_ID: this.jiGouValue[0]
          },
          then (response) {
          }
        })
      }
    },
    loadJg () {
      this.$kwz.ajax.ajaxUrl({
        url: 'jc_org/open/doOrgList',
        type: 'POST',
        vue: this,
        then (response) {
          let datas = response.data.datas
          if (datas && datas.length > 0) {
            let length = datas.length
            let jgList = []
            for (let i = 0; i < length; i++) {
              jgList.push({
                name: datas[i].ORG_MC,
                value: datas[i].ORG_ID
              })
            }
            this.jiGouList.push(jgList)
          }
        }
      })
    },
    // 底部导航点击后 跳转页面、svg变换样式(固定绿色字体)
    link (url, event) {
      this.$router.push({path: url})
    },
    tsyc () {
      this.cwTishi = false
    },
    // 登录
    login () {
      if (!this.login_username) {
        this.$kwz.alert('请输入用户名')
        return
      }
      if (!this.login_pwd) {
        this.$kwz.alert('密码输入错误')
        return
      }
      let param = {
        login_username: this.login_username,
        login_pwd: this.login_pwd
      }
      this.$kwz.ajax.ajaxUrl({
        url: 'login/open/doLogin',
        type: 'POST',
        vue: this,
        data: {
          params: JSON.stringify(param),
          WX_AUTO_LOGIN: this.wx_auto_login ? '1' : '2',
          OPENID: this.wxgzh.openid
        },
        then (response) {
          this.loginDisplay = false
          // 重新初始化kwz token
          this.$kwz.initToken()
          // 加载数据
          this.loadData()
        },
        error (e) {
          this.$kwz.alert('登陆失败')
        }
      })
    },
    // 登录完加载数据
    loadData () {
      this.$kwz.ajax.ajaxUrl({
        url: 'open/loadInfos',
        vue: this,
        type: 'POST',
        then (response) {
          let datas = response.data.datas
          if (datas) {
            let user = {
              name: datas.name,
              tx: datas.tx,
              ddlx: datas.ddlx,
              zw: datas.zw,
              unicode: datas.uid
            }
            this.$store.dispatch('login', user)
          }
        }
      })
    },
    // 退出
    exitLogin () {
      this.$kwz.ajax.ajaxUrl({url: 'login/open/logout'})
      this.$store.dispatch('logout')
      this.$router.go(0)
    }
  },
  components: {
    Flexbox,
    FlexboxItem,
    Cell,
    CellBox,
    Group,
    XButton,
    XSwitch,
    XInput,
    XHeader,
    Tab,
    TabItem,
    PopupPicker,
    InlineXSwitch
  },
  directives: {
    TransferDom
  }
}
</script>
<style scoped>
  .c_my_bottom_tab{
    position: fixed !important;
    bottom: 0;
    width: 100%;
    z-index: 10;
  }
  .c_my_bottom_tab .vux-tab-item{
    display: flex !important;
    flex-direction:column;
    justify-content: center;
    align-items: center;
  }
  .c_my_bottom_tab .vux-tab-item span{
    line-height: 16px;
    display: inline-block;
  }

  .my{
    background: #ececec;
  }
  .c_my_zl{
    background: white;
  }
  .c_my_zl_xx{
    text-align: center;
  }
  .c_my_zl_xx p{
    font-size: 18px;
    margin-top: 5px;
  }
  .c_my_zl_xx p:first-child{
    font-size: 24px;
    font-weight: bolder;
  }
  .c_my_tx{
    display: flex;
    justify-content: center;
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .c_my_wdlHint_body{
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0,0.5);
    opacity: 0.9;
    position: fixed;
    top: 0;
  }
  .c_my_cuowutishi{
    text-align: center;
    color: red;
    padding: 30px;
    position: fixed;
    top:40%;
    left:50%;
    width: 250px;
    height: 150px;
    box-sizing: border-box;
    margin-left:-125px; /* width的一半的相反数 */
    margin-top: -75px;  /* height的一半的相反数 */
    z-index:999;
    background: white;
  }
  .c_my_login{
    background: white;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 10;
    border-radius: 5px;
  }
  .c_my_login button{
    margin: 15px 0 0;
  }
</style>
