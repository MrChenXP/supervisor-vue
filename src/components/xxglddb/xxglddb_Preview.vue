<template>
    <div class="c_tkjl_Prediv c_ContentMain">
        <!--标题栏 本地的还没弄-->
        <!--    <x-header class="c_header" :left-options="{preventGoBack: true}" title="详情"-->
        <!--              @on-click-back="$router.push({path: '/cd5235ad9e2d463a9af919de06dcfb06'})">-->
        <!--    </x-header>-->
        <!--广西的-->
        <x-header class="c_header" :left-options="{preventGoBack: true}" title="详情" @on-click-back="$router.push({path: '/2d370b7696b04f5298826f17e67f8093'})">
        </x-header>

        <!-- 标题组 -->
        <div class="c_zggz_tabs">
          <sticky :offset="46" :check-sticky-support="false">
            <tab :animate=false >
              <tab-item @on-item-click="xxsxShow = true" selected >基本信息</tab-item>
              <tab-item @on-item-click="xxsxShow = false">年度属性</tab-item>
            </tab>
          </sticky>
        </div>
        
        <!-- 基本信息 -->
        <div v-if="xxsxShow" class="c_body">
            <div class="c_FormAdd_editor">
              <div class="c_FormAdd_editor_head clearfix">
                <p>
                  上级机构
                </p>
              </div>
              <div class="c_FormAdd_editor_body">{{jbxxData.PARENT_ORGS}}</div>
            </div>
            <cell title="学校名称" :value="jbxxData.ORG_MC || '未填写'" ></cell>
            <cell title="学校代码" :value="jbxxData.ORG_DM || '未填写'" ></cell>
            <cell title="办学类型" :value="jbxxData.XXBXLX || '未填写'" ></cell>
            <cell title="办学模式" :value="jbxxData.XXBBMC || '未填写'" ></cell>
            <cell title="所在地城乡类型" :value="jbxxData.XXZDCXLXDMC || '未填写'" ></cell>
            <cell title="学校等级" :value="jbxxData.XXDJMC || '未填写'" ></cell>
            <cell title="联系电话" :value="jbxxData.LXDH || '未填写'" ></cell>
            <cell title="主页地址" :value="jbxxData.ZYDZ || '未填写'" ></cell>
            <cell title="学校经度" :value="jbxxData.XXJD || '未填写'" ></cell>
            <cell title="学校纬度" :value="jbxxData.XXWD || '未填写'" ></cell>
            <cell title="学校地址" :value="jbxxData.XXDZ || '未填写'" ></cell>
            <div class="c_FormAdd_editor">
              <div class="c_FormAdd_editor_head clearfix">
                <p>
                  简介
                </p>
              </div>
              <div class="c_FormAdd_editor_body">{{jbxxData.LSYG || '未填写'}}</div>
            </div>
        </div>
        
        <!-- 年度属性-->
        <div v-if="!xxsxShow" class="c_body">
            <popup-picker confirm-text="确定" title="查询条件" :data="xnList" :show-name="true" v-model="xnValue" @on-change="changeXn"></popup-picker>
            <!-- 办学条件 -->
                <div>
                  <div class="title">
                  	办学条件
                  </div>
                  <div >
                    <cell title="占地面积/㎡" :value="ndsxData.ZDMJ|| '未填写'"></cell>
                    <cell title="其中：绿化用地面积/㎡" :value="ndsxData.LHYDMJ|| '未填写'"></cell>
                    <cell title="其中：运动场地面积/㎡" :value="ndsxData.YDCDMJ|| '未填写'"></cell>
                    <cell title="校舍建筑面积/㎡" :value="ndsxData.XSJZMJ|| '未填写'"></cell>
                    <cell title="图书量/册" :value="ndsxData.TSL|| '未填写'"></cell>
                    <cell title="数字资源量/个" :value="ndsxData.SZZYL|| '未填写'"></cell>
                    <cell title="计算机台数/台" :value="ndsxData.JSJTS|| '未填写'"></cell>
                    <cell title="其中：教学用计算机/台" :value="ndsxData.JXYJSJ|| '未填写'"></cell>
                    <cell title="其中：平板电脑/台" :value="ndsxData.PBDN|| '未填写'"></cell>
                    <cell title="教室/间" :value="ndsxData.JSZS|| '未填写'"></cell>
                    <cell title="其中：网络多媒体教室/间" :value="ndsxData.WLDMTJS|| '未填写'"></cell>
                    <cell title="固定资产总值/元" :value="ndsxData.GDZCZZ|| '未填写'"></cell>
                    <cell title="其中：教学仪器设备资产值/元" :value="ndsxData.JXYQSBZCZ|| '未填写'"></cell>
                  </div>
                </div>
                <!-- 学生 -->
                <div>
                  <div class="title" >
                  	学生
                  </div>
                  <div >
                   <cell title="毕业生数/人" :value="ndsxData.BYSS|| '未填写'"></cell>
                   <cell title="招生数/人" :value="ndsxData.ZSS|| '未填写'"></cell>
                   <cell title="教学班数/班" :value="ndsxData.JXBS|| '未填写'"></cell>
                   <cell title="在校学生数/人" :value="ndsxData.ZXXSS|| '未填写'"></cell>
                   <cell title="其中：女生人数/人" :value="ndsxData.NSRS|| '未填写'"></cell>
                   <cell title="其中：进城务工人员随迁子女数/人" :value="ndsxData.WGSQZNS|| '未填写'"></cell>
                  </div>
                </div>
                <!-- 教职工 -->
                <div>
                  <div class="title" >
                  	教职工
                  </div>
                  <div >
                   <cell title="教职工总数/人" :value="ndsxData.JZGZS|| '未填写'"></cell>
                   <cell title="专任教师数/人" :value="ndsxData.ZZJSS|| '未填写'"></cell>
                   <cell title="其中：女专任教师数/人" :value="ndsxData.NZZJSS|| '未填写'"></cell>
                   <cell title="其中：体育/艺术教师数/人" :value="ndsxData.TYJSS|| '未填写'"></cell>
                  </div>
                </div>
                <!-- 骨干教师 -->
                <div>
                  <div class="title" >
                  	骨干教师
                  </div>
                  <div>
                   <cell title="县级及以上骨干教师（小学）/人" :value="ndsxData.XXXJYSJS|| '未填写'"></cell>
                   <cell title="县级及以上骨干教师（初中）/人" :value="ndsxData.CZXJYSJS|| '未填写'"></cell>
                   <cell title="县级及以上骨干教师（高中）/人" :value="ndsxData.GZXJYSJS|| '未填写'"></cell>
                  </div>
                </div>
                <!-- 学历分布 -->
                <div>
                  <div class="title" >
                  	学历分布
                  </div>
                  <div >
                   <cell title="中专/高中毕业人数/人" :value="ndsxData.ZZGZBYRS|| '未填写'"></cell>
                   <cell title="专科毕业人数/人" :value="ndsxData.ZKBYRS|| '未填写'"></cell>
                   <cell title="本科毕业人数/人" :value="ndsxData.BKBYRS|| '未填写'"></cell>
                   <cell title="研究生毕业人数/人" :value="ndsxData.YJSBYRS|| '未填写'"></cell>
                   <cell title="其他学历人数/人" :value="ndsxData.QTXLRS|| '未填写'"></cell>
                  </div>
                </div>
                <!-- 职称分布 -->
                <div>
                  <div class="title" >
                  	职称分布
                  </div>
                  <div >
                   <cell title="高级职称人数/人" :value="ndsxData.GJZCRS|| '未填写'"></cell>
                   <cell title="中级职称人数/人" :value="ndsxData.ZJZCRS|| '未填写'"></cell>
                   <cell title="初级职称人数/人" :value="ndsxData.CJZCRS|| '未填写'"></cell>
                   <cell title="未评职称人数/人" :value="ndsxData.WPZCRS|| '未填写'"></cell>
                  </div>
                </div>
                <!-- 年龄结构 -->
                <div>
                  <div class="title" >
                  	年龄结构
                  </div>
                  <div >
                   <cell title="24岁及以下人数/人" :value="ndsxData.AGE0024|| '未填写'"></cell>
                   <cell title="25-29岁人数/人" :value="ndsxData.AGE2529|| '未填写'"></cell>
                   <cell title="30-34岁人数/人" :value="ndsxData.AGE3034|| '未填写'"></cell>
                   <cell title="35-39岁人数/人" :value="ndsxData.AGE3539|| '未填写'"></cell>
                   <cell title="40-44岁人数/人" :value="ndsxData.AGE4044|| '未填写'"></cell>
                   <cell title="45-49岁人数/人" :value="ndsxData.AGE4549|| '未填写'"></cell>
                   <cell title="50-54岁人数/人" :value="ndsxData.AGE5054|| '未填写'"></cell>
                   <cell title="55-59岁人数/人" :value="ndsxData.AGE5559|| '未填写'"></cell>
                   <cell title="60岁以上人数/人" :value="ndsxData.AGE60|| '未填写'"></cell>
                  </div>
                </div>
        </div>
         
    </div>
