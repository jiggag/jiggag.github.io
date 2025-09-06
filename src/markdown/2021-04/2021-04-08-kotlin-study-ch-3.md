---
slug: /blog/kotlin-study-ch3
date: 2021-04-08
layout: post
published: true
title: 코틀린은 함수도 간결하게 표현하고자 한다
subtitle: Chapter 03 함수를 사용하자
tags: [코틀린, 스터디, kotlin]
---

```markdown
[참고 도서]

- 다재다능 코틀린 프로그래밍
```

# 코틀린 함수

- 재사용 할 수 있는 단위가 클래스인 자바와 다르게 코틀린에서는 단독 함수까지 재사용 가능하다
- 필요할 때마다 사용할 수 있도록 단독으로 작고 단순한 함수를 만들었다
  - 클래스의 메소드로 만들어지는 것이 아닌 **단독으로 호출되는 함수**를 만든다
  - 탑 레벨 단독 함수를 만들어서 함수형, 객체지향 모두 사용 가능하다
- 모든 파라미터를 전달하지 않고 기본 파라미터를 전달한다
  - 함수와 메소드 확장을 쉽게 해준다
  - 인자에 이름을 명시하여 가독성과 가변적으로 파라미터를 전달할 수 있게 되었다

# 함수 생성

## 단일표현함수

- 함수를 블록으로 감싸는 대신 등호로 함수 정의와 바디를 구분하여 짧게 표현할 수 있다

  ```kotlin
  fun greetBlock(): String {
  	return "hello"
  }

  // 단일표현함수
  fun greet() = "hello"
  println(greet())
  ```

- 단일표현함수에서는 리턴 타입이 컴파일 단계에서 추론이 가능하다
  - 코틀린이 컨텍스트에 기반해 리턴 타입을 추론하며 타입이 다른 변수에 할당하려고 하면 컴파일 오류가 발생한다
  - 타입이 추론되지만 리턴 타입을 명시하여 구현(implement)에 의해 다른 타입으로 변경되는 것을 방지할 수 있다
    - `fun greet(): String = "hello"`

## 함수는 표현식으로

- 모든 함수가 표현식으로 취급되어 변수에 할당하거나 이후 프로세스에서 사용할 수 있다
- 함수의 리턴 내용이 없는 경우(void) `Unit` 이라는 특별한 타입으로 반환된다

  ```kotlin
  fun sayHello() = println("hello")
  val message: String = sayHello()
  >>> hello
  >>> error: type mismatch: inferred type is Unit but String was expected

  fun sayHello() = println("hello")
  val message: Unit = sayHello()
  println(message)
  >>> hello
  >>> kotlin.Unit
  ```

  1. 리턴하는게 없는 함수를 String 타입의 변수에 할당하려고 하면 오류가 발생한다
  2. `Unit` 타입을 리턴하도록 표현식으로 작성되어 있으며 Unit 또한 `기본 메소드`를 가지고 있다
     - `Unit의 toString()` 메소드가 호출되었고 해당 파일을 클래스로 래핑한 이름인 kotlin.Unit이 출력되었다

## 파라미터

- 타입 추론이 가능한 함수의 리턴 타입과는 다르게 파라미터의 타입은 명시하여야 한다
- 파라미터에는 var, val를 사용해 변수를 정의하지 않는다
  - 파라미터 값을 변경하려하면 컴파일 오류가 발생한다

## 블록으로 정의된 함수

- `블록으로 정의된 함수`는 리턴 타입을 항상 정의해줘야한다
  - **`return 키워드도 꼭 필요하다!!!`**
- 단일표현식 대신 블록 바디를 사용한 경우

  - `fun notReally() = {2}`
  - 코틀린은 코드 블록 안으로 들어가서 타입 추론을 하지 않는다
  - `람다 표현식`이나 `익명함수`로 취급한다

    ```kotlin
    fun f1() = 2
    fun f2() = { 2 }
    fun f3(factor: Int) = { n: Int -> n * factor }
    println(f1()) >>> 2
    println(f2()) >>> kotlin.Int // 람다표현식
    println(f2()()) >>> 2
    println(f3(2)) >>> (kotlin.Int) -> kotlin.Int // 파라미터를 가지는 람다표현식
    println(f3(2)(3)) >>> 6
    ```

# 기본 인자와 명시적 인자

## 오버로딩

- 기존 함수와는 다른 수의 인자나 타입을 받을 수 있도록하고자 같은 이름의 함수를 작성 + 작성 + 작성
  - `코틀린에서는 같은 이름으로 함수를 중복 생성할 수 없다`
- 코틀린에서도 오버로딩은 가능하지만 기존 함수에 `기본 인자`나 `명시적 인자` 를 사용해 함수를 변경하는 것이 더 단순한 방법이다
  - 그러나 바이너리가 변경되면 컴파일을 다시 해야한다는 단점이 있는데 하면 되지...

## 기본인자로 함수 변경하기

