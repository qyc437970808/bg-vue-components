import defaultLang from './zh';

let i18nHandler = function(key, value) {
  if (!key) {
    return '';
  }
  let res = defaultLang;
  try {
    const arr = key.split('.');
    arr.forEach(item => {
      res = res[item];
    });
  } catch (e) {
    console.error(`${key}缺少国际化`);
    res = '';
  }

  if (!res) {
    console.error(`${key}缺少国际化`);
    return '';
  }
  return res || '';
}

function i18n(fn) {
  i18nHandler = fn || i18nHandler;
}

function t() {
  let value = i18nHandler.apply(this, arguments);
  if (value !== null && value !== undefined) return value;
}

export {
  i18n,
  t
}