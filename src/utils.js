import { REACT_TEXT } from './ReactSymbols';
export const toVNode = node => {
  return typeof node === 'string' || typeof node === 'number'
    ? {
        type: REACT_TEXT,
        props: { text: node },
      }
    : node;
};
