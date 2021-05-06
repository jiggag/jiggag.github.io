---
layout : post
published : true
title : 클래스, 인터페이스, 상속
subtitle : Chapter 08 클래스 계층과 상속
tags : [코틀린, 스터디, kotlin]
--- 

```markdown
[참고 도서]
- 다재다능 코틀린 프로그래밍
```

# 클래스

- 객체지향 프로그래밍은 추상화 개념을 바탕으로 한다
- 클래스는 다른 클래스의 추상화에 연결되어 있다
- 코틀린은 추상화와 상속 과정이 간단하다
- 인터페이스를 만들고 중첩클래스와 내부클래스를 정의하고 상속을 사용한다
- 인터페이스는 명세에 따라 제공되고, 클래스는 그 명세를 구현하며, 추상 클래스로 재사용할 수 있다
- 클래스를 sealed로 정의하여 확장할 수 있는 클래스를 제한한다

# 인터페이스와 추상 클래스

## 인터페이스

- 인터페이스 안에 컴패니언 객체를 작성하여 static 메서드를 가질 수 있다
- 인터페이스를 상속하여 클래스에서 구현된 메서드를 가져오도록 한다

    ```kotlin
    class TV {
      var volume = 0
    }
    class TVRemote(val tv: TV): Remote {
      override fun up() { tv.volume++ }
      override fun down() { tv.volume-- }
    }

    val tv = TV()
    val remote: Remote = TVRemote(tv)
    remote.doubleUp()
    remote.down()
    remote.up()
    println(tv.volume) // 2
    ```

    1. `up, down` 처럼 추상 메서드는 인터페이스에 정의만 한다
    2. `doubleUp` 처럼 구현된 메서드는 클래스와 유사하지만 추가적인 문법이나 인자가 없다
    3. 인터페이스를 구현하는 클래스는 추상 메서드를 오버라이드 해야한다
        - `doubleUp` 처럼 구현된 메서드는 구현하지 않아도 된다
        - `class TVRemote(val tv: TV): Remote` 형태로 TVRemote가 Remote 인터페이스를 구현한다는 것을 명시하였다 (리턴타입 아닌가ㅜㅜ)

    ⇒ `doubleUp` 을 override하지 않았음에도 호출할 수 있다

- 인터페이스 안에 static 메서드를 작성할 수 없다
    - 컴패니언 객체를 사용한다

        ```kotlin
        interface Remote {
          fun up()
          fun down()
          fun doubleUp() {
            up()
            up()
          }

          companion object {
            fun combine(first: Remote, second: Remote): Remote = object: Remote {
              override fun up() {
                first.up()
                second.up()
              }

              override fun down() {
                first.down()
                second.down()
              }
            }
          }
        }

        val tv = TV()
        val remote: Remote = TVRemote(tv)
        val another = TV()
        val anotherRemote = TVRemote(another)
        val combinedRemote = Remote.combine(remote, anotherRemote)
        combinedRemote.up()
        combinedRemote.down()
        combinedRemote.doubleUp()
        println("${another.volume} ${tv.volume}") // 2 2
        ```

        - 인터페이스 안에 컴패니언 객체를 사용해 override한다
- 인터페이스를 구현할 때에는 모든 추상 메서드를 구현해야한다
    - 여러개의 인터페이스를 구현하는 경우 이름이 겹치는 메서드를 포함해 모든 메서드를 구현해야한다??!?

## 추상 클래스

- `abstract` 로 시작하는 추상 클래스, 추상 메서드를 구현한다

    ```kotlin
    abstract class Musician(val name: String, val activeFrom: Int) {
      abstract fun instrumentType(): String
    }
    class Cellist(name: String, activeFrom: Int): Musician(name, activeFrom) {
      override fun instrumentType(): String = "String"
    }
    val ma = Cellist("이름", 2021)
    println("${ma.name} ${ma.activeFrom}")
    ```

    - `abstract fun instrumentType(): String`
    - 추상 클래스에서 구현되지 않은 추상 메서드 표시

## 인터페이스 vs 추상 클래스

- 클래스는 여러 개의 인터페이스는 구현할 수 있다
    - 여러개를 받으니깐 인터페이는 상태 필드를 갖고 있을 수 없다
- 추상 클래스는 한번에 하나씩만 구현한다
    - 하나만 구현하니깐 필드를 가질 수 있다 → 이름이 겹칠일이 없어서!
- 따라서 여러 클래스 사이에서 상태를 다시 이용해야 한다면 추상 클래스를 사용하는 것이 좋다
    - 공통 상태를 구현할 수 있다
- 각각의 클래스에서 구현되지만 공통 요구사항이 있는 경우 인터페이스를 활용한다
    - 유연한 구현

