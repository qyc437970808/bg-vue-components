<template>
  <section>
    <div style="width: 600px">
      <bg-tree-select
        :options="options"
        v-model="value"
        :memoryName="'bg-tree-select'"
      ></bg-tree-select>
    </div>
    <div>
      <button @click="saveUsual">触发保存到常用选择</button>
    </div>
  </section>
</template>

<script>
import {
  historyStorageEmit
} from 'bg-vue-components/src/utils/history';
export default {
  methods: {
    saveUsual() {
      historyStorageEmit();
    }
  },
  data() {
    return {
      value: [],
      options: [
        {
          id: 'p1',
          label: 'p1',
          children: [
            {
              id: 'c1',
              label: 'c1'
            }
          ]
        },
        {
          id: 'p2',
          label: 'p2',
          children: [
            {
              id: 'c2',
              label: 'c2'
            }
          ]
        }
      ]
    }
  }
}
</script>

