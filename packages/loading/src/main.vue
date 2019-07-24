<template>
  <div>
    <button>{{loadingText}}</button>
  </div>
</template>

<script>
  import {t} from 'bg-vue-components/src/locale';
  export default {
      name: "BgLoading",
      computed: {
        loadingText() {
          return t('bg.loading')
        }
      }
  }
</script>

<style>

</style>