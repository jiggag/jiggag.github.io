---
slug: /blog/kotlin-study-ch6
date: 2021-04-22
layout: post
published: true
title: 코틀린 타입 안정성 그리고 공변성과 반공변성...
subtitle: Chapter 06 오류를 예방하는 타입 안정성
tags: [코틀린, 스터디, kotlin]
---

```markdown
[참고 도서]

- 다재다능 코틀린 프로그래밍
```

# Any과 Nothing

## Any

- 어떤 클래스에서도 사용 가능하도록 모든 클래스가 상속 받는 `베이스 클래스`
  - equal(), toString() 처럼 바로 사용할 수 있는 이유
  - 자바 Object
- 타입을 제한하지 않아 `유연하게 사용`할 수 있다
  - 코틀린의 타입 안정성 추구에 삐뚤어지는 클래스...
  - `모든 코틀린 타입에 공통 적용되는 메소드를 위해 사용`
    - equal(), toString(), to(), let(), run(), apply()...
    - Any 클래스에 구현된 확장함수

## Nothing

- 모든 클래스가 갖고 있는 클래스
- 아무것도 리턴하지 않을 경우 리턴하는 클래스

  - void와 닮았지만 다르다
  - 코틀린에서 void 대신 Unit 클래스 사용하는데 이는 리턴을 하긴 하는 경우 사용한다
  - Nothing은 리턴 자체를 하지 않을때 사용한다
  - `오직 예외만을 발생시키고 아무런 인스턴스나 값, 결과가 반환되지 않는다`

    - Nothing 타입의 대표가 예외

      ```kotlin
      fun test(n: Int): String {
      	if (n >= 1) {
      		return "1보다 같거나 큼" // return String
      	} else {
      		throw RuntimeException("1보다 작음") // return Nothing
      	}
      }
      >>>
      java.lang.RuntimeException: 1보다 작음
      	at Test.test(test.kts:146)
      	at Test.<init>(test.kts:150)
      ```

  - Nothing의 목적은 컴파일러의 타입 무결성 검증을 도와주기 위함이다

# Null 가능 참조

## null이라고요?

- 객체를 리턴하는 API에서 갑자기 null이 내려오는 경우
  - null 처리를 해두지 않았다면 null에서 구조분해를 하려는 경우 에러가 발생한다
  - NullPointerException
  - 이를 처리하기 위한 Optional
    - 누군가는 결국 null처리를 해야만 한다!
- null을 사용하지 않으면 안될까?
  - 코틀린에서 nullable 타입을 사용해 안정성을 추구한다
  - 또한 컴파일 시점에 null 체크 검증을 통해 오류도 예방한다

## null은 에러를 유발한다

- `콜렉션을 리턴하는 함수가 리턴할 게 없다면 null이 아니라 빈 콜렉션을 리턴해야한다` - 이펙티브 자바
  - 이런 좋은 의견을 강력하게 이야기해주는 책이 있었다니...
  - 그동안 혼자 고민하느라 힘들었다
  - 이제 당당하게 null말고 빈거 주세요! 해봐야지!
  - 콜렉션이 아닌 경우 null보다는 Optional을 권장하고 있다
    - 하지만 null을 피하려고만 해도 오버헤드가 발생한다
- null을 리턴하게 되면 사용하는 쪽에서 null에 대한 오류 처리를 해야한다
- 코틀린이 이런 상황들을 안전하고 우아하게 해결해준다

  - null 참조나 타입이 불가한 곳에 할당하거나 리턴하려고 하면 컴파일 오류를 발생시킨다

    ```kotlin
    fun nonNull(value: String): String {
      if (value == "nonnull") {
        return "널이 아닙니다"
      }
      return null // Null can not be a value of a non-null type String
    }
    println(nonNull(null)) // Null can not be a value of a non-null type String
    ```

  - 코틀린에서는 null과 nullable을 사용하지 않도록 한다
    - 꼭 사용해야한다면 NPE가 발생하지 않도록 명확하게 표현해야한다

## nullable

- 해당 타입과 null을 모두 받을 수 있다

  - `String?, List<String>?, CustomClass?`

  ```kotlin
  fun nonNull(value: String?): String? {
    if (value == "nonnull") {
      return "널이 아닙니다"
    }
    return null
  }
  println(nonNull("nonnull")) // 널이 아닙니다
  println(nonNull("null")) // null
  println(nonNull(null)) // null
  ```

## 세이프 콜 연산자 (?)

