---
layout : post
published : true
title : 코틀린은 간결함을 표현한다
subtitle : Chapter 02 Java 개발자를 위한 코틀린 필수 사항
tags : [코틀린, 스터디, kotlin]
--- 

```markdown
[참고 도서]
- 다재다능 코틀린 프로그래밍
- 코틀린 인 액션
```

# 간결한 코틀린

## **세미콜론 생략**

- 간결함 극대화
- 한 줄에 여러식을 작성하는 경우에는 세미콜론이 필요하다

## **변수 타입 생략**

- 타입 추론을 이용해 변수의 타입 선언을 생략할 수 있다
    - 함수나 메소드의 리턴 타입은 생략할 수 있다
    - 하지만 파라미터의 타입은 명시되어야한다
    - 만약 외부로 전달되는 목적의 함수인 경우 리턴 타입을 명시하여 전달한다
    - 추론이 가능한 것은 생략하고 적절한 네이밍을 통해 간결함을 높인다
- 컴파일 시점에 타입이 검증되어야 한다
- 타입 추론으로 생략된 변수를 이후에 다른 타입으로 재할당 하려는 경우 컴파일 오류가 발생한다

## **클래스와 메소드 생략**

- 모든 코드가 클래스의 메소드로 작성하지 않아도 된다
    - 함수 단독으로도 동작한다
    - 코틀린 컴파일러에서 스크립트로 작성된 코드를 필요에 따라 클래스로 래핑한다
- **`standalone.kts`**

    ```kotlin
    fun alone() {
    	println("단독 호출되는 함수")
    	throw RuntimeException("에러")
    }
    println("클래스 없는 스크립트")
    try {
    	alone()
    } catch (ex: Exception) {
    	val stackTrace = ex.getStackTrace()
    	println(stackTrace[0])
    	println(stackTrace[1])
    }

    >>> 클래스 없는 스크립트
    >>> 단독 호출되는 함수
    >>> Standalone.alone(standalone.kts:3)
    >>> Standalone.<init>(standalone.kts:7)
    ```

    1. 클래스 없이 단독 함수로만 구성된 스크립트를 실행
    2. 가장 외부에 단독으로 호출된 `클래스 없는 스크립트` 출력
    3. try-catch 안에서 **`alone`** 함수 호출 `단독 호출되는 함수` 출력
    4. 단독 호출된 함수에서 에러 발생하였으나 해당 함수에서 에러 처리가 되어있지 않아 해당 함수를 호출한 상위로 올라가 try-catch에서 스택 프레임 출력
    5. 출력된 스택에는 **`Standalone`** 라는 클래스로 감싸져 있는 것을 확인

## **try-catch는 선택사항**

- 위의 예시에서 보았듯 **`try-catch`** 로 감싸져있지 않은 곳에서 에러가 발생한 경우 해당 함수를 호출한 상위 코드로 전달되어 에러 처리를 하게 된다
- 어느 곳에서도 에러를 처리하고 있지 않으면 프로그램이 종료된다

# 잠재적 오류 예방

- 경고를 오류처럼 설정하여 잠재적으로 발생할 수 있는 오류를 예방한다
    - `경고를 오류처럼 다루는 것이 올바른 소프트웨어 개발 습관이다` - 애자일 프랙티스
- ex. 코틀린 컴파일러는 사용하지 않는 파라미터에 대해 경고를 발생시킨다
    - **`unused.kts`**

        ```kotlin
        fun compute(n: Int) = 0
        println(compute(4))

        >>> 0
        >>> unused.kts:1:13: warning: parameter 'n' is never used
        >>> fun compute(n: Int) = 0
        >>>             ^
        ```

    - 컴파일 옵션으로 **`-Werror`** 를 전달하여 이런 경고를 오류처럼 처리할 수 있다
        - 빌드와 실행을 실패시키고 오류 메세지를 전달한다
        - **`kotlinc-jvm -Werror -script unused.kts`**

            ```kotlin
            >>> warning: parameter 'n' is never used (unused.kts:1:13)
            >>> error: warnings found and -Werror specified
            >>> unused.kts:1:13: warning: parameter 'n' is never used
            >>> fun compute(n: Int) = 0
            >>>             ^
            ```

    - 단, `main()` 함수에 대헤서는 파라미터 미사용 경고를 출력하지 않는다
- 사용하지 않는 파라미터에 대한 경고를 예시로 들었지만 경고를 오류 메세지로 바꾸는 옵션을 이용해 컴파일러가 알려주는 경고를 사전에 수정하여 잠재적으로 오류가 될 수 있는 것들을 수정하도록 한다

# **불변성**

## **var보다는 val**

- **var**
    - javascript → let
- **val**
    - javascript → const
    - 재할당 불가능
    - 변수나 참조를 상수화한 것으로 객체의 참조만 불변성을 보장
        - 객체 내부를 변경하게 되면 val의 값도 변경된다
- 의도와 다르게 코드가 변경되는 것으로부터 방지할 수 있고 추론을 쉽게 하고 오류 발생을 낮추고자 Immutable을 사용한다

