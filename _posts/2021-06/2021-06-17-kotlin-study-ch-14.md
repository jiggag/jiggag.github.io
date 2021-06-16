---
layout : post
published : true
title : 재귀와 메모이제이션
subtitle : Chapter 14 재귀 프로그래밍과 메모이제이션 프로그래밍
tags : [코틀린, 스터디, kotlin]
--- 

```markdown
[참고 도서]
- 다재다능 코틀린 프로그래밍
```

# 재귀?

- 하위 문제의 솔루션을 사용해 상위 문제를 해결하고자 한다
- 그러나 런타임에서 스택오버플로우에 빠진다...
    - 그 이유를 뒤에서 알아본다
- 꼬리호출 최적화를 통해 스택오버플로우 없이 문제를 해결할 수 있다
- 앞에서 계산된 데이터를 기억하고 있는 메모이제이션을 활용해 성능을 향상시킨다

### 재귀의 강점과 위험성

- 재귀로 문제를 작게 쪼개서 부분 솔루션을 합쳐서 해결하는 기법을 사용할 수 있다
    - 보통 알고리즘 공부하면서 많이 접했다...
    - 하나의 커다란 문제를 한번에 접근하지 않고
    - 작은 예시로 접근하여 이것이 재귀로 처리할 수 있도록한다
- `재귀` 함수에는 일반적으로 `리턴 타입이 필요하다`
    - `Type checking has run into a recursive problem. Easiest workaround: specify types of your declarations explicitly`

    ```tsx
    fun sort(param): 리턴타입 = if (조건) 결과 else sort(param)
    ```

    - 이런식으로 내부적으로 자신을 다시 호출하면서 재귀 알고리즘을 구현한다
    - 그렇다면 `sort` 재귀함수는 무언가 리턴하는 값이 있다는 의미이다!
- 반복에서는 나타나지 않았던 문제가 재귀에서는 나타난다
    - 스택 증가 ⇒ 스택오버플로우
    - 반복에서은 그냥 반복적으로 값을 계산해서 내오는데
    - 재귀에서는 그 재귀가 끝날때까지 값을 계속 들고 쌓아두고 있다가 모든 재귀가 끝났을때에야 반환한다
    - 그러니 스택이 넘쳐서 터진다...

    ```tsx
    import java.math.BigInteger

    fun factorialRec(n: Int): BigInteger = if (n <= 0) 1.toBigInteger() else n.toBigInteger() * factorialRec(n - 1)
    ```

    - 팩토리얼 예시에서 사용한 재귀를 보면 첫번째 재귀에서 `n.toBigInteger() * factorialRec(n - 1)` 이 값은 언제 반환될까?
        - `factorialRec(n - 1)` 이 끝날때 반환될것이다
        - 그럼 `factorialRec(n - 1)` 은? `factorialRec(n - 2)` 가 끝날때겠지
        - 이렇게 스택에 쌓이고 쌓이고 `factorialRec(n - 1)`....... 쌓여서 결국 터진다

            ```tsx
            java.lang.StackOverflowError
            	at Factorial.factorialRec(factorial.kts:3)
            	at Factorial.factorialRec(factorial.kts:3)
            	at Factorial.factorialRec(factorial.kts:3)
            	at Factorial.factorialRec(factorial.kts:3)
            	...
            ```

    - 이런 문제를 해결하기 위한 `꼬리호출 최적화 (Tail Call Optimization)` 을 사용해본다

# 꼬리호출 최적화

- 코드 → 프로시저 → 바이트코드 → 실행
    - 반복을 사용하는 프로시저 → 반복을 사용하는 프로세스로 컴파일
    - 재귀 프로시저 → 재귀 프로세스로 컴파일
- 재귀로 작성된 코드를 반복 프로세스로 컴파일해서 런타임에는 반복으로 행동하도록 하여 스택오버플로우를 없게 한다
    - 재귀를 컴파일 했는데 왜 반복이 되는걸까? ⇒ `tailrec 어노테이션`

```tsx
tailrec fun factorialRec(n: Int): BigInteger = if (n <= 0) 1.toBigInteger() else n.toBigInteger() * factorialRec(n - 1)
```

- 단순히 `tailrec` 을 앞에 붙여서 되는게 아니다...
    - `tailrec' marks a function as tail-recursive (allowing the compiler to replace recursion with iteration)`
    - 재귀를 반복으로 최적화 하기 위해서는 재귀 함수를 호출하는 것이 마지막에 위치해야한다
    - `n.toBigInteger() * factorialRec(n - 1)` 가 연산이 완료될때까지 계속 재귀를 기다리고 있다⇒ 스택오버플로우의 범인
        - `tailcall` 이란 재귀 호출이 함수의 마지막 연산임을 의미한다

```tsx
tailrec fun factorial(n: Int, result: BigInteger = 1.toBigInteger()): BigInteger = if (n <= 0) result else factorial(n - 1, result * n.toBigInteger())
```

- 앞에서 연산된 결과값을 재귀함수에 파라미터로 같이 전달해서 함수가 호출는 것이 마지막이 되도록 하였다
    - 함수의 연산결과를 무한정 기다릴 필요가 없다
- `tailrec은 tailcall로 재귀를 반복으로 변환하도록하여 최적화한다`

# 메모이제이션

