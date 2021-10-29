---
layout : post
published : true
title : Redux와 Context의 차이
subtitle : 상태 관리와 전달
tags : [redux, context, state, 상태, 전달, 관리]
--- 

최근(벌써 작년이 되어버렸다) 전역 상태 관리를 고민하고 있었는데 [전역 상태 관리에 대한 단상](https://jbee.io/react/thinking-about-global-state) 블로그를 읽고 한참을 더 생각하다가 우연히 [Context는 상태 관리하는 것이 아니다](https://twitter.com/acemarke/status/1347717322673414146)를 재미있게 읽게 되었다. 한참을 재밋게 읽어가며 Redux와 Context에 대해 한번 더 고민하고 정리하던 중 [해당 트윗에 대한 질문들을 정리한 내용](https://blog.isquaredsoftware.com/2021/01/blogged-answers-why-react-context-is-not-a-state-management-tool-and-why-it-doesnt-replace-redux/)이 올라왔고 나만의 생각을 정리해두고자 한다.

------
#### `Redux를 사용하는게 맞을까?`
전역 상태 관리를 위해 Redux를 사용하고 있다. 
  
API 응답값이나 둘 이상의 화면에서 공유되는 상태값들을 전부 전역으로 관리하고 있는데 이것이 `과연 전부 전역으로 관리되는 것이 맞을까?` 하는 생각을 하게 되었다.
  
- 전역 상태를 받아오게 되면서 현재 필요하지 않은 상태의 업데이트에도 모든 컴포넌트가 영향을 받고 있는 것 아닐까?
- 쌓여있는 여러 컴포넌트들이 전역 상태를 바라보고 있고 전역 상태 변화에 의해 다시 렌더링 될 수 있으며 이를 방지하기 위해 최적화 작업이 필요했다
- 이러한 과정에서 과도하게 사용하고 있는 전역 상태로 인해 불필요한 최적화가 오히려 최적화를 방해하고 있지는 않을까?
  
이러한 생각을 정리하다가 [전역 상태 관리에 대한 단상](https://jbee.io/react/thinking-about-global-state)을 읽게 되었고 전역 상태 관리를 따라 이끌려간 곳에서 만난 이 [글](https://twitter.com/acemarke/status/1347717322673414146)을  더 흥미롭게 읽게 되었다.
  
([참고: 전역 상태 관리에 대해 다양하게 찾아보다가 - My State Management Mistake](https://epicreact.dev/my-state-management-mistake) →  `Almost all state was globally managed by the library.`)

------

#### `Context를 왜 사용했을까`

Root의 상태 값을 하위 컴포넌트에서도 사용하고자 하는 경우 이를 Redux에 올려서 관리하는 것 까지는 필요가 없다고 생각되는 부분에 대해서 Context를 사용하고 있다.

이 상태는 Root에 있으며 Root의 setState를 통해 업데이트된다. 이 상태가 변경되는 순간에 Context가 어떤 영향력을 주고 있을까 하고 생각해보면 `아무것도 하고 있지 않다`.

Context는 단순하게 Root의 상태 값을 머나먼 곳으로 전달해주고 있는 것이지 상태를 관리하는 것이 아니였다. [prop-drilling](https://kentcdodds.com/blog/prop-drilling)을 해결하려는 목적이다.

------

#### `무엇을 하고자 했을까`

이 [글](https://twitter.com/acemarke/status/1347717322673414146)의 `Context가 무엇을 위한 것인가` 하는 스레드를 재밋게 읽었고 `Redux와 Context가 과연 상태 관리를 하는 것인지` 그게 아니라면 `무엇을 하고 있는 것인지`에 대한 생각을 시작해보게 되었다.

- `Redux`는 어디서든 접근 가능하다. 그리고 Reducer에서 상태를 변경, 관리하고 있다.
- `Context`도 어디서든 접근 가능하다. 그렇다면 상태도 관리하고 있는걸까?

Redux에서는 상태와 그 상태 관리까지 하는 반면 Context에는 명시한 값 만을 담고 있다. Context에는 변수만 담을 수도 있고 어디서든 실행할 수 있는 루트 함수를 담을 수도 있다. Context가 `Provider와 Consumer로 구성된 이유` 가 있지 않을까?

Context를 사용하지 않았다면 Redux를 사용했을 것이다. 그러나 상태 관리를 필요로 하는 것이 아닌 단순 전달만을 위한 목적이였기에 Context를 사용하였다.

`Context로 상태를 관리하는 것이 아니라 Context로 전달 받은 상태를 업데이트 할 수 있는 함수를 호출`하는 것이다. 이 상태는 Context가 아닌 Root에서 관리되고 있으며 Context가 전달하는 것 뿐이다.

------

이미 대부분의 상태를 Redux에서 관리하고 있다. 전역으로 상태가 관리되고 있기 때문에 전혀 연관되지 않은 컴포넌트에서도 불필요한 상태 업데이트들이 일어나고 있다.

전역 상태가 변경되는 시점에 전체적으로 업데이트가 필요한 상태라면 전역으로 관리되는 것이 좋은 상태라고 생각한다. 하지만 특정 상태값을 필요로하는 컴포넌트나 시점이 명확하게 있다면 그러한 상태는 전역으로 관리하는 것보다 분리하여 관리하는 것이 더 좋은 구조가 되지 않을까?

단순히 전역에서 접근이 가능하길 바라는 것이라면 Context로 전달하고 전역 상태는 좀 더 가볍게 가져가도록 해봐야겠다.