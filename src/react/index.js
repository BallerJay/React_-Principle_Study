import { createElement } from './src/React';
import { Component, PureComponent } from './src/ReactBaseClasses';
import { createRef } from './src/ReactCreateRef';
import { forwardRef } from './src/ReactForwardRef';
import { memo } from './src/ReactMemo';

export * from './ReactHooks';

const React = {
  Component,
  createElement,
  createRef,
  forwardRef,
  PureComponent,
  memo,
};

export default React;
