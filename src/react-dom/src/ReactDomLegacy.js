import { isValidContainerLegacy } from './ReactDOMRoot';

import { REACT_ELEMENT_TYPE, REACT_FORWARD_REF_TYPE } from '../../ReactSymbols';

import { addEvent } from './ReactEvent';

export function render(VNode, container) {
  debugger;

  /**
   * @description
   * render方法所做的事情
   *  - 将虚拟DOM转化为真实DOM  这里element参数就是虚拟DOM
   *  - 将得到的真实DOM挂载到containerDOM中
   */

  if (!isValidContainerLegacy(container)) {
    throw new Error('Target container is not a DOM element.');
  }

  mount(VNode, container);
}

function mount(VNode, container) {
  /**
   * 1. 创建元素
   * 2. 处理子元素
   * 3. 处理属性值
   */
  let realDom = createDom(VNode);
  realDom && container.appendChild(realDom);
}

function mountArray(VNodeChildren, parentNode) {
  for (const child of VNodeChildren) {
    if (typeof child === 'string') {
      parentNode.appendChild(document.createTextNode(child));
    }
    if (typeof child === 'object' && child.type) {
      mount(child, parentNode);
    }
  }
}

/**
 * @description 创建真实DOM
 * @param {*} VNode
 * @returns
 */
function createDom(VNode) {
  console.log(VNode, 'VNode');
  const { type, props, ref } = VNode;
  let dom;
  // forwardRef组件
  if (type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
    return getDomByForwardRefFunctionComponent(VNode);
  }
  if (
    typeof type === 'function' &&
    VNode.$$typeof === REACT_ELEMENT_TYPE &&
    type.IS_CLASS_COMPONENT
  ) {
    // 处理类组件
    return getDOMByClassComponent(VNode);
  }
  if (typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT_TYPE) {
    // 处理函数式组件
    return getDOMByFunctionComponent(VNode);
  }
  if (type && VNode.$$typeof === REACT_ELEMENT_TYPE) {
    dom = document.createElement(type);
  }
  if (props) {
    if (typeof props.children === 'object' && props.children.type) {
      mount(props.children, dom);
    } else if (Array.isArray(props.children)) {
      mountArray(props.children, dom);
    } else if (typeof props.children === 'string') {
      dom.appendChild(document.createTextNode(props.children));
    }
  }
  // 处理元素的属性  例如style等等
  setPropsForDOM(dom, props);
  // 保存其真实DOM
  VNode.dom = dom;
  ref && (ref.current = dom);
  return dom;
}

function setPropsForDOM(realDOM, props = {}) {
  if (!realDOM) throw new Error('dom is null');

  for (const key in props) {
    if (key === 'children') continue;
    if (/^on[A-Z].*/.test(key)) {
      addEvent(realDOM, key.toLowerCase(), props[key]);
      continue;
    } else if (key === 'style') {
      Object.keys(props.style).forEach(styleName => {
        realDOM.style[styleName] = props.style[styleName];
      });
    } else {
      realDOM.setAttribute(key, props[key]);
    }
  }
}

function getDOMByFunctionComponent(VNode) {
  let { type, props } = VNode;
  const renderFunctionComponentVNode = type(props);
  console.log(renderFunctionComponentVNode, 'renderFunctionComponentVNode');
  if (!renderFunctionComponentVNode) return null;
  return createDom(renderFunctionComponentVNode);
}

function getDOMByClassComponent(VNode) {
  let { type, props, ref } = VNode;
  const instance = new type(props);
  const renderClassComponentVNode = instance.render();
  instance.oldVNode = renderClassComponentVNode;
  ref && (ref.current = instance);
  // setTimeout(() => {
  //   instance.setState({
  //     name: 'BallerJay',
  //   });
  // }, 3000);
  if (!renderClassComponentVNode) return null;
  return createDom(renderClassComponentVNode);
}

function getDomByForwardRefFunctionComponent(VNode) {
  let { type } = VNode;
  let renderForwardFunctionComponentVNode = type.render(VNode.props, VNode.ref);
  if (!renderForwardFunctionComponentVNode) return null;
  return createDom(renderForwardFunctionComponentVNode);
}

export function findDomByVNode(VNode) {
  if (!VNode) return null;
  if (VNode.dom) return VNode.dom;
}

export function updateDomTree(oldRealDOM, newVNode) {
  const parentNode = oldRealDOM.parentNode;
  parentNode.removeChild(oldRealDOM);
  parentNode.appendChild(createDom(newVNode));
}
