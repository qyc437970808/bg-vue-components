<template>
  <el-dialog
    :visible="visible"
    :title="schema.title"
    v-dialog-drag
    custom-class="bg-dialog"
    @close="closeHandler"
  >
    <section class="body-box" v-loading="isLoading">

      <slot name="body" :data="dialogData"></slot>

      <div class="bottom-btn-group" v-if="!isLoading">
        <el-button @click="closeHandler">取消</el-button>
        <el-button @click="sendHandler" type="primary">提交</el-button>
      </div>
    </section>
  </el-dialog>
</template>

<script>
export default {
  name: 'BgDialog',
  data() {
    return {
      isLoading: false,
      dialogData: {}
    }
  },
  props: {
    schema: Object,
    visible: Boolean
  },
  watch: {
    visible(val) {
      if (val) {
        this.initBySchema();
        if (this.schema.values && !this.schema.noReset) {
          this.schema.values.forEach(item => {
            this.dialogData[item.name] = item.value || '';
          });
        }
      }
    }
  },
  methods: {
    closeHandler() {
      this.$emit('close');
    },
    sendHandler() {
      this.$emit('send', this.dialogData);
    },
    async initBySchema() {
      this.isLoading = true;
      const res = await this.getDialogData();
      this.isLoading = false;
      this.$emit('loadingFinish');
      if (res) {
        this.dialogData = res;
      }
    },
    async getDialogData() {
      if (!this.schema) {
        return;
      }
      const schema = this.schema;
      const result = {};

      if (schema.options) {
        for (let item of schema.options) {
          if (item.cache) {
            result[item.name] = item.cache;
          } else {
            result[item.name] = [];

            const res = await item.handler();
            result[item.name] = res;
            item.cache = res;
          }
        }
      }

      if (schema.values) {
        schema.values.forEach(value => {
          result[value.name] = value.value || '';
        });
      }

      return result;
    }
  },
  created() {
    if (this.visible) {
      this.initBySchema()
    }
  }
}
</script>

<style lang="scss">
.bg-dialog {
  .el-dialog__body {
    overflow: auto;
    max-height: 600px;
    // &::after {
    //   display: block;
    //   content: '';
    //   height: 36px;
    //   width: 100%;
    //   margin-top: 20px;
    // }
  }
  .body-box {
    &::after {
      margin-top: 12px;
      display: block;
      content: '';
      height: 36px;
      width: 100%;
      margin-top: 20px;
    }
  }
  .bottom-btn-group {
    position: absolute;
    text-align: right;
    bottom: 0;
    left: 0;
    width: 100%;
    // height: 36px;
    padding: 0 20px 30px 20px;
    background: #fff;
    text-align: right;
    box-sizing: border-box;
  }
}
</style>

