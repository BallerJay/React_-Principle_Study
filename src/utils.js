import { REACT_TEXT } from './ReactSymbols';
export const toVNode = node => {
  return typeof node === 'string' || typeof node === 'number'
    ? {
        type: REACT_TEXT,
        props: { text: node },
      }
    : node;
};

function getType(obj) {
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
  };
  return map[Object.prototype.toString.call(obj)];
}

export const deepClone = data => {
  let type = getType(data);
  let resultValue;
  if (type !== 'array' && type !== 'object') return data;
  if (type === 'array') {
    resultValue = [];
    data.forEach(item => {
      resultValue.push(deepClone(item));
    });
    return resultValue;
  }
  if (type === 'object') {
    resultValue = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        resultValue[key] = deepClone(data[key]);
      }
    }
    return resultValue;
  }
};

// 浅比较
export const shallowEqual = (value1, value2) => {
  if (value1 === value2) return true;
  if (getType(value1) !== getType(value2)) return false;
  let keys1 = Object.keys(value1);
  let keys2 = Object.keys(value2);
  if (keys1.length !== keys2.length) return false;
  for (let key of keys1) {
    if (value1[key] !== value2[key]) return false;
  }
  return true;
};
