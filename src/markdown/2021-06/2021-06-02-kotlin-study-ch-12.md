---
slug: /blog/kotlin-study-ch12
date: 2021-06-02
layout: post
published: true
title: 연산자 오버로딩부터 함수 확장까지
subtitle: Chapter 12 코틀린에서 구현하는 유창성
tags: [코틀린, 스터디, kotlin]
---

```markdown
[참고 도서]

- 다재다능 코틀린 프로그래밍
```

# 연산자 오버로딩

- 같은 연산 결과를 얻지만 + 연산자를 사용해 더 유연하고 유창하게 한다

  ```kotlin
  num1.sum(num2)
  num1 + num2
  ```

- 코틀린에서는 +, -, \*와 같은 연산자를 숫자 타입 뿐만아니라 직접 만든 객체에 대해서도 사용할 수 있다

  ```kotlin
  withList + appleWatch
  ```

  - 그러나 명확하게 코드를 전달하지 못한다면 오히려 어뷰징이 되어버린다
  - 연산자의 동작 의도를 정확하게 전달해야한다

- 코틀린이 Java 바이트 코드로 컴파일되는데, JVM은 연산자 오버로딩을 지원하지 않는다

  - 그래서 내부적으로 연산자를 또 다른 명명된 메소드로 매핑하여 사용한다

    ```kotlin
    operator fun Pair<Int, Int>.plus(other: Pair<Int, Int>) = Pair(first + other.first, second + other.second)
    ```

- `직접 만든 클래스에 연산자를 오버로딩 하기 위해서 특화된 메소드를 클래스의 멤버함수로 작성해야한다`

  - oparator로 마크된 연산자 대응 메소드로 오버로딩 한다

    ```kotlin
    data class Complex(val real: Int, val imaginary: Int) {
      operator fun times(other: Complex) = Complex(real * other.real, imaginary * other.imaginary)
    }
    println(Complex(2, 4) * Complex(3, 4)) // Complex(real=6, imaginary=16)
    ```

  - 오버로딩한 연산자로 객체를 변경하면 안된다
    - immutable 해야한다
    - 연산 후 새로운 결과값을 반환하는 것이다

# 확장 함수와 속성을 이용한 인젝팅

- 이미 존재하는 클래스에 메소드와 속성을 인젝팅할 수 있다
  - 바이트코드 변경 없이 추가할 수 있다
  - 상속이 아니라 확장
- 멤버 함수 >>> 확장 함수
  - 이름이 같아서 충돌하는 경우 멤버 함수가 이긴다
  - 인스턴스에서 메소드를 찾고 없으면 확장 함수를 찾기 때문

### 확장 함수를 이용한 메소드 인젝팅

```kotlin
data class Point(val x: Int, val y: Int)
data class Circle(val cx: Int, val cy: Int, val radius: Int)
fun Circle.contains(point: Point) = (point.x - cx) * (point.x - cx) + (point.y - cy) * (point.y - cy) < radius * radius

/*
data class Circle(val cx: Int, val cy: Int, val radius: Int) {
  fun contains(point: Point) = (point.x - cx) * (point.x - cx) + (point.y - cy) * (point.y - cy) < radius * radius
}
*/

val circle = Circle(100, 100, 20)
val point = Point(20, 40)
println(circle.contains(point))
```

- 클래스 내부에 작성한 것과 동일하게 동작한다
  - 확장 함수에서 암시적으로 클래스 인스턴스에 접근한다
  - 단, private 속성에는 접근할 수 없다
- 확장 함수는 패키지의 static 메소드로 만들어진다

### 확장 함수를 이용한 연산자 인젝팅

```kotlin
operator fun Circle.contains(point: Point) = (point.x - cx) * (point.x - cx) + (point.y - cy) * (point.y - cy) < radius * radius
```

- 연산자 오버로딩과 동일하게 operator 키워드를 붙여준다

