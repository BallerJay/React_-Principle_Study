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
