---
layout: post
published: true
title: authentication DisabledException
subtitle: auth의 필수
tags: [spring,security,authentication]
---

## 스프링 AUTH 에러 발생

org.springframework.security.authentication.DisabledException User is disabled

위와 같은 에러발생 시
controller와 service를 아무리 찾아도 없었다..

## 답은 DB에
authentication의 필수 요건인 isActive가 존재하지 않아
계속 해당 USER를 찾지 못하였고

DB에 컬럼을 추가해주니 바로 해결..

#### 이걸 3시간 헤맴
ㅠㅠ
