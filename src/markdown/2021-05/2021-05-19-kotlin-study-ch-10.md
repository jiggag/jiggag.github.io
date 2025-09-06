---
slug: /blog/kotlin-study-ch10
date: 2021-05-19
layout: post
published: true
title: 람다로 함수형 프로그래밍
subtitle: Chapter 10 람다를 사용한 함수형 프로그래밍
tags: [코틀린, 스터디, kotlin]
---

```markdown
[참고 도서]

- 다재다능 코틀린 프로그래밍
```

# 람다로 함수형 프로그래밍 하기

- 선언적인 함수형 프로그래밍으로 코드의 복잡성을 낮춰서 읽기 쉽고 유지보수가 쉽게 한다
- 처리할 일과 해결방법을 모두 고려해서 명령하는 것과 다르게 선언형에서는 처리할 일만 알려주고 세부적인 것은 함수 자체가 구현한다

## 함수형

- 명령형 => `i는 0에서 9까지 증가하면서 for문을 돌면서 조건에 만족하는 값이 있는지 찾아줘`
- 선언형 => `contains() 메소드 호출`
- 명령형에서 풀어 썼던 내용들이 선언형에서는 내부적으로 `캡슐화` 되어 있다
- 읽기 쉽게 깔끔해지는 코드는 당연하다
- 세부적인 내용이 알고 싶다면 캡슐화된 메소드를 타고 들어가서 확인하면 된다
- `함수형 = 선언형 + 고차함수`
- `함수에 함수를 전달하고 함수를 리턴한다` => `f(g(h()))()` 이런것!? => `함수호출 체인 (함수형 컴포지션)`

  ```kotlin
  // 명령형
  val doubleOfEven = mutableListOf<Int>()
  for (i in (1..10)) {
      if (i % 2 == 0) {
      doubleOfEven.add(i * 2)
      }
  }
  println(doubleOfEven) // [4, 8, 12, 16, 20]

  // 함수형
  val doubleOfEvenFP = (1..10).filter { it % 2 == 0 }.map { it * 2 }
  println(doubleOfEvenFP) // [4, 8, 12, 16, 20]
  ```

  - 명령형에서는 mutable한 변수를 사용하였지만 함수형에서는 로직의 흐름 자체로 값을 immutable하게 만들었다

## 왜 사용하지? 언제 사용하지?

- 프레임워크와 라이브러리로 점차 명령형에서 선언형으로 흐르고 있다
- 스틱 기어 자동차로 기어 변경 와다다 보다 자율 주행 자동차로 흐르듯
- 명령형보다 함수형이 덜 복잡하고 연산에 집중할 수 있다
  - 연산에 집중하기 위해 순수 함수로 동작해야하며 immutable 해야 부작용이 없다
  - mutable 해야만 한다면 명령형이 더 나은 선택이 될 수 있다

# 람다 표현식

- `람다` => 고차함수에 인자로 사용되는 짧은 함수
  - 함수에 계산된 데이터를 전달하기 보다 람다를 이용해 실행 가능한 코드를 전달한다
  - 람다가 직접 계산하고 결정한다
  - 고기를 구워서 주는게 아니라 굽는 법을 알려줄테니 너가 직접 해!

## 람다의 구조

- 람다는 이름이 없고 타입추론을 이용한 리턴 타입을 가지는 함수이다
- `{ parameter -> body }`
  - 파라미터와 바디로 구성되어 있다
  - 멀티라인으로 작성 할 수 있다
  - 람다의 장점인 읽기 쉬운 코드를 살리기 위해 `함수 인자로 전달 될 때 마지막 인자로 위치`하도록 한다

## 람다 전달과 암시적 파라미터 it

1. `fun isPrime(n: Int) = n > 1 && (2 until n).none({ i: Int -> n % i == 0})`
   - 함수 파라미터 타입은 추론이 안되서 직접 명시하였다
2. `fun isPrime(n: Int) = n > 1 && (2 until n).none({ i -> n % i == 0})`
   - 람다의 파라미터는 타입이 필요하지 않는다
   - 람다로 전달된 함수의 파라미터로부터 타입을 추론한다
3. `fun isPrime(n: Int) = n > 1 && (2 until n).none { i -> n % i == 0 }`
   - 람다에 파라미터가 1개만 존재하는 경우 괄호를 생략할 수 있다
