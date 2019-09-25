export default {
  state: {
    lang: ''
  },
  mutations: {
    TOGGLE_LANG: (state, lang) => {
      state.lang = lang
    }
  }
}