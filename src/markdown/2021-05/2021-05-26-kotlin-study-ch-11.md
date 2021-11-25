---
slug: /blog/kotlin-study-ch11
date: 2021-05-26
layout : post
published : true
title : filter, map, reduce, sequence
subtitle : Chapter 11 내부 반복과 지연연산
tags : [코틀린, 스터디, kotlin]
--- 

```markdown
[참고 도서]
- 다재다능 코틀린 프로그래밍
```

# 코틀린의 내부 반복자

- 함수형 프로그래밍에서는 내부 반복자를 사용한다
- 내부 반복자는 `반복을 자동으로 실행한다`
    - 개발자가 반복에 집중하는 것이 아니라 콜렉션이나 범위에 있는 `각 요소`에 집중하도록 해준다
- 내부 반복자는 `명시적 뮤터빌리티를 피하게 해준다`
- 내부 반복자는 람다를 전달해 반복과 관련된 여러 작업들을 수행하는 고차함수이다
    - 고차함수는 반복을 위한 공통 코드를 제공한다
    - 고차함수 filter()에 람다가 실제 선택될 요소를 전달한다
- 코틀린의 내부 반복자로 편리하고 표현이 간단하지만 외부 반복자에 비해 `퍼포먼스`가 안 좋을 수 있다
    - 전체 데이터 콜렉션을 다루는 경우 오버헤드 이슈가 존재하는데 이를 `시퀀스` 를 이용해 실행을 지연시켜서 처리한다
    - (이전 챕터에서 알아본 listOf와 sequenceOf의 mutable한 변수에 대한 결과값 차이가 이러한 이유이다)

# 외부 반복자 vs 내부 반복자

```kotlin
val numbers = listOf(1, 2, 3)

// 외부 반복자 for..in
for (i in numbers) {
  if (i > 2) {
    println(">>> $i")
  }
}

// 내부 반복자 filter + forEach
numbers.filter { it > 2 }
	.forEach { println(it) }
```

- 외부 반복자보다 내부 반복자를 이용해 좀 더 흐름이 아름다워졌다
- filter, forEach 고차함수를 이용해 람다를 전달하였다
- 만약 새로운 값을 반환하는 것이 필요한 경우에도 내부 반복자를 사용하여 `함수형 파이프라인` 을 구현할 수 있다

    ```kotlin
    // 외부 반복자
    val mutableResult = mutableListOf<Int>()
    for (i in numbers) {
      if (i > 1) {
        mutableResult.add(i)
      }
    }
    println(mutableResult)

    // 내부 반복자
    val immutableResult = numbers.filter { it > 1 }
      .map { it }
    println(immutableResult)
    ```

# 내부 반복자

## filter, map, reduce

- 코틀린 스탠다드 라이브러리에서 내부 반복을 위해 제공하는 고차함수
- 일반적으로 js에서 사용하던 방식과 동일하나 reduce에 초기값 인자가 없는 것이 다르네?
- 전달되는 콜렉션을 변경하지 않고 연산을 수행하며 복사된 값을 리턴한다 ⇒ Immutable

## first

- `first()` 함수를 사용하여 콜렉션의 첫번째 요소를 가져온다
- `list[0]`로 가져와도 되는데 왜 이 함수를 사용하는걸까?
    - `함수형 파이프라인!!!`

## flatMap

```kotlin
val obj = listOf(listOf("1", "2", "3"), listOf("4", "5", "6")) // List<List<String>>
val flat = obj.map { listOf("value $it") }.flatten() // List<String>
val flatMap = obj.flatMap { value -> listOf("new value $value") } // List<Sting>
println(flat) // [value [1, 2, 3], value [4, 5, 6]]
println(flatMap) // [new value [1, 2, 3], new value [4, 5, 6]]
```

- `flatten()` 함수를 이용해 중첩된 콜렉션을 플랫하게 펼쳐진 데이터로 만들어준다
- `flatMap()` 함수는 map + flatten과 동일하게 동작한다

## sortedBy

```kotlin
data class People(val name: String, val age: Int)
val people = listOf(
  People("가하파", 10),
  People("가나다", 5)
)
val sortedName = people.sortedBy { it.name }
print(sortedName) // [People(name=가나다, age=5), People(name=가하파, age=10)]
```

- 함수형 파이프라인 안에서 정렬한다
- `sortedBy, sortedByDescending`

## groupBy

```kotlin
val groupedName = people.groupBy { it.name.first() }
print(groupedName) // {가=[People(name=가하파, age=10), People(name=가나다, age=5)]}
```

- groupBy로 전달한 값이 키가 되어 그룹화한다

# 지연 연산을 위한 시퀀스

- 시퀀스는 콜렉션의 성능 향상을 위해 최적화된 랩퍼이다
- 콜렉션의 연산이 계속 실행되는 것과 다르게 시퀀스에서 호출되는 함수는 지연되어 실행된다
    - 실행이 불필요한 경우 실행을 지연시킨다
    - 최적화를 하지 않으면 필요하지 않은 연산도 계속 하기 때문에 성능이 떨어진다

## 시퀀스로 성능 향상하기

