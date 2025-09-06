---
slug: /blog/kotlin-study-ch16
date: 2021-06-30
layout: post
published: true
title: 마지막 스터디! 코루틴으로 비동기 처리하기
subtitle: Chapter 16 비동기 프로그래밍
tags: [코틀린, 스터디, kotlin]
---

```markdown
[참고 도서]

- 다재다능 코틀린 프로그래밍
```

# 개요

- 코루틴을 이용해 `논블로킹 호출`을 `동시` 실행하거나 다른 코루틴 컨텍스트를 사용해 `병렬`로 실행할 수 있다
- 코루틴 비동기 예외 처리 방법과 시작한 코루틴을 취소하는 방법을 알아본다
- 취소와 예외의 상호작용과 supervisor job으로 부모/자식 관계의 코루틴을 관리해본다
- `launch` 가 아닌 `async-await` 으로 비동기 프로그래밍을 작성해본다

# 비동기 프로그래밍

- 즉시 실행되지 않는 작업들을 블로킹하지 않고 프로그램의 효울을 위해 비동기로 실행하고자 한다
  - ex) 응답시간이 긴~~ API 호출

### 동기식 호출

```kotlin
fun main() {
	val params = listOf("A", "B", "C")
	val list: List<Response> = params.mapNotNull { param ->
		API.callToAction(param) // 엄청나게 시간 오래 걸리는 API 호출
	}

	list.forEach { response ->
		println("API 호출 이후 무언가 연산 작업이 또 필요하다 $response")
	}
}
```

- 시간이 오래 걸리는 작업을 동기식으로 실행하게 된다면?
  - 코드가 블로킹 방식으로 실행된다
  - 첫번째 param에 대한 `API.callToAction` 코드 실행이 완료될때까지 다음 param에 대한 실행이 시작되지 않는다
  - 모든 `API.callToAction` 연산을 매번 긴 시간동안 기다려줘야한다
    - 만약 10초가 걸린다면 총 30초가 걸리게 되는것
- 위 코드를 논블로킹 + 비동기 실행으로 바꾸면?
  - 매번 `API.callToAction` 을 기다릴 필요 없이 그냥 호출해버리고 다음 param으로 넘어간다
  - 여러 요청을 동시에 처리할 수 있게 되어 총 작업 시간을 줄어든다
  - 그러나 list에 들어온 값이 과연 `API.callToAction` 이 완료된 이후 값이라고 장담할 수 없다
  - 따라서 안전한 비동기 실행을 위해 `차단, 대기`라는 상태가 필요하다

### 비동기 호출

- launch는 비동기 처리 후 결과값을 반환하지 않기 때문에 `async-await` 을 사용해서 구현한다
- 논블로킹 처리를 반복문에서 직접 사용 하게 되면 그 내부에서 호출되는 작업이 오래걸리는 코드(API.callToAction)는 같은 컨텍스트에서 코루틴이 걸리므로 동기 처리와 동일해진다
  - `async(API.callToAction(param))` 이런식으로...
  - 논블로킹 + 동기 ⇒ 효율이 없다...
- 그렇다면 컨텍스트를 직접 명시해서 코루틴을 실행하면 된다

  ```kotlin
  fun main() = runBlocking {
  	val params = listOf("A", "B", "C")
  	val list: List<Deferred<Response?>> = params.map { param ->
  		async(Dispatchers.IO) { // 비동기 코드를 준비만 해둔 상태
  			API.callToAction(param)
  		}
  	}

  	list
  		.mapNotNull { response -> response.await() } // 비동기 호출하는 시점
  		.forEach { response ->
  			println("API 호출 이후 무언가 연산 작업이 또 필요하다 $response")
  		}
  }
  ```

  - `async` 의 반환 타입인 `Deferred<T>` 로 변경하였다
  - 처음 list를 생성할때 비동기 실행이 되는 것이 아니라 저장만 할 뿐 `await` 으로 호출하는 시점에 비동기 작업이 이뤄진다

