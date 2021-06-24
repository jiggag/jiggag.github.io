---
layout : post
published : true
title : 드디어 코틀린의 핵... 코루틴
subtitle : Chapter 15 코루틴 탐험하기
tags : [코틀린, 스터디, kotlin]
--- 

```markdown
[참고 도서]
- 다재다능 코틀린 프로그래밍
```

# 코루틴?

- 논블로킹(실행하는데 시간이 걸리는 작업)을 위해서 코루틴을 사용한다
    - 일시중단이 가능한 함수와 함께 사용한다
    - 중간에 실행/중단될 수 있다
    - 컨티뉴에이션은 추후 함수 호출을 이어하기 위해 함수의 내부 상태를 보호하는 데이터 구조이다

# 코루틴과 동시 실행

### 병렬 vs 동시성

- 먹으면서 듣는 것 ⇒ 병렬
- 먹으면서 말하는 것 ⇒ 동시성
- 동시라는 말이 들어가 있어서 동시에 할 수 있는거 아니야? 하고 있는데...

### 코루틴

- 일반적으로 실행이 완료된 이후 반환되는 함수는 서브루틴이다
    - 엔트리포인트가 1개이다
    - 서브루틴 호출 사이에서는 아무런 상태 관리를 하지 않는다
- `**코루틴**` 은 여러개의 엔트리포인트가 있다
    - 호출 사이에 상태를 기억할 수 있다
        - 호출 간 협력이 가능하다
        - 이전에 멈춘 지점부터 다시 시작한다
    - 실행 플로우를 스위칭하며 동시에 실행한다 (A → B → A → B)

# 코루틴을 이용한 동시 실행

- 코루틴은 일급객체이다
- 무한 시퀀스, 이벤트 루프, 협력함수에서 동시 실행을 위해 사용된다
    - 순차실행/동시실행 + 같은 컨텍스트/다른 컨텍스트 조합

### 1. 순차적으로 실행하기

```kotlin
fun task1() { ... }
fun task2() { ... }

run {
	task1()
	task2()
	print("finish")
}
```

- 일반적인 함수 호출로 순차적으로 실행된다

### 2. 코루틴으로 변경

```kotlin
import kotlinx.coroutines.*

fun task1() { ... }
fun task2() { ... }

runBlocking {
	task1()
	task2()
	print("finish")
}
```

- 코루틴을 사용해 동시에 실행되도록 변경하였다
    - `runBlocking` 함수가 전달받은 람다를 코루틴에서 실행해준다
    - 현재 코루틴이 1개만 동작하므로 순차적으로 실행하는 것과 동일하게 동작한다...

### 3. 여러개의 코루틴으로 동시 실행

```kotlin
runBlocking {
	launch { task1() }
	launch { task2() }
	print("finish")
}
```

- `launch` 함수가 전달된 람다를 실행시키는 새로운 코루틴을 시작한다
    - `setInterval` 이 반환하는 것처럼 `launch` 함수도 job을 반환해서 이후에 작업 취소를 요청할 수 있다

### 4. 서스펜션 포인트와 인터리빙 호출

- 서스펜션 포인트: 현재 실행중인 작업을 중지(suspend)하고 다른 작업을 실행시키는 함수 ⇒ `delay(), yield()`
    - delay와 yield로 대기중인 다른 작업을 실행할 기회를 준다
- `suspend` 키워드로 어노테이션된 함수에서 서스펜션 포인트를 사용할 수 있는데 `async-await` 처럼 `suspend-delay, suspend-yield` 로 사용해야한다

```kotlin
suspend fun task1() {
	print(1)
	yield()
	print(3)
}
suspend fun task2() {
	print(2)
	yield()
	print(4)
}

runBlocking {
	launch { task1() }
	launch { task2() }
	print("finish")
}
```

- `suspend-yield` 로 실행 흐름을 `task1 → task2 → task1 → task2` 넘겨주면서 실행하게 된다
- 이런 코루틴을 언제 쓰게 될까?
    - 공유자원을 경쟁하는 경우
    - 순차실행 보다 코루틴을 사용해 미리 호출해두고 작업이 완료되기 기다리는 동안 다른 작업을 실행할 수 있다

# 코루틴의 컨텍스트와 스레드

- 동일 스레드에서 코루틴을 호출해서 작업 흐름을 넘겨주더라도 결국 하나의 스레드에서 작업하는 것은 한계가...
- 그렇다면 코루틴을 통해 실행 컨텍스트와 스레드를 원하는 곳을 이동하게 된다면?
    - 좀 더 빠른 병렬적인 작업이 이뤄질 수 있겠다

### 컨텍스트 명시적 세팅

- 코루틴이 실행될 컨텍스트를 `launch`와  `runBlocking` 함수에 전달해서 설정한다

    ```kotlin
    runBlocking {
    	launch(Dispatchers.Default) { task1() }
    	launch { task2() }
    	print("finish")
    }

    // task1 => Thread[DefaultDispatchers-worker]
    // task2 => Thread[main]
    ```

    - 명시적으로 코루틴이 실행될 컨텍스트를 전달해서 병렬/동시 실행을 할 수 있다

### 커스텀 풀에서 실행

- `싱글 스레드 풀` 에서 코루틴을 실행시키면 병렬이 아닌 동시 실행된다
    - 풀 안에 싱글 스레드가 있기 때문에
