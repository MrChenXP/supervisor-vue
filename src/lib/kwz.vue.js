// vue版KWZjs,简化了部分pc端kwz的函数,修改部分代码,使其完全符合eslint的规范

import xxtea from './XXTEA'
import axios from 'axios'
import { AlertModule } from 'vux'
import Vue from 'vue'
import Qs from 'qs'

let KWVue = {
  dev: true,
  token: '',
  jc_isencode: '',
  jc_isencrypt: '',
  domain: '', // 公众号返回路径
  corid: '', // 企业号corpid
  ajax: {
    formatParam (op) {
      // 参数加密处理
      let data = op.data ? KWVue.handleData(op.data) : {}
      // 默认get请求
      op.type = op.type ? op.type.toUpperCase() : 'GET'
      // token处理
      if (KWVue.token) {
        // data.token = KWVue.token
        op.url += op.url.indexOf('?') > 0 ? ('&token=' + KWVue.token) : ('?token=' + KWVue.token)
      }
      if (KWVue.dev) {
        // 开发因为使用了代理，所以要加上/api/
        op.url = '/api/' + op.url
      }
      op.data = data
      return op
    },
    ajaxInited: false,
    // 执行ajax处理
    ajaxUrl (op) {
      // 如果ajax还未初始化完成,延迟500ms执行
      if (!KWVue.ajax.ajaxInited) {
        setTimeout(() => {
          KWVue.ajax.ajaxUrl.apply(this, [op])
        }, 500)
      } else {
        if (op && op.url) {
          op = KWVue.ajax.formatParam(op)
          if (op.type === 'POST') {
            let postData = Qs.stringify(op.data || {})
            axios.post(op.url, postData).then(response => {
              KWVue.ajax.ajaxThen.apply(this, [response, op])
            }).catch(error => {
              KWVue.ajax.ajaxCatch.apply(this, [error, op])
            })
          } else if (op.type === 'GET') {
            axios.get(op.url, {
              params: op.data
            }).then(response => {
              KWVue.ajax.ajaxThen.apply(this, [response, op])
            }).catch(error => {
              KWVue.ajax.ajaxCatch.apply(this, [error, op])
            })
          }
        }
      }
    },
    // 执行并发请求
    ajaxAll (ops = [], cb = () => {}, vue) {
      let ajaxContainer = []
      for (let i = 0; i < ops.length; i++) {
        let op = ops[i]
        if (op && op.url) {
          op = KWVue.ajax.formatParam(op)
          ajaxContainer.push(axios({
            method: op.type,
            url: op.url,
            params: op.data
          }))
        }
      }
      axios.all(ajaxContainer).then(axios.spread(function () {
        let responseArray = []
        for (let i = 0; i < arguments.length; i++) {
          let response = arguments[i]
          if (response.data && response.data.statusCode === '200') {
            responseArray.push(response)
          }
        }
        if (typeof cb === 'function') {
          cb.apply(vue || this, responseArray)
        }
      }))
    },
    ajaxThen (response, op) {
      if (response.data && response.data.statusCode === '200') {
        if (typeof (op.then) === 'function') {
          op.then.apply(op.vue || this, [response])
        }
        if (typeof (op.success) === 'function') {
          op.success.apply(op.vue || this, [response])
        }
      } else if (response.data && response.data.msg) {
        KWVue.alert(response.data.msg)
      }
    },
    ajaxCatch (error, op) {
      let errorFlag = true
      if (typeof (op.catch) === 'function') {
        op.catch.apply(op.vue || this, [error])
        errorFlag = false
      }
      if (typeof (op.error) === 'function') {
        op.error.apply(op.vue || this, [error])
        errorFlag = false
      }
      if (errorFlag) {
        console.error(error)
      }
    },
    url (url = '') {
      return KWVue.dev ? '/api/' + url : url
    }
  },
  // 参数处理
  handleData (data) {
    if (KWVue.jc_isencode === 'Y') {
      data = KWVue.kwbms(data)
      if (KWVue.jc_isencrypt === 'Y') {
        data = KWVue.kwfilters(KWVue.kwencrypts(data))
      }
    }
    return data
  },
  // 编码==》解决部分中文或字符乱码的问题
  kwbms (data) {
    if (data && typeof (data) === 'object') {
      for (var i in data) {
        data[i] = KWVue.kwbm(data[i])
      }
    }
    return data
  },
  kwbm (str) {
    if (KWVue.jc_isencode === 'Y' && str) {
      let regStr = '([^\u0000-\u007F^\u0080-\u00FF]|\u00b7|\u44e3)'
      let reg = new RegExp(regStr, 'gm')
      str = str.toString().replace(reg, (a) => {
        return '&#' + a.charCodeAt(0) + ';'
      })
    }
    return str
  },
  kwfilters (data) {
    if (data && typeof (data) === 'object') {
      for (var i in data) {
        data[i] = KWVue.kwfilter(data[i])
      }
    }
    return data
  },
  kwfilter (str) {
    if (str) {
      str = str.replace(/\+/g, '_abc123')
        .replace(/-/g, '_def456')
        .replace(/=/g, '_ghi789')
        .replace(/\//g, '_jkl098')
        .replace(/\*/g, '_mno765')
    }
    return str
  },
  kwencrypts (data) {
    if (data && typeof (data) === 'object') {
      for (var i in data) {
        data[i] = KWVue.kwencrypt(data[i])
      }
    }
    return data
  },
  kwencrypt (data) {
    if (KWVue.jc_isencrypt === 'Y' && KWVue.token && data) {
      data = xxtea(data, KWVue.token)
    }
    return data
  },
  // 初始化token
  initToken () {
    KWVue.ajax.ajaxInited = false
    axios.get(KWVue.ajax.url('open/loadConfig'))
      .then((response) => {
        if (response.data.statusCode === '200') {
          let datas = response.data.datas
          KWVue.token = datas.token
          KWVue.jc_isencode = datas.jc_isencode
          KWVue.jc_isencrypt = datas.jc_isencrypt
          KWVue.domain = datas.domain
          KWVue.corid = datas.corid
          // alert('KWVue.domain ' + KWVue.domain)
          // alert('KWVue.corid ' + KWVue.corid)
        }
        KWVue.ajax.ajaxInited = true
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  // 初始化访问
  initVisit () {
    // 这个导致企业微信无限转圈圈。
    axios.get(KWVue.ajax.url('visit.jsp'))
      // .then((response) => {
      //   KWVue.ajax.ajaxInited = false
      //   axios.get(KWVue.ajax.url('open/loadConfig'))
      //     .then((response) => {
      //       if (response.data.statusCode === '200') {
      //         let datas = response.data.datas
      //         KWVue.token = datas.token
      //         KWVue.jc_isencode = datas.jc_isencode
      //         KWVue.jc_isencrypt = datas.jc_isencrypt
      //         KWVue.domain = datas.domain
      //         KWVue.corid = datas.corid
      //         // alert('KWVue.domain ' + KWVue.domain)
      //         // alert('KWVue.corid ' + KWVue.corid)
      //       }
      //       KWVue.ajax.ajaxInited = true
      //     })
      //     .catch(function (error) {
      //       console.error(error)
      //     })
      // })
  },
  // 提示效果
  alert (content = '系统错误，请稍后再试', onShow = () => { }, onHide = () => { }) {
    AlertModule.show({
      title: '提示信息',
      content,
      onShow,
      onHide
    })
  },
  // 确认框
  confirm (content = '是否进行此项操作', confirm = () => { }, cancel = () => { }, vue) {
    // ConfirmPlugin.show({
    //   title: '提示信息',
    //   content,
    //   onCancel () {
    //     cancel.apply(vue || this)
    //   },
    //   onConfirm () {
    //     confirm.apply(vue || this)
    //   }
    // })
  },
  // 正在加载效果
  loadding: {
    show (text = '正在加载...') {
      this.$vux.loading.show({ text })
    },
    hide () {
      this.$vux.loading.hide()
    }
  },
  storeJson (key, json) {
    if (localStorage) {
      localStorage.setItem(key, JSON.stringify(json))
    } else {
      console.error("envirment don't support storage")
    }
  },
  storeSessionJson (key, json) {
    if (sessionStorage) {
      sessionStorage.setItem(key, JSON.stringify(json))
    } else {
      console.error("envirment don't support session storage")
    }
  },
  removeStoreJson (key) {
    if (localStorage) {
      localStorage.removeItem(key)
    }
  },
  removeSessionStoreJson (key) {
    if (sessionStorage) {
      sessionStorage.removeItem(key)
    }
  },
  getStoreJson (key) {
    let json = {}
    if (localStorage) {
      let jsonStr = localStorage.getItem(key)
      try {
        json = JSON.parse(jsonStr)
      } catch (error) {
        console.error(error)
      }
    }
    return json
  },
  getSessionStoreJson (key) {
    let json = {}
    if (sessionStorage) {
      let jsonStr = sessionStorage.getItem(key)
      try {
        json = JSON.parse(jsonStr)
      } catch (error) {
        console.error(error)
      }
    }
    return json
  },
  uploadFile (e, cb, vue) {
    let file = e.target.files[0]
    if (file) {
      let param = new FormData()
      param.append('file', file, file.name)
      let url = KWVue.ajax.url('jc_mobile/doUpload')
      if (KWVue.token) {
        url += '?token=' + KWVue.token
      }
      axios.post(url, param, {
        headers: {'Content-Type': 'multipart/form-data'}
      }).then(response => {
        if (response.data.statusCode === '200') {
          if (typeof (cb) === 'function') {
            cb.apply(vue || this, [response])
          }
        }
      }).catch(error => {
        KWVue.alert('上传失败')
        console.log(error)
      })
    }
  },
  loadVueDms (dmKeys, cb, vue) {
    KWVue.dm.loadDms(dmKeys, dms => {
      let dmVue = {}
      if (dms) {
        for (let i in dms) {
          let vueDmArray = []
          if (dms[i].length > 0) {
            let array = []
            for (let j = 0; j < dms[i].length; j++) {
              array.push({
                name: dms[i][j].DMMX_MC,
                value: dms[i][j].DMMX_CODE
              })
            }
            vueDmArray.push(array)
          }
          dmVue[i] = vueDmArray
        }
      }
      cb.apply(vue, [dmVue])
    }, vue)
  },
  dm: {
    store: {
    },
    loadDms (dmKeys, cb, vue) {
      let dm = {}
      let notStore = []
      let dmKeyArray = dmKeys.split(',')
      // 截取已经缓存的代码值
      for (let i = 0; i < dmKeyArray.length; i++) {
        let key = dmKeyArray[i]
        if (!KWVue.dm.store[key]) {
          // 本地不存在的代码key
          notStore.push(key)
        } else {
          // 本地已存在的代码key
          dm[key] = KWVue.dm.store[key]
        }
      }
      // 如果有本地未存在的代码key，则去服务器加载
      if (notStore.length < 1) {
        cb.apply(vue, [dm])
      } else {
        KWVue.ajax.ajaxUrl({
          url: 'jc_dmtab/open/selectDmmxData',
          type: 'POST',
          data: {
            DM_CODES: notStore.join(',')
          },
          then (response) {
            let datas = response.data.datas
            if (datas) {
              // 把代码存到KWVue.dm.store
              for (let i in datas) {
                KWVue.dm.store[i] = datas[i]
              }
              // cb.apply(vue, [dm])
              KWVue.dm.loadDms(dmKeys, cb, vue)
            } else {
              console.error('加载代码失败')
            }
          }
        })
      }
    }
  },
  // 校验json是否为空==》true/false 不为空/为空
  jsonIsEmpty (json) {
    if (typeof json === 'object') {
      for (let i in json) {
        return true
      }
    }
    return false
  },
  isWx () {
    try {
      return window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i).toString() === 'micromessenger'
    } catch (e) {
      return false
    }
  },
  formatGetParam (url) {
    let param = url && url.indexOf('?') > 0 ? url.substr(url.indexOf('?') + 1, url.length) : ''
    let formatParam = {}
    if (param) {
      param = param.split('&')
      for (let i = 0; i < param.length; i++) {
        let p = param[i] ? param[i].split('=') : []
        if (p[0]) {
          formatParam[p[0]] = p[1]
        }
      }
    }
    return formatParam
  },
  getPopupName (list, key, keyName = 'key', valName = 'value') {
    if (list && list.length > 0) {
      key = key instanceof Array ? key[0] : key
      for (let i = 0; i < list.length; i++) {
        let list2 = list[i]
        if (list2 && list2.length > 0) {
          for (let j = 0; j < list2.length; j++) {
            if (list2[j][keyName] === key) {
              return list2[j][valName]
            }
          }
        }
      }
    }
  },
  // 检查是否登陆
  checkLogin (sf = () => {}, ef = () => {}, vue) {
    let url = KWVue.ajax.url('open/checkLogin')
    axios.post(url)
    .then(response => {
      let datas = response.data.datas
      if (datas && datas._login_ === '_SUCCESS_') {
        sf.apply(vue || this, [response])
      } else {
        ef.apply(vue || this, [response])
      }
    })
    .catch(error => {
      ef.apply(vue || this, [error])
    })
  },
  // 从html中分解出图片和去掉html标签==》{text: '',imgs: [<img src=xx>],imgSrcs: ['sdf/df/pngss..']}
  spiltHtml (html) {
    let content = {}
    if (html) {
      content.text = KWVue.splitHtmlTag(html)
      let imgs = []
      let imgSrcs = []
      html.replace(/(i?)<img.*? src="?(.*?(\.(jpg|gif|bmp|bnp|png))?)".*? \/?>/gim, (img) => {
        imgs.push(img)
        let src = img.substr(img.indexOf('src=') + 4)
        src = src.startsWith('"') || src.startsWith('\'') ? src.substr(1) : src
        src = src.substr(0, src.indexOf(' '))
        src = src.endsWith('"') || src.endsWith('\'') ? src.substr(0, src.length - 1) : src
        imgSrcs.push(src)
      })
      content.imgs = imgs
      content.imgSrcs = imgSrcs
    }
    return content
  },
  splitHtmlTag (html) {
    return html.replace(/<[^>]+>/gim, (a) => {
      return ''
    })
  },
  // 以图片分割html ==> {imgs:[],texts:[],length: imgs.length > texts.length ? imgs.length : texts.length}
  splitHtmlByImg (html) {
    let content = {}
    if (html) {
      html = html.split('<img')
      let flag = true
      let imgs = []
      let texts = []
      for (let i = 0; i < html.length; i++) {
        let a = html[i]
        if (flag) {
          texts.push(KWVue.splitHtmlTag(a))
          flag = false
        } else {
          let src = a.substr(a.indexOf('src=') + 4)
          src = src.startsWith('"') || src.startsWith('\'') ? src.substr(1) : src
          let text = src.substr(src.indexOf('/>') + 2)
          text = KWVue.splitHtmlTag(text)
          src = src.substr(0, src.indexOf(' '))
          src = src.endsWith('"') || src.endsWith('\'') ? src.substr(0, src.length - 1) : src
          imgs.push(src)
          texts.push(text)
        }
      }
      content.imgs = imgs
      content.texts = texts
      content.length = imgs.length > texts.length ? imgs.length : texts.length
    }
    return content
  },
  randomStr (length = 8) {
    const SEED = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
      'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
      'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b',
      'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
      'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ]
    let array = []
    for (let i = 0; i < length; i++) {
      array.push(SEED[Math.ceil(Math.random() * 62)])
    }
    return array.join('')
  },
  // 取出html属性值 老评估模板用 老评估模板不用可以删了 2018/12/5
  formatAttrFromTag (tag, attrName) {
    let reg = attrName + '\\s*=\\s*"?\\S+"?'
    let reg2 = '(' + attrName + '=\\s*)|"|\\s*'
    let value = ''
    tag.replace(new RegExp(reg, 'gim'), (a) => {
      value = a.replace(new RegExp(reg2, 'gim'), '').replace(/\/>/gim, '')
    })
    return value
  },
  // 将pc元素转换成打星星样式 并且可以点击评分
  formatPgbz (html, sj = {}) {
    if (html) {
      html = html.replace(/width=".*?"/gim, '')
      html = html.replace(/height=".*?"/gim, '')
      let dataOp = {
        // 表单数据
        pgData: {},
        // 计算属性
        computedData: {},
        // 计算表达式
        config: {}
      }
      let i = 0
      // html = html.replace(/<input\s*type="text"\s*(data-cal="[A-Za-z0-9\\-]*" )?class="pgbz-data"\s*name="[A-Za-z0-9]*"\s*\/?>/gim, (a) => {
      html = html.replace(/<rate-yo[^<>]+>/gim, (a) => {
      //   let name = KWVue.formatAttrFromTag(a, 'name')
      //   let dataCal = KWVue.formatAttrFromTag(a, 'data-cal')
      // 转换成dom文档
        let oHtml = new DOMParser().parseFromString(html, 'text/xml')
        let rateYo = oHtml.querySelectorAll('rate-yo')[i]
        let name = rateYo.getAttribute('name')
        let dataCal = rateYo.getAttribute('type') ? rateYo.getAttribute('type') + '-' + rateYo.getAttribute('rel') : ''
        i++ // 计算当前是第几个rate-yo
        let value = sj[name] ? parseInt(sj[name]) : 0
        dataOp[name + 'Cls1'] = value > 0 ? 'fa fa-2x fa-star start_corlor' : 'fa fa-2x fa-star-o'
        dataOp[name + 'Cls2'] = value > 1 ? 'fa fa-2x fa-star start_corlor' : 'fa fa-2x fa-star-o'
        dataOp[name + 'Cls3'] = value > 2 ? 'fa fa-2x fa-star start_corlor' : 'fa fa-2x fa-star-o'
        dataOp[name + 'Cls4'] = value > 3 ? 'fa fa-2x fa-star start_corlor' : 'fa fa-2x fa-star-o'
        dataOp[name + 'Cls5'] = value > 4 ? 'fa fa-2x fa-star start_corlor' : 'fa fa-2x fa-star-o'
        dataOp.pgData[name] = value
        if (dataCal) {
          let columArray = dataCal.split('-')
          for (let i = 1; i < columArray.length; i++) {
            if (!dataOp.computedData[columArray[i]]) {
              dataOp.computedData[columArray[i]] = []
            }
            dataOp.computedData[columArray[i]].push(name)
          }
          let type = columArray.shift()
          dataOp.config[name] = {
            name,
            type,
            expression: columArray
          }
          return `<div>
        <span :class="${name + 'Cls1'}"></span>
        <span :class="${name + 'Cls2'}"></span>
        <span :class="${name + 'Cls3'}"></span>
        <span :class="${name + 'Cls4'}"></span>
        <span :class="${name + 'Cls5'}"></span></div>`
        } else {
          return `<div>
        <span @click="star(1, '${name}')" :class="${name + 'Cls1'}"></span>
        <span @click="star(2, '${name}')" :class="${name + 'Cls2'}"></span>
        <span @click="star(3, '${name}')" :class="${name + 'Cls3'}"></span>
        <span @click="star(4, '${name}')" :class="${name + 'Cls4'}"></span>
        <span @click="star(5, '${name}')" :class="${name + 'Cls5'}"></span></div>`
        }
      })
      // 创建模板对象
      let DdPgComponent = Vue.extend({
        template: '<div>' + html + '</div>',
        data () {
          return dataOp
        },
        methods: {
          // 计算步骤1
          calData (name) {
            if (this.computedData[name] && this.computedData[name].length > 0) {
              for (let i = 0; i < this.computedData[name].length; i++) {
                this.cal(this.computedData[name][i])
              }
            }
          },
          // 计算步骤2
          cal (col) {
            let config = this.config[col]
            if (config) {
              let expression = config.expression
              let type = config.type
              let columnLengh = expression.length
              let value = 0
              if (columnLengh > 0) {
                for (let i = 0; i < columnLengh; i++) {
                  value += parseInt(this.pgData[expression[i]])
                }
                switch (type.toUpperCase()) {
                  // case 'AVG' : value = Math.round(value / columnLengh, 2)
                  case 'AVG' : value = (value / columnLengh).toFixed(1)
                }
              }
              let targetName = config.name
              this.lightStar(targetName, value, 'fa fa-2x fa-star start_corlor')
              this.pgData[targetName] = value
            }
          },
          lightStar (name, n, clsIn) {
            for (let i = 1; i <= 5; i++) {
              if (i > n) {
                this[name + 'Cls' + i] = 'fa fa-2x fa-star-o'
              } else {
                this[name + 'Cls' + i] = clsIn
              }
            }
          },
          star (n, name, FZName) {
            let key = name + 'Cls' + n
            let cls = this[key]
            let clsIn = cls === 'fa fa-2x fa-star-o' ? 'fa fa-2x fa-star start_corlor' : 'fa fa-2x fa-star-o'
            this.pgData[name] = n * (cls === 'fa fa-2x fa-star-o' ? 1 : 0)
            this.lightStar(name, n, clsIn)
            // 算分
            this.calData(name)
          },
          saveData (pVue, cb = () => {}) {
            this.$kwz.ajax.ajaxUrl({
              url: 'jc_pgbzmx/doAddOrUpdate/DDJL',
              type: 'POST',
              data: {
                SJ: JSON.stringify(this.pgData),
                FZ: this.pgData.FenZhi,
                MXID: pVue.data.MXID,
                YWSJ: pVue.data.YWSJ
              },
              vue: this,
              then (response) {
                this.$kwz.alert('保存督导评估成功')
                pVue.ddpgShow = false
                if (typeof cb === 'function') {
                  cb.apply(pVue, [this])
                }
              }
            })
          }
        }
      })
      let ddPgComponent = new DdPgComponent()
      return ddPgComponent
    }
    return html
  },
  // 只将pc元素转换成打星星样式
  formatPgbzHtml (html, sj = {}) {
    if (html) {
      html = html.replace(/width=".*?"/gim, '')
      html = html.replace(/height=".*?"/gim, '')
      let i = 0
      // html = html.replace(/<input\s*type="text"\s*(data-cal="[A-Za-z0-9\\-]*" )?class="pgbz-data"\s*name="[A-Za-z0-9]*"\s*\/?>/gim, (a) => {
      html = html.replace(/<rate-yo[^<>]+>/gim, (a) => {
        // let name = KWVue.formatAttrFromTag(a, 'name')
        let oHtml = new DOMParser().parseFromString(html, 'text/xml')
        let rateYo = oHtml.querySelectorAll('rate-yo')[i]
        let name = rateYo.getAttribute('name')
        let value = sj[name] ? parseInt(sj[name]) : 0
        let vHtml = []
        vHtml.push('<span class="')
        vHtml.push(value > 0 ? 'fa fa-2x fa-star start_corlor' : 'fa fa-2x fa-star-o')
        vHtml.push('"></span><span class="')
        vHtml.push(value > 1 ? 'fa fa-2x fa-star start_corlor' : 'fa fa-2x fa-star-o')
        vHtml.push('"></span><span class="')
        vHtml.push(value > 2 ? 'fa fa-2x fa-star start_corlor' : 'fa fa-2x fa-star-o')
        vHtml.push('"></span><span class="')
        vHtml.push(value > 3 ? 'fa fa-2x fa-star start_corlor' : 'fa fa-2x fa-star-o')
        vHtml.push('"></span><span class="')
        vHtml.push(value > 4 ? 'fa fa-2x fa-star start_corlor' : 'fa fa-2x fa-star-o')
        vHtml.push('"></span>')
        return vHtml.join('')
      })
    }
    return html
  },
  // 日期格式化 日期格式 传入的时间 默认:yyyy-MM-dd格式/当前时间(月份传的时候要-1 想要12月传11进来)
  formatDate (fmt = 'yyyy-MM-dd', date = new Date()) {
    date = new Date(date)
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  },
  // 返回指定日期 年 月 日 日期格式 d不能为0
  getLimdat (impose, format) {
    let _y = parseInt(impose.y)
    let _m = parseInt(impose.M)
    let _d = parseInt(impose.d)
    let date = new Date(Date.parse(new Date((new Date().getFullYear() + _y), (new Date().getMonth()) + _m, new Date().getDate())) + (86400000 * _d))
    date = KWVue.formatDate(format, date)
    return date
  },
  // 返回限制的日期参数 功能id vue对象
  dateImpose (url, vue) {
    let getAttrs = () => {
      let menus = vue.$store.state.menus
      for (let arrs of menus) { // arrs代表每个应用
        for (let arr of arrs.children) { // arr代表应用中的每个功能
          if (arr.PRO_ID === url) {
            if (typeof arr.PRO_ATTRS === 'object') { // 没配限制日期返回null,给他前后1年
              arr.PRO_ATTRS = {
                minDate: '{"y":"-1","M":"0","d":"0"}',
                maxDate: '{"y":"1","M":"0","d":"0"}'
              }
              return arr.PRO_ATTRS
            }
            let proAttrs = JSON.parse(arr.PRO_ATTRS)
            proAttrs.minDate = typeof proAttrs.minDate === 'undefined' ? '{"y":"-1","M":"0","d":"0"}' : proAttrs.minDate
            proAttrs.maxDate = typeof proAttrs.maxDate === 'undefined' ? '{"y":"1","M":"0","d":"0"}' : proAttrs.maxDate
            return proAttrs
          }
        }
      }
    }
    if (!vue.$store.state.menus.length) {
      KWVue.loadMenus(vue)
    } else {
      return getAttrs()
    }
  },
  // 权限判定 权限路径 vue对象
  hasAuth (url, vue) {
    if (vue && vue.$store) {
      if (!vue.$store.state.auths) {
        KWVue.loadMenus(vue)
      }
      let auths = vue.$store.state.auths
      return !!auths && auths.indexOf(url) > -1
    }
    return false
  },
  loadMenus (vue) {
    KWVue.ajax.ajaxUrl({
      url: 'open/loadMenus',
      type: 'POST',
      then (response) {
        let data = response.data.datas
        if (data && data.writePath) { vue.$store.dispatch('auths', data.writePath) }
        if (data && data._menus_.children) {
          vue.$store.dispatch('menus', data._menus_.children)
        }
      }
    })
  }
}

KWVue.initVisit()
KWVue.initToken()

export default KWVue
