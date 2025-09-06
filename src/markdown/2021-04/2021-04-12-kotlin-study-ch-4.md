---
slug: /blog/kotlin-study-ch4
date: 2021-04-12
layout: post
published: true
title: 코틀린의 반복문
subtitle: Chapter 04 외부 반복과 아규먼트 매칭
tags: [코틀린, 스터디, kotlin]
---

```markdown
[참고 도서]

- 다재다능 코틀린 프로그래밍
```

# 범위와 반복

- 명령형 스타일의 외부 반복자과 함수형 스타일의 내부 반복자가 있다
  - for i++, i—와 같은 시퀀스를 명시적으로 제어하는 외부 반복자
  - 람다처럼 내부 로직에만 집중하고 시퀀스는 대신 제어해주는 내부 반복자

## 레인지 클래스

```kotlin
val oneToFive: IntRange = 1..5
var aToE: CharRange = 'a'..'e'
val seekHelp: ClosedRange<String> = "hell".."help"
```

- `..` 으로 범위를 지정하고 앞뒤 값을 모두 포함한다 (1 ≤ i ≤ 5)
- `kotlin.ranges` 패키지의 타입으로 해당 범위 타입을 명확하게 한다
  - 타입 추론을 통해 유추 가능
  - int, char 원시타입 뿐만 아니라 String으로 범위 설정 가능

## 정방향 반복

```kotlin
for (i in 1..5) { print(i) } // 12345
for (c in 'a'..'e') { print(c) } // abcde

// 오류 발생
for (word in "hell".."help") { print(word) }
>>> For-loop range must have an 'iterator()' method
```

- 증가하는 반복
- i는 val로 선언되며 반복문 안에서 변경이 불가능하다
- 스코프는 반복문 안으로 제한되어 있다
- `IntRange` 나 `CharRange` 에는 `iterator()` 가 있지만 `ClosedRange<T>` 에는 iterator()가 없어서 오류가 발생한다
  - `ch 12-2 서드파티 클래스 인젝팅` 에서 `ClosedRange<T>` 를 반복하는 확장하는 함수로 만들게 된다...

## 후방향 반복

```kotlin
for (i in 5.downTo(1)) { print(i) } // 54321
for (i in 5 downTo 1) { print(i) } // 중위표기법으로 . 생략
```

- 정방향과 반대로 감소하는 반복

  - `for (i in 5..1)` 로는 동작하지 않는다
  - 감소하는 반복을 위해 `IntProgression` 인스턴스를 만들어주는 `downTo()` 메소드를 호출한다

    ```kotlin
    public infix fun Int.downTo(to: Int): IntProgression {
        return IntProgression.fromClosedRange(this, to, -1)
    }
    ```

## 범위 안의 값 건너뛰기

```kotlin
// 1 <= i <= 5
for (i in 1..5) >>> 12345

// 1 <= i < 5
for (i in 1 until 5) >>> 1234

// 1 <= i < 5, 2씩 증가
for (i in 1 until 5 step 2) >>> 13

// 1 <= i <= 9, 3이나 5의 배수
for (i in (1..9).filter { it % 3 == 0 || it % 5 == 0 })
```

- 일반적인 범위로는 앞뒤 값을 모두 포함하는 범위를 갖는다
- `until()` - 마지막 값을 포함하지 않는 범위를 만들어낸다
- `step()` - 특정 값을 건너뛰면서 반복하며 `IntProgression` 객체이다
- `filter()` - 해당 범위의 값을 람다표현식으로 인자를 전달받아 해당 조건에 맞는 경우에만 반환한다

# 배열과 리스트의 반복

## 배열

```kotlin
val array = arrayOf(1, 2, 3) // 반환타입: Array<Int>
val intArray = intArrayOf(1, 2, 3) // 반환타입: IntArray
```

- `for (i in array) { print(i) }` 형태로 배열을 반복한다
- **Array<Int>**
  - arrayOf에서 사용한 값이 `Int 타입의 정수 객체로 정수형 배열` 이 생성되었다
- **IntArray**
  - 정수 객체가 아닌 `원시 자료형 Int의 배열`을 생성하기 위해서는 intArrayOf()를 사용한다

## 리스트

```kotlin
var list = listOf(1, 2, 3) // 반환타입: List<Int>
print(list.javaClass) // java.util.Arrays$ArrayList
for (i in list) { print(i) } // 123

// 인덱스 추출
for (index in list.indices) { print(index) } // 012
for ((index, value) in list.withIndex()) { print("index: $index, value: $value") } // 012
```

- array와 유사하게 동작
  - List<T> 형태로 intListOf는 없다...
- 리스트의 `indices` 속성으로 리스트의 index를 가져올 수 있으며 `withIndex()` 함수로 구조분해된 형태로 index와 value를 가져올 수 있다

# 코틀린의 when

- 코틀린에서는 switch 대신 when을 사용한다
- 표현식과 명령문으로 사용할 수 있다
- if-else로 구성된 내부 로직이나 switch로 조건 분기를 하는 경우 when으로 대체 한다

