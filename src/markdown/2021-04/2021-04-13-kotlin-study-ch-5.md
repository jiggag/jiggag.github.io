---
slug: /blog/kotlin-study-ch5
date: 2021-04-13
layout : post
published : true
title : 코틀린의 immutable, mutable한 콜렉션
subtitle : Chapter 05 콜렉션 사용하기
tags : [코틀린, 스터디, kotlin]
--- 

```markdown
[참고 도서]
- 다재다능 코틀린 프로그래밍
```

# 콜렉션 특징

- 자바 List, Set, Map을 코틀린에서도 사용한다
    - 코틀린에서는 자바의 뮤터블 콜렉션 인터페이스를 이뷰터블 읽기 전용, 뮤터블 읽기/쓰기 인터페이스으로 나뉜다
- JDK 제공 함수 이외의 코틀린 콜렉션에 메소드가 추가되었다
    - `kotlin.collections` 패키지에 자바 콜렉션에 유용하게 사용할 수 있는 함수가 추가되었다
- 콜렉션의 요소들을 반복문으로 사용할 때 자바보다 더 유연하고 직관적으로 사용할 수 있다
    - Pair - 값이 두 개인 튜플
    - Triple - 값이 세 개인 튜플
    - Array - 객체나 프리미티브 타입으로 순번이 있고 크기가 고정된 콜렉션
    - List - 객체들이 정렬된 콜렉션
    - Set - 객체들이 정렬되지 않은 콜렉션
    - Map - 키와 값

## 코틀린 콜렉션에 추가된 메소드

```kotlin
var list = listOf(1, 2, 3)
print(list.javaClass) // class java.util.Arrays$ArrayList
for ((index, value) in list.withIndex()) { print("index: $index, value: $value") } // 012

// withIndex
public fun <T> Iterable<T>.withIndex(): Iterable<IndexedValue<T>> {
    return IndexingIterable { iterator() }
}
```

1. listOf()로 `JDK의 ArrayList` 객체를 가져온다
2. `withIndex()` 로 리스트의 인덱스와 값을 가져온다
    - `IndexedValue` 라는 특별한 interator를 반환한다
- 코틀린 컬렉션의 편의를 위해 JDK 클래스에 추가해둔 메소드를 사용한다

## 뷰

- 이뮤터블 콜렉션은 동시성을 사용하는 함수형 프로그래밍이나 비동기 처리에 안정적이다
- 대부분 자바의 콜렉션은 대부분 뮤터블이였으며 최근에 이뮤터블 콜렉션이 추가되었다
    - 그러나 이뮤터블, 뮤터블 버전이 `모두 같은 인터페이스를 구현하고 있기에 문제가 발생한다`
    - 이뮤터블 콜렉션을 변경하려는 경우 `런타임` 에 `UnsupportedOperationException` 이 발생한다
- 코틀린은 이뮤터블 콜렉션을 변경하려는 것처럼 `연산이 불가능한 것을 런타임이 되기 전에 알려주고자` `뷰` 가 존재한다
- List, Set, Map 각각 뷰를 두 가지씩 갖고 있다
    - 읽기 전용 뷰인 이뮤터블 뷰
        - 쓰기를 시도하면 컴파일 단계에서 실패한다
    - 읽기쓰기 뷰인 뮤터블 뷰
    - 이뮤터블, 뮤터블 뷰 모두 자바 기본 콜렉션에 매핑되지만 뷰를 사용하여 `런타임 오버헤드가 없고 컴파일 시간이나 실행 시간에 변환이 발생하지 않는다`
    - 읽기전용의 참조도 뮤터블 콜렉션이다
        - 콜렉션 자체는 변경할 수는 없지만 다른 스레드에서 참조하고 있는 콜렉션을 변경 시도할 수 있다
        - 여러 개의 뷰에서 같은 인스턴스를 참조하고 있고 어떤 스레드에서는 해당 인스턴스를 읽기쓰기용으로 사용하고 다른 스레드는 읽기전용으로만 사용하고 있다면 동일한 콜렉션을 변경하지 않도록 해야한다
        - 따라서 스레드 안정성을 제공해주지 않는다

# Pair와 Triple

## 튜플

- 작고 셀 수 있는 크기의 객체의 배열
- 코틀린에서는 2, 3개 사이즈의 튜플만을 허용한다
- Pair - 2개 사이즈의 튜플
- Triple - 3개 사이즈의 튜플

## Pair

- Pair에 담긴 값은 pair.first, pair.second로 가져올 수 있다

```kotlin
val pair = Pair<Int, String>(1, "튜플") // 각각의 타입을 다르게 넣을수도 있다
>>> (1, 튜플)
// pair.first == 1
// pair.second == 튜플

val mapPair = mapOf("Tom" to "Cat", "Jerry" to "Mouse")
>>> {Tom=Cat, Jerry=Mouse}

public fun <K, V> mapOf(vararg pairs: Pair<K, V>): Map<K, V> =
    if (pairs.size > 0) pairs.toMap(LinkedHashMap(mapCapacity(pairs.size))) else emptyMap()
```

