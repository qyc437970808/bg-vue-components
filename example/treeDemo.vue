<template>
  <section>
    <bg-tree-select
      :options="options"
      v-model="value"
      :memoryName="'treeDemo'"
    ></bg-tree-select>
  </section>
</template>

<script>
export default {
  data() {
    return {
      value: [],
      options: [
        {
          id: 'p1',
          label: 'p1',
          chidlren: [
            {
              id: 'c1',
              label: 'c1'
            }
          ]
        },
        {
          id: 'p2',
          label: 'p2',
          chidlren: [
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

