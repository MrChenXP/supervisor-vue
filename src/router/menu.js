import ddjs from '@/components/ddjs/ddjs'
import ddjsAdd from '@/components/ddjs/ddjs_add'
import ddjsPreview from '@/components/ddjs/ddjs_Preview'
import ddjsZgtzs from '@/components/ddjs/ddjs_zgtzs'
import ddjsXsyjs from '@/components/ddjs/ddjs_xsyjs'

import gzjh from '@/components/gzjh/gzjh'
import gzjhAdd from '@/components/gzjh/gzjh_add'
import gzjhDd from '@/components/gzjh/gzjh_dd'
import gzjhPreview from '@/components/gzjh/gzjh_Preview'

import zggz from '@/components/zggz/zggz'
import zggzAdd from '@/components/zggz/zggz_add'
import zggzZgtzs from '@/components/zggz/zggz_zgtzs'
import zggzXsyj from '@/components/zggz/zggz_xsyj'
import zggzXsyjAdd from '@/components/zggz/zggz_xsyj_add'
import zggzXsyjs from '@/components/zggz/zggz_xsyjs'

import tkjl from '@/components/tkjl/tkjl'
import tkjlAdd from '@/components/tkjl/tkjl_add'
import tkjlPreview from '@/components/tkjl/tkjl_Preview'
import tkjlOldChange from '@/components/tkjl/tkjl_oldChange'

/*
注意，配置菜单的时候请注意以下几点：
1、menus最外层菜单你必须配置menuid，不用配置path
2、menus内层菜单不用配置menuid
*/
let menus = [
  {
    name: 'ddjs',
    menuid: 'ebc60e699bc642a1871f1e017b979483',
    component: ddjs,
    desc: '督导纪实',
    childrenMenu: [
      {
        path: '/ddjs/add',
        name: 'ddjs-add',
        component: ddjsAdd,
        desc: '督导纪实新增'
      },
      {
        path: '/ddjs/Preview',
        name: 'ddjs-Preview',
        component: ddjsPreview,
        desc: '督导纪实查看'
      },
      {
        path: '/ddjs/zgtzs',
        name: 'ddjs-zgtzs',
        component: ddjsZgtzs,
        desc: '督导纪实整改'
      },
      {
        path: '/ddjs/xsyjs',
        name: 'ddjs-xsyjs',
        component: ddjsXsyjs,
        desc: '督导纪实协商'
      }
    ],
    meta: {
      title: ''
    }
  },
  {
    name: 'gzjh',
    menuid: 'b892eba5fae9493189ac81a510bbbd73',
    component: gzjh,
    desc: '工作计划',
    childrenMenu: [{
      path: '/gzjh/add',
      name: 'gzjh-add',
      component: gzjhAdd,
      desc: '工作计划新增'
    },
    {
      path: '/gzjh/dd',
      name: 'gzjh-dd',
      component: gzjhDd,
      desc: '工作计划督导'
    },
    {
      path: '/gzjh/Preview',
      name: 'gzjh-Preview',
      component: gzjhPreview,
      desc: '工作计划查看'
    }],
    meta: {
      title: ''
    }
  },
  {
    name: 'zggz',
    menuid: '3758a16aa4e14b3d87bb1f9c7e2fc509',
    component: zggz,
    desc: '整改工作',
    childrenMenu: [{
      path: '/zggz/add',
      name: 'zggz-add',
      component: zggzAdd,
      desc: '整改工作新增'
    },
    {
      path: '/zggz/zgtzs',
      name: 'zggz-zgtzs',
      component: zggzZgtzs,
      desc: '整改工作整改通知'
    },
    {
      path: '/zggz/xsyj',
      name: 'zggz-xsyj',
      component: zggzXsyj,
      desc: '整改工作协商意见'
    },
    {
      path: '/zggz/xsyj/add',
      name: 'zggz-xsyj-add',
      component: zggzXsyjAdd,
      desc: '协商意见新增'
    },
    {
      path: '/zggz/xsyj/xsyjs',
      name: 'zggz-xsyjs',
      component: zggzXsyjs,
      desc: '整改工作协商意见书'
    }],
    meta: {
      title: ''
    }
  },
  {
    name: 'tkjl',
    menuid: 'cd5235ad9e2d463a9af919de06dcfb06',
    component: tkjl,
    desc: '听课记录',
    childrenMenu: [
      {
        path: '/tkjl/add',
        name: 'tkjl-add',
        component: tkjlAdd,
        desc: '听课记录新增'
      },
      {
        path: '/tkjl/preview',
        name: 'tkjl-preview',
        component: tkjlPreview,
        desc: '听课记录预览'
      },
      {
        path: '/tkjl/oldChange',
        name: 'tkjl-oldChange',
        component: tkjlOldChange,
        desc: '听课记录老记录修改'
      }
    ],
    meta: {
      title: ''
    }
  }
]

export default menus