- `mapOf` 는 키-값 형태를 반환하는데 인자로 `to()` 메소드로 만든 `Pair 인스턴스`를 받는다
    - **`to() 메소드는 Pair의 인스턴스를 만든다`**
        - 코틀린의 모든 객체에서 사용할 수 있는 확장함수
    - mapOf는 Pair를 인자로 받는다
    - `"Tom" to "Cat"` , `"Jerry" to "Mouse"` 가 각각  2개 사이즈 튜플인 Pair이다
        - Tom과 Cat으로 구성된 Pair + Jerry와 Mouse로 구성된 Pair
        - 키는 Tom, Jerry이고 값은 Cat, Mouse

## Triple

- 3개 사이즈를 갖는 튜플로 first, second, third로 각각 값을 가져온다

    ```kotlin
    var triple = Triple<String, Int, Boolean>("트리플", 1, true)
    println(triple)
    println("${triple.first}, ${triple.second}, ${triple.third}")

    >>> (트리플, 1, true)
    >>> 트리플, 1, true
    ```

- Object 형태의 각각 클래스를 만들어주는 작업이 필요하지 않고 간결하게 타입 안정성까지 제공하는Pair로 코드를 작성할 수 있다

    ```kotlin
    val airportCodes = listOf("A", "B", "C")
    var temperatures = airportCodes.map { code -> code to 1 }
    for (temp in temperatures) {
      println("temp: $temp")
      println("Airport: ${temp.first}, Temperature: ${temp.second}")
    }

    >>>
    temp: (A, 1)
    Airport: A, Temperature: 1
    temp: (B, 1)
    Airport: B, Temperature: 1
    temp: (C, 1)
    Airport: C, Temperature: 1
    ```

    1. listOf로 만든 리스트를
    2. map으로 돌면서
    3. to를 이용해 Pair로 만들었다

    ⇒ map으로 기존 airportCodes로 temperatures 생성하였고 List<Pair<String, Int>> 형태가 되었다

- 객체 쌍이 필요하거나 튜플이 필요한 곳에 Pair, Triple이 유용하다
    - 간결하고 컴파일 시간에 타입 안정성을 제공한다
- Pair, Triple 모두 `immutable` 이다

# 객체 배열과 프리미티브 배열

- Array<T> 클래스로 낮은 수준의 최적화에서만 사용
    - 뮤터블
    - []의 인덱스 연산자 접근
    - 그 외에는 List 사용
- `arrayOf` 라는 최상위 함수를 사용해 배열을 만든다

    ```kotlin
    val array = arrayOf(1, 2, 3)
    println(array::class) // class kotlin.Array
    println(array.javaClass) // class [Ljava.lang.Integer;
    println(array[0]) // 1
    ```

    - arrayOf로 생성한 배열은 코틀린에서는 Array<T>를 갖지만 JVM에서 보면 Integer 배열이다
        - Integer 클래스로 생성되었고 **`프리미티브 타입인 int를 사용한 경우보다 오버헤드가 크게 걸린다`**
        - 따라서 `intArrayOf(1, 2, 3)` 처럼 사용하여 `kotlin.Array` 대신에  `kotlin.IntArray` 타입 특화 배열 클래스를 사용할 수 있도록 한다
        - `kotlin.Array` 내장된 메소드들(size, sum, average...)을 사용해 배열 데이터 계산을 할 수 있다

# List

- 뮤터블, 이뮤터블을 선택하여 사용한다
    - 정렬 + 길이 가변
    - []의 인덱스 연산자로 접근하거나 get() 메소드를 사용한다
        - 인덱스 연산자는 내부적으로 get() 메소드를 사용한다
        - 결국 노이즈를 줄이기 위해서 인덱스 연산자를 사용하기를 권장한다
    - listOf() - 이뮤터블 리스트
        - kotlin.collections.List<T>
    - mutableListOf() - 뮤터블 리스트
- `B.contains(A)` 나 `A in B` 로 A라는 값이 리스트 B에 존재하는지 확인한다
    - `in`을 사용하는게 더 표현력이 높고 직관적이다...

## listOf

- 리턴하는 참조를 변경할 수 없다
    - 읽기 전용 참조를 리턴한다

    ```kotlin
    val fruits = listOf("사과")
    fruits.add("배") // Kotlin: Unresolved reference: add
    ```

- List<T>는 자바의 Arrays.asList()로 만든 JDK 객체의 뷰로 동작한다
    - 해당 인터페이스에는 mutation 권한을 가진 메소드가 없기 때문에 `add()` 메소드가 컴파일 단계에서 실패한다
    - 이런 뷰를 이용해 코틀린의 코드를 안전하게 만들고 실행 시간에 오버헤드나 변경이 없게 만든다
    - 그러나 `+, -` 연산자로 리스트를 변경할 수 있다.................

    ```kotlin
    val fruits = listOf("사과")
    val fruits2 = fruits + "배"
    val fruits3 = fruits2 - "배"
    println(fruits) // [사과]
    println(fruits2) // [사과, 배]
    println(fruits3) // [사과]
    println(fruits::class) // class java.util.ArrayList
    println(fruits.javaClass) // class java.util.ArrayList
    ```

    - `+, -` 연산자로 변경하는 경우 기존 리스트를 복사해서 새로운 리스트를 반환하기에 기존의 리스트는 유지된다
    - `class java.util.Arrays$ArrayList` 가 나온다고 하는데 나는 이게 아닌데...?