- 시퀀스를 사용하지 않은 일반적인 경우

    ```kotlin
    data class Person(val name: String, val age: Int)
    val people = listOf(
      Person("가하파", 10),
      Person("가나다", 5),
      Person("어머나", 15)
    )
    fun isAdult(person: Person): Boolean {
      println("person ${person.name}: ${person.age}")
      return person.age > 5
    }
    fun fetchName(person: Person): String {
      println("fetch name ${person.name}")
      return person.name
    }
    val firstAdultName = people.filter(::isAdult).map(::fetchName).first()
    println(firstAdultName)

    >>>
    person 가하파: 10
    person 가나다: 5
    person 어머나: 15
    fetch name 가하파
    fetch name 어머나
    가하파
    ```

    1. filter와 map에 람다 대신 함수 레퍼런스를 전달하였다
    2. filter에서 실행한 isAdult로 adult 리스트를 만들었다
    3. map으로 adultName 리스트를 만들었다
    4. 그리고 adultName 리스트의 첫번째 요소를 가져와서 반환하였다

    ⇒ 하나의 값 (adultName 리스트의 첫번째 요소)를 얻기 위해 모든 연산(person 로그가 계속 찍혔다)이 실행되어야한다

- 사용하지 않을 연산은 하지 않도록 `시퀀스`로 연산을 지연시킨다

    ```kotlin
    val firstAdultName = people.asSequence().filter(::isAdult).map(::fetchName).first()

    >>>
    person 가하파: 10
    fetch name 가하파
    가하파
    ```

    1. `asSequence()` 로 people 콜렉션을 한번 감싸서 사용하였다

    ⇒ 필요한 연산만 실행되었다(people 로그가 하나만 찍혔다)

- 시퀀스로 감싸서 사용하면 시퀀스가 시퀀스를 리턴하고 시퀀스는 다시 시퀀스를 리턴한다
    - 최종적으로 filter나 map에 전달된 람다는 실행되지 않고 지연된다
    - 그리고 first 함수로 연산이 시작되는 순간 파이프라인을 타고 실행된 결과를 반환한다
- **`시퀀스는 마지막 메소드가 호출될 때까지 실행을 연기하고 결과를 얻기 위해 최소한의 연산만을 수행한다`**
    - 그럼 모든 콜렉션을 시퀀스로 지연 연산 시키면 성능이 좋을까?
    - 지연 연산을 사용하지 않는 것이 디버깅이나 코드 추론이 용이하다
    - 코드가 커질수록 시퀀스를 사용해서 중간에 연산 과정에서 생기는 오버헤드를 줄일 수 있다

## 무한 시퀀스

- 지연 연산을 통해 퍼포먼스만 얻는 것이 아니라 `온디맨드 연산`에도 장점이 있다
    - 온디맨드 연산은 요소의 무한 시퀀스를 만드는데 도움을 준다
    - 무한 시퀀스는 값으로 시작되어 발생 패턴에 따라 시퀀스가 따라온다

        ⇒ 피보나치 수열 (앞의 두 값을 더한 결과값이 새로운 값이 되므로 무한 시퀀스)

```kotlin
fun isPrime(value: Long) = value > 1 && (2 until value).none { i -> value % i == 0L }
tailrec fun nextPrime(value: Long): Long = if (isPrime(value + 1)) value + 1 else nextPrime(value + 1)

println(nextPrime(2)) // 3
println(nextPrime(5)) // 7
```

- 해당 값이 소수인지 검증하는 isPrime
- 다음 소수 값을 반환하는 nextPrime
- `generateSequence()` 를 이용해 무한 시퀀스를 만들 수 있다

    ```kotlin
    val primes = generateSequence(5, ::nextPrime)
    println(primes.take(4).toList()) // [5, 7, 11, 13]
    ```

    - 5부터 nextPrime을 호출하는 무한시퀀스 primes를 만들었다
    - 그리고 take로 4개의 값을 가져오도록하였다
        - 이때까지 primes의 nextPrime은 호출이 지연되어있다
- `seqeunce` 람다로 온디맨드 무한 시퀀스를 만들 수 있다

    ```kotlin
    val primes = sequence {
      var i: Long = 0
      while (true) {
        i++
        if (isPrime(i)) {
          yield(i)
        }
      }
    }
    println(primes.take(4).toList()) // [2, 3, 5, 7]
    ```

# 마무리

- 함수형 프로그래밍에서 많이 사용하는 내부 반복자를 이용해 유연하고 표현력 있는 코드를 작성한다
- 코틀린 콜렉션에서 직접 사용할 수 있는 내부 반복자를 제공하지만 `콜렉션의 모든 요소에 대하여 무조건 반복 실행 되기 때문에 오버헤드가 발생한다`
    - 필요하지 않는 실행까지도 모두 연산을 실행하기 때문인데
    - 이를 위해 코틀린은 시퀀스를 랩퍼로 제공하여 실행을 지연시킨다
- 지연 연산 실행으로 필요하지 않은 연산을 제거하여 성능을 끌어올린다

# 🚨?!?!?

---

# 🙈 더 알아보기

- 무한 시퀀스

    ```kotlin
    val primes = sequence {
      var i: Long = 0
      while (true) {
        i++
        if (isPrime(i)) {
          yield(i)
          yield(i)
        }
      }
    }
    println(primes.take(4).toList()) // [2, 2, 3, 3]
    ```

    - yield???
        - generator 같네?!
    - take로 4개의 값을 가져오겠다라고 했는데
    - yield가 2번 있으니 하나씩 값을 반환 → [2, 2, 3, 3]
