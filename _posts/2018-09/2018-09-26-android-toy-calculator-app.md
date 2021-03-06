---
layout: post
published: true
title: 안드로이드 계산기 앱 등록
subtitle: 기술블로그에서 토이1 - 직각계산기
tags: [android,toy]
---
## 기술블로그 구독
기술블로그들을 메일로 보내주는 서비스를 알게 되었다. 그리고 다음날 10시 첫 구독 메일을 받았다.

그 메일 속 여러 기술블로그 중 아무렇지 않았다면 그냥 지나갔을 그러나 한번 더 생각하게 했던 블로그들이 있었다.

- ***목표는 가깝게***
- ***가치를 생성하고 꾸준하게 유지하는 것***


## 9월 한달
계속된 가치 생성과 지치지 않을 목표를 설정했다.

9월 한달동안 나의 첫 App을 만들고 마켓 등록을 해보자. 너무 주제가 방대해서 만들다 지치지 않도록 정말 간단해야하는 그건 나의 *계산기*!!

*계산기를 만들고자 시작한지 다음날 그리고 다음날 나에게 영향을 준 그 블로그에는 계산기관련 게임을 만들어 등록하였고 광고도 붙이고 있다는 글이 올라왔다. 이는 나의 참고서랄까.*


## 안드로이드 앱 생성
그동안 진행했던 안드로이드 앱은 네이티브앱이 아닌 코르도바를 이용한 하이브리드앱이였다. 이번 기회에 네이티브앱을 구현해보고자 야심차게 프로젝트를 생성했는데, 습관이 무섭다고 코르도바 설치 후 안드로이드 플랫폼을 추가하고 있는 나를 발견..

정신차리고 안드로이드 프로젝트 생성하고 계산기를 구성할 기본적인 설정부터 적용하였다.

```script
    - AndroidManifest.xml
      // 기본 앱 설정
     
    - build.gradle : app
      // 빌드 버전, 플러그인 설정
   
    - activity_main.xml
      // 앱 내 레이아웃 설정

```

## 검색
```script
Installation failed with message Invalid File: D:\calculator\app\build\intermediates\split-apk\debug\slices\slice_5.apk. It is possible that this issue is resolved by uninstalling an existing version of the apk if it is present, and then re-installing.
WARNING: Uninstalling will remove the application data!
```
위와 같은 에러가 빌드하다가 발생하였다. 이건 대체 무엇인가 하여 추가했던 플러그인들을 지워봤지만 여전히 나타나는 에러메세지. [스택오버플로우](https://stackoverflow.com/questions/42219784/installation-failed-with-message-invalid-file/42226014#42226014)를 검색결과 build - clean project 후 다시 시도하니 해결되었다.
***검색의 중요성***

## 애드몹과 공식문서의 중요성
앱 내 광고를 추가하고자 애드몹을 가입하고 구현가이드를 찾아보고 여러 블로그도 참고하였다. 그러나 플러그인 버전 충돌이 생겼고 결국 애드몹 문서를 정독하고 나서야 해결할 수 있었다. 
***무엇이든 홈페이지 설명이 최고***

![calculator_layout](/jiggag.github.io/img/posts/2018/09/calculator_layout.png)


## 버튼 클릭 이벤트
레이아웃에 그려둔 각각의 버튼들의 id값을 이용해 MainActivity에서 클릭이벤트를 생성해주었다. 각각의 버튼마다 각각의 이벤트를 구현하는 것보다 하나의 클릭이벤트에 각각의 버튼이 id값을 가지고 구분되어 결과값을 돌려주는 것으로 하였다.

## 가로세로모드
레이아웃을 당연하게 세로모드로 작성했는데 화면을 회전시키니 레이아웃이 깨진다. 버튼 레이아웃이 화면 아래로 사라져버리는 현상.

AndroidManifest.xml에서 현재 액티비티에 orientation 설정을 추가하면 화면이 가로세로로 변경될때마다 onConfigurationChanged 이벤트가 발생한다.

가로 세로 전환 될때마다 각각의 액티비티를 호출하도록 하여 레이아웃을 구성하였다. *처음에는 가로세로마다 각각의 변수값을 지정해서 버튼의 레이아웃 크기를 주려고 했는데 그것보다는 화면을 다르게 구성하는게 좀 더 관리하기 편할것 같아 수정하였다*

*이는 앱 테스트 중 이벤트 적용하는것이 생각보다 잘 되지 않아 AndroidManifest.xml에서 android:screenOrientation="portrait"으로 설정하여 화면 세로 고정으로 출시하였다*


## 계산 결과 표시
- 단순 사칙연산인 경우
- 괄호가 포함된 경우

우선 두가지 경우를 생각하고 개발하였다. 단순 사칙연산만 필요한 경우에는 입력된 값을 차례대로 계산해주면 되는데 이때 이전에 입력값을 저장하는 변수 num1, 사칙연산이 저장되는 변수 cal, 다시 입력받은 값을 저장 num2, 연산이 적용된 값을 저장하는 변수 sum까지 4개의 변수가 필요하다.

그러나 연산이 완료된 값은 자동적으로 연산을 기다리는 상태가 되므로 num1과 sum을 통합하여 사용하였다.


## 예외처리
아직 추가되지않은 이벤트를 호출 또는 연산을 요청 시 오류가 발생해서 앱이 강제 종료되는 상황. MainActivity에 예외처리를 추가.


## 자꾸만 욕심에
개발하다보면 이기능도 추가하고 싶고 저것도 해주고 싶은 욕심만 가득하다. 그러나 버텨주지 못하는 나의 놋북.. 사칙연산 기능을 구현하는데에도 한달이 다되가는 9월 18일. 내가 세운 출시기간 압박을 내가 못견디는 상황. *우선 출시 해보고 업데이트하는것도 수정작업도 해보고 어떨까* 하는 생각으로 구글에 개발자 등록부터 했다. 나름 역사적인 순간이라 기록도 해두었다.

그리고 명절을 보내고 있던 중 9월 24일 결국 해버렸다. 사실 이러면 안되는거 같은데 완전한 구현이 되기전에 앱을 출시해버리고야 말았다! 우선 역사적인 순간이니 기록은 해뒀는대.. 이제 수많은 오류들을 수정해야한다.

![직각계산기](/jiggag.github.io/img/posts/2018/09/jiggag_calc.png)


