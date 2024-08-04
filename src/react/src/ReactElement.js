import { REACT_ELEMENT_TYPE } from '../../ReactSymbols';
import { toVNode } from '../../utils';

const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

function hasValidRef(config) {
  return config.ref !== undefined;
}

function hasValidKey(config) {
  return config.key !== undefined;
}

const ReactElement = (type, key, ref, self, source, owner, props) => {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
  };

  // element._store = {};

  // Object.defineProperty(element._store, 'validated', {
  //   configurable: false,
  //   enumerable: false,
  //   writable: true,
  //   value: false,
  // });

  // Object.defineProperty(element, '_source', {
  //   configurable: false,
  //   enumerable: false,
  //   writable: false,
  //   value: source,
  // });

  return element;
};

export function createElement(type, config, children) {
  let propName;

  // Reserved names are extracted
  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config !== null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;

    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = toVNode(children);
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return ReactElement(type, key, ref, self, source, undefined, props);
}