- null에서 메소드를 호출하려고 할 때 `save call operation`이나 `non-null assertion operator` 이 필요하다
- `? 연산자` 로 메소드 호출과 객체 속성에 대한 접근을 nullable하게 할 수 있다
  - `value?.method()`
  - value가 null이면 해당 메소드 호출은 null을 반환한다

## 엘비스 연산자 (?:)

- 세이프 콜 연산자에서는 대상이 null이면 null을 반환하지만 엘비스 연산자를 사용하여 특정 값을 반환하도록 할 수 있다
  - `value?.method() ?: "기본값 반환"`
    1. value가 null이면 기본값 반환
    2. value가 null이 아니면 해당 결과값 반환

## 확정 연산자 (!!)

- 모든게 `null이 절대 아니라고 확정한다`
  - `value!!.method()`
  - value가 무조건 null이 아니라고 확정하고 method를 호출하는데 실행하면 NPE...

## when으로 nullable 처리

- 세이프 콜 연산자나 엘비스 연산자로 nullable을 처리하는 것보다 when으로 처리할 수 있다

  - 해당 값을 추출하고자 한다면 세이프콜이나 엘비스 연산자
  - nullable한 참조에 대한 처리를 결정해야 할 때 when

  ```kotlin
  fun nickName(name: String?): String {
    if (name == "이름") {
      return "닉네임"
    }
    return name?.reversed()?.toUpperCase() ?: "없음"
  }
  println(nickName("이름")) // 닉네임
  println(nickName("etc")) // CTE
  println(nickName(null)) // 없음

  fun nickName(name: String?) = when (name) {
  	"이름" -> "닉네임"
  	null -> "없음"
  	else -> name.reversed().toUpperCase()
  }
  ```

  - 두번째 구문에서 null에 대한 처리를 했기때문에 마지막 else에서는 세이프콜 연산자를 사용하지 않아도 에러가 발생하지 않는다

# 타입 체크와 캐스팅

## 타입 체크

- 메소드를 호출하고자 한다면 해당 메소드를 가지고 있는 타입인지 확인이 필요하다
- 확장성에서는 타입 체크가 필수적이다

## is

- `a is A` a가 A타입인지 확인한다
- 객체의 타입과 같거나 상속관계에 있다면 true를 반환한다
- `b !is A` 로 사용하면 b는 A가 아님을 확인할 수 있다

## 스마트 캐스트

- 해당 참조의 타입이 확인되면 자동으로 스마트 캐스팅 된다
  - 코틀린이 타입을 확인하는 즉시 스마트 캐스트가 동작한다
  - `is` 를 사용하고 나면 해당 값의 타입은 검증되었기에 추가로 타입 캐스팅 없이 해당 타입으로 동작한다

## 명시적 타입 캐스팅

- `as, as?`
- 컴파일러가 타입을 결정할 수 없어 스마트 캐스팅을 할 수 없는 경우 사용한다

```kotlin
fun anyType(): Any {
  return 1
}
println((anyType() as String).length)

>>>
java.lang.ClassCastException: class java.lang.Integer cannot be cast to class java.lang.String (java.lang.Integer and java.lang.String are in module java.base of loader 'bootstrap')
```

- `(result as String).length`
  - result의 타입을 String이라고 명시를 해버리고 String처럼 동작하도록 하였다
  - 강제로 타입을 바꿔버렸기 때문에 실제로 result가 String이 아닌 경우 런타임 에러가 발생한다
- `println((anyType() as? String)?.length)`
  - `as?` 을 사용해서 실제 String이 아니라 실패하는 경우 null이 반환되도록 방어처리를 할 수 있다
  - null.length도 없으니깐 여기도 추가적으로 방어처리가 되어야한다
  - as?가 as 보다 안정적으로 보인다
- 스마트 캐스트 안전한 캐스트 연산자를 사용하기를 권한다

# 제네릭

- 코드 재사용성을 위해 타입을 Any로 사용하여 안정성이 저하되는 것을 방지하고자 제네릭을 사용한다
- 자바에서는 제네릭으로 받은 파라미터 타입 T에 대해서만 사용가능하고 T의 부모나 자식 클래스를 사용하는 것이 불가능했다
  - 그것은 타입이 정확하게 일치해야하기 때문이다
- 코틀린에서는 이를 **공변성(T의 자식), 반공변성(T의 부모)** 을 사용해 확장했다
  - 파라미터 타입 T를 확장해 T의 자식클래스(extends)와 부모 클래스(super) 모두 쓸 수 있다
