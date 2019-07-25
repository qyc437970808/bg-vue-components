import Storage from './localStorage'
import eventBus from 'bg-vue-components/src/utils/eventBus';
const STORAGE_NAME = 'historyStorage';

const HISTORY_COLLECT_KEY = 'history-collect';
/**
 * @description: 触发绑定事件
 * @param {type} 
 * @return: 
 */
export function historyStorageEmit() {
  eventBus.$emit(HISTORY_COLLECT_KEY);
}

/**
 * @description: 注册绑定事件
 * @param {Function} fn 
 * @return: 
 */
export function historyStorageOn(fn) {
  eventBus.$on(HISTORY_COLLECT_KEY , fn);
}

export class HistoryStorage {
  constructor({
    nameSpace = STORAGE_NAME,
    name,
    bindKey = 'id'
  }) {
    this.nameSpace = nameSpace;
    this.name = name;
    this.bindKey = bindKey;
    this.storageData = this.getStorageData();
  }

  /**
   * @description: 获取
   * @param {Number} amount 个数 
   * @return: 
   */
  get(amount = 30) {
    const storageData = this.storageData;
    if (!storageData || Object.keys(storageData).length === 0) {
      return [];
    }
    let keys = Object.keys(storageData);
    if (keys.length > amount) {
      keys = keys.sort((a, b) => {
        return storageData[b].times - storageData[a].times
      }).slice(0, amount);
    }
    const res = keys.map(key => {
      return storageData[key].value;
    });
    return res
  }

  getStorageData() {
    const historyData = this.getHistoryStorage();
    const res = historyData[this.name] ? historyData[this.name] : {};
    return res;
  }

  getHistoryStorage() {
    const data = Storage.getInfo(this.nameSpace);
    if (!data || Object.prototype.toString.call(data) !== '[object Object]') {
      return {};
    }
    return data;
  }

  set(data = []) {
    const storageData = this.storageData;
    data.forEach(item => {
      const key = typeof item === 'object' ? item[this.bindKey] : item;
      if (storageData[key]) {
        storageData[key].times ++;
      } else {
        storageData[key] = {
          times: 1,
          value: item
        }
      }
    });
    this.storageData = storageData;
    return storageData;
  }

  update(data = []) {
    const storageData = this.set(data);
    const historyStorageData = this.getHistoryStorage();
    historyStorageData[this.name] = storageData;
    Storage.set(this.nameSpace, historyStorageData);
    return storageData;
  }
}