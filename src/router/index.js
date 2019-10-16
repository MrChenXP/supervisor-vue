import Vue from 'vue'
import Router from 'vue-router'

import interf from '@/components/interf'
import interfWx from '@/components/interfWx'
import interfQyWx from '@/components/interfQyWx'
import choseSsx from '@/components/choseSsx'

import index from '@/components/index'
import news from '@/components/news/news'
import moreNews from '@/components/news/moreNews'

import my from '@/components/my'
import mySet from '@/components/my/mySet'

import workspace from '@/components/workspace'

import menus from '@/router/menu'

import notFound from '@/components/404'

Vue.use(Router)

let routes = [
  {
    path: '/',
    name: 'interf',
    component: interf,
    desc: '跳转页',
    meta: {
      title: ''
    }
  },
  {
    path: '/choseSsx',
    name: 'choseSsx',
    component: choseSsx,
    desc: '省市县选择页',
    meta: {
      title: ''
    }
  },
  {
    path: '/interfWx',
    name: 'interfWx',
    component: interfWx,
    desc: '获取微信信息',
    meta: {
      title: ''
    }
  },
  {
    path: '/interfQyWx',
    name: 'interfQyWx',
    component: interfQyWx,
    desc: '获取企业微信信息',
    meta: {
      title: ''
    }
  },
  {
    path: '/index',
    name: 'index',
    component: index,
    desc: '首页',
    meta: {
      title: ''
    }
  },
  {
    path: '/my',
    name: 'my',
    component: my,
    desc: '用户首页',
    meta: {
      title: ''
    }
  },
  {
    path: '/workspace',
    name: 'workspace',
    component: workspace,
    desc: '工作区首页',
    meta: {
      title: ''
    }
  },
  {
    path: '/index/news',
    name: 'index-news',
    component: news,
    desc: '新闻详细页',
    meta: {
      title: ''
    }
  },
  {
    path: '/index/moreNews',
    name: 'index-moreNews',
    component: moreNews,
    desc: '更多新闻列表页',
    meta: {
      title: ''
    }
  },
  {
    path: '/my/mySet',
    name: 'mySet',
    component: mySet,
    desc: '用户信息修改',
    meta: {
      title: ''
    }
  },
  {
    path: '*',
    component: notFound,
    desc: '404页面',
    meta: {
      title: ''
    }
  }
]

let VUE_MENU_ID = {}

let treeMenu = menu => {
  let menuArray = []
  if (menu.childrenMenu && menu.childrenMenu.length > 0) {
    let children = menu.childrenMenu
    let length = children.length
    for (let i = 0; i < length; i++) {
      let childrenMenu = children[i]
      if (childrenMenu.menuid) {
        VUE_MENU_ID[childrenMenu.menuid] = true
        childrenMenu.path = childrenMenu.path ? childrenMenu.path : '/' + childrenMenu.menuid
      }
      menuArray.push(childrenMenu)
      menuArray = menuArray.concat(treeMenu(childrenMenu))
    }
  }
  return menuArray
}

if (menus && menus.length) {
  routes = routes.concat(treeMenu({
    childrenMenu: menus
  }))
}

let router = new Router({
  // mode: 'history',
  routes
})

export {VUE_MENU_ID}

export default router
