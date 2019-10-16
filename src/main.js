// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
import Vuex from 'vuex'
import axios from 'axios'
import VueWechatTitle from 'vue-wechat-title'
import { LoadingPlugin } from 'vux'
import $kwz from './plugins/kwz/index'
import kwz from './lib/kwz.vue'
import vueHtml5Editor from './plugins/vueHtml5Editor/vueHtml5Editor'

// import css
import '../static/css/font-awesome.min.css'
import '../static/css/reset.css'
import '../static/css/common.css'

// vueHtml5Editor 富文本编辑器
vueHtml5Editor()
// 点击增强
FastClick.attach(document.body)

Vue.config.productionTip = false

// vux的弹窗插件
Vue.use(LoadingPlugin)
// kwz-vue插件
Vue.use($kwz)
// vuex数据互通插件
Vue.use(Vuex)
// 改变title的组件
Vue.use(VueWechatTitle)
// confirm插件
// Vue.use(VueWechatTitle)

let store = new Vuex.Store({
  state: {
    user: {}, // 登陆的用户
    auths: '', // 用户权限路径
    wxgzh: {},
    qywx: {},
    menus: {} // 用户拥有的菜单权限
  },
  mutations: {
    // 登陆==》将登陆的用户放入store和localstorage中
    LOGIN (state, user) {
      state.user = user
      kwz.storeSessionJson('user', user)
    },
    // 退出==》将登陆的用户移除store和localstorage
    LOGOUT (state) {
      kwz.removeSessionStoreJson('user')
      kwz.removeSessionStoreJson('auths')
      state.user = {}
      state.auths = ''
      state.menus = {}
    },
    // 从localstorage中取出缓存的用户
    LOGIN_FROM_STORAGE (state) {
      state.user = kwz.getSessionStoreJson('user') || {}
    },
    // 存储微信公众号信息
    WXGZH (state, wxgzh) {
      state.wxgzh = wxgzh
      kwz.storeSessionJson('wxgzh', wxgzh)
    },
    // 从sessionstorage中取出缓存的微信公众号信息
    WXGZH_FROM_STORAGE (state, wxgzh) {
      state.wxgzh = kwz.getSessionStoreJson('wxgzh') || {}
    },
    WXGZH_OUT (state) {
      kwz.removeSessionStoreJson('wxgzh')
      state.wxgzh = {}
    },
    // 存储微信公众号信息
    QYWX (state, qywx) {
      state.qywx = qywx
      kwz.storeSessionJson('qywx', qywx)
    },
    // 从sessionstorage中取出缓存的微信公众号信息
    QYWX_FROM_STORAGE (state, qywx) {
      state.qywx = kwz.getSessionStoreJson('qywx') || {}
    },
    QYWX_OUT (state) {
      kwz.removeSessionStoreJson('qywx')
      state.qywx = {}
    },
    AUTHS (state, auths) {
      state.auths = auths
      kwz.storeSessionJson('auths', auths)
    },
    AUTHS_FROM_STORAGE (state) {
      state.auths = kwz.getSessionStoreJson('auths') || {}
    },
    MENUS (state, menus) {
      state.menus = menus
      kwz.storeSessionJson('menus', menus)
    },
    MENUS_FROM_STORAGE (state) {
      state.menus = kwz.getSessionStoreJson('menus') || {}
    }
  },
  getters: {
    user (state) {
      if (!state.user.name) {
        store.dispatch('login_from_storage')
      }
      return state.user
    },
    wxgzh (state) {
      if (!state.wxgzh || !kwz.jsonIsEmpty(state.wxgzh)) {
        store.dispatch('wxgzh_from_storage')
      }
      return state.wxgzh
    },
    qywx (state) {
      if (!state.qywx || !kwz.jsonIsEmpty(state.qywx)) {
        store.dispatch('qywx_from_storage')
      }
      return state.qywx
    },
    auths (state) {
      if (!state.auths) {
        store.dispatch('auths_from_storage')
      }
      return state.auths
    },
    menus (state) {
      if (!state.menus) {
        store.dispatch('menus_from_storage')
      }
      return state.menus
    }
  },
  actions: {
    login ({ commit }, user) {
      commit('LOGIN', user)
    },
    logout ({ commit }) {
      commit('LOGOUT')
    },
    login_from_storage ({ commit }) {
      commit('LOGIN_FROM_STORAGE')
    },
    wxgzh ({ commit }, wxgzh) {
      commit('WXGZH', wxgzh)
    },
    wxgzh_from_storage ({ commit }) {
      commit('WXGZH_FROM_STORAGE')
    },
    wxgzh_out ({ commit }) {
      commit('WXGZH_OUT')
    },
    qywx ({ commit }, qywx) {
      commit('QYWX', qywx)
    },
    qywx_from_storage ({ commit }) {
      commit('QYWX_FROM_STORAGE')
    },
    qywx_out ({ commit }) {
      commit('QYWX_OUT')
    },
    auths ({ commit }, auths) {
      commit('AUTHS', auths)
    },
    auths_from_storage ({ commit }) {
      commit('AUTHS_FROM_STORAGE')
    },
    menus ({ commit }, menus) {
      commit('MENUS', menus)
    },
    menus_from_storage ({ commit }) {
      commit('MENUS_FROM_STORAGE')
    }
  }
})

/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 请求拦截器
axios.interceptors.request.use((config) => {
  // 在请求时弹出正则加载的显示框
  kwz.loadding.show.apply(vm, ['加载中,请稍后...'])
  return config
}, (error) => {
  return Promise.reject(error)
})

// 返回拦截器
axios.interceptors.response.use(
  response => {
    // 关闭正在加载显示框
    kwz.loadding.hide.apply(vm)
    return response
  },
  error => {
    kwz.loadding.hide.apply(vm)
    if (error.response) {
      switch (error.response.status) {
        // 401错误==>token不正确,重新加载token
        case 401: {
          kwz.initToken()
          router.push(0)
          break
        }
        // 访问了未登录的资源,提示登录
        case 402: {
          store.dispatch('logout')
          if (kwz.isWx()) {
            kwz.alert('会话已失效，请返回公众号菜单重新点击进入')
          } else {
            kwz.alert('请登录', undefined, () => {
              router.push('/my')
            })
          }
          break
        }
        case 403: {
          kwz.alert('对不起，您无权限进行此项操作')
        }
      }
    }
    return Promise.reject(error)
  })