# 동일성 체크

- **값 비교 `==`**
    - 구조상의 동일성 체크 (structural equality)
    - java → `equals()`
    - javascript → `==`
- **참조 비교 `===`**
    - 참조상의 동일성 체크 (referential equality)
    - java → `==`
    - javascript → `===`
- 값을 비교한다는 것은 java의 `equals`과 kotlin의 `==`이 동일하지만 코틀린의 철학 중 하나인 `안정성` 으로 `NullPointerException`을 미리 잡아내기 위해 값을 비교하는 순간에도 null을 비교하여 안정적으로 반환한다

    ```kotlin
    // java
    "hi".equals("hi") >>> true
    "hi".equals("Hi") >>> false
    "hi".equals(null) >>> false
    null.equals(null) >>> error: <null> cannot be dereferenced

    // kotlin
    "hi" == "hi" >>> true
    "hi" == "Hi" >>> false
    "hi" == null >>> false
    null == null >>> true
    ```

    1. java equals로 값을 비교하면 null에는 문자열 비교하는 equals를 갖고 있지 않으므로 `NullPointerException` 이 발생한다
    2. 코틀린에서는 null 자체를 값으로 비교하여 에러를 반환하기보다 안정적으로 값을 비교하여 반환한다
        - 코틀린 내부적으로 == 값 비교를 하면 null을 먼저 체크하고 equals를 실행한다
    3. 또한 null이라는 값을 비교하면 항상 동일한 결과값을 반환할 것이라 예상되기에 경고로 해당 내용을 알려주며 코드의 간결함을 유지할 수 있도록 제안한다

# 문자열 표현

## 문자열 템플릿

- **`$`** 을 사용해 문자열을 만들때 간결하게 표현할 수 있도록 한다

    ```kotlin
    // java
    String name = "코틀린";
    int age = 10;
    String message = "저의 이름은 " + name + "이고 나이는 " + age + "입니다.";

    >>> 저의 이름은 코틀린이고 나이는 10입니다.

    // kotlin
    val name = "코틀린"
    val age = 10
    val price = 99
    val message = "저의 이름은 $name 이고 나이는 ${age}입니다. 환율이 $${price}이고 \$은 그냥 써봅니다"

    >>> 저의 이름은 코틀린 이고 나이는 10입니다. 환율이 $99이고 $은 그냥 써봅니다
    ```

    - java에서는 문자열을 나열하기 위해 `+` 를 사용한다
    - 코틀린에서는 `${변수}` 형태로 문자열 안에 작성해서 표현한다
        - `$변수` 로 사용할 수 있으나 변수 바로 뒤에 다른 문자가 붙는 경우 구분이 되지 않는다
        - `\$` 로 표현하면 `$` 자체를 문자로 표현해준다
- 문자열이 만들어지는 시점의 변수를 바인딩한다

    ```kotlin
    var factor = 2
    fun doubleIt(n: Int) = n * factor
    var message = "factor = $factor"
    factor = 0
    println(doubleIt(2))
    println(message)

    >>> 0
    >>> factor = 2
    ```

    1. factor에 처음에는 2로 할당되어 있었으나 이후에 0으로 재할당 되어버렸다
    2. doubleIt 함수를 실행하는 시점은 println에서 호출하는 시점으로 이 순간에 factor가 바인딩되어 0이 출력되었다
    3. message는 println에서 호출하는 시점이 아니라 message라는 변수가 만들어진 순간이므로 factor가 2가 출력된다
    - 이처럼 문자열이 만들어지는 순간의 값을 다 알고 있어야 한다면 코틀린의 간결함이 복잡해지기에 var보다는 val를 사용하길 권한다

## RAW 문자열

- `$`를 쓰고 `$`를 표현하기 위해 `\$`, `"` 로 작성된 문자열 안에 `"` 를 표현하기 위해 `\"` ...
- 점점 복잡해지는 문자열을 간결하게 표현하기 위해 `"""` raw 문자열을 사용한다

    ```kotlin
    val name = "코틀린"
    val memo = """[여러줄을 한번에 표현]
    저의 이름은 "$name"입니다
    """

    >>>
    [여러줄을 한번에 표현]
    저의 이름은 "코틀린"입니다

    fun createMemo(): String {
    	val name = "코틀린"
    	val memo = """[여러줄을 한번에 표현]
    	저의 이름은 "$name"입니다
    	"""
    	
    	return memo
    }
    println(createMemo())

    >>>
    [여러줄을 한번에 표현]
    	저의 이름은 "코틀린"입니다

    fun createMemoTrim(): String {
    	val name = "코틀린"
    	val memo = """[여러줄을 한번에 표현]
    	|저의 이름은 "$name"입니다
    	"""
    	
    	return memo.trimMargin()
    }
    println(createMemoTrim())

    >>>
    [여러줄을 한번에 표현]
    저의 이름은 "코틀린"입니다
    ```

    - 함수 안에 존재하는 raw 문자열을 출력하면 함수의 탭 만큼 출력된 문자 앞에 들여쓰기가 포함되어있다
        - 문자열 앞에 들여쓰기를 잘라내기 위해 raw 문자열 라인 앞에 `|` 를 추가해주고 반환하는 문자열에 `trimMargin()` 을 사용한다
        - 문자열 라인 앞에 들여쓰기를 잘라내는 구분자로 `trimMargin` 의 파라미터로 주게 된다
            - `trimMargin(":")` 하게 되면 raw문자열 앞에 `:` 로 시작하는 라인의 들여쓰기를 잘라낸다

