// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import store from './store/index'
import bgComponents from 'bg-vue-components/packages';
import VueI18n from 'vue-i18n';
import * as Locale from 'bg-vue-components/lib/locale';
import enLocale from 'bg-vue-components/lib/en';
import zhLocale from 'bg-vue-components/lib/zh';
console.log('bgComponents');

Vue.use(VueI18n)
const messages = {
  en: {
    ...enLocale
  },
  zh: {
    ...zhLocale
  }
}
console.log('VueI18n:', VueI18n);
const i18n = new VueI18n({
  locale: 'zh',
  messages
})


Locale.i18n((key, value) => i18n.t(key, value))
console.log('bgComponents:', bgComponents);
Vue.use(bgComponents)

// 看看配置会不会生效
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: { App },
  template: '<App/>'
})
