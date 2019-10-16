import polyfill from './polyfill-ie'
import buildInModules from './modules/index' // 引入具体功能模块
import editor from './editor' // 引入处理editro.html模板的js
import i18nZhCn from './i18n/zh-cn' // 引入语言翻译
import i18nEnUs from './i18n/en-us'
import mixin from './util/mixin'

polyfill()

/**
 * Vue html5 Editor
 * @param Vue   {Vue}
 * @param options {Object}
 */
class VueHtml5Editor {

  /**
   * build an editor component
   */
  constructor(options = {}) {
    // 结构引入的buildInModules数组，将其赋给modules
    let modules = [...buildInModules]
    const components = {}

    // 如果options.modules是数组 一般是对象，暂不知道什么时候是数组
    if (Array.isArray(options.modules)) {
      // 循环遍历出modules
      options.modules.forEach((module) => {
        // 如果module有name属性则把module添加进modules
        if (module.name) {
          modules.push(module)
        }
      })
    }
    // 如果options.hiddenModules是数组 hidden modules
    if (Array.isArray(options.hiddenModules)) {
      modules = (() => {
        const arr = []
        // 循环遍历出modules
        modules.forEach((m) => {
          if (!options.hiddenModules.includes(m.name)) {
            arr.push(m)
          }
        })
        return arr
      })()
    }
    // 如果options.hiddenModules是数组 根据name来判断用户要显示哪些功能 visible modules
    if (Array.isArray(options.visibleModules)) {
      modules = (() => {
        const arr = []
        modules.forEach((module) => {
          //如果名字一样就添加进arr
          if (options.visibleModules.includes(module.name)) {
            arr.push(module)
          }
        })
        return arr
      })()
    }

    // 便利出最后要显示的功能
    modules.forEach((module) => {
      // 根据名称指定每个模块的配置
      const config = options[module.name]
      module.config = mixin(module.config, config)

      // module.dashboard 功能块的隐藏区域
      if (module.dashboard) {
        // $options.module
        module.dashboard.module = module
        components[`dashboard-${module.name}`] = module.dashboard
      }
      if (options.icons && options.icons[module.name]) {
        module.icon = options.icons[module.name]
      }

      // 给图标添加点击事件 控制功能操作区域显示隐藏
      module.hasDashboard = !!module.dashboard
      // prevent vue sync
      // module.dashboard = null
    })

    // i18n
    const i18n = {'zh-cn': i18nZhCn, 'en-us': i18nEnUs}
    const customI18n = options.i18n || {}
    Object.keys(customI18n).forEach((key) => {
      i18n[key] = i18n[key] ? mixin(i18n[key], customI18n[key]) : customI18n[key]
    })
    const language = options.language || 'en-us'
    const locale = i18n[language]

    // showModuleName
    const defaultShowModuleName = !!options.showModuleName

    // ######################################
    const compo = mixin(editor, {
      data() {
        return {modules, locale, defaultShowModuleName}
      },
      components
    })
    mixin(this, compo)
  }

  /**
   * global install
   *
   * @param Vue
   * @param options
   */
  static install(Vue, options = {}) {
    Vue.component(options.name || 'vue-html5-editor', new VueHtml5Editor(options))
  }
}

export default VueHtml5Editor