## mutableListOf

- MutableList<T>
- List<T>에서 사용하던 것과 동일하게 사용 가능하다

    ```kotlin
    val fruits = mutableListOf("사과")
    fruits.add("배")
    println(fruits) // [사과, 배]
    println(fruits::class) // class java.util.ArrayList
    println(fruits.javaClass) // class java.util.ArrayList
    ```

    - 읽기 쓰기 모두 가능한 인터페이스이지만 listOf()로 이뮤터블한 리스트를 사용하는 것이 좋다

# Set

- Set<T>
- 정렬되지 않은 요소의 모음
    - List<T>처럼 immutable, mutable 둘 다 존재하며 메소드들을 지원한다
    - setOf(), mutableSetOf(), hashSetOf(), linkedSetOf(), sortedSetOf()
    - 중복 요소를 허용하지 않는다

        ```kotlin
        val fruits = setOf("사과", "배", "배")
        println(fruits) // [사과, 배]
        println(fruits::class) // class java.util.LinkedHashSet
        println(fruits.javaClass) // class java.util.LinkedHashSet
        ```

# Map

- Map<K, V>
- 키-값 Pair를 보관하는 콜렉션
    - immutable, mutable 모두 존재한다
    - mapOf(), mutableMapOf(), hashMapOf(), linkedMapOf(), sortedMapOf()

    ```kotlin
    val sites = mapOf("key" to "value", "키" to "값")
    println(sites) // {key=value, 키=값}
    println(sites::class) // class java.util.LinkedHashMap
    println(sites.javaClass) // class java.util.LinkedHashMap
    ```

    - `to()` 확장함수를 이용해 키-값 Pair를 만든다
    - 메소드를 이용해 키 또는 값이 존재하는지 확인할 수 있다
        - `sites.containsKey("키")`
        - `sites.containsValue("값")`
        - `sites.contains("키")`
        - `"키" in sites`
    - `get()` 메소드나 [] 인덱스 연산자로 해당 키에 대한 값을 가져온다
        ```kotlin
          val value: String? = sites.get("키가없다") >>> null
          val value: String? = sites["키가없다"] >>> null
          val value: String = sites.getOrDefault("키가없다", "기본값 반환") >>> 기본값 반환
        ```
        - 만약 해당 키에 대한 값이 없다면 오류가 발생한다
            - nullable 타입 사용하거나 디폴트 값을 반환하는 메서드를 사용

    - `mapOf()` 은 읽기 전용 참조로 변경이 불가능 하지만 `+, -` 연산자로 새로운 맵을 만들 수 있다
        - `val sites2 = sites + ("새로운키" to "값")`
    - `key, value` 속성값으로 맵의 키, 값을 가져온다

        ```kotlin
        for (site in sites) {
        	println("${site.key} -> ${site.value}")
        }

        // 구조분해
        for ((key, value) in sites) {
        	println("${site.key} -> ${site.value}")
        }
        ```

# 결론

- 코틀린에서는 자바 콜렉션 확장과 읽기전용 뷰를 통해 컴파일 시간동안 안정성을 높인다
    - 함수형, 동시성, 비동기 코드를 작성 시 읽기전용 뷰를 사용해야한다
- Pair와 Triple로 크기가 작은 콜렉션을 만든다
- 크기가 크고 고정된 콜렉션은 Array 클래스를 사용하며 크기가 변경되는 경우에는 List나 Set을 사용한다
- 콜렉션을 사용할때 해당 콜렉션이 mutable인지 immutable인지 선택해서 생성한다
    - 읽기전용 뷰, 읽기쓰기 뷰 차이

# 🚨?!?!?

- **런타임/실행 시간**
    - 내용 중 두 단어가 혼용되어있는데 같은 것이 아닌건가...
    - 단어를 통일하는게 좋겠다
- **get() 보다 [] 인덱스 연산자**
    - 인덱스 연산자 내부적으로 get()을 사용하는데 바로 사용하는 것보다 인덱스로 접근하는게 왜 더 안정적인 것일까?

# 🙈 더 알아보기

- mutable vs immutable
    - 뮤터블 콜렉션 인터페이스 - 간단한 싱글 스레드
        - mutableListOf, mutableSetOf...
    - 이뮤터블 콜렉션 인터페이스 - 함수형 비동기
        - listOf, setOf...
- 최상위 함수
    - 클래스나 다른 함수 안에 있는 것이 아닌 가장 바깥에 존재하는 함수
        - static
    - 같은 Package라면 import하지 않아도 바로 접근이 가능
        - 다른 Package라면 `import package` 필요
- 코드 노이즈
