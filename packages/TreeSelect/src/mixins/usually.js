import {
  historyStorageOn,
  HistoryStorage
} from 'bg-vue-components/lib/history';
export default {
  data() {
    return {
      historyStorage: null
    }
  },
  methods: {
    /**
     * @description: 初始化
     */
    initUsual() {
      this.historyStorage = new HistoryStorage({
        name: this.memoryName
      });
      this.usualKeys = this.historyStorage.get();
      historyStorageOn(() => {
        if (this.treeSelectedItem.length === 0) {
          return;
        }
        this.updateHistoryStorage();
        this.usualKeys = this.historyStorage.get();
      });
    },
    /**
     * @description: 更新常用选择的本地仓库
     */
    updateHistoryStorage() {
      // 过滤掉有children的
      const arr = this.treeSelectedItem.filter(item => !item.children).map(item => item.id);
      this.historyStorage.update(arr);
    },
  }
}