# 명령문 보다는 표현식

- **명령문**
    - java, javascript, c#
    - try-catch, if, for문
    - 아무것도 리턴하지 않으며 상태, 변수를 업데이트하는 등 side-effect이 존재한다
- **표현식**
    - ruby, groovy
    - 결과를 리턴하고 어떠한 상태도 업데이트 하지 않는다

## **if**

- if문을 코틀린에서는 표현식으로 나타날 수 있다
    ```kotlin
    // 자바 명령문 형태로 작성된 함수
    fun statementFunc(name: String, price: Int): String {
        var status: String
        if (price >= 500) {
            status = "500원 이상이에요"
        } else {
            status = "500원 미만이에요"
        }
        return "$name, $status"
    }
    println(statementFunc("바나나", 400))

    >>> 바나나, 500원 미만이에요

    // 코틀린 표현식 형태로 작성된 함수
    fun expressionFunc(name: String, price: Int): String {
        val status = if (price >= 500) "500원 이상이에요" else "500원 미만이에요"
        return "$name, $status"
    }
    ```
    1. `명령문`으로 작성된 statementFunc에서 새로운 결과를 반환하기 위해 `mutable 변수 var status`를 만들어서 수정하였다
    2. 코틀린의 if는 `표현식`으로 나타낼 수 있기에 var를 사용하지 않고 `val를 사용하여 immutable` 하게 status 값을 반환하였고 `타입 추론`이 가능하게 되었다

## **try-catch**

- 코틀린의 try-catch는 표현식으로 취급된다
- 예외가 발생하지 않으면 try의 마지막 코드가 결과로 반환된다
- 예외가 발생한다면 catch의 마지막 코드가 결과로 반환된다

    ```kotlin
    fun expressionTry(blowup: Boolean): Int {
    	return try {
    		if (blowup) {
    			throw RuntimeException("fail")
    		}
    		2
    	} catch (ex: Exception) {
    		4
    	} finally {
    		println("finally $blowup")
    	}
    }
    println(expressionTry(true))
    >>>
    finally true
    4

    println(expressionTry(false))
    >>>
    finally false
    2
    ```

    1. blowup 값에 따라 오류를 던졌고 try문의 결과값이 아니라 catch문의 결과값 4가 반환되었다
    2. finally가 try-catch가 완료되고 난 뒤 마지막에 실행될 것이라 기대했는데 먼저 출력되었다
    3. 이것은 expressionTry 함수 자체의 반환값이 4인 것이고 그 안에서 동작한 try-catch-finally에서 출력된 finally가 먼저 나온것이다

# 결론

- 코틀린은 정말 간결함을 추구한다
- 코드 작성을 최소화하기 위해 생략 가능한 것들을 모두 생략해도 되도록 지원한다
    - 세미콜론, 타입, 클래스, 예외 처리
- 문자열을 표현하는 방법을 최선으로 간결하게 만들었다
- 명령문보다는 표현식을 사용하여 불변성을 유지하며 안정성을 높인다

# 🚨?!?!?

- **모든 곳에서 에러 처리를 하지 않아도 상위로 전파된다면?**
    - 리액트의 ErrorBoundary처럼 가장 상위 코드에서 한번 에러 처리를 해두면 모든 에러를 일괄적으로 처리 가능한 것일까?
- **문자열 템플릿으로 작성한 변수 뒤에 바로 붙어있는 문자는 어디까지 인식할까?**

    ```kotlin
    val name = "이름"
    println("$name, 이런 형태") >>> 이름, 이런 형태
    println("$name. 이런 형태") >>> 이름. 이런 형태
    println("$name; 이런 형태") >>> 이름; 이런 형태

    println("$name은 이런 형태") >>> error: unresolved reference: name은
    ```

    - `,.;` 는 잘 나오지만 한글, 영어, 숫자가 붙어있는 경우에는 템플릿 변수명으로 인식하여 오류가 발생한다

# 🙈 더 알아보기

- 위임 Delegate
    - 변수 할당된 a, b, c를 표현식으로 취급되지 않는 이유?

        ```kotlin
        var a = 1
        var b = 2
        var c = 3

        a = b = c >>> 오류
        ```

        - 코틀린은 위임을 통해 변수를 get, set 하고 있다
        - 대입 연산자인 = 로 표현식을 다룬다면 할당 연산을 예상할 수 없어 오류가 발생한다