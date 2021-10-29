---
layout : post
published : true
title : 코틀린이란
subtitle : Chapter 01 코틀린 시작하기
tags : [코틀린, 스터디, kotlin]
--- 

```markdown
[참고 도서]
- 다재다능 코틀린 프로그래밍
- 코틀린 인 액션
```

# 코틀린이란?
## 풀스택 언어
- 다른 언어들의 장점을 가져와서 풀스택 개발을 가능하게 하는 언어
- java의 바이트 코드로 컴파일
- javascript로 트랜스파일
- 네이티브, 웹 어셈블리로 컴파일

## 정적 타입 추론
- 코틀린은 타입이 명확하게 추론되지 않는 경우 해당 타입을 명시하도록 요청한다
    - 기존에 정적 타입 언어에서는 컴파일 단계에 타입 에러를 반환하지만 코틀린은 컴파일 전에 타입이 추론되지 않는 경우 개발자에게 타입을 명시하도록 요청하여 타입 안정성을 높여준다
- Null이 될 수 있는 타입을 지원하기 때문에 컴파일 시점에 널포인트 예외를 확인 할 수 있다
    - NullPointerException이 프로그램 실행 도중 발생하지 않기에 신뢰성을 높일 수 있다

## 객체지향 + 함수형
- 객체지향 + 비동기 + 함수형 + 스크립트 다양한 형태의 프로그래밍 지원한다
    - 명령형과 함수형을 섞어서 사용할 수 있다
    - 직면한 문제에 적합한 방법으로 작성하고 이후에 원하는 방식으로 리팩터링한다
    - 우선 동작하게 만들고 빠르게 개선한다
    - 코틀린의 코루틴의 높은 성능의 비동기 처리
- 순수 함수로 값처럼 사용하면서 간결하게 코드를 작성 할 수 있다
- 순수 함수이기에 동기화 처리가 되지 않아도 멀티스레드 방식에서 안전하다
- 독립적인 함수로 구성되어 테스트가 용이하다

## 코틀린 목적
- 실용성 + 간결성 + 안정성 + 상호운용성
- 다른 언어들의 장점 기법들을 활용하여 실용성을 높인다
- 최소한으로 간단하고 간결한 코드를 작성한다
    - less is more
    - 코드를 적게 작성하고 관리하는 코드를 줄이면 오류도 줄어든다
- 컴파일 시점에 더 많은 검사를 통해 오류 방지한다 (NullPointerException, ClassCastException)
    - 적게 작성한 코드에서 오류가 더 적게 발생한다
    - 컴파일 단계에서 빠르게 오류를 찾아낸다
- 기존의 자바 라이브러리를 유지하고 섞어서 사용하며 상호운용이 가능하도록 한다

# 코틀린 사용하기
## 컴파일
```
1. .kt, .java 파일을 코틀린/자바 컴파일러로 분석한다
2. .class 파일 생성하고 .jar로 패키징한다
3. 코틀린 런타임이 .jar를 실행한다
```
1. **`touch kotlin.kt`**

    ```markdown
    fun main() = println("Hello World")
    ```

2. **`kotlinc-jvm kotlin.kt -d kotlin.jar`**
    - kotlin.kt 파일을 java 바이트 파일로 컴파일하여 jar 생성
3. **`java -classpath kotlin.jar KotlinKt`**
    - 컴파일된 jar의 `KotlinKt` 클래스 실행
    - 컴파일 과정을 거치면서 코틀린의 main함수를 *Kt라는 클래스를 생성
    - `java -jar kotlin.jar` 도 동일하게 동작
    - kotlin 라이브러리를 사용한 경우 jar파일을 java로 실행하게 되면 오류 발생
        - classpath에 kotlin 라이브러리 파일을 추가해주고 java로 실행하거나
            - `java -classpath kotlin.jar:$KOTLIN_PATH/lib/kotlin-stdlib.jar KotlinKt`
        - kotlin으로 실행하여 해결
            - `kotlin -classpath kotlin.jar KotlinKt`

## 스크립트
- 쉘 스크립트 작성 지원
- 추가적인 컴파일 작업 없이 코틀린 자체를 스크립트로 사용
1. **`touch kotlin.kts`**

    ```markdown
    java.io.File(".")
    	.walk()
    	.filter { file -> file.extension == "kts" }
    	.forEach { println(it) }
    ```

2. **`kotlinc-jvm -script kotlin.kts`**
    - 코틀린 스크립트 실행
    - 컴파일러를 매번 명시하지 않아도 파일을 실행하는 것만으로도 스크립트가 실행되도록 설정
        - `shebang` 스크립트의 첫 줄에 셔뱅(`#!`) 나머지 부분을 전처리 실행

            ```markdown
            #!/usr/bin/env kotlinc-jvm -script
            ...
            ```

        - `chmod +x kotlin.kts`
            - 실행 권한 추가 후 `kotlin.kts` 파일만 실행하면 스크립트가 실행됨

# 마무리
- 여러 프로그래밍 언어의 특장점 지원한다
- 단순 스크립트부터 js로 트랜스파일하거나 네이티브 플랫폼으로 컴파일 하는 등 다양하게 사용 가능하다
- 다양한 옵션이 있는만큼 원하는 방향으로 선택하여 효율적인 코드 작성할 수 있다


# 🚨?!?!?
- **코틀린 컴파일러 실행 시 경고 발생**

    ```markdown
    $ kotlinc-jvm ...

    WARNING: An illegal reflective access operation has occurred
    WARNING: Illegal reflective access by com.intellij.util.ReflectionUtil to method java.util.ResourceBundle.setParent(java.util.ResourceBundle)
    WARNING: Please consider reporting this to the maintainers of com.intellij.util.ReflectionUtil
    WARNING: Use --illegal-access=warn to enable warnings of further illegal reflective access operations
    WARNING: All illegal access operations will be denied in a future release
    ```

    - jar파일이 정상적으로 컴파일은 되는데 위와 같은 경고 발생
    - 원인을 찾지 못했다...

# 🙈 더 알아보기
- DSL
    - 도메인 특화 언어
    - 간결한 코틀린 특징을 모아서 내부적으로 직접 디자인한 API 생성이 가능하다
    - ref. Groovy, Ruby
- Delegation
    - 위임은 코드를 재사용할때 상속보다 더 좋은 디자인을 할 수 있도록 도와준다
    - 메소드를 호출한 객체에서 다른 객체로 위임할 때 타입을 안정적으로 사용한다
    - ref. Groovy, Ruby
- argument-matching
    - if-else 중첩 대신 인자 매칭 문법 when을 사용하여 코드를 간결하게 작성한다
    - ref. Erlang, Scala
- 함수 확장
    - 이미 존재하는 함수를 확장하는 것이 쉽다
    - 자바의 오버로딩 대신 기본 파라미터를 사용해 함수 확장을 쉽게 해준다
    - ref. Javascript
- Named argument
    - 명시적 인자는 코드의 표현력을 강화하고 읽기 쉬우며 에러를 줄여준다
- 연산자 오버로딩
    - 작성된 클래스나 서드파티 클래스에서 연산자를 오버로딩할 수 있다
    - ref. C++, Groovy
- 비동기 프로그래밍
    - Coroutine
    - Continuation