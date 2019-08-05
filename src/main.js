// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import store from './store/index'
import bgComponents from 'bg-vue-components/packages';
import VueI18n from 'vue-i18n';
import * as Locale from 'bg-vue-components/src/locale';
import enLocale from 'bg-vue-components/src/locale/en';
import zhLocale from 'bg-vue-components/src/locale/zh';
import {
  Select,
  Input,
  Button,
  Cascader,
  Tag,
  Dialog,
  Form,
  FormItem,
  Option,
  Loading
} from 'element-ui';

// Vue.use(VueI18n)
Vue.use(Loading.directive);
Vue.use(Option);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Dialog);
Vue.use(Select);
Vue.use(Input);
Vue.use(Button);
Vue.use(Tag);
Vue.use(Cascader);
const messages = {
  en: {
    ...enLocale
  },
  zh: {
    ...zhLocale
  }
}
// const i18n = new VueI18n({
//   locale: 'zh',
//   messages
// });


// Locale.i18n((key, value) => i18n.t(key, value))
Vue.use(bgComponents)

// 看看配置会不会生效
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  // i18n,
  router,
  store,
  components: { App },
  template: '<App/>'
})
