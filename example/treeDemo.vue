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

    <div>
      <span>输出的结果：</span>
      <span>{{value}}</span>
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
  computed: {
    lang() {
      return this.$store.getters.lang;
    },
    options() {
      const isEn = this.lang === 'en';
      return [
        {
          id: 'p1',
          label: isEn ? 'p1' : '父1',
          showCheckbox: false,
          children: [
            {
              id: 'c1',
              label: isEn ? 'c1' : '子1'
            }
          ]
        },
        {
          id: 'p2',
          label: isEn ? 'p2' : '父2',
          children: [
            {
              id: 'c2',
              label: isEn ? 'c2' : '子2'
            }
          ]
        }
      ];
    }
  },
  data() {
    return {
      value: [],
      // options: [
      //   {
      //     id: 'p1',
      //     label: 'p1',
      //     showCheckbox: false,
      //     children: [
      //       {
      //         id: 'c1',
      //         label: 'c1'
      //       }
      //     ]
      //   },
      //   {
      //     id: 'p2',
      //     label: 'p2',
      //     children: [
      //       {
      //         id: 'c2',
      //         label: 'c2'
      //       }
      //     ]
      //   }
      // ]
    }
  }
}
</script>

