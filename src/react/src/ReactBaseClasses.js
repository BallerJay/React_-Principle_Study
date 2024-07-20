import { findDomByVNode, updateDomTree } from '../../react-dom/src/ReactDomLegacy';

export let updaterQueue = {
  isBatch: false,
  updaters: new Set(),
};

export function flushUpdateQueue() {
  updaterQueue.isBatch = false;
  for (const updater of updaterQueue.updaters) {
    updater.launchUpdate();
  }
  updaterQueue.updaters.clear();
}

class Updater {
  constructor(classComponentInstance) {
    this.classComponentInstance = classComponentInstance;
    this.pendingStates = [];
  }

  addState(partialState) {
    this.pendingStates.push(partialState);
    this.preHandleForUpdate();
  }
  preHandleForUpdate() {
    if (updaterQueue.isBatch) {
      updaterQueue.updaters.add(this);
    } else {
      this.launchUpdate();
    }
  }

  launchUpdate() {
    const { classComponentInstance, pendingStates } = this;
    if (pendingStates.length === 0) return;
    classComponentInstance.state = this.pendingStates.reduce((accState, curState) => {
      return Object.assign({}, accState, curState);
    }, classComponentInstance.state);
    // 清空
    this.pendingStates.length = 0;

    classComponentInstance.update();
  }
}

export class Component {
  static IS_CLASS_COMPONENT = true;
  constructor(props) {
    this.updater = new Updater(this);
    this.state = {};
    this.props = props;
  }
  setState(partialState) {
    // 1. 合并属性
    this.state = Object.assign({}, this.state, partialState);
    // 2. 重新渲染进行更新
    this.updater.addState(partialState);
  }
  update() {
    // 1. 获取重新执行render函数后的虚拟DOM -> 新的虚拟DOM
    // 2. 根据新虚拟DOM生成新的真实DOM
    // 3. 将真实DOM挂载到页面上

    const oldVNode = this.oldVNode;
    const oldRealDOM = findDomByVNode(oldVNode);
    const newVNode = this.render();
    updateDomTree(oldRealDOM, newVNode);
    this.oldVNode = newVNode;
  }
}
