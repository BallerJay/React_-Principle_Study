import { REACT_MEMO_TYPE } from '../../ReactSymbols';

export function memo(type, compare) {
  return {
    $$typeof: REACT_MEMO_TYPE,
    type,
    compare,
  };
}
