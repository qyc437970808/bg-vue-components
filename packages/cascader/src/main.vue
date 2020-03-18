<template>
  <el-cascader
    :popper-class="isFirefox ? 'c-crm-cascader fireFox-hack' : 'c-crm-cascader'"
    :value="selectedValue"
    :filter-method="filterCustom"
    :props="newAttr"
    :placeholder="t('bg.search')"
    size="mini"
    clearable
    :options="actualOptions"
    @change="changeHandler"
    filterable></el-cascader>
</template>

<script>
import {
  HistoryStorage,
  USUAL_KEY
} from 'bg-vue-components/src/utils/history';
import { deepClone, cecursion } from "bg-vue-components/src/utils/util";
import {t} from 'bg-vue-components/src/locale';

const usualOptionsNum = 15; // 常用选项的个数
export default {
  name: 'BgCascader',
  props: [
    'options',
    'value', // value是一个对象 {label: '', value: ''}
    'requestTime',
    'memoryName',
    'filterMethod',
    'attr'
  ],
  methods: {
    t,

    changeHandler(val) {
      this.$emit('input', val);
      this.$emit('change', val);
    },
    initUsual() {
      this.historyStorage = new HistoryStorage({
        name: this.memoryName
      });
    },
    updateHistoryStorage() {
      const key = this.selectedValue[this.selectedValue.length - 1].value;
      // 过滤掉有children的
      this.historyStorage.update([key]);
    },
    /**
     * @description: 得到带有常用选项的options
     * @param {Object} crmCascaderHistory localStorage里存放的对象
     * @return: 
     */
    getOptionsWidthUsually(historyArr) {
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

      // 组装数据结构
      const res = [
        {
          label: this.t('bg.usualSelectLabel'),
          value: {
            label: this.t('bg.usualSelectLabel'),
            value: USUAL_KEY
          },
          children: usuallyOptions
        },
        ...this.formatOptions
      ];
      return res;
    },
    /**
     * @description: 设置当前optionsWithUsually的值
     */
    setOptionsWithUsually() {
      const usualKeys = this.historyStorage.get(usualOptionsNum);
      if (!usualKeys || usualKeys.length === 0) {
        return;
      }
      // 加上常用选择
      this.optionsWithUsually = this.getOptionsWidthUsually(usualKeys);
    }
  },
  data() {
    return {
      selectedValue: [],
      optionsWithUsually: [],
      historyStorage: null,
      usualKeys: []
    }
  },
  watch: {
    value(val) {
      this.selectedValue = val;
    },
    /**
     * @description: 该数据变化会触发常用数据的收集
     */
    requestTime(val) {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        return;
      }

      this.updateHistoryStorage();
      this.setOptionsWithUsually();

      if (this.selectedValue.findIndex(item => item.value === USUAL_KEY) > -1) {
        let res = [];
        this.selectedValue.forEach(item => {
          cecursion(this.actualOptions, (option) => {
            if (option.value.value === item.value) {
              res.push(option.value);
            }
          })
        });
        // 修复选择了常用选项，然后触发historyStorage.set()时的清空问题
        this.selectedValue = res;
      }
    },
    formatOptions(val) {
      this.setOptionsWithUsually();
    }
  },
  computed: {
    filterCustom() {
      return this.filterMethod;
    },

    newAttr() {
      return this.attr;
    },

    /**
     * @description: 实际用的otions
     */
    actualOptions() {
      if (this.optionsWithUsually && this.optionsWithUsually.length !== 0) {
        return this.optionsWithUsually;
      } else {
        return this.formatOptions;
      }
    },
    /**
     * @description: 把传入的options进行处理，让组件可用
     */
    formatOptions() {
      const result = deepClone(this.options);
      /**
       * 递归处理数据 1.去掉为空数组的属性children 2.叶子节点加上displayLabel 3.每个节点value转化为一个对象
       */
      const handler = (data) => {
        data.forEach((item) => {
          item.label = item.problemName;
          item.value = item.mailProblemLabelId
          if (item.children && item.children.length === 0) {
            delete item.children
          }
          if (item.children) {
            handler(item.children);
          } 
        });
      }
      handler(result);
      return result;
    },

    /**
     * @description: 是否火狐
     * @param {type} 
     * @return: 
     */
    isFirefox() {
      try {
        return navigator.userAgent.includes('Firefox')
      } catch(e) {
        return false
      }
    }
  },
  created() {
    this.selectedValue = this.value;
  },
  mounted() {
    this.initUsual();

    if (this.formatOptions && this.formatOptions.length > 0) {
      this.setOptionsWithUsually();
    }
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