4. `fun isPrime(n: Int) = n > 1 && (2 until n).none { n % it == 0 }`
   - 람다의 파라미터가 1개라면 it라는 이름의 암시적 파라미터를 사용할 수 있다
   - 파라미터를 하나만 받는 짧은 람다에서는 암시적 파라미터로 더 간결하게 작성할 수 있다
   - 단, 파라미터 이름이 it인 경우와 헷갈릴 수 있다 (파라미터 이름 규칙이 있으면 괜찮지 않을까)

## 람다 받기

```kotlin
fun walkTo(action: (Int) -> Unit, n: Int) = (1..n).forEach { action(it) }
walkTo({ i -> print(i) }, 3) // 123
```

- 람다를 첫번째 인자로 전달하였다
- 람다 장점을 활용하기 위해 마지막 인자로 위치를 변경하고 `{}`로만 표현할 수 있다

```kotlin
fun walkTo(n: Int, action: (Int) -> Unit) = (1..n).forEach { action(it) }
walkTo(3) { i -> print(i) }
walkTo(1) { i ->
    println(">>> 멀티라인 람다")
    println(i)
}
walkTo(3) { print(it) }
```

- 마지막 인자로 위치를 변경하고 괄호를 빼고 멀티라인트로 전달해보았다

## 함수 참조 사용

- `패스스루(::)`를 사용해 람다를 더 읽기 쉽게 만들 수 있다
  - `({ x -> method(x) })` => `(::method)`
  - 마치 스크립트에서 `list.map(item => fn(item))`를 `list.map(fn)` 같다
- `(1..n).forEach { action(it) }` => `(1..n).forEach(action)`
  - 단순히 파라미터를 `action`으로 보내기 위해 사용되던 `{ action(it) }` 람다 구조를 제거했다
- **`패스스루 람다를 사용할 수 있는 함수는 람다이여야 한다!`**
  - 람다가 아닌 것은 패스스루로 할 수 없다
  - `action`은 일반 람다라서 `(1..n).forEach(action)`로 대체하였다
  - 만약 일반 함수라면 `(1..n).forEach(::action)` 형태가 되어야한다
  - `walkTo(3, { i -> print(i) })` => `walkTo(3, ::print)`
- **`암시적 리시버 this ?!!?!`**

  ```kotlin
  fun print(s: Int) = println(">>> $s")
  walkTo(3, ::print) // 1번
  walkTo(3, this::print) // 2번
  ```

  1. 1번 print에는 암시적으로 this가 참조되어있다
  2. 2번 print에는 this를 앞에 명시하였다
  3. 만약 this.print 함수가 없었다면 글로벌로 print 함수를 찾아간난다

- `walkTo(3, System.out::print)`
  - `System.out` 인스턴스의 print를 호출한다

## 함수를 리턴하는 함수

- 함수가 함수를 리턴한다
  - 함수를 재사용해서 중복되는 코드를 줄일 수 있다

```kotlin
fun predicateOfLength(length: Int): (String) -> Boolean {
    return { input: String -> input.length == length }
}
val list = listOf("다섯글자야", "네글자다", "세글자")
println(list.filter(predicateOfLength(5))) // [다섯글자야]
println(list.filter(predicateOfLength(3))) // [세글자]

>>> filter에서 인자로 predicateOfLength가 리턴하는 함수를 전달하였다
```

```kotlin
fun predicateOfLength(length: Int) = { input: String -> input.length == length }

>>> predicateOfLength를 블록 없이 타입추론이 가능하도록 하였다
```

# 람다와 익명 함수

- 람다를 함수의 인자로 전달하는데 동일한 람다를 여러 곳에서 필요하면 코드가 중복된다
  - 이런 코드 중복을 피하기 위해 `람다를 변수`에 담거나 `익명 함수`로 대체할 수 있다
