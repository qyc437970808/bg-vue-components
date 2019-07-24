<template>
  <section class="c-tree-select-2">
    <div class="input-contain">
      <el-input
        v-model="inputValue"
        size="mini"
      >
      </el-input>
      <el-button class="btn btn-selectAll"
        :disabled="inputValue !== ''"
        @click="selectAllHandler"
        size="mini">{{t('bg.selectAll')}}</el-button>
      <el-button class="btn btn-clear"
        @click="clearHandler"
        size="mini">{{t('bg.clear')}}</el-button>
    </div>
    <tag-group
      class="tag-group"
      :data="tagData" @close="tagClose">
    </tag-group>
    <div class="el-tree-contain" :class="{'label-ellipsis': labelEllipsis}">
      <crm-tree
        ref="tree"
        class="vue-tree-repeatable"
        node-key="id"
        :data="options"
        :usual-keys="usualKeys"
        filter
        highlight-current
        :filter-node-method="filterNode"
        :usual-label="t('bg.treesSelect.usualSelectLabel')"
        :empty-text="emptyText"
        show-checkbox
        @check-change="checkChangeHandler"
        @current-change="currentChangeHandler"
        @node-click="nodeClickHandler"
        @check="checkHandler"
      >
        <span slot-scope="{ node, data}" v-html="getNodeRenderHtml(data)">
        </span>
      </crm-tree>
    </div>
  </section>
</template>

<script>
import { debounce, cecursion } from 'bg-vue-components/src/utils/util';
import TagGroup from './components/tagGroup';
import FormMixins from 'bg-vue-components/src/mixins/form';
import usually from './mixins/usually';
import CrmTree from '../../tree/src/main';
import {t} from 'bg-vue-components/src/locale';