- 기존 함수에 인자를 추가하는 경우

  - 기존 함수를 사용하던 곳에서 인자가 누락되어 오류 발생
  - 자바에서는 이를 오버로딩을 통해 해결하였으나 코드량이 방대해지는 단점이 존재
  - 코틀린에서는 기본인자를 활용해 기존에 사용하던 함수에서도 오류 없이 실행되도록함

  ```kotlin
  fun greet(name: String): String = "Hello $name"
  println(greet("이름")) >>> Hello 이름

  // 기존 함수에 일반 인자를 추가하는 경우
  fun greet(name: String, age: Int): String = "Hello $name $age"
  println(greet("이름")) // 기존 함수를 사용하던 곳에서 인자가 누락되어 오류 발생

  // 기본 인자 형태로 인자를 추가하는 경우
  fun greet(name: String, age: Int = 10): String = "Hello $name $age"
  println(greet("이름")) >>> Hello 이름 10
  println(greet("이름", 20)) >>> Hello 이름 20
  ```

  - 기본인자를 사용하게 되면 해당 파라미터를 전달하지 않은 경우에는 기본인자 값이 사용된다
  - 만약 기본인자가 일반인자보다 앞에 위치하게 된다면 항상 일반인자까지 전달하기 위해 모든 인자를 넣어줘야한다

    - 이는 기본인자를 사용하는 장점을 잃어버리는 것
    - 기본인자를 효과적으로 사용하기 위해 마지막 인자로 사용하는 것이 좋다

    ```kotlin
    fun greet(name: String = "이름", age: Int): String = "Hello $name $age"
    println(greet("이름", 10)) >>> Hello 이름 10
    println(greet("이름", 20)) >>> Hello 이름 20
    // 기본인자가 있음에도 뒤에 일반인자까지 순서대로 전달되어야 하기에 모든 인자를 전달해줘야한다
    ```

  - 기본인자에 문자열 템플릿 형태로도 지정할 수 있다

    - 하지만 아직 초기화되지 않은 인자를 참조한 표현식을 기본인자 값으로 사용하는 경우 컴파일 오류가 발생한다

    ```kotlin
    fun greet(name: String, length: String = "${name.length}"): String = "Hello $name $length"
    println(greet("이름")) >>> Hello 이름 2

    fun greet(length: String = "${name.length}", name: String): String = "Hello $name $length"
    println(greet(7, "이름")) // 컴파일 오류
    // 기본인자를 생성할 때 템플릿에서 아직 초기화되지 않은 name을 사용해서 오류가 발생한다
    ```

## 명시적 인자로 가독성 향상하기

- 함수의 인자가 어떤 값인지 명확하게 전달하여 가독성을 향상시키기 위해 명시적 인자를 사용한다

  - 명시적 인자를 사용하면 파라미터의 순서를 바꿔서 사용할 수 있다

  ```kotlin
  fun greet(name: String, city: String, age: Int = 10, value: Int = 20) ...
  println(greet("이것은", "무엇일까")) // 각각의 파라미터가 어떤 값인지 알 수 없다

  // 명시적 인자를 사용해 가독성 + 선택적 인자 전달
  println(greet(name = "이것은", city = "무엇일까", age = 20))
  println(greet(city = "무엇일까", age = 20, name = "이것은", value = 3))
  println(greet(city = "무엇일까", name = "이것은"))
  ```

# 다중 인자와 스프레드

## 다중인자

- 다중인자 `vararg` 는 함수가 여러 개의 인자를 받을 때 타입 안정성을 제공해주는 기능

  - `vararg` 키워드로 선언한 타입의 형태로 인자를 여러개 받는다

  ```kotlin
  // 배열을 인자로 받는 함수
  fun max(numbers: IntArray): Int {
  	...
  }
  println(max([1, 3, 5])) // 파라미터를 배열로 전달해야한다

  // 다중인자 vararg을 사용한 함수
  fun max(vararg numbers: Int): Int { // Int 인자를 배열형태로 받는다
  	...
  }
  println(max(1, 3, 5)) // 여러개의 파라미터를 받는다
  ```

- 다중인자도 기본인자와 동일하게 인자가 위치하는 순서는 상관없지만 `어디까지가 해당 인자의 범위라고 볼 것인지` 를 파악하는 것이 결국 명시적 인자를 사용해야만 하므로 다중인자나 기본인자의 장점을 효과적으로 사용하기 위해 뒤쪽에 위치하는 것을 권한다

## 스프레드 연산자

- 이미 배열로 존재하는 값들을 `vararg` 의 인자로 다시 풀어서 전달해야 하는 경우에 사용한다

  ```kotlin
  // vararg 형태로 Int 인자를 받는 함수
  fun max(vararg numbers: Int): Int {
  	...
  }

  val values = intArrayOf(1, 2, 3)
  println(max(values)) // type mismatch: inferred type is IntArray but Int was expected
  ```

  1. Int형 인자를 여러개 받는 함수에 IntArray 파라미터를 넘기면서 타입 에러가 발생하였다
  2. `println(max(values[0], values[1], values[2]))` 형태로 파라미터를 풀어서 전달하는 방법이 있으나 너무 코드가 지저분해진다 (코틀린의 목적은 단순하고 간결함인데!)
  3. `println(max(*values))` 스프레드 연산자 `*` 를 이용해 배열을 다중인자로 전달하였다