## 표현식 when

```kotlin
fun isAlive(alive: Boolean, numberOfLiveNeighbors: Int) = when {
  numberOfLiveNeighbors < 2 -> false
  numberOfLiveNeighbors < 5 -> false
  numberOfLiveNeighbors == 5 -> true
  else -> alive && numberOfLiveNeighbors > 10
}

print(isAlive(true, 1)) // false
print(isAlive(true, 2)) // false
print(isAlive(true, 5)) // true
print(isAlive(true, 8)) // false
print(isAlive(false, 12)) // false
print(isAlive(true, 12)) // false
```

- 블록으로 작성하여 리턴타입이 추론되게 한다
- 단일 표현식으로 when에서 리턴되는 값이 함수의 리턴값이다
- 코틀린 컴파일러는 when에서 `else가 있는지, 표현식으로 조건을 구분할 수 있는 모든 케이스`에 대해 검증한다
  - 컴파일 시간 체크는 코드의 정확성과 실수 오류를 줄여준다

```kotlin
fun whatTodo(dayOfWeek: Any) = when (dayOfWeek) {
  is Int -> "int???"
  "월", "화", "수" -> "스터디"
  in listOf("토", "일") -> "운동"
  in arrayOf("목", "금") -> "휴식"
  else -> "다시"
}
print(whatTodo(1)) // int???
print(whatTodo("화")) // 스터디
print(whatTodo("일")) // 운동
print(whatTodo("금")) // 휴식
print(whatTodo("월화")) // 다시
```

- when에 변수를 전달하는 경우 when 조건 구문이 Boolean이 아니라 각각의 값들에 맞는 조건을 사용한다
  - 해당 파라미터가 조건에 맞는지 확인 후 반환한다

## 명령문 when

```kotlin
fun whatTodo(dayOfWeek: Any) {
  when (dayOfWeek) {
    is Int -> print("int???")
    "월", "화", "수" -> print("스터디")
    in listOf("토", "일") -> print("운동")
    in arrayOf("목", "금") -> print("휴식")
  }
}
whatTodo(1) // int???
whatTodo("화") // 스터디
whatTodo("일") // 운동
whatTodo("금") // 휴식
whatTodo("월화") //
```

- 하나 이상의 값에 기반해서 다른 동작을 원하는 경우 명령문 when을 사용한다
  - 특정 값을 리턴하는 것이 아니라 조건에 따라 어떤 행동만을 하게 된다
  - 명령문으로 사용되는 when에서는 else가 존재하지 않아도 된다
  - 조건에 맞는 내용이 없으면 아무런 행동도 취하지 않게 된다

## when에서의 변수 스코프

```kotlin
fun systemInfo(): String {
	// 해당 라인에서 경고 메세지가 뜬다
	// Variable declaration could be moved into `when`
  val numberOfCores = Runtime.getRuntime().availableProcessors()
  return when (numberOfCores) {
    1 -> "1 core"
    in 2..16 -> "2 ~ 16 cores"
    else -> "$numberOfCores cores???"
  }
}

// when 인자로 변수 스코프를 제한하도록 수정
fun systemInfo(): String {
  return when (val numberOfCores = Runtime.getRuntime().availableProcessors()) {
    1 -> "1 core"
    in 2..16 -> "2 ~ 16 cores"
    else -> "$numberOfCores cores???"
  }
}
```

- when 내부에서만 사용하는 변수의 스코프를 제한한다
  - 첫번째 코드처럼 when 외부에서 선언하게 되면 when이 아닌 함수 내부의 다른 곳에서 해당 변수를 사용할 수 있게된다
  - when의 인자로 내부 변수를 넣어버리면서 해당 변수의 스코프를 제한하고 when을 단일표현식으로 사용할 수 있게 되었다

# 결론

- range, 배열, 콜렉션으로 반복하는 코드를 작성한다
- when 전달인자 매칭문법으로 기존 조건문보다 간결하고 코드의 노이즈를 제거한다

# 🚨?!?!?

- **arrayOf랑 listOf의 차이?**
  - arrayOf는 사이즈가 고정되어있음

# 🙈 더 알아보기

- when을 Decomplie하면?

  - if이거나 switch

  ```kotlin
  // when 인자가 없는 경우
  print(when {
    list.size == 3 -> true
    list.size > 4 -> 1
    else -> false
  })

  >>> Decompile
  Object var2 = ((Standalone)this).list.size() == 3 ? true : (((Standalone)this).list.size() > 4 ? 1 : false);

  // when 인자가 있는 경우
  print(when (list.size){
    3 -> true
    4 -> 1
    else -> false
  })

  >>> Decompile
  Object var10001;
    switch(((Standalone)this).list.size()) {
    case 3:
      var10001 = true;
      break;
    case 4:
      var10001 = 1;
      break;
    default:
      var10001 = false;
    }
  ```

- import kotlin
  - kotlin 패키지에 포함된 함수는 kotlin.arrayOf() 형태나 kotlin을 따로 import하지 않아도 arrayOf()로만 사용 가능하다