const DELAYTIME = 300;
const LARGET_LEGTH = 300; // 300是数量多与少的分界线
export default {
  name: 'BgTreeSelect',
  mixins: [FormMixins, usually],
  components: {
    TagGroup,
    CrmTree
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    options: Array,
    memoryName: String, // 用于区分每个实例
    labelEllipsis: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    /**
     * @description: 如果options为空，返回加载中，如果是有数据但搜索为空，返回无数据
     * @param {type} 
     * @return: 
     */
    emptyText() {
      if (this.options.length > 0) {
        return this.t('bg.searchNoData');
      } else {
        return this.t('bg.loading')
      }
    }
  },

  watch: {
    inputValue(val) {
      this.regExp = new RegExp(val, 'ig');
      this.treeFilterHandler(val);
    },
    treeSelectedItem() {
      this.updateOutPutData();
    },
    value() {
      if (this.dataUpdateing) {
        this.dataUpdateing = false;
        return;
      }
      this.updateTreeStatus(this.value);
    }
  },

  created() {
    this.initUsual();
    if (this.value && this.value.length > 0) {
      this.$nextTick(() => {
        this.updateTreeStatus(this.value);
      });
    }
  },
  data() {
    this.treeFilterHandler = debounce((val) => {
      this.$refs.tree.filter(val);
      this.$refs.tree.updateUsualTreeExpand();
    }, 300);
    return {
      dataUpdateing: false,
      usualKeys: [],
      formatOptions: [], // 经过适配处理后的options
      inputValue: '', // input输入的值
      treeSelectedItem: [], // 当前选中的item
      tagData: [], // 显示的tag
      regExp: null
    };
  },
  methods: {
    t,
    /**
     * @description: tag标签点击关闭的钩子函数
     * @param { Object } target 目标对象 
     */
    tagClose(target) {
      const ref = this.$refs['tree'];
      ref.setChecked(target, false, true);
      this.treeSelectedItem = ref.getCheckedNodes();
    },
    /**
     * @description: 节点渲染函数
     * @param {Object} 节点的数据
     * @return: 
     */
    getNodeRenderHtml(data) {
      if (!this.regExp) {
        return data.label;
      }
      const label = data.label.replace(this.regExp, (replacement) => `<span class="keword-mark">${replacement}</span>`);
      return label;
    },
    /**
     * @description: 更新当前树形控件的选中情况
     * @param {type} 
     * @return: 
     */
    updateTreeStatus(value) {
      const treeEl = this.$refs['tree'];
      treeEl.setCheckedKeys(value);
      this.treeSelectedItem = treeEl.getCheckedNodes();
      this.tagData = this.getTagData(this.treeSelectedItem);
    },
    /**
     * @description: 搜索方法
     * @param {string} val 搜索关键字 
     * @return: 
     */
    treeFilterHandler() {},
    checkChangeHandler(node, checked, params3) {
      return;
    },
    checkHandler(node, obj) {
      this.treeSelectedItem = obj.checkedNodes;
    },
    /**
     * @description: 通过一个父节点列表获取所有子节点的id
     * @param {Arrary} parentArr 
     * @return: 
     */
    getIdsByParentArr(parentArr) {
      let childrenItemArr = [];
      parentArr.forEach((parent) => {
        childrenItemArr = [
          ...childrenItemArr,
          ...parent.children
        ]
      })
      
      return childrenItemArr;
    },
    /**
     * @description: 获取可输送外部的数据。为了去除一些重复id
     * @param {Array} arr 
     * @return: result 结果数据
     */
    getTagData(arr = []) {
      const parentArr = arr.filter(parent => parent.children);
      const childrenItemArr = this.getIdsByParentArr(parentArr);
      // 需要过滤的children的id，另外加上常用选择
      const childrenIdArr = childrenItemArr.map(item => item.id);
      const result = arr.filter(item => !childrenIdArr.includes(item.id));
      return result;
    },
    /**
     * @description: 获取emit到外部的数据
     * @param {Array} 
     * @return: 
     */
    getEmitData(arr = []) {
      const parentArr = arr.filter(parent => parent.children && !parent.useChildrenId);
      const childrenItemArr = this.getIdsByParentArr(parentArr);
      const childrenIdArr = childrenItemArr.map(item => item.id);
      const idToFilter = [
        ...childrenIdArr,
        ...arr.filter(item => item.useChildrenId).map(item => item.id)
      ];
      const result = arr.filter(item => !idToFilter.includes(item.id));
      return result;
    },
    /**
     * @description: 更新tagGroup的数据，更新外部的v-model的数据
     */
    updateOutPutData() {
      this.dataUpdateing = true;
      const ids = this.getEmitData(this.treeSelectedItem).map(item => item.id);
      this.$emit('input', ids);
      this.tagData = this.getTagData(this.treeSelectedItem);
    },
    nodeClickHandler(params1, params2, params3) {
    },
    currentChangeHandler(data, node) {
    },
    /**
     * @description: 懒加载，展开收起有卡顿，当前不太适合
     * @param {Object} node 节点
     * @param {Function} resolve 类似Promise中的resolve
     */
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.options);
      }
      const data = node.data;
      if (data && data.children && data.children.length > 0) {
        return resolve(data.children);
      }
    },
    /**
     * @description: 全选
     */
    selectAllHandler() {
      // if ()
      let arr = [];
      cecursion(this.options, (item) => {
        arr.push(item);
      });
      this.options.forEach(item => {
        this.$refs['tree'].setChecked(item, true, true);
      });
      this.treeSelectedItem = arr;
    },
    /**
     * @description: 清空
     */
    clearHandler() {
      this.options.forEach(item => {
        this.$refs['tree'].setChecked(item, false, true);
      });
      this.treeSelectedItem = [];
    },
    /**
     * @description: 对树节点进行筛选时执行的方法，
     * 返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    }
  }
};
</script>

<style lang="scss">
.vue-tree-repeatable {
  .keword-mark {
    background-color: yellow;
  }
}
</style>

<style lang="scss" scoped>
.c-tree-select-2 {
  padding-right: 20px;
  .top-slot {

  }
  // max-height: 400px; 
  .el-tree-contain {
    margin-top: 10px;
    max-height: 400px;
    overflow: auto;
    &.label-ellipsis {
      .el-tree-node__label {
        max-width: 400px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
  .input-contain {
    display: flex;
    align-items: center;
    .btn {
      margin-left: 5px;
    }
  }
  .tag-group {
    margin-top: 10px;
  }
}
</style>
