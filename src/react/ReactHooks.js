import { emitUpdateForHooks } from '../react-dom/src/ReactDomLegacy';

let states = [];
let hookIndex = 0;
export const useState = initialValue => {
  states[hookIndex] = states[hookIndex] || initialValue;
  const currentIndex = hookIndex;
  const setState = newState => {
    states[currentIndex] = newState;
    // 更新界面
    emitUpdateForHooks();
  };
  return [states[hookIndex++], setState];
};

export const resetHookIndex = () => {
  hookIndex = 0;
};

export const useReducer = (reducer, initialState) => {
  states[hookIndex] = states[hookIndex] || initialState;
  const currentIndex = hookIndex;
  const dispatch = action => {
    states[currentIndex] = reducer(states[currentIndex], action);
    // 更新界面
    emitUpdateForHooks();
  };
  return [states[hookIndex++], dispatch];
};

export const useEffect = (callback, deps = []) => {
  const currentIndex = hookIndex;
  const [destroyCallback, preDeps] = states[hookIndex] || [null, null];
  if (!states[hookIndex] || deps.some((item, index) => item !== preDeps[index])) {
    // setTimeout 在EventLoop中是宏任务，所以会在当前宏任务（页面渲染完成后）执行完毕后执行
    setTimeout(() => {
      destroyCallback && destroyCallback();
      // callback() 调用之后返回的其实是 destroyCallback
      states[currentIndex] = [callback(), deps];
    });
  }
  hookIndex++;
};

export const useLayoutEffect = (callback, deps = []) => {
  const currentIndex = hookIndex;
  const [destroyCallback, preDeps] = states[hookIndex] || [null, null];
  if (!states[hookIndex] || deps.some((item, index) => item !== preDeps[index])) {
    queueMicrotask(() => {
      destroyCallback && destroyCallback();
      // callback() 调用之后返回的其实是 destroyCallback
      states[currentIndex] = [callback(), deps];
    });
  }
  hookIndex++;
};

export const useRef = initialValue => {
  states[hookIndex] = states[hookIndex] || { current: initialValue };
  return states[hookIndex++];
};

export const useImperativeHandle = (ref, createHandle) => {
  ref.current = createHandle();
};

export const useMemo = (callback, deps = []) => {
  const currentIndex = hookIndex;
  const [cachedValue, cachedDeps] = states[currentIndex] || [null, null];

  if (!cachedDeps || deps.some((dep, i) => dep !== cachedDeps[i])) {
    // 依赖项变化或首次调用,重新计算
    const newValue = callback();
    states[currentIndex] = [newValue, deps];
    hookIndex++;
    return newValue;
  } else {
    // 依赖项未变化,返回缓存的值
    hookIndex++;
    return cachedValue;
  }
};

export const useCallback = (callback, deps = []) => {
  const currentIndex = hookIndex;
  const [cachedCallback, cachedDeps] = states[currentIndex] || [null, null];

  if (!cachedDeps || deps.some((dep, i) => dep !== cachedDeps[i])) {
    // 依赖项变化或首次调用,创建新的回调函数
    states[currentIndex] = [callback, deps];
    hookIndex++;
    return callback;
  } else {
    // 依赖项未变化,返回缓存的回调函数
    hookIndex++;
    return cachedCallback;
  }
};