- 람다를 변수에 담아서 재사용 하는 경우 코틀린은 파라미터의 타입을 추론할 수 없어 타입을 명시해주어야 한다
  1. **`val fn = { input: String -> input.length == 2 }`**
     - `fun predicateOfLength(length: Int) = { input: String -> input.length == length }` ⇒ 여기서 input 타입을 명시한 이유와 같다
     - 파라미터 타입을 전달하였기 때문에 람다의 리턴타입은 코틀린이 추론할 수 있게 되었다
  2. **`val fn: (String) -> Boolean = { input -> input.length == 2 }`**
     - 다른 방법으로 리턴 타입을 명시(변수의 타입 명시)하고 파라미터 타입을 뺄 수 있다
     - 그러나 람다의 리턴 타입이 명시한 타입과 다른 경우 컴파일 에러가 발생한다
  - 람다가 할당된 변수의 타입을 정의하면 반드시 리턴 타입을 지정해야한다
  - 람다의 파라미터 타입을 지정한다면 리턴 타입은 추론된다
- 변수의 타입은 추론을 사용하고 리턴 타입만 지정하는 `익명 함수`가 있다
  - 일반 함수와 동일하게 작성하지만 함수 이름 없이 함수의 리턴 타입을 지정하는 규칙이 있다
  - `list.filter(fun(name: String): Boolean { return name.length == 2 })`
  - 람다보다 지저분해져서... 특수한 상황 말고는 `람다 >>> 익명`
  - `return` 키워드로 익명 함수에서 리턴된다

# 클로저와 렉시컬 스코핑

- `클로저` => 외부 상태에 의존하는 경우

  ```kotlin
  var factor = 2
  val doubleFn = { e: Int -> e * factor }
  ```

  1. 외부 변수인 factor를 의존한다
  2. doubleFn 로컬 변수에서 찾지 못했기 때문에 클로저가 정의된 곳으로 스코프를 확장해서 factor를 찾는다

  ⇒ `렉시컬 스코핑`

- **`함수형에서 mutable은 금기사항이다`**

  - mutable인 factor가 클로저 안에서 변경될 수 있다
  - 이것은 결과를 예상할 수 없게 한다

    ```kotlin
    var factor = 2
    val doubled = listOf(1, 2).map { it * factor }
    val doubledAlso = sequenceOf(1, 2).map { it * factor }
    factor = 0
    doubled.forEach { print(it) } // 24
    doubledAlso.forEach { print(it) } // 00
    ```

    - sequenceOf만 변경되었다..... 이게 뭐가 다른걸까?

  - 클로저에서 mutable 변수를 사용하는 것이 에러와 혼란의 원인이 된다
  - 순수함수를 사용하자

## 비지역성(non-local)과 라벨(labeled)리턴

- 람다에서는 return 키워드를 사용하지 않는다
  - 익명함수에서만 사용한다
  - 외부 함수를 리턴하는게 아니라 익명함수 자체가 값을 리턴한다
- 람다에는 왜 return이 없을까
- return 같은 처리를 위한 라벨리턴과 비지역성 return이 있다

## 리턴이 허용되지 않는다

- 람다에서는 기본적으로 return이 허용되지 않는다

  ```kotlin
  fun invokeWith(n: Int, action: (Int) -> Unit) {
      println(">>> 실행 $n")
      action(n)
      println(">>> 종료 $n")
  }
  fun caller() {
      (1..3).forEach { i ->
          invokeWith(i) {
              println("> invoke 람다 시작 $it")
              if (it == 2) { return } // Kotlin: 'return' is not allowed here
              println("> invoke 람다 종료 $it")
          }
      }
  }
  caller()
  ```

  - `invokeWith`에 인자로 전달하는 람다 함수 안에서 return을 사용했더니 에러가 발생했다
  - 이 return이 `invokeWith`에 인자로 전달한 람다를 return하려는 것인지 `forEach`를 리턴하는 것인지, `caller`를 리턴하는 것인지 알 수 없기 때문이다

## 라벨 리턴

- 어느 상황을 return하려는 것인지 알 수 없는 상황에서 라벨 리턴을 사용해 리턴하려는 지점을 명시한다
- `return@label`을 하게 되면 `label@`이 달려있는 함수가 return 된다

  ```kotlin
  fun caller() {
      (1..3).forEach { i ->
          invokeWith(i) here@ {
              println("> invoke 람다 시작 $it")
              if (it == 2) {
                  return@here
              }
              println("> invoke 람다 종료 $it")
          }
      }
  }
  /*
  >>> 실행 1
  > invoke 람다 시작 1
  > invoke 람다 종료 1
  >>> 종료 1
  >>> 실행 2
  > invoke 람다 시작 2
  >>> 종료 2
  >>> 실행 3
  > invoke 람다 시작 3
  > invoke 람다 종료 3
  >>> 종료 3
  */
  ```

  - 람다의 흐름을 제어해서 라벨이 달려있는 블록으로 점프한다

  ```kotlin
  fun caller() {
      (1..3).forEach { i ->
          invokeWith(i) {
              println("> invoke 람다 시작 $it")
              if (it == 2) {
                  return@invokeWith
              }
              println("> invoke 람다 종료 $it")
          }
      }
  }
  ```

  - 함수 이름으로 암시적인 라벨로 사용할 수도 있다

