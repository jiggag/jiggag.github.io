---
layout: post
published: true
title : MySQL Query Cache
subtitle : 쿼리캐시 Map<key,value>
tags: [mysql]
---

## MySQL 쿼리캐시
SQL 문장이 아니라 결과를 Map 형태로 쿼리를 키로 결과를 값으로 저장한다.

해당 쿼리가 캐시에 존재하는지를 확인하며 쿼리에서 1글자, 대소문자, 공백이 다르면 다른 키값을 가진다.

프리페어스테이먼트 쿼리의 경우 변수가 ?로 표시되나 실제 적용되는것은 지정한 변수값으로 나타나므로 캐시적용되지만
?로 적용되는 경우에는 캐시가 불가하다.

