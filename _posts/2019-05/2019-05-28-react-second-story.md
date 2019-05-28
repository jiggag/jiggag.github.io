---
layout: post
published: true
title : 나의 리액트 두번째 이야기
subtitle : TypeScript 꼭 해야겠니
tags: [javascript,es6,react,typescript]
---
## 나의 리액트 두번째 이야기
리액트를 시작한지 2달정도... 아직 자바스크립트도 찾아보는 실력에 타입스크립트를 꼭 해야만 하는 걸까  

물론 배우면 좋을 것이다. 그러나 너무 벅찬 나의 메모리.  
  
#### Redux
프로젝트 전역에서 공통적으로 쓰이는 데이터의 경우 매번 호출하지 않고 Redux에 담아두고 접근할 수 있다. 이번 프로젝트에서는 어디에 적용해야할지
찾지 못했다... 내 눈에는 보이지 않을뿐. 사용자가 어느 화면에서든 접근할 수 있는 장바구니가 Redux의 가장 대표적인 예시이다.  
  
#### React-Hooks : React
```js
useEffect : componentDidMount  
useState : constructor  
useCallback : memoized  
```
리액트 훅스는 클래스형 컴포넌트로 구현하였을때 리액트의 함수들을 대신할 수 있는 것이라 생각한다.  
  
#### Redux-React-Hooks : Redux
```js
useMappedState : mapStateToProps  
useDispatch : mapDispatchToProps  
```
리덕스에도 훅스가 있는데 이것도 리액트 훅스와 마찬가지로 리덕스를 클래스형 컴포넌트에서 구현할 수 있도록 해준다.  
  
#### useState
state를 선언하는 방법으로 훅스인 useState을 이용하거나 defaultProps로 선언 후 컴포넌트에 props로 받아와서 사용할 수 있다.  
```js
const Ex = () => {
  const [ state, setState ] = useState(null);
  const [ state ] = useState(null);
}
```
```js
const Ex = ({ state }) => {
  console.log(state);
}
Ex.defaultProps = {
  state: null
};
```
  
#### useReducer
useState를 여러개를 해야할 경우 보다 효율적으로 사용할 수 있다. redux와 같은 방법으로 reducer와 action을 이용하지만 전역적으로 접근할 수 있는 데이터는 아니다.
```js
const [state, reducer] = useReducer(reducer, {name: 'abc', value: 0});
const { name, value } = state;

function reducer(state, action) {
  switch(action.type) {
    case 'CHANGE_NAME':
      return { ...state, name: action.name };
    case 'CHANGE_VALUE':
      return { ...state, value: state.value + action.value };
    default:
      return state;
  }
}

function onClick() {
  dispatch({type: 'CHANGE_NAME', name: 'abcd'});
  dispatch({type: 'CHANGE_VALUE', value: -4});
}

return (
  <div onClick={onClick}>이름{name}, 값{value} 모두 변경</div>
);
```
위와 같은 로직을 거친 후 state는 `{name: 'abcd', value: -4}`로 변경되어있다.  
먼저 초기 state값과 reducer를 설정해두었고 state를 distruction하였다.  
사용하려는 reducer 작성 후 dispatch로 호출하여 사용한다.  
위의 예시에서는 state의 데이터를 변경하기 위해 리듀서를 2번 호출 하였지만,
이런 경우 또 다른 리듀서를 하나 만들어서 한번의 호출로 값들을 변경하는게 좋다고 한다.  
  
#### File Structure
Grouping by features or routes
```js
list/
  List.js
  ListAPI.js
  ListCSS.js
  index.js
detail/
  Detail.js
  DetailAPI.js
  DetailCSS.js
  index.js
```
Grouping by file type
```js
page/
  List.js
  Detail.js
  Join.js
api/
  ListAPI.js
  DetailAPI.js
  JoinAPI.js
```

#### Ducks pattern
한 파일에 actionTypes, actions, reducer 다 같이 모여있는 패턴
```js
// Actions
const LOAD   = 'GET_LOAD';

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case LOAD: return { ...state };
    default: return state;
  }
}

// Action Creators
export function load() {
  return { type: LOAD };
}
```

#### Typescript
```js
{id: number}  
{list: string[]}  
```
이처럼 모든 파라미터마다 타입을 선언해주어야한다.
그렇지 않으면 에러가 파파팍 일어난다.  

api request, response도 타입을 선언할 수 있는데, 타입을 이용하면 코드를 작성할 때 자동 완성 기능을 이용할 수 있어 편리하다.  
다만, 타입스크립트로 작성하는게 까다로울뿐...  
리액트로 프로젝트를 진행하면서 styled-component를 이용했는데 이런 css.js 조차도 타입스크립트로 변경하는게 나에게는 너무 힘들었던 시간이였다.  
처음 한번이 어려웠을뿐, 두번째에도 조금 어려웠으며, 다음에는 조~금 어렵겠지...  