- 라벨 리턴으로는 현재 스코프의 람다만 벗어날 수 있다

## 논로컬 리턴

- 논로컬 리턴으로 현재 함수에서 나갈 수 있다

  - 라벨 리턴은 현재 함수의 람다만 벗어날 수 있었다

  ```kotlin
  fun caller() {
      (1..3).forEach { i ->
          if (i == 2) {
              return // forEach를 빠져나간다
          }
          invokeWith(i) {
              println("> invoke 람다 시작 $it")
              println("> invoke 람다 종료 $it")
          }
      }
  }
  /*
  >>> 실행 1
  > invoke 람다 시작 1
  > invoke 람다 종료 1
  >>> 종료 1
  */
  ```

  - 일반적인 라벨리턴이 아닌 return으로 forEach에 전달된 람다를 빠져나간다

- 왜 forEach의 람다에서는 return으로 빠져나갈 수 있을까?
  - 코틀린 스탠다드 라이브러리 forEach는 `inline` 키워드로 정의되어있다
- 논로컬 리턴은 inline으로 선언된 람다에서만 사용할 수 있는 것이다

# 람다를 이용한 인라인 함수

- 람다 사용 시 퍼포먼스를 위해 inline 키워드를 사용한다
  - inline 람다는 forEach에서 리턴을 사용하는 것처럼 논로컬 흐름을 제어하기 위해 사용된다
  - 구체화된 타입 파라미터를 전달하기 위해 inline 키워드를 사용했었다 (ch6)

## 인라인 최적화

1. **인라인 최적화 적용전**

   ```kotlin
   fun invokeTwo(n: Int, action1: (Int) -> Unit, action2: (Int) -> Unit): (Int) -> Unit {
     println(">>>> invoke $n")
     action1(n)
     action2(n)
     println(">>>> invoke exit")
     return { _: Int -> println(">>>> invoke lambda") }
   }
   fun report(n: Int) {
     println(">>>> start report $n")
     val stackTrace = RuntimeException().stackTrace
     println("stackTrace.size ${stackTrace.size}")
     stackTrace.take(3).forEach(::println)
   }
   fun caller() {
     invokeTwo(2, { n -> report(n) }, { n -> report(n) })
   }
   caller()

   >>>> invoke 2
   >>>> start report
   stackTrace.size 36
   Lamda.report(lamda.kts:121)
   Lamda$caller$1.invoke(lamda.kts:126)
   Lamda$caller$1.invoke(lamda.kts:1)
   >>>> start report
   stackTrace.size 36
   Lamda.report(lamda.kts:121)
   Lamda$caller$2.invoke(lamda.kts:126)
   Lamda$caller$2.invoke(lamda.kts:1)
   >>>> invoke exit
   ```

   - 기본적으로 인라인 최적화를 하지 않은 상태이다
     - 람다 함수 안에서 호출된 report의 뎁스는 36이다
   - inline 키워드를 이용해 람다를 받는 함수(invokeTwo)의 성능을 향상시킬 수 있다
     - `**함수를 호출하는 대신 함수의 바이트코드가 함수를 호출하는 위치에 들어가게된다**`
     - 이는 함수 호출의 오버헤드는 제거하지만 함수가 호출되는 모든 부분에 바이트코드가 들어가야해서 바이트코드 자체가 커지게 된다
     - 최적화 이득이 없는 경우 inline 키워드에 경고 문구를 띄워준다
       - `Expected performance impact from inlining is insignificant. Inlining works best for functions with parameters of functional types`

