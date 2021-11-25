---
slug: /blog/kotlin-study-ch7
date: 2021-04-29
layout : post
published : true
title : 보일러플레이트 없는 코틀린의 클래스
subtitle : Chapter 07 객체와 클래스
tags : [코틀린, 스터디, kotlin]
--- 

```markdown
[참고 도서]
- 다재다능 코틀린 프로그래밍
```

# 객체와 싱글톤

- 코틀린에서는 클래스를 사용하지 않고 탑레벨 함수만으로도 작업할 수 있다
- 그러나 객체지향 프로그래밍을 따르기에 보일러플레이트 코드 없이 코틀린을 이용해 쉽고 빠르게 클래스를 만들 수 있다
    - 클래스의 속성만 정의하면 코틀린이 backing field를 만들어준다

### 싱글톤

- 인스턴스 수를 제어하기 위해 생성자에 리클렉션 접근을 방지하고
- 스레드 안정성과 인스턴스 존재 유무를 확인하면서 오버헤드를 방지해야한다
- 이런 여러가지 신경써야하는 것을 코틀린에서 싱글톤을 지원하면서 잘못된 구현이나 위험을 방지한다

## 객체 표현식으로 익명 객체 사용하기

- `object` 키워드로 객체가 가지고 있는 필드를 감싸주기만 하면 된다

    ```kotlin
    fun createObj() {
      val circle = object { // val circle: <anonymous object : Any>
        val x = 20
        val y = 20
        val radius = 10
      }
      println("circle ${circle.x}, ${circle.y}, ${circle.radius}")
    }
    createObj()
    ```

    - `circle` 라는 객체에는 `x, y, radius` 속성을 갖고 있다
        - 익명 객체를 circle에 담아주었다
        - 단순하게 객체를 만들었다! `const circle = { ... }` 처럼...
    - **`익명 객체의 내부 타입은 함수나 메서드의 리턴타입이나 파라미터가 될 수 없다`**
    - **`클래스 안에 저장된 속성이 있다면 모두 Any로 간주된다`**
        - `circle` 객체는 `object: Any` 로 추론되고 있다

        ```kotlin
        fun createRunnable(): Runnable {
          val runnable = object: Runnable {
            override fun run() {
              println("runnable")
            }
          }
          return runnable
        }

        fun createRunnable(): Runnable {
          val runnable = object: Runnable, AutoCloseable {
            override fun run() {
              println("runnable")
            }
            override fun close() {
              println("close")
            }
          }
          return runnable
        }
        ```

        - `runnable` 의 타입을 `Runnable` 로 리턴하였다
            - 두번째 runnable에서는 object가 AutoCloseable 타입의 인터페이스도 구현하였지만 `리턴타입이 Runnable라서 close메서드에 접근이 안된다`
            - 리턴이 필요한 경우 리턴할 인스턴스 타입을 명시해주어야한다

## 객체 선언을 이용한 싱글톤

- `object` 키워드 뒤에 이름을 넣어서 객체를 선언한다

    ```kotlin
    object Util {
    	val name = "객체"
      fun numberOfProcessors() = Runtime.getRuntime().availableProcessors()
    }
    println(Util.numberOfProcessors())
    println(Util.name)
    ```

    - `Util` 객체의 메서드 `numberOfProcessors` 를 호출한다
    - Util로 선언된 순간 이미 객체가 되었다!
        - private 생성자와 static 메서드를 갖고 있다
        - 메서드와 속성에 접근이 가능하다

## 탑레벨 함수 vs 싱글톤

- 함수의 그룹핑과 모듈화의 목적
- 넓게 사용될 유틸리티성 함수들은 탑레벨
- 서로 연관되어 있는 함수들은 싱글톤
    - 멀티스레드에서 싱글톤을 뮤터블하게 만들어서 사용하는 경우 서로 업데이트 해버리는 불상사...

# 클래스

## 보일러 플레이트 없는 클래스

- `class Car(val speed: Int)`
- 백킹 필드를 직접 작성하지 않아도 된다
- 코틀린 컴파일러가 생성자와 setter, getter를 추가해준다

    ```java
    public static final class Car {
        private final int speed;

        public final int getSpeed() {
           return this.speed;
        }

        public Car(int speed) {
           this.speed = speed;
        }
     }
    ```

    - 코틀린에서 한줄이 자바로 컴파일하니 여러줄이 되었다...