- `**async()` 와 `async(Dispatchers.IO)` 의 차이점?\*\*
  - main스레드가 await을 만나면 코루틴을 실행시킨다
  - 컨텍스트를 명시해주었기 때문에 `Dispatchers.IO 풀` 의 스레드가 작업을 하는 동안 `main 스레드는 쉬고 있다`

# 예외 처리

- 작업이 비동기 처리가 되는 동안 무슨일이 발생할지 모르기 때문에 `방어 로직` 이 필요하다
  - optional도 데이터가 없는 경우를 방어 처리 한 것

### launch + Exception

- launch는 코루틴이 시작됐다는 의미를 가지는 Job 객체를 반환한다(≠ 비동기 결과값)
  - Job 객체는 코루틴의 성공/실패 여부가 아닌 코루틴이 종료되는 것을 기다리는데 사용한다
  - isCancelled 라는 프로퍼티로 코루틴이 성공적으로 완료되었는지, 실패해서 취소되었는지를 확인할 수 있다
- `launch로 비동기 처리를 했다면 호출자가 예외를 받을 수 없다`
  - 왜? 예외를 왜 위로 던지지 않는걸까
  - 내부적으로 무언가 처리가 되어있는건가
  - 단순히 launch를 try-catch로 감싸도 예외 처리가 되지 않는다 ⇒ `예외 핸들러` 를 직접 설정해주어야 한다

```kotlin
fun main() = runBlocking {
	val handler = CoroutineExceptionHandler { context, ex ->
		// 예외 핸들러
	}

	try {
		launch(Dispatchers.IO + handler + SupervisorJob()) { // 컨텍스트 명시 + 예외 핸들러
			// 비동기 작업
		}
	} catch (ex: Exception) {
		// 예외
	}
}
```

- 예외 핸들러로 처리하지 않은 예외로 실패하게 되면 코루틴을 취소시켜 버린다
  - 자식이 취소되면 부모도 취소된다
  - 그러나 슈퍼바이저 잡을 이용해 자식만 취소되고 부모까지 전파하지 않도록 처리할 수 있다...

### async + Exception

- async를 사용하면 `Deferred<T>` 인스턴스를 반환한다
  - 그리고 await가 호출되면 `Deferred<T>` 인스턴스가 해당 호출자에게 예외를 전달한다

```kotlin
fun main() = runBlocking {
	val call = async(Dispatchers.IO + handler + SupervisorJob()) { // 컨텍스트 명시 + 예외 핸들러
		// 비동기 작업
	}

	try {
		call.await() // 비동기 호출
	} catch (ex: Exception) {
		// 예외
	}
}
```

# 코루틴 취소

- 코루틴 취소가 발생하는 이유
  - 내부적으로 더 이상 처리할 작업이 없는 경우
  - 작업이 실패한 경우
  - 부모 코루틴이 강제로 취소시키는 경우
- 코루틴을 취소하면 코루틴 내부의 코드는 더 이상 실행되지 않는다
  - 스레드 종료와는 연관이 없고 컨텍스트를 공유하는 코루틴 계층구조에 영향을 끼친다

### 코루틴 취소

- 코루틴 취소를 직접 명시할 수 있다
  - launch의 리턴 객체 Job의 cancel 메소드
  - async의 리턴 객체 Deferred의 cancelAndJoin 메소드
  - 그러나 코루틴은 현재 서스펜션 포인트가 존재하는 경우에만 취소가 가능하다
- 서스펜션 포인트를 여러개 두면서 코루틴 활성 상태를 체크하는 구조로 만들어야 한다
  - 서스펜션 포인트에 진입한 코루틴은 서스펜션 포인트 내부에서 던진 예외를 받을 수 있다
  - 서스팬션 포인트의 코루틴이 활성화된 상태인지 취소되었는지 확인 할 수 있다

### 방해금지 컨텍스트 (=비밀의방)

