import debounce from 'lodash.debounce'
export { debounce }

/**
 * 递归
 * @param { Array } data 
 * @param { Function } fn 
 * @param { Array } parent 可选
 */
export const cecursion = (data, fn, parent = null) => {
  data.forEach(item => {
    fn(item, parent);
    if (item.children) {
      cecursion(item.children, fn, item);
    }
  })
}

/**
 * @description: 递归深拷贝
 * @param {type} source
 * @return: 
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 判断是否为falsy值/空数组/空对象
 * @param data
 * @returns {boolean}
 */
export function isEmptyResult(data) {
  // Object.keys(data).length === 0
  // 判断假值（除0外）和空数组/对象
  if (!data && data !== 0 && data !== false) {
    return true
  }

  // 判断时间
  if (data instanceof Date) {
    return false
  }

  if (Array.isArray(data) && data.length === 0) {
    return true
  } else if (Object.prototype.isPrototypeOf(data) && Object.keys(data).length === 0) {
    return true
  }

  return false
}
