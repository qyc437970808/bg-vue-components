<template>
  <div
    class="el-tree"
    :class="{
      'el-tree--highlight-current': highlightCurrent,
      'is-dragging': !!dragState.draggingNode,
      'is-drop-not-allow': !dragState.allowDrop,
      'is-drop-inner': dragState.dropType === 'inner'
    }"
    role="tree"
  >
    <!-- 常用选择 -->
    <template v-if="usualTreeStore">
      <el-tree-node
        ref="usual"
        :node="usualTreeStore.root.childNodes[0]"
        :props="props"
        :render-after-expand="renderAfterExpand"
        :show-checkbox="showCheckbox"
        :key="getNodeKey(usualTreeStore.root.childNodes[0])"
        :render-content="renderContent"
        @node-expand="handleNodeExpand">
      </el-tree-node>
    </template>

    <el-tree-node
      v-for="child in root.childNodes"
      :node="child"
      :props="props"
      :render-after-expand="renderAfterExpand"
      :show-checkbox="showCheckbox"
      :key="getNodeKey(child)"
      :render-content="renderContent"
      @node-expand="handleNodeExpand">
    </el-tree-node>
    <div class="el-tree__empty-block" v-if="isEmpty">
      <span class="el-tree__empty-text">{{ emptyText }}</span>
    </div>
    <div
      v-show="dragState.showDropIndicator"
      class="el-tree__drop-indicator"
      ref="dropIndicator">
    </div>
  </div>
</template>

