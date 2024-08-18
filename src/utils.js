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
