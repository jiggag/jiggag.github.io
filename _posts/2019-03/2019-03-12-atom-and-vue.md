---
layout: post
published: true
title : Atom & Vue.js
subtitle : 가벼운 atom, 간단한 vue
tags: [atom,vue]
---
# Atom 텍스트 에디터
[Atom Download](https://atom.io/)  
그동안 써본 느낌은 가볍다.  
개발툴 같으면서 가벼움이 마음에 쏙든다.  
게다가 이 에디터를 HTML, CSS로 만들어진 웹 형태로 구성되있기 때문에 UI를 마음대로 변경해줄 수 있다고 한다.    
Atom에서 vue 페이지를 인식하고 문법에 따라 색상을 입혀주기 위해서는 'language-vue'라는 플러그인을 설치해주어야한다.

# Vue.js
AngularJS를 사용하다 공부 할 겸 관리자 페이지를 개편할 겸사겸사 react와의 고민 중 vue를 선택하여 시작하였다.  
이렇게 시작한 Vue는 Angular와 매우 닮았다.  
그래서 자신있게 시작한 vue

## 가볍다
vue 3.0 버전이 나왔고 cli를 이용해 너무나 간단하게 프로젝트를 생성할 수 있었다.  
단 vue cli를 설치하기 위해서는 node 버전이 8.9 이상이여야한다.  
```
npm install -g @vue/cli
vue create vue-project
```
이건 마치 cordova 안드로이드 프로젝트 생성할때와 데자뷰..  
vue 프로젝트가 설치되면서 구동에 필요한 모듈이 자동으로 설치되었기 때문에 바로 웹으로 확인 할 수 있었다.  
```
vue run serve
```

## 싱글 컴포넌트
웹에 보여지는 화면을 따라가보니 .vue 파일 안에는 html, script, style이 한 페이지에 모두 작성되어있었다.  
이건 신세계!!!??  
  
AngularJS에서는 html에서 작성하고 js에서 컨트롤러 선언하고 그안에 서비스 작성하고 함수들 호출해야하는데 vue에서는 원페이지,  
요즘 대세 ONE UI로 구성되어있고 이는 싱글 파일 컴포넌트로 vue만의 특징이다.  
  
## 플러그인
vue는 가벼웠다. 그렇기에 처음 빌드된 vue 프로젝트에는 아무것도 없었다.  
이것저것 추가해보고 이제 rest api를 호출해볼까 하는데 내가 설치한 vue 프로젝트에는 http가 포함되어있지 않았다...  
vue axios를 추가 설치하고 선언해주어야만 $http를 접근할 수 있었다.  
```
vue install vue-axios
```
  
```
Vue.prototype.$http = http
```

각각의 페이지에 URL은 변경되지만 페이지 전체가 새로 로딩되는 것이 아닌 SPA를 구현하기 위해 router를 추가하고  
router.js에 각각의 페이지 경로와 URL을 선언해준다.  
```
vue install vue-router
```
또한 router를 이용해 각각의 URL을 호출 시 방어벽 역할을 하는 네비게이션 가드를 설정해줄 수 있었다.  
이 네비게이션 가드를 이용해 인증이 필요한 페이지를 구분하였고 인증되지 않은 경우 로그인 화면으로 리다이렉트 해줄 수 있었다.  
  
## GitHub 연동
프로젝트 폴더에 git init하고 원격저장소를 연결해주었더니 atom에서 깃허브로 바로 커밋할 수 있었다.  
커맨드를 이용하는게 어려운 나에게 정말 편리하다~  
atom이 변경된 파일을 자동으로 추적하며 하단에 Git에 변경된 파일의 수로 알려주며 커밋 후 Push를 눌러주면 끝!  

 
