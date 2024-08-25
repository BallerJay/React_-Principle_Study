import { isValidContainerLegacy } from './ReactDOMRoot';

import {
  MOVE,
  CREATE,
  REACT_ELEMENT_TYPE,
  REACT_FORWARD_REF_TYPE,
  REACT_TEXT,
  REACT_MEMO_TYPE,
} from '../../ReactSymbols';

import { addEvent } from './ReactEvent';
import { shallowEqual } from '../../utils';

export function render(VNode, container) {
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
  if (!Array.isArray(VNodeChildren)) return;
  for (let i = 0; i < VNodeChildren.length; i++) {
    VNodeChildren[i].index = i;
    mount(VNodeChildren[i], parentNode);
  }
  // for (const child of VNodeChildren) {

  //   if (typeof child === 'object' && child.type) {
  //     mount(child, parentNode);
  //   }
  // }
}

/**
 * @description 创建真实DOM
 * @param {*} VNode
 * @returns
 */
function createDom(VNode) {
  const { type, props, ref } = VNode;
  let dom;

  // 处理 memo 包裹的组件
  if (type && type.$$typeof === REACT_MEMO_TYPE) {
    return getDomByMemoFunctionComponent(VNode);
  }

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
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.text);
  }
  if (type && VNode.$$typeof === REACT_ELEMENT_TYPE) {
    dom = document.createElement(type);
  }
  if (props) {
    if (typeof props.children === 'object' && props.children.type) {
      mount(props.children, dom);
    } else if (Array.isArray(props.children)) {
      mountArray(props.children, dom);
    }
    // else if (typeof props.children === 'string') {
    //   dom.appendChild(document.createTextNode(props.children));
    // }
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
      // realDOM.setAttribute(key, props[key]);
      realDOM[key] = props[key];
    }
  }
}

function getDOMByFunctionComponent(VNode) {
  let { type, props } = VNode;
  const renderFunctionComponentVNode = type(props);
  if (!renderFunctionComponentVNode) return null;
  let realDOM = createDom(renderFunctionComponentVNode);
  VNode.dom = realDOM;
  return realDOM;
}

function getDOMByClassComponent(VNode) {
  let { type, props, ref } = VNode;
  const instance = new type(props);
  VNode.classInstance = instance;
  ref && (ref.current = instance);
  const renderClassComponentVNode = instance.render();
  instance.oldVNode = renderClassComponentVNode;
  // setTimeout(() => {
  //   instance.setState({
  //     name: 'BallerJay',
  //   });
  // }, 3000);
  if (!renderClassComponentVNode) return null;
  const realDom = createDom(renderClassComponentVNode);
  // 执行componentDidMount
  if (instance.componentDidMount) instance.componentDidMount();
  return realDom;
}

function getDomByForwardRefFunctionComponent(VNode) {
  let { type } = VNode;
  let renderForwardFunctionComponentVNode = type.render(VNode.props, VNode.ref);
  if (!renderForwardFunctionComponentVNode) return null;
  return createDom(renderForwardFunctionComponentVNode);
}
function getDomByMemoFunctionComponent(VNode) {
  let { type, props } = VNode;
  let renderVNode = type.type(props);
  if (!renderVNode) return null;
  VNode.oldRenderVNode = renderVNode;
  return createDom(renderVNode);
}

export function findDomByVNode(VNode) {
  if (!VNode) return null;
  if (VNode.dom) return VNode.dom;
}

export function updateDomTree(oldVNode, newVNode, oldRealDOM) {
  // debugger;
  // const parentNode = oldRealDOM.parentNode;
  // parentNode.removeChild(oldRealDOM);
  // parentNode.appendChild(createDom(newVNode));
  /**
   * - 新节点、旧节点都不存在
   * - 新节点存在，旧节点不存在
   * - 新节点不存在，旧节点存在
   * - 新旧节点都存在，但是类型不一样
   * - 新旧节点都存在，类型一样 -> 需要深入探讨 探索复用相关节点的方案
   */
  const operateMap = {
    NO_OPERATE: !oldVNode && !newVNode,
    ADD: !oldVNode && !!newVNode,
    DELETE: !!oldVNode && !newVNode,
    REPLACE: !!oldVNode && !!newVNode && oldVNode.type !== newVNode.type,
  };
  let operateType = Object.keys(operateMap).filter(key => operateMap[key])[0];
  switch (operateType) {
    case 'NO_OPERATE':
      return;
    case 'ADD':
      oldRealDOM.parentNode.appendChild(createDom(newVNode));
      return;
    case 'DELETE':
      removeVNode(oldVNode);
      return;
    case 'REPLACE':
      removeVNode(oldVNode);
      oldRealDOM.parentNode.appendChild(createDom(newVNode));
      return;
    default:
      deepDOMDiff(oldVNode, newVNode);
      return;
  }
}

const removeVNode = oldVNode => {
  const currentDom = findDomByVNode(oldVNode);
  currentDom && currentDom.remove();
  if (oldVNode.classInstance && oldVNode.classInstance.componentWillUnmount) {
    oldVNode.classInstance.componentWillUnmount();
  }
};

