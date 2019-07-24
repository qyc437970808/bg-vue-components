<template>
  <section class="c-tag-group">
    <el-tag
      class="item"
      type="info"
      size="small"
      v-for="item in data"
      :key="item.id"
      @close="closeHandler(item)"
      closable
    >{{item.label}}</el-tag>
  </section>
</template>

<script>
import {
  Tag
} from 'element-ui';
export default {
  props: ['data'],
  methods: {
    closeHandler(item) {
      this.$emit('close', item);
    }
  },
  components: {
    'el-tag': Tag
  }
}
</script>
<style lang="scss" scoped>
.c-tag-group {
  max-height: 56px;
  overflow-y: auto;
  .item {
    margin-right: 2px;
    margin-bottom: 2px;
  }
}
</style>