- `withContext(NonCancellable)`
  - 해당 컨텍스트에 들어가 있으면 코루틴 취소 요청이 중간에 와도 무시하고 작업이 완료된다
  - 그러나 코루틴 활성 상태 여부 값 자체는 변경되기 때문에 작업이 완료되고 나서 활성 상태에 따라 이후 처리를 해줄 수 있다

### 양방향 취소

- 코루틴은 컨텍스트를 공유하는 다수의 코루틴이 계층관계를 구성할때 구조적 동시성을 제공한다
  - 코루틴에서 컨텍스트를 공유하는 새로운 코루틴을 생성하면 부모-자식 관계가 형성된다
  - 자식이 완료되어야 부모 코루틴도 완료될 수 있다
  - 부모를 취소하면 자식들도 모두 취소된다
    - 자식 코루틴이 정지하면 부모도 정지하므로 형제도 취소된다
- 연관 관계에 있는 코루틴들이 모두 취소 되는 것이 기본 동작이다
  - 슈퍼바이저 잡을 이용해 부모 → 자식 단방향으로만 취소가 가능하도록 변경할 수 있다

### 슈퍼바이저 잡

- 자식 ↔ 부모 양방향으로 취소 시켜버리는 관계를 단반향으로만 취소할 수 있도록 슈퍼바이저를 적용한다

  - 컨텍스트나 예외 핸들러를 명시하는 것처럼 슈퍼바이저도 전달할 수 있다
    - `launch(context + handler + supervisor)`
  - `supervisorScope` 호출로 코드를 감싸서 적용할 수 있다

    ```kotlin
    launch {
    	supervisorScope { ... }
    }
    ```

- 명확하게 독립된 작업을 하는 자식 코루틴 계층 구조를 구성하고 싶을때 슈퍼바이저를 적용한다
  - 슈퍼바이저를 적용하면 부모가 취소된 경우에만 자식이 취소된다
  - 자식에서 부모나 형제 관계는 영향을 주지 않는다

# 타임아웃

- 코루틴이 일정 시간 이상 응답이 없다면 타임아웃 예외로 취소할 수 있다

  ```kotlin
  fun main() = runBlocking {
  	val handler = CoroutineExceptionHandler { context, ex ->
  		// 예외 핸들러
  	}

  	launch(Dispatchers.IO + handler + SupervisorJob()) {
  		withTimeout(3000) {
  			// 비동기 작업
  		}
  	}
  }
  ```

  - 만약 명시된 3초 이상 걸리는 비동기 작업이 발생한다면 타임아웃으로 해당 코루틴을 취소해버린다

# 결론

- 코루틴은 비동기 실행 + 예외처리를 제공한다
- 코루틴을 이용해 `동시실행, 비동기` 코드를 `순차실행, 동기` 코드와 유사한 구조로 유지할 수 있다
  - 순차+동기 코드를 동시+비동기 코드로 연산을 위해 변경 작업 비용을 줄여준다
- 코루틴의 계층구조로 매핑하는 것은 실행 라이프사이클을 관리하기 쉽게 해준다
- 타임아웃을 사용해 실행시간을 제어할 수 있고 슈퍼바이저 잡을 설정해 계층구조 내의 코루틴 상호작용을 제어할 수 있다

# 🚨?!?!?

-

# 🙈 더 알아보기

- 블로킹-논블로킹
  - 블로킹: 작업이 완료되고 응답이 오는 것을 기다려야만 한다
  - 논블로킹: 작업을 호출하기만하고 작업 완료 응답을 기다리지 않고 자신의 작업을 계속 이어간다
  - 동기+블로킹
  - 비동기+블로킹
  - 동기+논블로킹
  - 비동기+논블로킹
  - [참고: IO모델 (동기vs비동기vs블로킹vs논블로킹)](<[https://sjh836.tistory.com/109](https://sjh836.tistory.com/109)>)
