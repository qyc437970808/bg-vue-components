<template>
  <div>
    <button>{{loadingText}}</button>
  </div>
</template>

<script>
  import {t} from 'bg-vue-components/lib/locale';
  console.log('t:', t, t('bg.loading'));
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