- 배열은 스프레드 연산자가 가능한데 리스트는 불가능하다...
  - `max(*listOf(1, 2, 3).toIntArray())` 이처럼 리스트를 배열로 한번 변환 후 스프레드 할 수 있다

# 구조분해

- 구조화 ↔ 구조분해

  - 구조화: 다른 변수의 값으로 객체를 만드는 것
  - 구조분해: 객체에서 값을 추출해 변수에 넣는 것
  - javascript의 구조분해와 유사하지만 속성의 이름이 아닌 `속성의 위치`를 기반으로 한다

  ```kotlin
  // 일반적인 방법
  fun getFullName = Triple("첫번째", "두번째", "세번째")
  val result = getFullName()
  val first = result.first // 각각 속성값들을 할당해줘야한다
  val second = result.second
  val third = result.third

  // 구조분해
  val (first, second, third) = getFullName() // Triple의 속성값들을 순서대로 할당한다
  val (_, _, third) = getFullName() // 필요하지 않은 속성값은 _로 스킵한다
  val (_, second) = getFullName() // 필요하지 않은 속성값은 _로 스킵한다
  ```

# 결론

- 코틀린에서는 `top-level functions` 최상위 함수를 개발자가 만들 수 있다
  - 객체로만 이뤄질 필요가 없고 함수로만 작성이 가능하다
  - 상황에 따라 함수형, 객체지향, 절차적 구현을 가능하게 한다
- 파라미터는 항상 타입을 명시해주어야 한다
- 블록으로 작성된 함수는 리턴타입이 필수로 명시되어야한다
  - 등호로 작성된 단일표현식 함수는 리턴타입을 추론 가능하여 생략해도 된다
- 기본인자 기능을 활용하면 기존의 작성된 함수의 확장을 쉽게 할 수 있다
- 명시적 인자를 사용해 코드의 가독성을 향상시킨다
- `vararg와 *` 를 이용해 다중인자를 전달하면서도 타입의 안정성을 유지시켜준다

# 🚨?!?!?

- Nothing

  - Unit을 리턴값이 없다는 void를 대체하는 타입으로 사용하였는데 Nothing이라는 타입을 알게 되었다
  - Unit과 비슷하지만 또 다르고 void와 Unit이 완전 같지 않음을 깨닫고 🙈
  - Unit을 로그 찍어보면 `클래스.Unit` 으로 나오는 부분에서 추측할 수 있듯 Unit 자체가 class이다
  - 그렇다면 Unit을 진정한 void라고 볼 수 있을까?

    - void는 리턴 값이 없다는 것을 의미하는 타입이지만 Unit은 그 자체로 class를 의미하므로 진정한 void는 아닌 것 같다
    - 그래서 Nothing이 나타난다
    - 리턴은 하지만 값이 없다는 의미의 Unit
    - 리턴이라는 것조차 하지 않는다는 Nothing

    ```kotlin
    fun returnVoid() {  // Unit으로 추론된다
        println("무언가 리턴은 하지만 리턴하는 값이 없다")
        return
    }
    fun returnUnit(): Unit {
        println("Unit을 리턴 타입으로 명시하면 return 키워드를 쓰지 않아도 리턴되는 값이 없는 형태로 인식된다")
    }

    fun nothing(): Nothing = throw Error("리턴하지 않고 에러를 던졌다")
    fun throwErrNothing(): Nothing {
        // 블록 함수는 리턴이 필수인데 에러를 던졌으니깐 리턴이 없어도 이게 끝!
        throw Error("리턴 타입을 Nothing 이라고 명시하였다")
    }
    fun throwErr() {
        throw Error("리턴 타입이 Unit으로 추론되고 있다")
    }
    ```

  - 모든 타입을 뜻하는 Any > Unit > Nothing
    - 리턴 타입을 명시하지 않은 throw를 던졌더니 Unit으로 추론되고 있다
    - Nothing은 모든 타입 클래스가 갖고 있는 하위 타입으로 보여진다
  - `리턴이라는 행위의 유무`가 두 타입의 가장 큰 차이점!!!

# 🙈 더 알아보기

- 오버로딩 vs 오버라이드

  - 오버로딩

    - 같은 메서드 이름으로 파라미터만 다르게 하여 확장
    - 비슷한 코드를 중복 작성하게 됨

      ```kotlin
      함수1(param1) {}
      함수1(param1, param2) {}
      함수1(param1, param2, param3) {}
      ```

  - 오버라이드

    - 상속 받아온 메서드를 재정의

      ```kotlin
      클래스 extends 부모 {
      	부모함수() {
      		// 재정의
      	}
      }
      ```
