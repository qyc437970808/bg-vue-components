const path = require('path');

function getPath(str) {
  return path.resolve(__dirname, '../src/' ,str);
}
module.exports = {
  'locale/index': path.resolve(__dirname, '../src/locale'),
  en: path.resolve(__dirname, '../src/locale/en'),
  zh: path.resolve(__dirname, '../src/locale/zh'),
  form: path.resolve(__dirname, '../src/mixins/form'),
  util: path.resolve(__dirname, '../src/utils/util'),
  history: getPath('utils/history'),
  eventBus: getPath('utils/eventBus')
}