### 확장 속성을 이용한 속성 인젝팅

```kotlin
val Circle.area: Double
  get() = kotlin.math.PI * radius * radius

println(Circle(100, 100, 10).area)
```

- 확장 속성은 클래스 내부에 존재하는 것이 아니라서 `백킹 필드`를 가질 수 없다

### 서드파티 클래스 인젝팅

```kotlin
fun String.isPalindrome(): Boolean {
  return reversed() == this
}
println("wow".isPalindrome())
```

- 코틀린 내부 함수 또는 서드파티 클래스를 확장할 수 있다
- 이미 존재하는 메소드의 동작을 바꾸면 안된다

### static 메소드 인젝팅

- 클래스의 컴패니언 객체를 확장할 수 있다

  - 클래스가 컴패니언 객체를 가지고 있다면 static 메소드를 인젝팅할 수 있다

  ```kotlin
  fun String.Companion.toURL(link: String) = java.net.URL(link)
  val url = String.toURL("https://www.naver.com")
  print(url)
  ```

### 클래스 내부에서 인젝팅

- 클래스 내부에서 인젝팅하는 경우

  - 외부에서 확장함수를 사용하려고 하면 에러가 발생한다

  ```kotlin
  class Point() {
    private val value = "wow"
    fun String.isPalindrome() = "${value}, ${this@Point.value}, ${this.toString()}"

    override fun toString(): String {
      return "pop".isPalindrome()
    }
  }
  val point = Point()
  print(point.toString()) // wow, wow, pop
  ```

  - 확장 함수가 클래스 내부에서 생성되었기 때문에 `this와 this@Point` 두개의 리시버를 갖고 있다
    - 익스텐션 리시버: 해당 확장 함수를 실행하는 객체 `this`
    - 디스패치 리시버: 확장 함수를 추가한 대상 클래스 인스턴스 `this@Point`
    - 버블링으로 익스텐션에서 먼저 찾고 없으면 디스패치로 찾으로 간다

- 특정 확장 함수를 클래스 내부에서만 사용하도록 스코프를 좁히는데 유용하다

# 함수 확장

- 클래스에 메소드를 인젝트한 것 처럼 함수에도 메소드를 인젝트할 수 있다

  - `코틀린에서 함수는 객체이다`

  ```kotlin
  fun <T, R, U> ((T) -> R).andThen(next: (R) -> U): (T) -> U = { input: T -> next(this(input)) }

  fun increment(number: Int): Double = number + 1.toDouble()
  fun double(number: Double) = number * 2
  val incrementAndDouble = ::increment.andThen(::double)
  println(incrementAndDouble(5)) // 12.0
  ```

  - T → R 함수를 R → U를 인자로 받는 `andThen` 메소드를 호출해서 T → U를 리턴한다
  - `fun String.isPalindrome() = ...` 처럼 `((T) → R)` 형태의 함수를 확장한 것이다

# infix를 이용한 중위표기법

- 중위표기법 ⇒ 연산자가 중간에 있거나 피연산자 사이에 있는 것
  - `if (obj.instanceOf(String)) { ... }` 를 중위표기법을 사용해 `if (obj instanceOf String) { ... }` 형태로 변경하였다
- 코틀린에서 연산자는 항상 자동으로 중위표기법을 사용한다
  - 그러나 메소드는 기본적으로 중위표기법을 사용하지 않는다
- `infix` 어노테이션을 사용해 메소드를 중위표기법으로 나타낼 수 있다

  ```kotlin
  operator fun Circle.contains(point: Point) = (point.x - cx) * (point.x - cx) + (point.y - cy) * (point.y - cy) < radius * radius
  println(circle.contains(point))

  >>>

  infix operator fun Circle.contains(point: Point) = (point.x - cx) * (point.x - cx) + (point.y - cy) * (point.y - cy) < radius * radius
  println(circle contains point)
  ```

