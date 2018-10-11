---
layout: post
published: true
title: First - 지킬을 이용한 깃허브 블로그 만들기
subtitle: 깃허브 블로그 만드는데 4시간..
tags: [github,blog]
---

깃허브 블로그 첫번째 포스트는 이 블로그를 만들고자 했던 방금 전 나의 4시간을 담았다.

## 첫번째 포스트

항상 그렇듯 구글에 검색중이였다.
많은 글들을 보았고 갑자기 눈에 띄었던 Disqus라는 댓글 서비스
이 또한 구글에 검색하였다.
그러다 우연히 들어간 어떤 블로그
이는 내가 깃허브 블로그를 시작하게 된 계기가 되었다.

## 간단해 보였으나 복병이

지킬 홈페이지에서 테마를 찾아 git repository에 저장~
그러면 금방 git page가 생성되리라 쉽게 생각했다.
다운받은 테마의 index 페이지를 띄우는 것은 쉬웠다.
그러나 설정을 조금만 수정해도 config.yml에서 에러가 발생했다..
전혀 감을 잡을 수 없는 에러 덕분에 repository를 지우고 설치하기를
4시간여 만에 드디어 이 포스트를 작성할 수 있게 되었다.

## 지킬을 이용한 깃허브 블로그 만들기

#### github.io 주소 생성
git repository를 myname.github.io로 만들어서 github page를 생성한다.

#### 지킬 사이트에서 원하는 테마 clone
http://jekyllthemes.org/
여기서는 이 블로그의 테마로 사용한 beautiful-jekyll을 예시로 한다.

```script
$ git clone https://github.com/daattali/beautiful-jekyll.git
$ cd beautiful-jekyll
$ rm .git	# git commit 정보들을 담고 있으므로 나만의 것을 위해 삭제
$ rm .gitignore
$ git init
$ git add .
$ git commit -m "first commit"
$ git remote add origin https://github.com/jiggag/jiggag.github.io
$ git push orign master
```

#### 깃허브 블로그 주소로 들어가보기
https://jiggag.github.io
주소를 호출하면 다운받은 테마가 적용되어있는 나의 블로그를 볼 수 있다.
이제 설정과 포스트를 잘 올리면 되는데..
이 설정이 나를 4시간동안 괴롭혔다.

## _config.yml 설정
```script
# 다운받은 _config.yml 수정
# 깃허브 블로그 url
url: "http://jiggag.github.io"

# 블로그 제목과 설명
title: JIGGAG
description: blog by jiggag

# navbar 사용할 것으로 수정
navbar-links:
  About Me: "aboutme"

# 프로필 이미지로 사용할 이미지 경로 지정
# 사용하지 않는 경우 비워둡니다
avatar : ""

# footer에 표시
author:
  name: JIGGAG

# footer에서 사용할 것만 입력해주고 빈칸
social-network-links:
  rss:
  email: "jiggag90@gmail.com"
  facebook:
  github: jiggag
  twitter:

# 공유 기능 활성화 t/f
share-links-active:
  twitter: true
  facebook: true
  google: false
  linkedin: true

# 구글 애널리틱스 사용시
google_analytics : "애널리틱스에서 발급받은 ID"

# 시간
timezone: "Asia/Seoul"
```

#### 구글 애널리틱스 추가

블로그에 방문한 기록들을 볼 수 있는 구글 애널리틱스 붙이기

1. https://analytics.google.com 계정 생성
2. 관리할 사이트에 https://myname.github.io 추가
3. 생성된 추적ID를 _config.yml의 google_analytics에 입력


문제의 _config.yml 내용 수정 후 git commit
다시 깃허브 블로그에 들어가서 새로고침 열심히 해보고 잘 나오면 오케이
아니라면 git settings - git pages에서 에러가 났는지 확인해보면 됩니다.

#### 이유를 아직 찾지 못한 4시간 에러의 진실..
