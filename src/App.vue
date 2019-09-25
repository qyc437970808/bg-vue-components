<template>
  <div id="app">
    <div class="top">
      <label>当前语言：{{language}}</label>
      <button @click="languageSwitch">切换语言</button>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      language: 'zh'
    }
  },
  methods: {
    languageSwitch() {
      if (this.language === 'zh') {
        this.$i18n.locale = 'en';
        this.language = 'en'
      } else {
        this.$i18n.locale = 'zh';
        this.language = 'zh'
      }
      this.$store.commit('TOGGLE_LANG', this.language);
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.top {
  display: flex;
  justify-content: flex-end;
  label {
    margin-right: 60px;
  }
}
</style>