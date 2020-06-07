---
layout : post
published : true
title : 리덕스 사가 사이드 이펙트 - call
subtitle : 문서가 답이다 그리고 검색
tags : [redux, saga, context]
---
`react-native-firebase`을 사용하려고 한다. 그리고 비동기로 호출되는 `requestPermission`을 `saga`에서 제어하고자 했다.
그리고 자연스럽게 호출했는데 아무런 값을 찾지 못해 실행되지 않았다. 왜? 단지 `async-await`을 `yield`로 한건데...
  
#### `side effect`
문서에는 `call`, `put`, `all`, `takeEvery`, `takeLatest` 많은 사이드 이펙트가 있으나 멱등성만 지켜지면 `takeEvery`와 `takeLatest`로 모든걸 할 수 있을거라 생각했다. 그럼 왜 수 많은 사이드 이펙트가 있을까? 몰라서 사용하지 못하는게 아니라 골라서 사용하길 바라는 마음으로 문서를 읽어본다.
  
#### `react-native-firebase`
```es6
// 기존
const request = async () => {
const messaging = await firebase.messaging();
    await messaging.requestPermission();
}

// 변경
function* workRequestPermission() {
    const messaging = yield call(firebase.messaging);

    // 1
    yield call(messaging.requestPermission);

    // 2
    yield messaging.requestPermission();

    // 3
    yield call([this, messaging.requestPermission]);
}
```
기존의 `async-await`으로 작성한 코드를 `saga`로 옮겨서 작성하였다. 그리고 1번 코드에서는 `messaging`에서 `requestPermission`을 찾을 수 없다는 에러메세지를 만나게 되었다. 왜 그럴까 생각하며 `call`에서 빼내어 2번 코드를 작성했더니 이번엔 정상적으로 동작한다.
`call`이 수상한데 생각하며 문서를 열어보니 `context`라는게 눈에 보인다. 그렇다면 `call`에서 바라보고 있는 `context`는 어디일까?
똑같이 동작을 하는데 `call`을 사용하는 이유가 있을까? 바인딩에 대하여 많이 보던 세트 `call`, `apply`, `bind` 이들이 중요하게 여기던건 `context`이고 `saga`에서도 동일하게 생각해보면 `context`를 지정해줄 수 있기 때문에 `call`, `apply` 사이드이펙트를 사용하는 것이라 생각된다.
  
#### `context`
`화살표 함수`를 사용하면서 바인딩을 잊고 있었다. 화살표 함수는 `함수 내부 this`로 바인딩 해준다. 그렇다면 saga에서 requestPermission이 실행된 `context`는 함수 내부일까 전체일까?
사가 함수는 화살표함수가 아니다. 그럼 this는 글로벌이다. 첫번째 호출된 requestPermission에서는 글로벌 this가 자동 바인딩 되어있고 글로벌에서는 함수 내부에만 존재하는 messaging을 가져올수 없다.
두번째에는 이미 찾아둔 messaging을 가져와서 그대로 호출했다.
call에 context 인자를 넣어주지 않으면 자동으로 함수 내부의 this가 바인딩 되니깐 마지막에서는 this를 명시해주었고
이는 함수 내부를 가리키며 messaging을 찾을 수 있었다.

#### `blocking`
call을 사용하는 이유에 대해 찾아보다가 `blocking`이라는게 눈에 들어왔다.
동시에 여러 프로세스가 실행될때, 해당 포인트를 블로킹함으로써 안정성을 주려는 것이다.
그럼 이게 사가에서 필요한 이유가 있을까?
사가는 비동기를 제어한다. 보통 api를 호출한다. 그렇다면 post api를 동시에 여러곳에서 호출면서 그와 동시에 get을 가져오고 있다면?
맨 처음 호출된 post와 마지막에 호출된 post는 과연 어떤 상태의 데이터를 바라보고 있을까?
마치 setState에서 업데이터 함수로 최신데이터를 가져와서 사용하는 느낌이랄까
  
#### `선언적 vs 명령적`
사가 이펙트들을 찾아서 비교해보다가 어떤 [글](https://medium.com/@adlusk/a-newbs-guide-to-redux-saga-e597d8e6c486)을 보게 되었다.
여기서 `call`로 한번 감싸서 호출하는 것을 `imperative`와 `declarative`의 차이가 있다고 설명하고 있다.
`firebase`를 사가에서 호출하면서 call에 context를 명시해주어야만 의도대로 작동했는지 한번 더 생각해보았다.
call로 감싸지 않고 `yield messaging.requestPermission()`하게 되면 앱이 초기화 될때 이미 실행이 되어버린다고 한다.
`yield call(messaging.requestPermission)`는 선언만 해두고 해당 액션이 호출 될때 실행되면서 두가지 호출 방식에 context가 다르게 적용되어 있다고 생각된다.
  
## 
사가 이펙트를 너무 사용했다. 고민해보지 않았다. 액션은 `put`, 호출은 `call`.
그리고 무심코 사용한 이펙트로 인해 코드는 의도대로 작동하지 않았고 덕분에 한번 더 찾아볼 수 있게 되었다.
처음부터 잘 읽어보면 좋겠지만 직접 문제에 마주하는 것도 좋은 효과이지 않을까...
  
[참고: redux-saga 가이드](https://medium.com/@adlusk/a-newbs-guide-to-redux-saga-e597d8e6c486)