# 중첩된 내부 클래스

## 내부 클래스

```kotlin
class TV {
  private var volume = 0
  val remote: Remote
  get() = TVRemote()

  override fun toString(): String = "volume: ${volume}"
  inner class TVRemote: Remote {
    override fun up() { volume++ }
    override fun down() { volume++ }
    override fun toString(): String = "remote: ${this@TV.toString()}"
  }
}

var tv = TV()
val remote = tv.remote
println("$tv") // volume: 0
remote.up()
println("$tv") // volume: 1
remote.doubleUp()
println("$tv") // volume: 3
println(remote) // remote: volume: 3
```

- `class TV` 안에 중첩된 `inner class TVRemote` 에서는 TV의 private 속성인 volume에 접근할 수 있다
    - 클로저?

## 익명 내부 클래스

```kotlin
class TV {
  private var volume = 0
  val remote: Remote get() = object: Remote {
    override fun up() { volume++ }
    override fun down() { volume++ }
    override fun toString(): String = "remote: ${this@TV.toString()}"
  }

  override fun toString(): String = "volume: ${volume}"
}
```

- 중첩된 내부 클래스 대신 익명 내부 클래스로 생성할 수 있다

# 상속

- 의도대로 클래스가 동작하도록 `의도치 않은 베이스 클래스로의 사용을 제한하고자 권한을 명시`적으로 제공한다
    - 자식 클래스가 해당 메소드를 오버라이드하는 것이 가능하도록 명시한다
- 코틀린의 클래스는 기본이 `final`이다
    - 기본적으로는 상속이 불가능하다
    - `open`이라고 명시해주어야만 상속할 수 있다
        - interface, abstract랑은 애초에 다르다..!
    - `final override` 라고 해버리면 그 이후 자식클래스에서는 해당 메서드를 오버라이드 할 수 없다
- 리턴타입과 헷갈리게도 동일하게도
    - `class 자식클래스(): 부모클래스`
    - 상속받을 클래스를 명시한다

## 메서드 오버라이드

```kotlin
open class Vehicle(val year: Int, open var color: String) {
  open val km = 0
  final override fun toString(): String = "이건 override 불가능 ${year}, ${color}, ${km}"
  fun repaint(newColor: String) {
    color = newColor
  }
}
open class Car(year: Int, color: String): Vehicle(year, color) {
  override var km: Int = 0
  set(value) {
    if (value < 1) {
      throw RuntimeException("1보다 커야합니다")
    }
    field = value
  }

  fun drive(distance: Int) {
    km += distance
  }
}

val car = Car(2021, "파랑")
println(car) // 이건 override 불가능 2021, 파랑, 0
car.drive(200)
println(car) // 이건 override 불가능 2021, 파랑, 200
car.repaint("빨강")
println(car) // 이건 override 불가능 2021, 빨강, 200
```

1.  `Vehicle` 클래스의 `repaint` 메서드는 open이 명시되지 않아 `final`이다
2. `Vehicle` 클래스의 `toString` 은 `final override`로 명시되어 자식 클래스에서 오버라이드 할 수 없다
3. 자식 클래스 `Car` 에서 `km` 을 오버라이드 하였다
4. `println(car)` 의 toString은 Vehicle의 toString으로 오버라이드 하지는 못하지만 호출은 할 수 있다

## 파라미터 오버라이드

```kotlin
class FamilyCar(year: Int, color: String): Car(year, color) {
  override var color: String
  get() = super.color
  set(value) {
    super.color = value
  }
}
```

- getter, setter 모두 override해서 부모 color를 가져오고 변경한다

## 제약사항

- 오버라이딩 접근 권한에 관한 제약사항
- 부모의 public을 자식이 private, protected로 만들 수 없다
    - 부모가 공개하겠다고 한걸 자식이 숨길 수 없지!
- 부모의 private, protected를 자식이 public으로 느슨하게 할 수 있다
    - 부모가 비공개로 막았지만 자식이 이제 공개하겠습니다!

# sealed 클래스

- `final 클래스`
    - open으로 표기되어 있지 않아 자식클래스가 하나도 없는 클래스
- `open, abstract 클래스`
    - 자식, 자식, 자식
    - 어떤 클래스가 상속받았는지 알 수 없다
- `sealed 클래스`
    - 클래스를 생성할 때 어떤 클래스만 상속 가능하다고 제한한다
    - 동일한 파일에 작성된 다른 클래스들에게만 확장이 가능하다
    - `sealed 클래스의 생성자는 private 표기하지 않아도 private으로 취급된다`

```kotlin
sealed class Card(val suit: String)
class Ace(suit: String): Card(suit)
class Kink(suit: String): Card(suit) {
	override fun toString() = "왕"
}

fun process(card: Card) = when (card) {
	is Ace -> "ace"
	is Kink -> "king"
}
```

