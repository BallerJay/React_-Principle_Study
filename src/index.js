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
// ReactDOM.render(<MyClassComponent className="2" />, document.getElementById('root'));

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
// let ref = React.createRef();
// let MyForwardFunctionComponent = React.forwardRef((props, ref) => {
//   return (
//     <div ref={ref} {...props}>
//       forwardRef_Text
//       <span>222</span>
//     </div>
//   );
// });

// // console.log(<MyForwardFunctionComponent ref={ref} />, 'MyForwardFunctionComponent');
// // debugger;
// ReactDOM.render(
//   <MyForwardFunctionComponent className="test" ref={ref} />,
//   document.getElementById('root')
// );

// ------------------------------- DOM Diff -------------------------------
// class MyClassComponent extends React.Component {
//   isRest = false;
//   oldArr = ['A', 'B', 'C', 'D', 'E'];
//   newArr = ['C', 'B', 'E', 'F', 'A'];
//   constructor(props) {
//     super(props);
//     this.state = {
//       arr: this.oldArr,
//     };
//   }
//   updateShowArr() {
//     this.setState({ arr: this.isRest ? this.oldArr : this.newArr });
//     this.isRest = !this.isRest;
//   }
//   render() {
//     return (
//       <div>
//         <div
//           className="test-class"
//           style={{
//             color: 'red',
//             cursor: 'pointer',
//             border: '1px solid gray',
//             borderRadius: '6px',
//             display: 'inline-block',
//             padding: '6px 12px',
//           }}
//           onClick={() => this.updateShowArr()}>
//           Change The Text
//         </div>
//         <div>
//           {this.state.arr.map((item, index) => {
//             return <div key={item}>{item}</div>;
//           })}
//         </div>
//       </div>
//     );
//   }
// }

// ReactDOM.render(<MyClassComponent />, document.getElementById('root'));

// ------------------------------- Life Circle -------------------------------
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  /**
   * 1. 在组件挂载到页面上之后调用
   * 2. 需要依赖真实DOM节点的相关初始化动作需要放在这里
   * 3. 适合加载数据
   * 4. 适合事件订阅
   * 5. 不适合在这里调用setState
   */
  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
    console.log('componentDidMount');
  }

  /**
   * 1. 组件从DOM树上卸载完成之前调用。
   * 2. 执行一些清理操作，比如清除定时器，取消事件订阅，取消网络请求等等。
   * 3. 不能在该函数中执行this.setState，不会产生新的渲染。
   */
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  /**
   * 1. 更新完成后调用，初始化渲染不会调用。
   * 2. 当组件完成更新，需要对DOM进行某种操作的时候，适合在这个函数中进行。
   * 3. 当当前的props和之前的props有所不同的时候，可以在这里进行有必要的网络请求。
   * 4. 这里虽然可以调用setState，但是要记住是有条件的调用，否则会陷入死循环。
   * 5. 如果shouldComponentUpdate返回false，componentDidUpdate不会执行。
   * 6. 如果实现了getSnapshotBeforeUpdate，componentDidUpdate会在它之后执行，componentDidUpdate会接收到第三个参数
   */
  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps, prevState, 'componentDidUpdate');
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate');
    return true;
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<Clock />);
ReactDOM.render(<Clock />, document.getElementById('root'));