- 사용처 가변성 - 제네릭을 사용할때
- 선언처 가변성 - 제네릭을 선언할때

## 타입 불변성

- 타입을 변경할 수 없다
  - 전달 받는 타입은 약속된 타입과 동일해야한다!!!!
  - !!이런 불변성을 뛰어넘어 다른 타입을 전달하고자 한다면 공변성, 반공변성을 활용한다...
- 메소드가 클래스 T를 파라미터로 받는다 → T의 자식 클래스로 전달 가능하다
  - fun method(Animal animal) → method(dog) 가능
- 메소드가 타입 T의 제네릭을 받는다 → T의 파생 클래스는 전달 불가능하다

  - fun method<Animal> → method<Dog> 불가능

  ```kotlin
  open class Fruit // public static class Fruit {}
  class Banana: Fruit() // public static final class Banana extends Example.Fruit {}
  class Orange: Fruit()

  fun receiveFruites(fruits: Array<Fruit>) {
  	println(fruits.size)
  }
  val banana: Array<Banana> = arrayOf()
  receiveFruites(banana)
  >>> Kotlin: Type mismatch: inferred type is Array<Banana> but Array<Fruit> was expected
  ```

  1. Fruit를 제네릭으로 받는 배열을 파라미터로 갖는 `receiveFruites` 함수에 Banana 배열을 넘겼더니 에러가 발생했다
  2. 코틀린의 `제네릭에 대한 타입 불변성` 으로 에러가 발생한다
     - Banana 배열은 Fruit 배열을 상속받지 않았다?
     - 상속 받았다면 Fruit의 인스턴스 메소드를 모두 Banana에서 사용 할 수 있다?
  3. `receiveFruites` 에서 Banana를 전달 가능하게 처리하다보면 Orange도 처리해줘야하고 그러면 `리스코프 치환 원칙` 에 위배된다

  ```kotlin
  val banana: Array<Banana> = arrayOf()
  receiveFruites(banana)
  >>> 이건 타입 오류가 발생하지만

  val banana: List<Banana> = listOf()
  receiveFruites(banana)
  >>> 이건 정상 동작한다
  ```

  - arrayOf와 listOf의 차이로 뮤터블인지 이뮤터블인지에 따라 타입 불변성이 유지된다
    - 뮤터블인 arrayOf에서는 Fruit가 아닌 Array<Banana>에 또 다른 무언가가 추가되어 Fruit와는 다르게 동작할 가능성이 있기에 에러를 발생시킨다
    - 이뮤터블인 listOf는 추가할 수 없기에 정상 동작한다
    - 두 타입의 정의를 보면 `Array<T>는 class Array<T>` 이고 `List<T>는 interface List<out E>` 이다

## 공변성

- 부모 클래스 자리에 자식 클래스도 사용할 수 있게 확장한다
- `타입 T를 확장`해서 사용하고자 `코틀린 컴파일러가 공변성을 허용`하도록 타입 프로젝션을 사용한다
  - 코틀린은 Array<Banana>를 Array<Fruit>를 받는 곳에 전달하는 것을 방지한다
  - Array<Banana>에 이상한 걸 추가해서 Fruit라고 하는 것을 보호해주는 것이다
  - 제네릭 베이스 타입이 요구되는 곳에 제네릭 파생 타입이 허용되도록 하기 위해 공변성을 허용하도록 하는 타입 프로젝션을 사용한다

### 공변성 사용하기

```kotlin
val fruitBasket1 = Array<Fruit>(3) { _ -> Fruit()  }
val fruitBasket2 = Array<Fruit>(3) { _ -> Fruit()  }
fun copyFromTo(from: Array<Fruit>, to: Array<Fruit>) {
  for (i in 0 until from.size) {
    to[i] = from[i]
  }
}
copyFromTo(fruitBasket1, fruitBasket2)

// from과 to 모두 동일하게 Fruit 타입의 배열을 인자로 전달받았기에 정상 동작한다
```

```kotlin
val fruitBasket = Array<Fruit>(3) { _ -> Fruit()  }
val bananaBasket = Array<Banana>(3) { _ -> Banana()  }
copyFromTo(bananaBasket, fruitBasket) // type mismatch

// Banana 배열을 전달하고자 하면 타입 에러가 발생한다
```