</template>

<script>
    import {XHeader,Tab, TabItem, Sticky,Group,Cell,Rater,PopupPicker} from 'vux'

    export default {
        name: 'c_tkjl_Prediv',
        components: {XHeader,Tab, TabItem, Sticky,Group,Cell,Rater,PopupPicker},
        data() {
            return {
                // 基本信息和年度属性切换
                xxsxShow: true,
                // 基本信息-上级机构显示隐藏
                sjjgShow: true,
                // 基本信息-简介显示隐藏
                jjShow: true,
                // 基本信息-办学条件显示隐藏
                bxtjShow: true,
                // 基本信息-学生显示隐藏
                xsShow: true,
                // 基本信息-教职工显示隐藏
                jzgShow:true,
                // 基本信息-骨干教师显示隐藏
                ggjsShow:true,
                // 基本信息-学历分布显示隐藏
                xlfbShow:true,
                // 基本信息-职称分布显示隐藏
                zcfbShow:true,
                // 基本信息-年龄结构显示隐藏
                nljgShow:true,
                // 学校id
                id:"",
                // 基本信息
                jbxxData:{},
                // 学年属性数据
                ndsxData:{},
                // 学年属性数据-学年下拉数据
                xnList:[[{name:"",value:""}]],
                // 学年属性数据-当前学年
                xnValue:[],
                query: ''
            }
        },
        created() {
            this.initPage()
        },
        methods: {
            // 初始化页面
            initPage() {
                this.query = this.$route.query
                if (this.query && this.query.id) {
                    this.id = this.query.id
                    this.getJbxxData()
                    this.getXnList()
                    this.getXnValue()
                }
            },
            // 基本信息数据获取
            getJbxxData() {
                this.$kwz.ajax.ajaxUrl({
                    url: 'dd_xx/doSelectByPrimaryKey',
                    type: 'POST',
                    data: {
                        ORG_ID: this.id
                    },
                    vue: this,
                    then(response) {
                        this.jbxxData = response.data.datas
                    }
                })
            },
            // 学年属性-学年下拉数据获取
            getXnList() {
                this.$kwz.ajax.ajaxUrl({
                    url: 'jc_xq/doList',
                    type: 'POST',
                    vue: this,
                    then(response) {
                        let datas = response.data.datas
                        for(let i = 0; i < datas.length; i++){
                            this.xnList[0][i].name = datas[i].XQ_XN
                            this.xnList[0][i].value = datas[i].XQ_ND
                        }
                    }
                })
            },
            // 学年属性-获取当前学年
            getXnValue() {
                this.$kwz.ajax.ajaxUrl({
                    url: 'jc_xq/getCurXq',
                    type: 'POST',
                    vue: this,
                    then(response) {
                        this.xnValue[0] = response.data.datas.curXq
                        this.getNdsxData()
                    }
                })
            },
            // 年度属性-获取数据
            getNdsxData() {
                this.$kwz.ajax.ajaxUrl({
                    url: 'dd_xx/doSelectNdsx',
                    type: 'POST',
                    data: {
                        ORG_ID: this.id,
                        XQ_ND: this.xnValue[0].XQ_ND
                    },
                    vue: this,
                    then(response) {
                        this.ndsxData = response.data.datas
                    }
                })
            },
            // 选择搜索条件 => 学段
            changeXn() {
                this.getNdsxData()
            },
        }
    }
</script>

<style scoped>
    .c_body{
        max-height: calc(100vh - 46px - 44px);
        overflow: auto;
    }
    .c_FormAdd_editor_body{
        color: #999999;
    }
    .title{
        padding: 10px 15px;
        box-sizing: border-box;
        font-weight: 600;
        background: #EEEEEE;
    }
</style>