- 싱글 스레드 실행자를 만들고 컨텍스트를 가져온다

    ```kotlin
    Executors.newSingleThreadExecutor().asCoroutineDispatcher().use { context ->
      runBlocking {
    		launch(context) { task1() }
    		launch { task2() }
    		print("finish")
    	}	
    }
    ```

    - 싱글 스레드의 컨텍스트를 가져와서 실행
    - `use` 함수로 실행자를 자동 관리해줘서 닫히지 않아서 스레드 관리가 안되는 오류를 방지한다
    - `Executors.newSingleThreadExecutor` - 싱글 스레드 풀
    - `Executors.newFixedThreadPool` - 멀티 스레드 풀
- 서스펜션 포인트 이후 스레드 스위칭이 필요한 경우
    - `launch` 파라미터로 전달

# 코루틴 디버깅

- `runBlocking` 와 `launch` 에 `CoroutineName()` 인스턴스를 전달하면 코루틴 이름을 할당할 수 있다

    ```kotlin
    runBlocking(CoroutineName("top")) {
    	withContext(Dispatchers.Default) { task1() }
    	launch(Dispatchers.Default + CoroutineName("task")) { task2() }
    	print("finish")
    }
    ```

    - `withContext` 로 현재 실행중인 코루틴 컨텍스트를 변경하였다

# async-await

- launch 가 setInterval처럼 job을 반환하기에 다른 결과값을 구할 수 없다
    - 비동기 처리를 하고 결과를 받기 위해서는 async-await을 사용한다
- async는 Deffered<T> 객체를 반환한다
    - 코루틴 상태체크, 취소 등 작업을 할 수 있는 await를 반환한다
- await은 스레드의 실행은 차단하지 않고 실행의 흐름 자체를 차단한다
    - 코루틴의 결과를 리턴한다

```kotlin
runBlocking {
	val log: Deffered<String> = async(Dispatchers.Default) {
		"async"
	}

	print("finish")
	print(log.await())
}
```

- await 메소드를 호출하면 async에 의해서 실행된 코루틴이 완료되기를 기다리고 출력한다

# 연속성

- 코루틴은 작업을 중단시키거나 스레드 변경을 할 수 있다
    - 그렇다면 코루틴에서 사용되는 스레드 사이에 작업 상태를 전달해서 유지할 수 있을까? ⇒ `연속성`
- 연속성을 사용해 한 스레드에서 실행 상태를 capture하고 preserve할 수 있다
    - 상태가 필요한 다른 스레드에서 이를 불러올 수 있다
- 컴파일러가 코루틴 작업을 위해 Continuation을 사용한다
    - Continuation을 잘 사용하는 것이 핵심!

# 무한 시퀀스

### 시퀀스?

- listOf와 sequenceOf의 차이점으로 생겨난 반복 연산 퍼포먼스(Chapter 11 내부 반복과 지연연산)
    - 콜렉션을 미리 만들 필요가 없기 때문에
    - 이미 생성된 값을 사용하면 되고
    - lazy연산으로 값이 필요한 시점에 생성하기 때문에

### 시퀀스와 이터레이터

- sequence와 iterator 함수를 사용해서 무한한 값을 생성하는 코루틴을 만들때 명확하게 해준다

# 결론

- 코루틴은 컨티뉴에이션의 개념을 기반으로 한다
- concurrency(동시성)과 다중 엔트리포인트를 가지고 있는 함수이다
- 코루틴으로 호출된 함수들 사이에서 상태를 전달할 수 있다
    - 상태를 전달하기 때문에 언제든 중단하고 그 중단된 포인트에서 다시 시작할 수 있다
- 스레드나 자원이 필요한 다른 지연되는 작업에 대해 제어의 흐름을 넘길 수 있다
    - 코루틴이 실행되고 있는 스레드를 변경하거나
    - async-await을 사용해 병렬로 실행하고 나중에 결과를 얻을 수 있다
- 무한 시퀀스와 바운드가 없는 콜렉션을 반복하는 이터레이터를 만들 수 있다
- `코루틴 ⇒ 비동기 + 동시성`

# 🚨?!?!?

- 동시성
    - 동시에 된다고?
    - 그럼 병렬과 다른게 뭘까
    - 순차, 동시, 병렬을 구분해보자
    - 순차는 말그대로 순서대로 하나씩 처리하는 것
    - 병렬은 각각 다른 스레드에서 각각 실행되는 병렬적인 상황으로 서로 공유되지 않고 평행한 상태
        - 입과 귀로 먹으면서 듣는다
    - 동시는 각각 다른 스레드에서 각각 실행되는 것은 병렬과 같지만 동시라는 같은 시점을 바라본다는 의미를 깊이 생각해본다
        - 입으로 말하면서 먹는다
        - 먹는게 끝나고 나서 말하는 것은 순차 실행이다
        - 그러나 먹으면서 말하려면 먹는 중간에 말해야하는데 그럼 하려는 무언가를 왔다갔다 상태를 바꿔가면서 실행되어야하는 것

# 🙈 더 알아보기

- `코루틴?`
    - 코루틴을 사용해 다른 작업을 병렬적으로 처리하려고 한다고 해도 전체적인 소요시간은 동일한게 아닐까?
    - A + B + C + D와 A + C + B + D는 같다
    - 만약 A와 C가 엄청난 연산을 필요로해서 작업시간이 오래걸린다면?
    - 코루틴을 사용해 A를 호출하고 연산하는 동안 C로 넘어가서 호출하고 연산하는 동안 B를 그리고 D를 호출하는 이런 방식이라면?
    - A + B + C + D와 A + C + B + D는 다르다!?
    - [참고: 코루틴과 스레드 더 모르겠다...](https://aaronryu.github.io/2019/05/27/coroutine-and-thread/)