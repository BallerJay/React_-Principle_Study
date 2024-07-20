import { REACT_ELEMENT_TYPE } from '../../ReactSymbols';

export const toVNode = node => {
  return typeof node === 'string' || typeof node === 'number'
    ? {
        type: REACT_ELEMENT_TYPE,
        props: { text: node },
      }
    : node;
};
