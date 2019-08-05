<template>
  <section>
    <el-button @click="openHandler">打开dialog</el-button>

    <bg-dialog
      :schema="schema"
      :visible="visible"
      @close="visible = false"
    >
      <template slot="body" slot-scope="{data}">
        <div>
          <div style="padding-bottom: 20px;">{{data}}</div>
          <el-form>
            <el-form-item label="111">
              <el-select v-model="data.value1">
                <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in data.option1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="222">
              <el-select v-model="data.value2">
                <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in data.option2"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div style="height: 500px;">slot</div>
        </div>
      </template>
    </bg-dialog>

  </section>
</template>

<script>
export default {
  watch: {
    visible() {
      console.log('visible:', this.visible);

    }
  },
  methods: {
    openHandler() {
      this.visible = true;
    }
  },
  data() {
    return {
      visible: true,
      schema: {
        title: 'bg-vue-component',
        options: [
          {
            name: 'option1',
            async handler() {
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve([
                    {
                      label: '1',
                      value: '1'
                    }
                  ])
                }, 1000);
              })
            }
          },
          {
            name: 'option2',
            async handler() {
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve([
                    {
                      label: '2',
                      value: '2'
                    }
                  ])
                }, 1000);
              })
            }
          }
        ],
        values: [
          {
            name: 'value1'
          },
          {
            name: 'value2'
          }
        ]
      }
    }
  }
}
</script>

