---
layout: post
published: true
title : return, break, continue
subtitle : 반복문에서 탈출하기
tags: [java]
---

## return
지금 소속된 클래스 끝내기
```java
public void returnLoop(){
 while(true){
  System.out.print(1);
  return;
  System.out.println(2);
 }
}
```
결과 : 1 클래스returnLoop의 종료

## break
지금 돌고 있는 반복문 끝내기
```java
while(true){
 System.out.print(1);
 break;
 System.out.println(2);
}
```
결과 : 1
## continue
지금 돌고 있는 하위 내용 스킵하기
```java
while(true){
 System.out.print(1);
 continue;
 System.out.println(2);
}
```
결과 : 1111
