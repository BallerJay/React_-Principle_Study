import React, { useState, useReducer, useEffect, useLayoutEffect } from './react';
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

// // ------------------------------- Life Circle -------------------------------
// class Clock extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { date: new Date() };
//   }

//   /**
//    * 1. 在组件挂载到页面上之后调用
//    * 2. 需要依赖真实DOM节点的相关初始化动作需要放在这里
//    * 3. 适合加载数据
//    * 4. 适合事件订阅
//    * 5. 不适合在这里调用setState
//    */
//   componentDidMount() {
//     this.timerID = setInterval(() => this.tick(), 1000);
//     console.log('componentDidMount');
//   }

//   /**
//    * 1. 组件从DOM树上卸载完成之前调用。
//    * 2. 执行一些清理操作，比如清除定时器，取消事件订阅，取消网络请求等等。
//    * 3. 不能在该函数中执行this.setState，不会产生新的渲染。
//    */
//   componentWillUnmount() {
//     clearInterval(this.timerID);
//   }

//   /**
//    * 1. 更新完成后调用，初始化渲染不会调用。
//    * 2. 当组件完成更新，需要对DOM进行某种操作的时候，适合在这个函数中进行。
//    * 3. 当当前的props和之前的props有所不同的时候，可以在这里进行有必要的网络请求。
//    * 4. 这里虽然可以调用setState，但是要记住是有条件的调用，否则会陷入死循环。
//    * 5. 如果shouldComponentUpdate返回false，componentDidUpdate不会执行。
//    * 6. 如果实现了getSnapshotBeforeUpdate，componentDidUpdate会在它之后执行，componentDidUpdate会接收到第三个参数
//    */
//   componentDidUpdate(prevProps, prevState) {
//     console.log(prevProps, prevState, 'componentDidUpdate');
//   }

//   shouldComponentUpdate(nextProps, nextState) {
//     console.log('shouldComponentUpdate');
//     return true;
//   }

//   tick() {
//     this.setState({
//       date: new Date(),
//     });
//   }

//   render() {
//     return (
//       <div>
//         <h1>Hello, world!</h1>
//         <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
//       </div>
//     );
//   }
// }

// // const root = ReactDOM.createRoot(document.getElementById('root'));
// // root.render(<Clock />);
// ReactDOM.render(<Clock />, document.getElementById('root'));

// // ------------------------------- Life Circle(getDerivedStateFromProps) --------------------------------
// class DerivedState extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       email: 'zhangsanfeng@163.com',
//       preveUserId: 'zhangsanfeng',
//     };
//   }

//   static getDerivedStateFromProps(nextProps, prevState) {
//     console.log(nextProps, prevState, 'getDerivedStateFromProps');
//     if (nextProps.userId !== prevState.preveUserId) {
//       return {
//         preveUserId: nextProps.userId,
//         email: nextProps.userId + '@xxx.com',
//       };
//     }
//     return null;
//   }

//   render() {
//     console.log(333);
//     return (
//       <div>
//         <h1>email:</h1>
//         <h2>{this.state.email}</h2>
//       </div>
//     );
//   }
// }
// class ParentClass extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       id: 'zhangsanfeng',
//     };
//   }

//   changeUserId = () => {
//     this.setState({ id: 'dongfangbubai' });
//   };
//   render() {
//     return (
//       <div>
//         <input type="button" value="点击改变UserId" onClick={() => this.changeUserId()} />
//         <DerivedState userId={this.state.id} />
//       </div>
//     );
//   }
// }

// ReactDOM.render(<ParentClass />, document.getElementById('root'));

// // ------------------------------- Life Circle(getSnapshotBeforeUpdate(prevProps, prevState)) --------------------------------

// class ScrollingList extends React.Component {
//   isAppend = true;
//   count = 0;
//   intervalID = 0;
//   constructor(props) {
//     super(props);
//     this.listRef = React.createRef();
//     this.state = {
//       list: [],
//     };
//   }

//   getSnapshotBeforeUpdate(prevProps, prevState) {
//     // 我们是否要向列表中添加新内容？
//     // 捕获滚动的​​位置，以便我们稍后可以调整滚动。
//     // console.log(this.state, prevState.list, '---');
//     if (prevState.list.length < this.state.list.length) {
//       const list = this.listRef.current;
//       return list.scrollHeight - list.scrollTop;
//     }
//     return null;
//   }

