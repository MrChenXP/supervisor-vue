import KWVue from '../../lib/kwz.vue'

export default {
  install (Vue) {
    Vue.prototype.$kwz = KWVue
    Vue.kwz = KWVue
  },
  $kwz: KWVue
}

export const $kwz = KWVue