const deepDOMDiff = (oldVNode, newVNode) => {
  const diffTypeMap = {
    ORIGIN_NODE: typeof oldVNode.type === 'string',
    CLASS_COMPONENT: typeof oldVNode.type === 'function' && oldVNode.type.IS_CLASS_COMPONENT,
    FUNCTION_COMPONENT: typeof oldVNode.type === 'function',
    TEXT: oldVNode.type === REACT_TEXT,
    MEMO_COMPONENT: oldVNode.type.$$typeof === REACT_MEMO_TYPE,
  };
  let DIFF_TYPE = Object.keys(diffTypeMap).filter(key => diffTypeMap[key])[0];
  switch (DIFF_TYPE) {
    case 'ORIGIN_NODE':
      const currentDOM = (newVNode.dom = findDomByVNode(oldVNode));
      setPropsForDOM(currentDOM, newVNode.props);
      updateChildren(currentDOM, oldVNode.props.children, newVNode.props.children);
      return;
    case 'CLASS_COMPONENT':
      updateClassComponent(oldVNode, newVNode);
      return;
    case 'FUNCTION_COMPONENT':
      updateFunctionComponent(oldVNode, newVNode);
      return;
    case 'TEXT':
      newVNode.dom = findDomByVNode(oldVNode);
      newVNode.dom.textContent = newVNode.props.text;
      return;
    case 'MEMO_COMPONENT':
      updateMemoFunctionComponent(oldVNode, newVNode);
      return;
    default:
      return;
  }
};

// DOM Diff 核心
const updateChildren = (parentDOM, oldVNodeChildren, newVNodeChildren) => {
  oldVNodeChildren = (
    Array.isArray(oldVNodeChildren) ? oldVNodeChildren : [oldVNodeChildren]
  ).filter(Boolean);
  newVNodeChildren = (
    Array.isArray(newVNodeChildren) ? newVNodeChildren : [newVNodeChildren]
  ).filter(Boolean);

  let lastNotChangedIndex = -1;

  // key与节点之间的对应关系
  let oldKeyChildMap = {};
  oldVNodeChildren.forEach((oldVNode, index) => {
    let oldKey = oldVNode && oldVNode.key ? oldVNode.key : index;
    oldKeyChildMap[oldKey] = oldVNode;
  });

  /**
   * 遍历新的子虚拟DOM数组，找到
   * - 可以复用但需要移动的节点
   * - 需要重新创建的节点
   * - 需要删除的节点
   * - 剩下的就是可以复用且不用移动的节点
   */
  let actions = [];
  newVNodeChildren.forEach((newVNode, index) => {
    newVNode.index = index;
    let newKey = newVNode.key ? newVNode.key : index;
    let oldVNode = oldKeyChildMap[newKey];
    if (oldVNode) {
      deepDOMDiff(oldVNode, newVNode);
      if (oldVNode.index < lastNotChangedIndex) {
        actions.push({
          type: MOVE,
          oldVNode,
          newVNode,
          index,
        });
      }
      delete oldKeyChildMap[newKey];
      lastNotChangedIndex = Math.max(lastNotChangedIndex, oldVNode.index);
    } else {
      actions.push({
        type: CREATE,
        newVNode,
        index,
      });
    }
  });
  const VNodeMoveTypeSet = actions
    .filter(action => action.type === MOVE)
    .map(action => action.oldVNode);
  const VNodeDeleteTypeSet = Object.values(oldKeyChildMap);
  VNodeMoveTypeSet.concat(VNodeDeleteTypeSet).forEach(oldVNode => {
    let currentDOM = findDomByVNode(oldVNode);
    currentDOM.remove();
  });

  actions.forEach(action => {
    const { type, oldVNode, newVNode, index } = action;
    const childNodes = parentDOM.childNodes;
    const childNode = childNodes[index];
    const getDOMForInsert = () => {
      if (type === CREATE) {
        return createDom(newVNode);
      }
      if (type === MOVE) {
        return findDomByVNode(oldVNode);
      }
    };
    if (childNode) {
      parentDOM.insertBefore(getDOMForInsert(), childNode);
    } else {
      parentDOM.appendChild(getDOMForInsert());
    }
  });
};

const updateClassComponent = (oldVNode, newVNode) => {
  const classInstance = (newVNode.classInstance = oldVNode.classInstance);
  classInstance.updater.launchUpdate(newVNode.props);
};

const updateFunctionComponent = (oldVNode, newVNode) => {
  let oldDOM = findDomByVNode(oldVNode);
  newVNode.dom = oldDOM;
  if (!oldDOM) return;
  const { type, props } = newVNode;
  let newRenderVNode = type(props);
  updateDomTree(oldVNode.oldRenderVNode, newRenderVNode, oldDOM);
  newVNode.oldRenderVNode = newRenderVNode;
};

const updateMemoFunctionComponent = (oldVNode, newVNode) => {
  const { type } = oldVNode;
  if (
    (!type?.compare && !shallowEqual(oldVNode.props, newVNode.props)) ||
    (type.compare && !type.compare(oldVNode.props, newVNode.props))
  ) {
    // 更新
    const oldDOM = findDomByVNode(oldVNode);
    const { type, props } = newVNode;
    let renderVNode = type.type(props);
    updateDomTree(oldVNode.oldRenderVNode, renderVNode, oldDOM);
    newVNode.oldRenderVNode = renderVNode;
  } else {
    newVNode.oldRenderVNode = oldVNode.oldRenderVNode;
  }
};
