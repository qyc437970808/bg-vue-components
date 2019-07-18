import Vue from 'vue'
import App from './App.vue'
import bgComponents from '../packages/index';

Vue.use(bgComponents.install);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
