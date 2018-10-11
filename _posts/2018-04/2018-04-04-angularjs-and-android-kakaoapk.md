---
layout: post
published: true
title: angularjs & android 하이브리드앱에서 카카오APK
subtitle: cordova 플러그인으로 웹에서 앱으로
tags: [angularjs,android,cordova,kakao]
---

angularjs로 WEB을 만들고 이를 cordova를 이용해 APP으로 보여주는 하이브리드앱에서 카카오APK이용하기

## KAKAO 개발자 등록

angularjs로 만들어진 하이브리드앱에서 회원 가입 및 로그인을 카카오APK를 이용하고자 한다.
우선 카카오 개발자로 가입 후 만들고자 하는 APP의 프로젝트명을 등록한다.
등록하고 나면 주어지는 앱 키를 이용해 카카오SDK를 호출해 사용할 수 있게 된다.
앱키의 종류로는 네이티브, REST, JavaScript, Admin 키가 주어지는데 
내가 사용할 것은 하이브리드 앱으로 네이티브 앱과 같은 형식으로 호출할 것이기에 네이티브 앱 키를 사용한다.
그리고 아래에 플랫폼 추가로 android에 패키지명과 마켓URL을 등록해주면 사용 준비 완료..


## cordova project 생성

안드로이드 스튜디오에서 하이브리드 앱 프로젝트를 생성하기 위해 npm에서 cordova를 설치한다.
그리고 cordova를 이용해 프로젝트를 생성하고 플랫폼을 추가하면 준비 완료

```script

## cordova 설치
- npm install -g cordova

## 폰갭 혹은 코르도바 프로젝트 생성
# cordova create [project_directory] [com.name.project_name] [Project_name]

# cordova 프로젝트 생성 시 : 생성하고자 하는 workspace에서
# cordova create 경로 패키지 프로젝트명
- cd \workspace
- cordova create projectfolder com.app.kakao kakaotest

# phonegap 프로젝트 생성 시
- phonegap create projectfolder com.app.kakao kakaotest


# cordova 플랫폼 추가 : 해당 프로젝트 경로로 이동 후
- cd projectfolder
- cordova platform add android
- cordova platform add ios

# cordova 플랫폼 제거
- cordova platform remove ios

# cordova 플러그인 추가 .. 
- cordova plugin add org.apache.cordova.device
- cordova plugin add org.apache.cordova.console

```

해당 플랫폼의 프로젝트를 개발하기 위해서는 일반적으로 open project를 하는 것이 아니라
안드로이드 스튜디오에서 project-import에서 해당 프로젝트 폴더 아래에 platforms-android를 선택하여야만
해당 플랫폼의 프로젝트를 개발할 수 있다.


## AngularJS에서 cordova plugin 호출하기

하이브리드앱에서 네이티브앱의 기능을 사용하려면 cordova플러그인을 이용해 접근해야한다.
우선 프로젝트에 android프로젝트 폴더에서 가져온 cordova-plugin을 설치한다.
cordova.js를 선언하면 하이브리드앱 준비 끝