- 클래스 인스턴스를 만들때 `new` 키워드가 없이 바로 함수처럼 클래스를 이용한다
    - `val car = Car(20)`
    - 클래스 속성에 접근도 일반적으로 접근 가능하다
        - `println(car.speed)`
        - 코틀린에서는 car.speed에 대한 접근을 하면 `car.getSpeed()` 를 호출한다
- 클래스 선언 당시 생성자 파라미터를 뮤터블/이뮤터블하게 선언해주면 setter처럼 바로 속성값 변경이 가능하다
    - `class Car(var speed: Int)`
    - `car.speed = 10000` → car.setSpeed()
- 클래스 속성에 직접 접근이 가능하다

    ```kotlin
    class Car(val speed: Int, var name: String)
    fun useCar(): Pair<Int, String> {
      val car = Car(20, "이름")
      val speed = car.speed
      car.name = "이름바꾸기"
      val name = car.name
      return speed to name
    }
    println(useCar()) // (20, 이름바꾸기)
    ```

## 속성 제어 변경

- setter에 대한 제한을 줄 수 있다
    - setter를 커스텀하게 정의하였고 getter는 백킹필드로 생성된다

    ```kotlin
    class Car(val speed: Int, theName: String) {
      var name = theName
      set(value) {
        if (value.isEmpty()) {
          throw RuntimeException("빈 문자열 에러")
        }
        field = value
      }
    }
    val car = Car(20, "이름")
    try {
      car.name = ""
    } catch(ex: Exception) {
      println(ex.message) // 에러 발생
    }
    println(car.name) // 이름
    ```

    - name이라는 속성은 생성자에 의해 변경되는 것이 아니라 추가 설정한 setter에 의해서만 변경된다
    - theName은 Car 클래스의 파라미터일뿐! 필드가 아니다

## 접근 제어자

- 클래스 속성과 메서드에 접근 할 수 있는 제어자
- public, private, protected, internal
- protected는 파생된 자식클래스들의 메서드가 속성에 접근할 수 있는 권한을 준다
- internal은 같은 모듈에 있는 모든 코드에서 속성이나 메서드에 접근할 수 있다
    - 컴파일된 모든 소스 코드에서 이뤄지며 코틀린 컴파일러가 직접 이용하므로 런타임 오버헤드가 없다
- getter는 속성의 접근 권한과 동일하지만 setter는 직접 권한을 설정할 수 있다
    - `private set` 으로 private setter를 만든다

## 초기화 코드

- 주 생성자는 첫번째 줄에 파라미터와 속성이 정의된다
    - 파라미터로 전달되지 않은 속성은 클래스 내부에서 정의한다
    - 초기화 하는 코드값을 커스텀하기 위해 생성자용 바디를 만들 수 있다
- `init` 블록으로 생성자를 top-down 방식으로 실행하면서 생성한다
    - init 블록 안에서는 클래스 내부의 속성과 파라미터를 사용할 수 있다
    - init 블록을 여러개 작성할 수 있다
        - 주 생성자, 보조 생성자, 추가 메서드
        - 가능한 0개를 만들도록...

    ```kotlin
    class Car(val name: String) {
      var fullName = ""
        private set

      init {
        fullName = "내부 setter ${name}"
      }
    }
    println(Car("이름").fullName) // 내부 setter 이름
    ```

## 보조 생성자

- 주 생성자를 작성하지 않았다면 코틀린이 아규먼트가 없는 기본 생성자를 생성한다
    - 주 생성자가 있다면 아규먼트가 없는 보조 생성자를 생성한다
- 보조 생성자는 주 생성자를 호출하거나 다른 보조 생성자를 호출해야한다
- 보조 생성자에서는 속성을 선언할 수 없다
    - 주 생성자와 클래스 내부에서만 정의할 수 있다
- **생성자끼리 순환 호출하면 안된다**
- 파라미터를 이용해 다양한 생성자 형태로 객체를 생성 할 수 있다

