<template>
  <section>
    <div>
      在element的cascader基础上增加了常用选择的功能。 依赖element的cascader
    </div>
    <bg-cascader
      :options="options"
      v-model="value"
      :memoryName="'bg-cascader'"
    ></bg-cascader>
  </section>
</template>

<script>
export default {
  data() {
    return {
      value: [],
      options: [
      ]
    }
  }
}
</script>