- 코틀린에서는 from을 읽어오기만 하기 때문에 Fruit나 Fruit의 하위 클래스가 전달되어도 괜찮다 → `파라미터 타입의 공변성`
  - `from: Array<out Fruit>` 형태로 from 인자를 내부 로직에서 읽기만 한다는 것을 명시하여 공변성을 이용한다
  - 만약 `Array<out Fruit>` 라고 해놓고 내부 로직에서 from을 수정하려고 하면 컴파일 오류가 발생한다
- 공변성을 사용하기 위해서는 코틀린 컴파일러에게 어떤 값도 추가, 수정 하지 않겠다는 약속을 해야한다
  - Array<T>는 T타입을 읽고 쓰는 메소드를 모두 가지고 있다
  - 제네릭 클래스를 사용하는 관점에서 공변성을 이용하는 것을 `사용처 가변성 (타입 프로젝션)` 이라고 한다
    - `Array<out T>` 는 `Array<out T>` 의 공변성 파라미터에 추가, 수정이 없다는 것을 보장한다
  - 사용하는 관점이 아니라 선언할 때 공변성을 사용한다고 지정하는 것을 `선언처 가변성` 이라고 한다
    - `List<out T>` 로 되어있는 인터페이스는 `List<T>` 에 추가, 수정이 없다는 것을 보장한다
    - 선언 가변성을 적용된 파라미터에만 사용 가변성과 같이 동작한다

## 반공변성

- 자식 클래스 자리에 부모 클래스를 사용할 수 있게 한다
- 모든 타입의 베이스 타입을 사용할 수 있게 한다

```kotlin
val anyBasket = Array<Any>(3) { _ -> Fruit()  }
val bananaBasket = Array<Banana>(3) { _ -> Banana()  }
copyFromTo(bananaBasket, anyBasket) // type mismatch

// Fruit가 온다고 고정되어 있는 to 자리에 부모 클래스인 Any 타입이 전달되면 타입 오류가 발생한다
```

```kotlin
fun copyFromTo(from: Array<out Fruit>, to: Array<in Fruit>) {
  ...
}
```

- Array<Fruit>로 고정되어 있던 to의 타입을 `Array<in Fruit>`로 변경하였다
  - `in 키워드`는 파라미터에 값을 설정할 수 있지만 읽는 건 불가능하다
  - `반공변성 in` 을 사용한 사용처 가변성이다

## 파라미터 타입 제한 (where)

- 제네릭으로 파라미터에 여러가지 타입을 쓸 수 있도록 유연함을 제공한다

  - 유연함을 제공하면서도 제약하고자 제약조건을 추가하여 파라미터 타입을 제한한다
  - 줬다 뺐기

    ```kotlin
    fun <T> useAndClose(input: T) {
      input.close() // Unresolved reference: close
    }
    ```

    1. input의 타입을 제네릭으로 전달하였지만 어떤 타입에서는 close() 메소드가 없을 수 있다
    2. close가 있는 타입만 들어올 수 있도록 제네릭을 제약조건을 주어서 제약한다
    3. `fun <T: AutoCloseable> useAndClose(input: T)`
    4. T 타입은 `AutoCloseable` 인터페이스를 구현한 클래스만이 들어올 수 있다

- 제네릭에 하나의 제약조건을 주고 싶을 때는 `:` 으로 넣으면 되지만 여러개의 제약조건을 주고 싶은 경우에는 `where` 를 사용한다

  ```kotlin
  fun <T> useAndClose(input: T)
  	where T: AutoCloseable,
  				T: Appendable {
    input.append("더하기")
    input.close()
  }
  ```

  - close와 append를 모두 갖고 있는 타입만이 전달할 수 있다

## 스타 프로젝션 (\*)

- 타입에 대해 정확하게 알 수 없지만 타입 안정성을 유지하면서 파라미터를 전달하고자 할 때 사용한다

  - 스타 프로젝션은 읽기만 허용하고 쓰는 것을 허용하지 않는다

  ```kotlin
  fun onlyRead(values: Array<*>) {
  	for (value in values) {
  		println(value)
  	}
  	values[0] = values[1] // Out-projected type 'Array<*>' prohibits the use of 'public final operator fun set(index: Int, value: T): Unit defined in kotlin.Array'
  }
  ```

# 타입 파라미터 구체화

```kotlin
val books: List<Book> = listOf(NonFiction("찾는책"), Fiction("책"))
fun <T> findFirst(books: List<Book>, ofClass: Class<T>): T {
  val selected = books.filter { book -> ofClass.isInstance(book) }
  if (selected.size == 0) {
    throw RuntimeException("not found")
  }
  return ofClass.cast(selected[0])
}

println(findFirst(books, NonFiction::class.java).name)
```

