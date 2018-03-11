---
layout: post
published: true
title: 포스트 URL 변경하기
subtitle: year-month-day-TITLE
tags: [github,blog]
---

깃허브 블로그 포스트의 URL을 변경해본다.


## 포스트 작성

_posts 폴더아래에 생성되어 있는 markdown형식을 참고하여 포스트를 작성한다.
그리고 블로그를 새로고침 해보니 포스트가 보이긴 하는데 주소가 ...
markdown 파일명으로 url이 호출되고 있다.
이것은 _config.yml에서 설정을 변경해주면 쉽게 적용된다.


## _config.yml 설정 변경

```

# 기존의 url
permalink: /:year-:month-:day-:title/

# 변경된 url
permalink: /:title/

```

위와 같이 기존의 포스트 url은 생성된 md파일의 명칭으로 "-"로 잘라낸 문자를 다시 이어 붙여 url을 생성하고 있다.
이를 날짜부분은 빼고 title만으로 url을 생성하도록 설정을 변경해보았다.

이제 https://jiggag.github.io/2018-03-09-github-makingblog 였던 포스트url은 [https://jiggag.github.io/github-makingblog](https://jiggag.github.io/github-makingblog) 로 변경된것을 볼 수 있다.


#### 다음에는 포스트의 카테고리를 정해보려고 한다..