<script>
  import TreeStore from './model/tree-store';
  import { getNodeKey, findNearestComponent, USUAL_KEY } from './model/util';
  import ElTreeNode from './tree-node.vue';
  import {t} from 'bg-vue-components/src/locale';
  import emitter from 'element-ui/src/mixins/emitter';
  import { addClass, removeClass } from 'element-ui/src/utils/dom';
  import debounce from 'lodash.debounce';
  export default {
    name: 'Tree',

    mixins: [emitter],

    components: {
      ElTreeNode
    },

    data() {
      this.updateUsualTreeParent = debounce((keys) => {
        let checkedKeys = keys;
        if (!keys) {
          checkedKeys = this.store.getCheckedKeys();
        }

        if (checkedKeys.length > 0 && this.usualKeys.length > 0) {
          // 如果常用选择里的选项都选择了
          if (this.usualKeys.length > 0 && this.usualKeys.every(id => {
            return checkedKeys.includes(id);
          })) {
            this.usualTreeStore.setChecked(USUAL_KEY, true);
          } else {
            this.usualTreeStore.setChecked(USUAL_KEY, false);
          }
        } else {
          this.usualTreeStore.setChecked(USUAL_KEY, false);
        }
      }, 0);
      return {
        store: null,
        root: null,
        currentNode: null,
        treeItems: null,
        checkboxItems: [],
        dragState: {
          showDropIndicator: false,
          draggingNode: null,
          dropNode: null,
          allowDrop: true
        },
        usualTreeStore: null,

        checkedKeys: [], // 当前选择了的keys
      };
    },

    props: {
      usualLabel: {
        default: '常用选择'
      },
      usualKeys: {
        type: Array,
        default: () => []
      },
      data: {
        type: Array
      },
      emptyText: {
        type: String,
        default() {
          return t('bg.tree.emptyText');
        }
      },
      renderAfterExpand: {
        type: Boolean,
        default: true
      },
      nodeKey: String,
      checkStrictly: Boolean,
      defaultExpandAll: Boolean,
      expandOnClickNode: {
        type: Boolean,
        default: true
      },
      checkOnClickNode: Boolean,
      checkDescendants: {
        type: Boolean,
        default: false
      },
      autoExpandParent: {
        type: Boolean,
        default: true
      },
      defaultCheckedKeys: Array,
      defaultExpandedKeys: Array,
      currentNodeKey: [String, Number],
      renderContent: Function,
      showCheckbox: {
        type: Boolean,
        default: false
      },
      draggable: {
        type: Boolean,
        default: false
      },
      allowDrag: Function,
      allowDrop: Function,
      props: {
        default() {
          return {
            children: 'children',
            label: 'label',
            disabled: 'disabled'
          };
        }
      },
      lazy: {
        type: Boolean,
        default: false
      },
      highlightCurrent: Boolean,
      load: Function,
      filterNodeMethod: Function,
      accordion: Boolean,
      indent: {
        type: Number,
        default: 18
      },
      iconClass: String
    },

    computed: {
      children: {
        set(value) {
          this.data = value;
        },
        get() {
          return this.data;
        }
      },

      treeItemArray() {
        return Array.prototype.slice.call(this.treeItems);
      },

      isEmpty() {
        const { childNodes } = this.root;
        return !childNodes || childNodes.length === 0 || childNodes.every(({visible}) => !visible);
      },

      usualOptions() {
        let result = [];
        const usualKeys = this.usualKeys;
        const nodeKey = this.nodeKey;
        if (!this.root) {
          return [];
        }
        const recursion = (data) => {
          data.forEach(item => {
            if (usualKeys.includes(item.data[nodeKey])) {
              result.push(item);
            }
            if (item.childNodes) {
              recursion(item.childNodes)
            }
          })
        }
        recursion(this.root.childNodes);
        return result;
      }
    },

    watch: {
      usualOptions(val) {
        if (this.root) {
          this.usualTreeStore.root.childNodes[0].childNodes = this.usualOptions;
          this.updateUsualTreeParent(this.checkedKeys);
        }
      },
      defaultCheckedKeys(newVal) {
        this.store.setDefaultCheckedKey(newVal);
      },

      defaultExpandedKeys(newVal) {
        this.store.defaultExpandedKeys = newVal;
        this.store.setDefaultExpandedKeys(newVal);
      },

      data(newVal) {
        this.store.setData(newVal);
      },

      checkboxItems(val) {
        Array.prototype.forEach.call(val, (checkbox) => {
          checkbox.setAttribute('tabindex', -1);
        });
      },

      checkStrictly(newVal) {
        this.store.checkStrictly = newVal;
      }
    },

    methods: {
      filter(value) {
        if (!this.filterNodeMethod) throw new Error('[Tree] filterNodeMethod is required when filter');
        this.store.filter(value);
      },

      // initSelectKeys(checkedKeys = []) {
      //   this.setCheckedKeys(checkedKeys, true)
      //   this.updateUsualTreeParent(checkedKeys);
      // },

      eimtCheck(node, params) {
        const {checkedKeys, checked} = params;

        // 如果是点了“常用选择”，则特殊处理
        if (node.id === USUAL_KEY) {
          this.usualKeys.forEach(key => {
            this.setChecked(key, checked);
          })
          this.$emit('check', node, {
            checkedNodes: this.store.getCheckedNodes(),
            checkedKeys: this.store.getCheckedKeys(),
            halfCheckedNodes: this.store.getHalfCheckedNodes(),
            halfCheckedKeys: this.store.getHalfCheckedKeys(),
            checked: params.checked
          });
        } else {
          this.$emit('check', node, params);
        }
        this.treeNodeCheckHandler(node, {checkedKeys});
      },

      /**
       * @description: 更新常用选择的展开状态
       * @param {type} 
       * @return: 
       */
      updateUsualTreeExpand() {
        const childNodes = this.usualTreeStore.root.childNodes[0].childNodes;
        const usualNode = this.$refs.usual.node;
        if (childNodes && childNodes.length > 0) {
          if (childNodes.some(node => node.visible)) {
            usualNode.expand();
          } else {
            usualNode.collapse();
          }
        } else {
          usualNode.collapse();
        }
      },

      /**
       * @description: 
       * @param {type} 
       * @return: 
       */
      treeNodeCheckHandler(node, {checkedKeys}) {
        this.checkedKeys = checkedKeys;
        this.updateUsualTreeParent();
      },

      /**
       * @description: 判断当前常用选择是否已经选满，是的话设置勾选，否则不勾选
       * @param {type} 
       * @return: 
       */
      updateUsualTreeParent(keys) {
      },

      /**
       * @description: 创建常用选择
       * @param {type} 
       * @return: 
       */
      creatUsualTreeStore() {
        this.usualTreeStore = new TreeStore({
          key: this.nodeKey,
          data: [
            {
              label: this.usualLabel,
              id: USUAL_KEY,
              // 这个children只是初始化时候用到，并没有实质性作用
              children: [
                {
                  label: '',
                  id: 'slot'
                }
              ]
            }
          ],
          lazy: this.lazy,
          props: this.props,
          load: this.load,
          currentNodeKey: this.currentNodeKey,
          checkStrictly: this.checkStrictly,
          checkDescendants: this.checkDescendants,
          defaultCheckedKeys: this.defaultCheckedKeys,
          defaultExpandedKeys: this.defaultExpandedKeys,
          autoExpandParent: this.autoExpandParent,
          defaultExpandAll: this.defaultExpandAll,
          filterNodeMethod: this.filterNodeMethod
        });

        console.log('usualTreeStore:', this.usualTreeStore);

        // this.$nextTick(() => {
        //   const ref = this.$refs['usual'][0];
        //   ref.childNodeRendered = true;
        //   ref.expanded = true;
        //   ref.node.isLeaf = false;
        // })
      },

      getNodeKey(node) {
        return getNodeKey(this.nodeKey, node.data);
      },

      getNodePath(data) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in getNodePath');
        const node = this.store.getNode(data);
        if (!node) return [];
        const path = [node.data];
        let parent = node.parent;
        while (parent && parent !== this.root) {
          path.push(parent.data);
          parent = parent.parent;
        }
        return path.reverse();
      },

      getCheckedNodes(leafOnly, includeHalfChecked) {
        return this.store.getCheckedNodes(leafOnly, includeHalfChecked);
      },

      getCheckedKeys(leafOnly) {
        return this.store.getCheckedKeys(leafOnly);
      },

      getCurrentNode() {
        const currentNode = this.store.getCurrentNode();
        return currentNode ? currentNode.data : null;
      },

      getCurrentKey() {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in getCurrentKey');
        const currentNode = this.getCurrentNode();
        return currentNode ? currentNode[this.nodeKey] : null;
      },

      setCheckedNodes(nodes, leafOnly) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedNodes');
        this.store.setCheckedNodes(nodes, leafOnly);
        this.updateUsualTreeParent();
      },

      setCheckedKeys(keys, leafOnly) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedKeys');
        console.log('keys:', keys)
        this.store.setCheckedKeys(keys, leafOnly);
        this.updateUsualTreeParent();
      },

      setChecked(data, checked, deep) {
        this.store.setChecked(data, checked, deep);
        this.updateUsualTreeParent(); // 更新常用选择的状态
      },

      getHalfCheckedNodes() {
        return this.store.getHalfCheckedNodes();
      },

      getHalfCheckedKeys() {
        return this.store.getHalfCheckedKeys();
      },

      setCurrentNode(node) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentNode');
        this.store.setUserCurrentNode(node);
      },

      setCurrentKey(key) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentKey');
        this.store.setCurrentNodeKey(key);
      },

      getNode(data) {
        return this.store.getNode(data);
      },

      remove(data) {
        this.store.remove(data);
      },

      append(data, parentNode) {
        this.store.append(data, parentNode);
      },

      insertBefore(data, refNode) {
        this.store.insertBefore(data, refNode);
      },

      insertAfter(data, refNode) {
        this.store.insertAfter(data, refNode);
      },

      handleNodeExpand(nodeData, node, instance) {
        this.broadcast('ElTreeNode', 'tree-node-expand', node);
        this.$emit('node-expand', nodeData, node, instance);
      },

      updateKeyChildren(key, data) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in updateKeyChild');
        this.store.updateChildren(key, data);
      },

      initTabIndex() {
        this.treeItems = this.$el.querySelectorAll('.is-focusable[role=treeitem]');
        this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]');
        const checkedItem = this.$el.querySelectorAll('.is-checked[role=treeitem]');
        if (checkedItem.length) {
          checkedItem[0].setAttribute('tabindex', 0);
          return;
        }
        this.treeItems[0] && this.treeItems[0].setAttribute('tabindex', 0);
      },

      handleKeydown(ev) {
        const currentItem = ev.target;
        if (currentItem.className.indexOf('el-tree-node') === -1) return;
        const keyCode = ev.keyCode;
        this.treeItems = this.$el.querySelectorAll('.is-focusable[role=treeitem]');
        const currentIndex = this.treeItemArray.indexOf(currentItem);
        let nextIndex;
        if ([38, 40].indexOf(keyCode) > -1) { // up、down
          ev.preventDefault();
          if (keyCode === 38) { // up
            nextIndex = currentIndex !== 0 ? currentIndex - 1 : 0;
          } else {
            nextIndex = (currentIndex < this.treeItemArray.length - 1) ? currentIndex + 1 : 0;
          }
          this.treeItemArray[nextIndex].focus(); // 选中
        }
        if ([37, 39].indexOf(keyCode) > -1) { // left、right 展开
          ev.preventDefault();
          currentItem.click(); // 选中
        }
        const hasInput = currentItem.querySelector('[type="checkbox"]');
        if ([13, 32].indexOf(keyCode) > -1 && hasInput) { // space enter选中checkbox
          ev.preventDefault();
          hasInput.click();
        }
      }
    },

    created() {
      this.isTree = true;

      this.store = new TreeStore({
        key: this.nodeKey,
        data: this.data,
        lazy: this.lazy,
        props: this.props,
        load: this.load,
        currentNodeKey: this.currentNodeKey,
        checkStrictly: this.checkStrictly,
        checkDescendants: this.checkDescendants,
        defaultCheckedKeys: this.defaultCheckedKeys,
        defaultExpandedKeys: this.defaultExpandedKeys,
        autoExpandParent: this.autoExpandParent,
        defaultExpandAll: this.defaultExpandAll,
        filterNodeMethod: this.filterNodeMethod
      });

      this.creatUsualTreeStore();

      this.root = this.store.root;

      let dragState = this.dragState;
      this.$on('tree-node-drag-start', (event, treeNode) => {
        if (typeof this.allowDrag === 'function' && !this.allowDrag(treeNode.node)) {
          event.preventDefault();
          return false;
        }
        event.dataTransfer.effectAllowed = 'move';

        // wrap in try catch to address IE's error when first param is 'text/plain'
        try {
          // setData is required for draggable to work in FireFox
          // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
          event.dataTransfer.setData('text/plain', '');
        } catch (e) {}
        dragState.draggingNode = treeNode;
        this.$emit('node-drag-start', treeNode.node, event);
      });

      this.$on('tree-node-drag-over', (event, treeNode) => {
        const dropNode = findNearestComponent(event.target, 'ElTreeNode');
        const oldDropNode = dragState.dropNode;
        if (oldDropNode && oldDropNode !== dropNode) {
          removeClass(oldDropNode.$el, 'is-drop-inner');
        }
        const draggingNode = dragState.draggingNode;
        if (!draggingNode || !dropNode) return;

        let dropPrev = true;
        let dropInner = true;
        let dropNext = true;
        let userAllowDropInner = true;
        if (typeof this.allowDrop === 'function') {
          dropPrev = this.allowDrop(draggingNode.node, dropNode.node, 'prev');
          userAllowDropInner = dropInner = this.allowDrop(draggingNode.node, dropNode.node, 'inner');
          dropNext = this.allowDrop(draggingNode.node, dropNode.node, 'next');
        }
        event.dataTransfer.dropEffect = dropInner ? 'move' : 'none';
        if ((dropPrev || dropInner || dropNext) && oldDropNode !== dropNode) {
          if (oldDropNode) {
            this.$emit('node-drag-leave', draggingNode.node, oldDropNode.node, event);
          }
          this.$emit('node-drag-enter', draggingNode.node, dropNode.node, event);
        }

        if (dropPrev || dropInner || dropNext) {
          dragState.dropNode = dropNode;
        }

        if (dropNode.node.nextSibling === draggingNode.node) {
          dropNext = false;
        }
        if (dropNode.node.previousSibling === draggingNode.node) {
          dropPrev = false;
        }
        if (dropNode.node.contains(draggingNode.node, false)) {
          dropInner = false;
        }
        if (draggingNode.node === dropNode.node || draggingNode.node.contains(dropNode.node)) {
          dropPrev = false;
          dropInner = false;
          dropNext = false;
        }

        const targetPosition = dropNode.$el.getBoundingClientRect();
        const treePosition = this.$el.getBoundingClientRect();

        let dropType;
        const prevPercent = dropPrev ? (dropInner ? 0.25 : (dropNext ? 0.45 : 1)) : -1;
        const nextPercent = dropNext ? (dropInner ? 0.75 : (dropPrev ? 0.55 : 0)) : 1;

        let indicatorTop = -9999;
        const distance = event.clientY - targetPosition.top;
        if (distance < targetPosition.height * prevPercent) {
          dropType = 'before';
        } else if (distance > targetPosition.height * nextPercent) {
          dropType = 'after';
        } else if (dropInner) {
          dropType = 'inner';
        } else {
          dropType = 'none';
        }

        const iconPosition = dropNode.$el.querySelector('.el-tree-node__expand-icon').getBoundingClientRect();
        const dropIndicator = this.$refs.dropIndicator;
        if (dropType === 'before') {
          indicatorTop = iconPosition.top - treePosition.top;
        } else if (dropType === 'after') {
          indicatorTop = iconPosition.bottom - treePosition.top;
        }
        dropIndicator.style.top = indicatorTop + 'px';
        dropIndicator.style.left = (iconPosition.right - treePosition.left) + 'px';

        if (dropType === 'inner') {
          addClass(dropNode.$el, 'is-drop-inner');
        } else {
          removeClass(dropNode.$el, 'is-drop-inner');
        }

        dragState.showDropIndicator = dropType === 'before' || dropType === 'after';
        dragState.allowDrop = dragState.showDropIndicator || userAllowDropInner;
        dragState.dropType = dropType;
        this.$emit('node-drag-over', draggingNode.node, dropNode.node, event);
      });

      this.$on('tree-node-drag-end', (event) => {
        const { draggingNode, dropType, dropNode } = dragState;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        if (draggingNode && dropNode) {
          const draggingNodeCopy = { data: draggingNode.node.data };
          if (dropType !== 'none') {
            draggingNode.node.remove();
          }
          if (dropType === 'before') {
            dropNode.node.parent.insertBefore(draggingNodeCopy, dropNode.node);
          } else if (dropType === 'after') {
            dropNode.node.parent.insertAfter(draggingNodeCopy, dropNode.node);
          } else if (dropType === 'inner') {
            dropNode.node.insertChild(draggingNodeCopy);
          }
          if (dropType !== 'none') {
            this.store.registerNode(draggingNodeCopy);
          }

          removeClass(dropNode.$el, 'is-drop-inner');

          this.$emit('node-drag-end', draggingNode.node, dropNode.node, dropType, event);
          if (dropType !== 'none') {
            this.$emit('node-drop', draggingNode.node, dropNode.node, dropType, event);
          }
        }
        if (draggingNode && !dropNode) {
          this.$emit('node-drag-end', draggingNode.node, null, dropType, event);
        }

        dragState.showDropIndicator = false;
        dragState.draggingNode = null;
        dragState.dropNode = null;
        dragState.allowDrop = true;
      });
    },

    mounted() {
      this.initTabIndex();
      this.$el.addEventListener('keydown', this.handleKeydown);
    },

    updated() {
      this.treeItems = this.$el.querySelectorAll('[role=treeitem]');
      this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]');
    }
  };
</script>

<style>
@import url('./style.css');
</style>

