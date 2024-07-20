import { updaterQueue, flushUpdateQueue } from '../../react/src/ReactBaseClasses';
export function addEvent(realDom, eventName, eventHandler) {
  realDom.attach = realDom.attach || {};
  realDom.attach[eventName] = eventHandler;
  // 事件合成机制的核心点一：事件绑定到document上
  if (document[eventName]) return;
  document[eventName] = dispatchEvent;
}

function dispatchEvent(nativeEvent) {
  updaterQueue.isBatch = true;
  // 事件合成机制的核心点二：抹平浏览器之间的差异、统一事件对象
  const syntheticEvent = createSyncSyntheticEvent(nativeEvent);
  let target = nativeEvent.target;
  while (target) {
    syntheticEvent.currentTarget = target;
    const eventName = `on${nativeEvent.type}`;
    let eventHandler = target.attach && target.attach[eventName];
    eventHandler && eventHandler(syntheticEvent);
    if (syntheticEvent.isPropagationStopped) {
      break;
    }
    target = target.parentNode;
  }
  // 执行批量更新操作
  flushUpdateQueue();
}

function createSyncSyntheticEvent(nativeEvent) {
  let nativeEventKeyValues = {};

  for (let key in nativeEvent) {
    nativeEventKeyValues[key] =
      typeof nativeEvent[key] === 'function'
        ? nativeEvent[key].bind(nativeEvent)
        : nativeEvent[key];
  }

  let syntheticEvent = Object.assign(nativeEventKeyValues, {
    nativeEvent,
    isDefaultPrevented: false,
    isPropagationStopped: false,
    preventDefault: function () {
      this.isDefaultPrevented = true;
      if (this.nativeEvent.preventDefault) {
        this.nativeEvent.preventDefault();
      } else {
        this.nativeEvent.returnValue = false;
      }
    },
    stopPropagation: function () {
      this.isPropagationStopped = true;
      if (this.nativeEvent.stopPropagation) {
        this.nativeEvent.stopPropagation();
      } else {
        this.nativeEvent.cancelBubble = true;
      }
    },
  });

  return syntheticEvent;
}