2. 인라인 최적화 적용

   ```kotlin
   inline fun invokeTwo...

   >>>> invoke 2
   >>>> start report 2
   stackTrace.size 33
   Lamda.report(lamda.kts:121)
   Lamda.caller(lamda.kts:126)
   Lamda.<init>(lamda.kts:128)
   >>>> start report 2
   stackTrace.size 33
   Lamda.report(lamda.kts:121)
   Lamda.caller(lamda.kts:126)
   Lamda.<init>(lamda.kts:128)
   >>>> invoke exit
   ```

   - inline 키워드를 붙여서 정의하여 `컴파일러에게 호출을 최적화`하라고 알려주었다
     - 뎁스가 33으로 줄었다
     - report 함수에서 `Lamda$caller$1.invoke` 호출하던 것이 `Lamda.caller` 로 변경되었다
   - inline 함수가 엄청 긴 경우 이걸 다 바이트코드로 변환해서 들고 있어야 하기 때문에 최적화를 하는 것이 오히려 파일 크기를 키우는 영향이 생겨버린다
     - 측정하고 최적화하도록한다

## 선택적 노인라인 파라미터로 최적화 제거하기

- inline에서 최적화를 요청했다면 `noinline` 으로 해당 함수 최적화를 제거할 수 있다

  - inline 키워드를 사용한 함수에 noinline 키워드를 람다 파라미터에 붙여서 전달한다

  ```kotlin
  inline fun invokeTwo(
  	n: Int,
  	action1: (Int) -> Unit,
  	noinline action2: (Int) -> Unit
  ): (Int) -> Unit {
  	...
  }

  >>>> invoke 2
  >>>> start report 2
  stackTrace.size 33
  Lamda.report(lamda.kts:121)
  Lamda.caller(lamda.kts:126)
  Lamda.<init>(lamda.kts:128)
  >>>> start report 2
  stackTrace.size 35
  Lamda.report(lamda.kts:121)
  Lamda$caller$2.invoke(lamda.kts:126)
  Lamda$caller$2.invoke(lamda.kts:1)
  >>>> invoke exit
  ```

  - inline으로 정의된 invokeTwo의 람다 함수 파라미터는 최적화 되어있다
  - 그러나 noinline으로 붙여주면서 action2 람다에 대해서는 최적화를 제거하였다
    - action1보다 action2의 뎁스가 더 깊다

## 인라인 람다에서는 논로컬 리턴 가능하다

- inline 람다에서는 return 키워드로 함수에서 빠져나가는 것이 가능하다 (논로컬 리턴)
  - 최적화 되어있어서 함수 뎁스에서 바로 빠져나갈 수 있다
  - 그러나 noinline으로 최적화를 제거한 action2에서는 더 많은 뎁스(콜스택)이 있기 때문에 return을 사용해도 현재 람다 함수를 빠져나갈 수 없다
- inline, noinline 둘 다 라벨리턴은 가능하다
  - 직접 빠져나갈 곳을 라벨로 기입해줬기 때문에!

## 크로스인라인 파라미터

```kotlin
inline fun invokeTwo(n: Int, action1: (Int) -> Unit, action2: (Int) -> Unit): (Int) -> Unit {
  println(">>>> invoke $n")
  action1(n)
  println(">>>> invoke exit")
  return { x: Int -> action2(x) }
}

// Can't inline 'action2' here: it may contain non-local returns. Add 'crossinline' modifier to parameter declaration 'action2
```

- inline으로 최적화된 함수에서 파라미터로 전달 받은 람다를 실행하는 것이 아니라 새로 리턴하는 경우 컴파일 오류가 발생한다
  - 언제 실행될지 모르는 리턴 함수로 최적화된 내용을 넣을 수 없다
- 해결법으로 noinline이나 crossinline 키워드를 붙여준다

  - noinline은 action2에서 논로컬 리턴을 사용할 수 없음을 명시한다
  - crossinline은 invokeTwo 리턴 함수를 `호출하는 부분에서 인라인 최적화를 시킨도록 한다`

    ```kotlin
    inline fun invokeTwo(
    	n: Int,
    	action1: (Int) -> Unit,
    	crossinline action2: (Int) -> Unit
    ): (Int) -> Unit {
    	...
    }
    ```

    - 호출하는 부분을 인라인으로 어떻게!?

# 마무리

- 함수형 프로그래밍 짱이다
  - 고차함수 + 함수형 = 유동적인 코드 + 쉬운 유지보수