- 제네릭으로 전달한 타입 T의 인스턴스를 반환하고자 한다
- 타입 체크와 타입 캐스팅을 위해 ofClass를 사용하였다
- ofClass를 전달하기 위해 타입 정보를 런타임에 계속 구해서 전달해야한다

## Reified Type Parameters

```kotlin
inline fun <reified T> findFirst(books: List<Book>): T {
  val selected = books.filter { book -> book is T }
  if (selected.size == 0) {
    throw RuntimeException("not found")
  }
	return selected[0] as T
}
```

- 코틀린의 구체화 타입 파라미터를 이용해 컴파일 시점에 구해서 전달할 수 있다
- 함수 내부에서 T를 타입 체크와 캐스팅 하는데 사용할 수 있다
- 함수가 inline으로 선언되어있기에 reified를 사용할 수 있고 컴파일 시간에 실제 타입으로 대체 된다
- 구체화 타입 파라미터를 이용해 가독성과 타입 캐스팅, 컴파일 안정성을 확보할 수 있다

# 결론

- 타입 안정성이 먼저다!
  - 스마트 캐스트
  - 파라미터 타입 조정
  - reified 타입 파라미터
- nullable과 non-nullable을 분리하여 컴파일러가 메모리 오버헤드 없이 타입 안정성을 가지게 되었다
  - nullable로부터 타입 안정적으로 객체에 접근할 수 있는 연산자를 제공한다

# 🚨?!?!?

- **갑자기 null이 리턴된다고!?**
  - 협업을 하게 되면서 그리고 클라이언트 작업을 하게 되면서 개발된 API를 전달받고나서
  - 더미 데이터로 잘 테스트 하다가 갑자기 에러가 나는 경우가 있다
  - `갑자기 null이 들어왔을때`
  - 분명 문서에도 리턴값은 User, Custom, number, string...
  - 데이터가 없어서 null이라고 한다
  - 이럴때면 왜 null이지? 그냥 빈 값을 내려주면 되는것 아닐까? 생각해보았다
  - []나 {}나... 0이나 ''나...
  - null처리를 어느 곳에서 하느냐의 차이이지 않았을까
  - 이걸 코틀린이 해결해주려나!

# 🙈 더 알아보기

- **공변성, 반공변성**
  - [참고 블로그: 공변성이란 무엇인가](<[https://seob.dev/posts/공변성이란-무엇인가/](https://seob.dev/posts/%EA%B3%B5%EB%B3%80%EC%84%B1%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80/)>)
  - [참고 블로그: 공변성과 반공변성은 무엇인가?](<[https://edykim.com/ko/post/what-is-coercion-and-anticommunism/](https://edykim.com/ko/post/what-is-coercion-and-anticommunism/)>)
  - 공변성은 읽기 전용이라면 반공변성은 쓰기 전용이라고 이해하면 되는걸까
  - 읽기 전용이니깐 확장된 타입인 자식 클래스를 전달해서 읽어가기만 해도 되는 것이고 쓰기 전용에서는 값을 써야하는데 없는 메소드가 있으면 안되니깐 부모 클래스를 전달해도 되는 이런 느낌?
- **리스코프 치환 원칙**
  - [참고](<[https://pizzasheepsdev.tistory.com/9](https://pizzasheepsdev.tistory.com/9)>)
  - 공변성, 반공변성과 연관
  - 부모 클래스의 인스턴스가 실행하는 행위는 자식 클래스의 인스턴스들도 일관성이 있게 실행해야 함
  - 부모에서 구현한 원칙을 따라야 한다
- **inline 키워드**
  - `inline fun <reified T>  findName(...):T {}`
  - `reified` 를 사용하려면 `inline 함수` 이여야만 한다
  - inline 키워드는 무슨 뜻일까
- **reified 키워드**
  - inline 키워드 안에서만 사용가능하다
  - 제네릭으로 주어진 타입을 함수 내부 로직에서 마치 클래스 인 것 처럼 사용할 수 있다
  - `name is T` 이런 모양으로... ??? 원래 안되나?? 헷갈린다
- **오버헤드**
  - 무언가를 처리하기 위해 소요되는 처리 시간이나 메모리
  - X만큼 걸리던 처리에 안정성 개선하고자 추가한 작업으로 인해 X+5만큼 걸리게 되었다면 5라는 오버헤드 발생
