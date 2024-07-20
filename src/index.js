import React from './react';
import ReactDOM from './react-dom';
// import React from 'react'
// import ReactDOM from 'react-dom/client';

// React18创建初始化方法
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<div>Hello World</div>);

// React旧版本初始化方法
// ReactDOM.render(
//   <div style={{ color: 'red' }} className="test">
//     Hello Simple React222<span>---</span>
//   </div>,
//   document.getElementById('root')
// );

// ------------------------------- 创建函数式组件 -------------------------------

// function MyFunctionComponent(props) {
//   return (
//     <div style={{ color: 'red' }} className="test">
//       Function Component<span>---</span>
//     </div>
//   );
// }

// ReactDOM.render(<MyFunctionComponent className="2" />, document.getElementById('root'));

// ------------------------------- 创建类组件 -------------------------------

// class MyClassComponent extends React.Component {
//   counter = 0;
//   constructor(props) {
//     super(props);
//     this.state = {
//       name: 'Summer',
//       count: '0',
//     };
//   }
//   updateShowCount(newValue) {
//     this.setState({
//       count: newValue + '',
//     });
//   }
//   render() {
//     return (
//       <div style={{ color: 'red' }} className="test">
//         Simple React {this.state.count}
//         <button onClick={() => this.updateShowCount(++this.counter)}>click</button>
//       </div>
//     );
//   }
// }

// ------------------------------- ref -------------------------------
// class CustomTextInput extends React.Component {
//   constructor(props) {
//     super(props);
//     // create a ref to store the textInput DOM element
//     this.textInput = React.createRef();
//     this.focusTextInput = this.focusTextInput.bind(this);
//     this.show100 = this.show100.bind(this);
//     this.myClassComponentRef = React.createRef();
//   }

//   focusTextInput() {
//     // Explicitly focus the text input using the raw DOM API
//     // Note: we're accessing "current" to get the DOM node
//     this.textInput.current.focus();
//   }

//   show100() {
//     // console.log(this.myClassComponentRef, 'this.myClassComponentRef');
//     this.myClassComponentRef.current.updateShowCount(100);
//   }

//   render() {
//     // tell React that we want to associate the <input> ref
//     // with the `textInput` that we created in the constructor
//     return (
//       <div>
//         <input type="text" ref={this.textInput} />
//         <input type="button" value="Focus the text input" onClick={this.focusTextInput} />
//         <input type="button" value="update Counter" onClick={this.show100} />
//         {/* <MyClassComponent ref={this.myClassComponentRef} /> */}
//       </div>
//     );
//   }
// }
// ReactDOM.render(<CustomTextInput xx="123" />, document.getElementById('root'));

// ------------------------------- forwardRef -------------------------------
let ref = React.createRef();
let MyForwardFunctionComponent = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} {...props}>
      forwardRef
      <span>222</span>
    </div>
  );
});

// console.log(<MyForwardFunctionComponent ref={ref} />, 'MyForwardFunctionComponent');
debugger;
ReactDOM.render(
  <MyForwardFunctionComponent className="test" ref={ref} />,
  document.getElementById('root')
);
