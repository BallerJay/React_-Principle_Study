import { findDomByVNode, updateDomTree } from '../../react-dom/src/ReactDomLegacy';
import { deepClone } from '../../utils';

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

  launchUpdate(nextProps) {
    const { classComponentInstance, pendingStates } = this;
    if (pendingStates.length === 0 && !nextProps) return;
    let isShouldUpdate = true;

    let prevProps = deepClone(classComponentInstance.props);
    let prevState = deepClone(classComponentInstance.state);

    const nextState = this.pendingStates.reduce((accState, curState) => {
      return Object.assign({}, accState, curState);
    }, classComponentInstance.state);
    // 清空
    this.pendingStates.length = 0;
    if (
      classComponentInstance.shouldComponentUpdate &&
      !classComponentInstance.shouldComponentUpdate(nextProps, nextState)
    ) {
      isShouldUpdate = false;
    }
    classComponentInstance.state = nextState;
    nextProps && (classComponentInstance.props = nextProps);
    isShouldUpdate && classComponentInstance.update(prevProps, prevState);
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
    // // 1. 合并属性
    // this.state = Object.assign({}, this.state, partialState);
    // // 2. 重新渲染进行更新
    // this.updater.addState(partialState);
    this.updater.addState(partialState);
  }
  update(prevProps, prevState) {
    // 1. 获取重新执行render函数后的虚拟DOM -> 新的虚拟DOM
    // 2. 根据新虚拟DOM生成新的真实DOM
    // 3. 将真实DOM挂载到页面上
    const oldVNode = this.oldVNode;
    const oldRealDOM = findDomByVNode(oldVNode);
    if (this.constructor.getDerivedStateFromProps) {
      let newState = this.constructor.getDerivedStateFromProps(this.props, this.state);
      this.state = { ...this.state, ...newState };
    }

    let snapshot =
      this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate(prevProps, prevState);

    const newVNode = this.render();
    updateDomTree(oldVNode, newVNode, oldRealDOM);
    this.oldVNode = newVNode;
    // 执行componentDidUpdate
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state, snapshot);
    }
  }
}
