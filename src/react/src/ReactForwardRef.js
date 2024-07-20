import { REACT_FORWARD_REF_TYPE } from '../../ReactSymbols';

export function forwardRef(render) {
  const elementType = {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render: render,
  };

  return elementType;
}
