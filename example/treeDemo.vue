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