- 함수를 반복으로 호출하는 것보다 더 최적화하는 방법으로 `저장된 값`을 사용하는 것이다
    - 예를 들면 피보나치 수열에서 앞서 계산한 값을 저장하고 있다가 사용하는 것!
    - `memoization`
    - 단, 메모이제이션은 사이드이펙트 없는 순수함수에서만 사용하여야 한다
    - 일반적인 재귀가 아닌 다이나믹 프로그래밍에서 재귀를 사용할 때 하위 문제의 결과를 저장해서 다시 사용한다
        - 지수형 복잡도 O(n^2) → 선형 복잡도 O(n)
- 그러나 슬프게도 코틀린이 메모이제이션을 직접 지원해주지 않는다...  왜...
    - Groovy와 코틀린 델리게이션을 사용해 구현해본다

### 반복 연산

- 이전 결과값을 기억해둔다면 연산시간을 최적화할 수 있다
    - 호출하려는 상태의 값이 이미 존재한다면 재귀 호출을 하지 않고 존재하는 값을 리턴한다 ⇒ 메모이제이션!

```tsx
fun fib(n: Int): Long = when (n) {
  0, 1 -> 1L
  else -> fib(n - 1) + fib(n - 2)
}
println(measureTimeMillis { fib(30) }) // 8
println(measureTimeMillis { fib(40) }) // 465
```

- 피보나치 수열을 계산하는 `fib` 함수의 연산시간은 `n` 이 커질수록 엄청나게 커진다
    - 메모이제이션을 통해 연산시간을 최적화 할 수 있다

### Groovy방식의 메모이제이션

- 보통 캐싱을 지원하는 라이브러리(`react-query`)를 보면 클래스 프로퍼티로 데이터를 캐시하고 있고 그 프로퍼티를 사용하는 함수에서 캐시를 사용하도록 한다
    - 근데 이번 스터디 내용에는 클래스가 아니라 함수로 구현한다고.......... 🙈
    - 메모이제이션 구현을 위해 함수가 호출됐을 때 캐시를 체크하고 데이터가 존재한다면 캐시를 반환하고 없다면 함수를 새로 호출하는 다이나믹한 동작이 필요하다
- 람다 함수에 `memoize` 메소드를 인젝트해서 메모이제이션을 구현해보았다

    ```tsx
    fun <T, R> ((T) -> R).memoize(): ((T) -> R) {
      val original = this
      val cache = mutableMapOf<T, R>()
      return { n: T -> cache.getOrPut(n) { original(n) } }
    }
    ```

    1. memoize 함수의 리턴타입은 인젝트 대상이 된 함수의 타입과 같다
    2. 처음에 original에 this를 할당해서 오리지널 레퍼런스를 저장하고 cache를 초기화한다
    3. memoize를 호출하면 파라미터로 받은 값을 키로 하는 캐시데이터를 확인한다
    4. 저장된 값이 있다면 리턴하고 없다면 새로 연산 후 캐시에 저장하고 반환한다

    ```tsx
    lateinit var fib: (Int) -> Long
    fib = { n: Int ->
      when (n) {
        0, 1 -> 1L
        else -> fib(n - 1) + fib(n - 2)
      }
    }.memoize()
    println(measureTimeMillis { fib(30) }) // 0
    println(measureTimeMillis { fib(40) }) // 0
    ```

    - memoize로 최적화된 피보나치 연산시간을 엄청 줄어들었다
        - lateinit으로 fib 변수 초기화를 딜레이 시켰다

### 코틀린 델리게이션을 이용한 메모이제이션

- 델리게이트를 이용해 변수와 프로퍼티에 접근해서 메모이제이션을 구현해본다

    ```tsx
    class Memoize<T, R>(val func: (T) -> R) {
      val cache = mutableMapOf<T, R>()
      operator fun getValue(thisRef: Any?, property: KProperty<*>) = { n: T ->
        cache.getOrPut(n) { func(n) }
      }
    }

    val fib: (Int) -> Long by Memoize { n: Int ->
      when (n) {
        0, 1 -> 1L
        else -> fib(n - 1) + fib(n - 2)
      }
    }
    ```

    - 델리게이트 내부적으로 캐시를 가지고 있다
    - getValue 함수가 캐시에 값이 없는 경우 func를 실행하는 람다 표현식을 리턴한다
        - 람다에서 fib 변수에 직접 접근하는 것이 아니라 델리게이트를 통해서 접근한다

### 다이나믹 프로그래밍

- 메모이제이션을 이용해서 재귀호출을 효율적으로 하는 알고리즘 기법
    - 캐싱하고 함수호출 결과를 다시 사용하는 방법으로 반복적인 재귀함수 호출을 제거한다
    - 연산시간을 O(2^n) → O(n)으로 시간복잡도를 낮춘다

# 결론

- 코틀린은 tailrec을 제공하여 재귀호츨을 사용하는 코드에 꼬리재귀 최적화를 제공한다
    - 내부적으로 재귀를 반복으로 바꿔줘서 스택오버플로우를 방지한다
- 코틀린이 메모이제이션을 직접 지원하지는 않지만 기능을 구현할 수 있다
    - 연산결과를 메모이즈하거나 캐싱하는 것
    - 함수 또는 델리게이트 기반으로 메모이제이션을 구현한다
    