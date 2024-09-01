import { emitUpdateForHooks } from '../react-dom/src/ReactDomLegacy';

let states = [];
let hookIndex = 0;
export const useState = initialValue => {
  console.log(hookIndex, 'hookIndex');
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