- 람다는 이름이 없는 함수이다
  - 다른 함수의 인자로 전달이 쉽다
- mutable 상태를 많이 사용하면 잠재적인 에러를 유발한다
  - 코드를 혼란스럽게 한다
- 코틀린 람다에서는 return 규칙이 많다... 🚨
  - 라벨리턴
  - 논로컬리턴
  - inline으로 최적화하는 방법
    - inline은 성능 향상이 눈에 띄는 경우에 사용...

# 🚨?!?!?

- **인라인???**

  - 뭐지?
  - 최적화를 하는데?
  - 왜 외부로 나가는 함수에서는 쓸 수 없을까?
  - 인라인을 붙이면 그 인라인 함수를 호출한 자리에 인라인 함수 내부가 그대로 들어가게 된다

    ```kotlin
    inline fun ex() {
    	println("1")
    }
    fun call() {
    	ex()
    }

    ===>
    fun call() {
    	println("1") // 이런 형태로 인라인된 함수가 들어간다
    }
    ```

  - 그런데 인자로 받은 람다를 다시 리턴하는 경우에는 인라인이 아니라 크로스인라인을 사용해야한다

    ```kotlin
    inline fun ex(crossinline action: (Int) -> Unit): (Int) -> Unit {
      return { _ -> action(1) }
    }
    fun call(): (Int) -> Unit {
      return ex { println(it) }
    }
    fun final() {
      call()(2)
    }

    ===>
    fun final() {
      action(1) // 최종적으로 리턴된 람다를 실행하는 곳에 인라인ㄷ
    }

    /*
    크로스인라인을 사용하지 않으면
    fun call() {
    	{ _ -> action(1) }
    }
    이런 형태가 되는건데 말이 안된다!
    */
    ```

  - [참고: inline, noinline 이해하기](<[https://medium.com/harrythegreat/kotlin-inline-noinline-한번에-이해하기-1d54ff34151c](https://medium.com/harrythegreat/kotlin-inline-noinline-%ED%95%9C%EB%B2%88%EC%97%90-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-1d54ff34151c)>)

---

# 🙈 더 알아보기

- 선언형 vs 명령형
- 클로저
- 함수형
  - `f(g(h(x)))`
  - [참고: 함수형 컴포지션](https://velog.io/@nakta/FP-in-JS-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%A1%9C-%EC%A0%91%ED%95%B4%EB%B3%B4%EB%8A%94-%ED%95%A8%EC%88%98%ED%98%95-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D-%ED%95%A8%EC%88%98-%EC%BB%B4%ED%8F%AC%EC%A7%80%EC%85%98-%EC%BB%A4%EB%A7%81-s7k2z039vb)
  - 전에 함수형 프로그래밍 스터디(물론 소리 없이 사라졌다) 기억이 새록새록
  - 커링
- 암시적 리시버 this
  - apply, bind, call 처럼 바인딩해주는 개념과 유사하다고 생각했는데...
- 리스트와 시퀀스

  ```kotlin
  var factor = 2
  val doubled = listOf(1, 2).map { it * factor }
  val doubledAlso = sequenceOf(1, 2).map { it * factor }
  factor = 0
  doubled.forEach { print(it) } // 24
  doubledAlso.forEach { print(it) } // 00
  ```

  - 위 예시에서 mutable한 factor가 변경되자 `listOf`와 `sequenceOf`의 결과값이 다르게 나왔다
  - 코틀린 Sequence는 모든 단계가 처리되고 마지막에 결과를 요청한 순간 연산이 발생한다
    - factor가 변경되고 나서 연산이 일어나므로 00을 리턴하였다
  - Collection인 경우에는 각 단계가 끝나는 즉시 결과를 처리한다
    - listOf가 처리된 순간의 factor의 값 2를 따라서 결과를 24로 반환하였다
  - [참고: 코틀린의 시퀀스](<[https://iosroid.tistory.com/79](https://iosroid.tistory.com/79)>)

- return
  - 람다에서 빠져나가기 위해 `라벨 리턴`
    - 람다를 호출한 곳이 아니라 람다가 정의된 곳에서 빠져나간다
  - inline으로 정의된 경우 `논로컬 리턴`
    - 현재 동작중인 람다를 선언한 곳 바깥으로 나간다