## 인스턴스 메서드

- 클래스 안에 정의하는 메서드
- `fun` 으로 정의하며 public으로 생성된다
    - private, protected, internal 권한을 설정할 수 있다
- 탑레벨 함수와 유사하게 클래스 블록 안에서 선언된다

## 인라인 클래스

- 클래스는 추상화를 나타낸다
    - 프리미티브 타입과 동일하다
- 프리미티브를 사용할지 클래스를 사용할지
    - 클래스를 반환한다고 구현할 수 있으나
    - 결국 클래스라는 인스턴스를 만들어야 하기 때문에 오버헤드가 발생할 수 있다
- **`inline 클래스`** 로 `컴파일 타임에는 클래스`처럼 활용하며 `런타임에는 프리미티브 타입`으로 취급된다
    - 컴파일하고 바이트 코드로 변환되었을때 프리미티브 타입으로 변경된다

    ```kotlin
    inline class SSN(val id: String)
    fun receive(ssn: SSN) {
      println(ssn)
    }
    receive(SSN("ididid"))

    /*
    SSN(id=ididid)
    object.kts:117:1: warning: the feature "inline classes" is experimental
    inline class SSN(val id: String)
    */
    ```

- **`inline 클래스의 주 생성자 파라미터는 1개만 가능하다`**

    ```kotlin
    inline class SSN(val id: String, val name: String)

    // Inline class must have exactly one primary constructor parameter
    ```

# 컴패니언 객체와 클래스 멤버

## 클래스 레벨 멤버

- 클래스 레벨에서 필요하지만 클래스 인스턴스와는 관련이 없는 경우 `컴패니언 객체` 로 만든다
    - 컴패니언 객체는 클래스 안에서 정의한 싱글톤으로 인터페이스를 구현하거나 다른 클래스를 확장한다

    ```kotlin
    class Machine(val name: String) {
      fun plus() = time++
      fun minus() = time--

      companion object {
        var time = 0
        fun getTime() = println(time)
      }
    }
    println(Machine.time) // 0
    Machine("이름").plus()
    println(Machine.time) // 1
    Machine("이름2").plus()
    println(Machine.time) // 2
    ```

    1. 컴패니언 속성에 접근하여 해당 값을 변경하였다
    2. 분명 다른 이름으로 Machine을 생성해서 plus 메서드를 호출하였다
    3. 그러나 Machine 컴패니언의 time 값이 계속 증가하고 있다
    4. 컴패니언 객체는 싱글톤으로 하나만 생성되었고 Machine 객체 자체를 여러개 생성했어도 컴패니언은 하나이기에 계속 값이 증가한다

    ⇒ 이와 같은 이유로 뮤터블 속성값을 사용하면 멀티스레드에서 안정성 문제가 발생할 수 있다

## 컴패니언에 접근하기

- `Class.Companion`
    - 컴패니언 객체 자체의 참조가 필요한 경우
    - 컴패니언 객체가 구현하고 있는 인터페이스의 참조가 필요한 경우
    - 함수나 메서드에 특정 인터페이스를 구현한 싱글톤 객체가 필요한 경우

    ```kotlin
    val ref = Machine.Companion
    println(ref) // Object$Machine$Companion@2286dfcd

    ...
    companion object CompName {...} // 컴패니언에 이름이 있다면 해당 이름으로 대체 한다
    val ref = Machine.CompName
    ```

## 팩토리로 사용하는 컴패니언

- 컴패니언 객체는 클래스의 `팩토리`로 사용할 수 있다
- 생성자로 객체를 초기화하고 사용하기 위한 상태를 만드는 여러 방법이 있다
    - 이런 상황에서 팩토리로 동작하는 클래스의 컴패니언 객체를 설계하는 것이 좋다
