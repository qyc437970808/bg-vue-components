<template>
  <!-- <el-cascader
    :popper-class="browser ? 'c-crm-cascader fireFox-hack' : 'c-crm-cascader'"
    :value="selectedValue"
    :placeholder="t('bg.search')"
    size="mini"
    clearable
    :options="actualOptions"
    @change="changeHandler"
    filterable></el-cascader> -->
  <div></div>
</template>

<script>
import Storage from 'bg-vue-components/src/utils/localStorage'
import { deepClone } from "bg-vue-components/src/utils/util";
import {t} from 'bg-vue-components/src/locale';

const usualOptionsNum = 15; // 常用选项的个数
export default {
  props: [
    'options',
    'value', // value是一个对象 {label: '', value: ''}
    'requestTime'
  ],
  methods: {
    t,

    changeHandler(val) {
      this.$emit('input', val);
      this.$emit('change', val);
    },
    /**
     * 得到带有常用选项的options
     */
    getOptionsWidthUsually(crmCascaderHistory) {
      // 排序 把使用频率高的放在前面
      const historyArr= Object.keys(crmCascaderHistory).sort((a, b) => {
        return crmCascaderHistory[b] - crmCascaderHistory[a];
      });
      const result = {};
      /**
       * historyArr存下的数据并不全部有效，有些数据不在当前options里。
       * 该函数把historyArr转换为当前组件有效的一个数据对象。
       */
      const handler = (data) => {
        data.forEach((item) => {

          if (item.children) {
            handler(item.children);
          } else {
            // value值
            const value = item.value.value;
            if (historyArr.includes(value)) {
              result[value] = {
                label: item.value.label,
                value: item.value
              }
            }
          }
        });
      };
      handler(this.formatOptions);
      const usuallyOptions = historyArr.map((key) => {
        if (result[key]) {
          return result[key];
        }
        return null;
      }) // 数组转化为对象数组
      .filter(item => item !== null) // 过滤掉不在当前options的
      .slice(0, usualOptionsNum); // 只取前15个

      // 组装数据结构
      const res = [
        {
          label: this.t('bg.usualSelectLabel'),
          value: {
            label: this.t('bg.usualSelectLabel'),
            value: 'usually'
          },
          children: usuallyOptions
        },
        ...this.formatOptions
      ];
      return res;
    },
    /**
     * 设置当前optionsWithUsually的值
     */
    setOptionsWithUsually() {
      let storage = Storage.getInfo('crmComponentsHistory');
      if (Object.prototype.toString.call(storage) !== '[object Object]') {
        storage = {};
      }
      if (!storage.crmCascader || Object.keys(storage.crmCascader).length === 0) {
        return;
      }
      // 加上常用选择
      this.optionsWithUsually = this.getOptionsWidthUsually(storage.crmCascader);
    }
  },
  data() {
    return {
      selectedValue: [],
      optionsWithUsually: []
    }
  },
  watch: {
    value(val) {
      this.selectedValue = val;
    },
    /**
     * 该数据变化会触发常用数据的收集
     */
    requestTime(val) {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        return;
      }

      let storage = Storage.getInfo('crmComponentsHistory');
      if (Object.prototype.toString.call(storage) !== '[object Object]') {
        storage = {};
      }
      if (!storage.crmCascader) {
        storage.crmCascader = {}
      }
      const key = this.selectedValue[this.selectedValue.length - 1].value;
      storage.crmCascader[key] = storage.crmCascader[key] || 0;
      storage.crmCascader[key] ++;
      Storage.set('crmComponentsHistory', storage);
      this.optionsWithUsually = this.getOptionsWidthUsually(storage.crmCascader);
    },
    formatOptions(val) {
      this.setOptionsWithUsually();
    }
  },
  computed: {
    /**
     * 实际用的otions
     */
    actualOptions() {
      if (this.optionsWithUsually && this.optionsWithUsually.length !== 0) {
        return this.optionsWithUsually;
      } else {
        return this.formatOptions;
      }
    },
    /**
     * 把传入的options进行处理，让组件可用
     */
    formatOptions() {
      const result = deepClone(this.options);
      /**
       * 递归处理数据 1.去掉为空数组的属性children 2.叶子节点加上displayLabel 3.每个节点value转化为一个对象
       */
      const handler = (data, extendLabelArr = []) => {
        data.forEach((item) => {
          let labelArr = [];
          item.label = item.problemName;
          item.value = {
            value: item.mailProblemLabelId,
            label: item.problemName
          };
          labelArr = [...extendLabelArr, item.problemName]
          if (item.children && item.children.length === 0) {
            delete item.children
          }
          if (item.children) {
            handler(item.children, labelArr);
          } else {
            item.value.displayLabel = labelArr.join('/');
          }
        });
      }
      handler(result);
      return result;
    },

    browser() {
      console.log('browser', navigator.userAgent);
      return navigator.userAgent.includes('Firefox')
    }
  },
  created() {
    // this.selectedValue = this.value;

    // if (this.formatOptions && this.formatOptions.length > 0) {
    //   this.setOptionsWithUsually();
    // }
  }
}
</script>
<style lang="scss">
.c-crm-cascader {
  .el-cascader-menu__item--extensible:after {
    font-weight: bolder;
    color: #000000a6;
  }
}
.fireFox-hack {
  .el-cascader-menu {
    .el-cascader-menu__item {
      /*overflow-x: auto;*/
      width: calc(100% + 17px);
    }
  }
}
</style>


