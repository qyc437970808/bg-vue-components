import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import app from './modules/app';

Vue.use(Vuex)
// modules
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    app
  }
})
export default store