- infix를 이용해 함수에 유연성을 제공한다

  - 그러나 `infix 메소드는 하나의 파라미터`만 받아야하는 제한이 있다
  - vararg나 기본 파라미터는 사용 불가능하다

  ⇒ 파라미터가 여러개면 `circle contains param1 param2` 이렇게 써야하는데 이상하니깐!?

# Any 객체를 이용한 자연스러운 코드

- `also(), apply(), let(), run()`
  - 람다 표현식을 파라미터로 받고 전달받은 람다를 실행하고 객체를 리턴한다
  - `각 메소드의 리시버(this)와 리턴 결과의 차이`

### let()

```kotlin
val context = "context"
val result = context.let { arg ->
	println(arg) // context
	"$arg 업데이트"
}
println(result) // context 업데이트
```

- 컨택스트 객체를 아규먼트로 람다에게 전달한다
- 람다의 this는 렉시컬 스코프이고 람다의 리턴값이 let의 호출 결과로 리턴된다

### also()

```kotlin
data class Context(val value: String)
val context = Context("context")
val result = context.also { arg ->
  println(arg) // Context(value=context)
  "이값이아니라"
}
println(result) // Context(value=context)
```

- 컨택스트 객체를 아규먼트로 람다에게 전달한다
- this도 let()과 동일하다
- also()는 let()과는 다르게 람다의 리턴값이 아니라 컨텍스트 객체를 also() 리턴값으로 가진다
  - also()가 전달받은 람다의 리턴타입은 Unit이다

### run()

- 람다에 아규먼트를 전달하지 않는다

  ```kotlin
  data class Context(val value: String)
  val context = Context("context")
  val result = context.run {
    println(value) // context
    "title"
  }
  println(result) // title
  ```

- 컨텍스트 자체가 람다의 this로 바인딩한다
- 람다가 리턴하는 값이 run()의 리턴값이다

### apply()

```kotlin
data class Context(val value: String)
val context = Context("context")
val result = context.apply {
  println(value) // context
  "이값을리턴하지않는다"
}
println(result) // Context(value=context)
```

- 람다에 아규먼트를 전달하지 않는다
- run()과 동일하게 컨텍스트 자체가 람다의 this로 바인딩된다
- 그러나 run()과 다르게 람다의 리턴값을 무시하고 컨텍스트 객체를 apply() 메소드의 리턴값으로 가진다
  - 람다의 리턴타입은 Unit이다

### 4개의 메소드로 코드 정리하기

- 타깃 객체를 유지하고 싶다면 apply()
- 람다 표현식의 결과를 유지하고 싶다면 run()
- 아규먼트로 전달한 람다의 결과를 사용하기를 원한다면 let()
- 타깃 객체에 람다를 파라미터로 전달하고 람다의 결과값과 무관하게 타깃으로 다시 돌아가서 동작하도록 also()

# 암묵적 리시버

### 리시버 전달

- `run(), apply()로 리시버(this)를 전달힌다`
  - js의 call, apply
  - `String.(Int) -> Unit` String을 리시버로 명시하였다
  - 리시버 자체에서 변수를 찾을 수 없다면 컴파일러는 렉시컬스코프로 찾으러간다

### 멀티플 스코프

- 람다 표현식이 다른 람다 표현식에 의해 중첩되는 경우
  - 내부의 람다 표현식에는 멀티플 리시버를 가진 것처럼 보인다
  - `다이렉트 리시버와 부모의 리시버`
  - 그러나 람다는 하나의 리시버만 가진다
  - 중첩되는 경우 멀티플 스코프를 가질 수 있으나 가장 가까운 리스너에서부터 찾아간다

# 결론

- 연산자 오버로딩
- 함수, 프로퍼티, 연산자 확장
- 중위표기법
- 람다 암시적 리시버
- 이 모든 것이 DSL을 위한 것이였다...

# 🚨?!?!?

-

---

# 🙈 더 알아보기

- `also(), apply(), let(), run()`