- 컴패니언을 팩토리로 사용하기
    1. `private` 생성자를 만들고
    2. 컴패니언 객체에서 생성된 인스턴스를 리턴하기 전에 인스턴스를 사용하는 메서드를 하나 이상 생성한다

    ```kotlin
    class Machine private constructor(val name: String) {
      fun start() {
        println("시작")
      }

      companion object {
        fun create(name: String): Machine {
          val instance = Machine(name)
          instance.start()
          return instance
        }
      }
    }
    val machine = Machine.create("컴패니언")
    println(machine.name)
    val direct = Machine("오류 발생") // Cannot access '<init>': it is private in 'Machine'
    ```

    - `private 생성자`로 만들었기 때문에 `Machine` 을 직접적으로 인스턴스를 생성하려고 하면 오류가 발생한다
    - **`컴패니언 객체의 메서드를 통해서만 Machine 인스턴스에 접근할 수 있다`**

## 그렇다고 컴패니언이 static은 아니다

- 컴패니언 객체의 멤버가 static이 되는 것은 아니다
- 코틀린 컴파일러가 컴패니언 객체를 싱글톤으로 접근한다

# 제네릭 클래스

- 클래스의 속성을 특정 타입으로만 제한하지 않고 제네릭으로 전달받은 타입을 허용한다
    - 참고: 파라미터 타입의 가변성과 제약사항

    ```kotlin
    class PriorityPair<T: Comparable<T>> (param1: T, param2: T) {
      val first: T
      val second: T
      init {
        if (param1.compareTo(param2) >= 0) { // param1 >= param2
          first = param1
          second = param2
        } else {
          first = param2
          second = param1
        }
      }

      override fun toString() = "${first} - ${second}"
    }
    println(PriorityPair(1, 2).toString())
    ```

    1. `PriorityPair<T: Comparable<T>>` 라고 파라미터의 타입은 Comparable 인터페이스를 갖고 있도록 제한하였다
    2. `Comparable` 한 파라미터를 받았기 때문에 `compareTo` 메서드를 사용할 수 있다

# 데이터 클래스

- 메서드 보다는 데이터 자체에 특화된 클래스
- 주 생성자에 var나 val 속성 정의가 1개 이상 꼭 필요하다
    - var, val 이외의 파라미터는 사용할 수 없다
- 클래스 안에 속성이나 메서드를 추가할 수는 있다
- 데이터를 주요하게 여기다보니 `equals(), copy(), hashCode(), toString()` 를 자동으로 만들어준다
    - 주 생성자에서 정의된 각각의 속성에 접근할 수 있는 특별한 메서드를 지원한다
    - `componentN()` → `component1(), component2()...`
        - 순서에 기반해 접근...

    ```java
    data class Task(val id: Int, val name: String)
    val task = Task(1, "첫번째 태스크")
    var copyTask = task.copy()

    var (id, _) = task
    println(task.component1()) // 1
    println(task.component2()) // 첫번째 태스크
    ```

    - copy하면 복사된 인스턴스가 생기지만 얕은 복사로 이뤄진다
        - immutable 해야하는 이유!
    - 데이터 클래스는 구조분해를 이용할 수 있다
        - 주 생성자가 만든 속성과 동일한 순서로 구조분해해야한다
        - 순서에 기반한 구조분해...

# 마무리

- 코틀린의 객체지향 프로그래밍 지원
- 생성자, getter, setter를 생성해주며 `보일러플레이트 코드를 최소화`한다
- 컴패니언 객체 > 클래스 멤버 > 인스턴스 멤버
- 싱글톤 구현 지원
- 데이터 자체에 집중해야 하는 경우 데이터 클래스를 구조분해하여 접근
- 제네릭 클래스로 타입 안정성 향상

# 🚨?!?!?

---

# 🙈 더 알아보기

- **static**
    - 모든 인스턴스에서 공통적으로 사용해야하는 경우 static으로 사용한다
    - 컴패니언 객체와 다르다고 하는데 컴패니언도 위의 예시에서 확인한 것처럼
    - 여러 인스턴스를 생성해도 같은 컴패니언 객체를 바라보고 있다
    - `static 아닌가?!`
    - [참고: 컴패니언과 static](https://www.bsidesoft.com/8187)
    - 컴패니언은 static을 대체하는 용도로 사용할 수 있는 것 같다
- **inline class**
    - 프리미티브 타입 대명사 버전???
    - `fun login(id: Id, pw: Password)`
        - 아이디의 타입은 Id 이고 패스워드의 타입은 Password이다
    - 좀 더 명확하게 전달하고자 쓰는건가
