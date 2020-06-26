<template>
    <div class="c_ListMian ">
        <!--标题栏-->
        <x-header class="c_header" :left-options="{preventGoBack: true, showBack: !qywx.type}" @on-click-back="$router.push({path: '/workspace'})">
            学校管理
            <a slot="right" @click="searchParam.show = !searchParam.show">
                <span class="fa fa-search">&nbsp;搜索</span>
            </a>
        </x-header>

        <!--搜索选项隐藏区 -->
        <div v-if="searchParam.show" class="">
            <div>
                <div class="c_searchBody_content">
                    <cell title="学校名称" class="c_zggz_searchShow_xxmc">
                        <search :auto-fixed=false class="" placeholder="请输入学校名称" v-model.trim="searchParam.XXMC"
                            auto-scroll-to-top ref="search"></search>
                    </cell>
                    <x-input title="学校代码" class="c_inputParent_borderB" placeholder="请输入学校代码" v-model="searchParam.ORG_DM"></x-input>
                    <popup-picker confirm-text="确定" title="办学类型" :data="searchCondition.DM_BXLX" :show-name="true"
                        v-model="searchParam.XXBXLXM"></popup-picker>
                    <popup-picker confirm-text="确定" title="办学模式" :data="searchCondition.DM_BXMS" :show-name="true"
                        v-model="searchParam.XXBBM"></popup-picker>
                    <popup-picker confirm-text="确定" title="城乡类型" :data="searchCondition.DM_XXZDCXLX" :show-name="true"
                        v-model="searchParam.XXZDCXLXDM"></popup-picker>
                    <popup-picker confirm-text="确定" title="学校等级" :data="searchCondition.DM_XXDJ" :show-name="true"
                        v-model="searchParam.XXDJ"></popup-picker>
                    <x-button type="primary" @click.native="searchList">确定</x-button>
                </div>
            </div>
            <div class="c_searchBody_mask" @click.stop="searchParam.show = !searchParam.show"></div>
        </div>

        <!--列表-->
        <group class="c_card_lb" v-for="(i,j) in dataList" :key="j" @click.native="toDetail(i.ORG_ID)">
            <cell class="c_card_lb_school">
                <div slot="title">
                    <span class="fa fa-map-marker"></span>&nbsp;{{i.XXMC}}
                </div>
            </cell>
            <cell>
                <div slot="title">学校代码：{{i.ORG_DM || '未填写'}}</div>
                <div slot="">办学类型：{{i.XXBXLX || '未填写'}}</div>
            </cell>
            <cell>
                <div slot="title">办学模式：{{i.XXBBMC || '未填写'}}</div>
                <div slot="">城乡类型：{{i.XXZDCXLXDMC || '未填写'}}</div>
            </cell>
            <cell>
                <div slot="title">学校等级：{{i.XXDJMC || '未填写'}}</div>
                <div slot="">联系电话：{{i.LXDH || '未填写'}}</div>
            </cell>
        </group>

        <x-button @click.native="loadMore" :disabled="moreParam.hasMore">{{moreParam.moreName}}</x-button>

    </div>
</template>

<script>
    import {
        XHeader,
        Group,
        XButton,
        XInput,
        Cell,
        Datetime,
        PopupPicker,
        Search
    } from 'vux'
    import {
        mapGetters
    } from 'vuex'
    export default {
        name: 'c_tkjl',
        data() {
            return {
                // 列表参数条件
                searchParam: {
                    show: false, // 搜索显示隐藏
                    XXMC: '', // 学校
                    XXBBM: [''], // 办学模式
                    XXDJ: [''], //学校等级
                    ORG_DM: '', //学校代码
                    XXBXLXM: [''], //办学类型
                    // "ASC":"",
                    XXZDCXLXDM: [''], //城乡类型
                    page: 1 // 页
                },
                // 搜索参数条件
                searchCondition: {},
                // 控制加载更多按钮
                moreParam: {
                    hasMore: false, // 是否可选
                    moreName: '加载更多' // 显示的值
                },
                dataList: []
            }
        },
        components: {
            XHeader,
            Group,
            XButton,
            XInput,
            Cell,
            Datetime,
            PopupPicker,
            Search
        },
        computed: mapGetters({
            qywx: 'qywx'
        }),
        created() {
            this.loadCondition()
            this.$kwz.hasAuth('jc_pgbz/toUpdate', this)
        },
        methods: {
            // 初始化页面
            loadCondition() {
                this.$kwz.loadVueDms('DM_XXDJ,DM_BXMS,DM_BXLX,DM_XXZDCXLX', dms => {
                    this.searchCondition = dms
                }, this)
                this.loadData()
            },
            // 判断按钮权限
            getPermission(url) {
                return this.$kwz.hasAuth(url, this)
            },
            // 搜索确定
            searchList() {
                this.searchParam.show = !this.searchParam.show
                this.searchParam.page = 1
                this.loadData('init')
            },
            // 加载列表数据 more加载更多/init初始化
            loadData(type) {
                this.$kwz.ajax.ajaxUrl({
                    url: 'dd_xx/doPageList',
                    type: 'POST',
                    data: {
                        "ORG_MC": this.searchParam.XXMC, //学校名称
                        // "start":"0",
                        "XXBBM": this.searchParam.XXBBM[0], //办学模式
                        // "rows":"20",
                        "XXDJ": this.searchParam.XXDJ[0], //学校等级
                        "ORG_DM": this.searchParam.ORG_DM, //学校代码
                        "XXBXLXM": this.searchParam.XXBXLXM[0], //办学类型
                        // "ASC":"",
                        "XXZDCXLXDM": this.searchParam.XXZDCXLXDM[0], //城乡类型
                        // "limit":"20",
                        "page": this.searchParam.page //分页 
                    },
                    vue: this,
                    then(response) {
                        let datas = response.data.datas
                        if (type === 'initAgain') {
                            if (datas === null || datas.length === 0) {
                                this.moreParam.hasMore = true
                                this.moreParam.moreName = '已无更多数据'
                            }
                        } else {
                            if (datas && datas.length > 0) {
                                this.searchParam.page++
                                this.moreParam.hasMore = false
                                this.moreParam.moreName = '加载更多'
                                if (type === 'more') {
                                    this.dataList = this.dataList.concat(datas)
                                } else {
                                    this.dataList = datas
                                }
                                // 需要在进行一次ajax请求，判断还有没有数据
                                this.loadData('initAgain')
                            } else {
                                this.moreParam.hasMore = true
                                if (type === 'more') {
                                    this.moreParam.moreName = '已无更多数据'
                                } else {
                                    this.dataList = []
                                    this.moreParam.moreName = '无数据'
                                }
                            }
                        }
                    }
                })
            },
            // 给列表卡添加点击事件 在点击删除按钮后没有效果
            toDetail(id) {
                // if (!this.check.checkboxDelete && id) {
                this.$router.push({
                    path: '/xxglddb/preview',
                    query: {
                        id: id
                    }
                })
                // }
            },
            // 加载更多事件
            loadMore() {
                this.loadData('more')
            }
        }
    }
</script>

<style scoped>
    .c_tkjl_search_endTime>>>div:first-child {
        width: 64px;
        text-align: right;
    }

    .c_ListMian {
        padding-top: 0;
    }

    .c_ListMian>>>.weui-cell__ft {
        color: black;
    }

    .c_ListMian>>>.weui-search-bar {
        padding: 1px 3px 1px 1px;
    }
</style>