//   componentDidUpdate(prevProps, prevState, snapshot) {
//     // 如果我们有快照值，那么说明我们刚刚添加了新内容。
//     // 调整滚动，使得这些新内容不会将旧内容推出视野。
//     //（这里的 snapshot 是 getSnapshotBeforeUpdate 返回的值）
//     if (snapshot !== null) {
//       const list = this.listRef.current;
//       list.scrollTop = list.scrollHeight - snapshot;
//     }
//   }

//   componentWillUnmount() {
//     clearInterval(this.intervalID);
//   }

//   appendData = () => {
//     if (this.isAppend) {
//       this.intervalID = setInterval(() => {
//         this.setState({
//           list: [...this.state.list, this.count++],
//         });
//       }, 1000);
//     } else {
//       clearInterval(this.intervalID);
//     }
//     this.isAppend = !this.isAppend;
//   };

//   render() {
//     return (
//       <div>
//         <input type="button" onClick={() => this.appendData()} value="追加/暂停追加数据" />
//         <div
//           ref={this.listRef}
//           style={{
//             overflow: 'auto',
//             height: '400px',
//             backgroundColor: '#efefef',
//           }}>
//           {this.state.list.map(item => {
//             return (
//               <div
//                 key={item}
//                 style={{
//                   height: '60px',
//                   padding: '10px',
//                   marginTop: '10px',
//                   border: '1px solid #ccc',
//                   borderRadius: '5px',
//                 }}>
//                 {item}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   }
// }

// ReactDOM.render(<ScrollingList />, document.getElementById('root'));

// ------------------------------- pureComponent/memo --------------------------------
// class Greeting extends React.PureComponent {
//   render() {
//     console.log(this.props, 'update');
//     return <h1>Hello- {this.props.name}</h1>;
//   }
// }

// const Greeting = React.memo(({ name }) => {
//   console.log(name, 'update');
//   return <h1>Hello- {name}</h1>;
// });

// class MyClassApp extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       name: '张三',
//       address: '北京',
//     };
//   }

//   setName = name => {
//     this.setState({ name });
//   };

//   setAddress = address => {
//     this.setState({ address });
//   };

//   componentDidUpdate() {
//     console.log('componentDidUpdate');
//   }

//   render() {
//     return (
//       <div>
//         <label>
//           Name{': '}
//           <input value={this.state.name} onInput={e => this.setName(e.target.value)} />
//         </label>
//         <label>
//           Address{': '}
//           <input value={this.state.address} onInput={e => this.setAddress(e.target.value)} />
//         </label>
//         <Greeting name={this.state.name} />
//       </div>
//     );
//   }
// }

// ReactDOM.render(<MyClassApp />, document.getElementById('root'));

// ------------------------------- Hooks -------------------------------
// ------------------------------- useState -------------------------------
// function Counter() {
//   const [count, setCount] = useState(0);
//   const handleClick = () => {
//     setCount(count + 1);
//   };
//   return (
//     <div>
//       <p>Count: {count}</p>
//       <button onClick={handleClick}>Increment</button>
//     </div>
//   );
// }

// ReactDOM.render(<Counter />, document.getElementById('root'));

// ------------------------------- useReducer -------------------------------
// function reducer(state, action) {
//   if (action.type === 'increment') {
//     return { age: state.age + 1 };
//   }
//   return state;
// }
// function Counter() {
//   const [state, dispatch] = useReducer(reducer, { age: 42 });

//   return (
//     <div>
//       <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
//       <p>Hello! You are {state.age}</p>
//     </div>
//   );
// }

// ReactDOM.render(<Counter />, document.getElementById('root'));

// ------------------------------- useEffect -------------------------------

export function createConnection(serverUrl, roomId) {
  // 真正的实现会实际连接到服务器
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    },
  };
}

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useLayoutEffect(() => {
    console.log('useLayoutEffect');
  })

  useEffect(() => {
    console.log('useEffect');
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <div>
      <label>
        Server URL: <input value={serverUrl} onInput={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </div>
  );
}

function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <div>
      <label>
        Choose the chat room:{' '}
        <select value={roomId} onChange={e => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>{show ? 'Close chat' : 'Open chat'}</button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