1. 여러 자식 클래스가 상속받았다
2. sealed 클래스를 when 구문에서 else로 처리하면 안된다
    - 자식 클래스를 제한해두었는데 else로 처리하면 제한되지 않은 인스턴스가 들어온 경우(?)에 대해 확인할 수 없다

# Enum

- 해당 클래스의 인스턴스 속성을 참조하여 열거
- `enum class Suit { KING, ACE }`
- enum 클래스는 상태와 메서드를 가질 수 있다

    ```kotlin
    enum class Suit(val symbol: String) {
      KING("king") {
        override fun display() = "${super.display()} $symbol"
      };
      open fun display() = "$symbol $name"
    }

    for (suit in Suit.values()) {
      println(suit.display()) // king KING king
    }
    ```

# 마무리

- default 키워드가 없다
- 인터페이스에서도 static 메서드를 컴패니언 객체로 사용한다
- 클래스의 디폴트는 final이다
- 모든 open 클래스가 상속 가능한 것은 아니다
- sealed 클래스를 사용해 상속을 제한할 수 있다
    - 상속에 제약을 줘서 의도치 않게 사용되는 일이 없다
- enum 클래스 인스턴스는 static 멤버로 생성된다
    - 타입 세이프하게 사용할 수 있다

# 🚨?!?!?

- **인터페이스 vs 추상클래스**
    - 인터페이스는 여러개를 extends 할 수 있다
    - 그러나 추상클래스는 `extends가 하나씩만 된다!`
    - 인터페이스와 추상클래스는 `open` 키워드가 없어도 상속받을수 있는데 이건 일반 클래스가 아니라서 그렇다...
- **그럼 인터페이스를 여러개 상속 했을때 발생하는 일!**
    - 이름이 겹치는 메서드는 어떻게 할까?

        ```kotlin
        interface RemoteA {
          fun up() // 무조건 override해야 쓸 수 있음
          fun down()
          fun doubleUp() { // 블록형 디폴트 메서드 -> override없이 그냥 호출해서 사용할 수 있다
            up()
            up()
          }
        }
        interface RemoteB {
          fun up()
          fun down()
          fun doubleUp() {
            up()
            up()
          }
        }

        class TV {
          var volume = 0
        }

        // 1. override 하지 않은 경우
        class TVRemote(val tv: TV): RemoteA, RemoteB {}
        >>> Class 'TVRemote' is not abstract and does not implement abstract member public abstract fun up(): Unit defined in Classstudy.RemoteA
        >>> Class 'TVRemote' must override public open fun doubleUp(): Unit defined in Classstudy.RemoteA because it inherits multiple interface methods of it

        // 2. 하나씩 override 한 경우
        class TVRemote(val tv: TV): RemoteA, RemoteB {
          override fun up() {
            TODO("Not yet implemented")
          }

          override fun down() {
            TODO("Not yet implemented")
          }

          override fun doubleUp() {
            TODO("Not yet implemented")
          }
        }

        // 3. 전부 override 한 경우
        class TVRemote(val tv: TV): RemoteA, RemoteB {
          override fun up() {
            TODO("Not yet implemented")
          }

          override fun down() {
            TODO("Not yet implemented")
          }

          override fun up() {
            TODO("Not yet implemented")
          }

          override fun down() {
            TODO("Not yet implemented")
          }

          override fun doubleUp() {
            TODO("Not yet implemented")
          }

          override fun doubleUp() {
            TODO("Not yet implemented")
          }
        }
        >>> Conflicting overloads: public open fun down(): Unit defined in Classstudy.TVRemote, public open fun down(): Unit defined in Classstudy.TVRemote
        ```

        - TVRemote는 메서드 이름이 동일한 RemoteA와 RemoteB 두개의 인터페이스를 상속받는다
        - 아무것도 override 하지 않은 경우 오류가 발생한다
            - 이름이 같아서 어떤걸 호출해야할지 모르니깐
        - 이름이 중복되는 메서드를 각각 하나씩 override하면 정상적으로 실행된다
        - 상속받은 메서드 전부 override하면 다시 오류가 발생한다

---

# 🙈 더 알아보기

- 클래스 인터페이스
    - 리턴타입처럼 클래스 뒤에 `class TVRemote(val tv: TV): Remote`
    - 이것은 리턴타입이 아니라 인터페이스를 구현한다는 의미...
- 파라미터 오버라이드
    - `class FamilyCar(year: Int, color: String): Car(year, color) {}`
        - 여기에는 var, val이 없는데 이건 마치 인자를 그대로 전달하는듯
        - FamilyCar: color → Car: color → Vehicle: car 까지 가는길