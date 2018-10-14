---
layout: page
title: Wiki
subtitle: 직각위키
---

## 구글 애널리틱스 gtag.js 추적 설정
```script
<!-- Global Site Tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'GA_TRACKING_ID');
</script>
```


## Single Page Application Tracking
```script
gtag('config', 'GA_TRACKING_ID', {'page_path': '/page/path'});
```
싱글페이지인 경우 페이지별 추적 설정


## 구글 애널리틱스 이벤트 추적 설정
```script
gtag('event', '이벤트액션', {'event_category':'이벤트카테고리','event_label':'이벤트라벨', 'value':'이벤트값'});
```
카테고리 > 액션 > 라벨 > 값

## 사파리 브라우저
자바스크립트 Date() 호출
```script
new Date(2018,10,1,0,0,0) : 2018-11-1 00:00:00으로 인식
```

## Angularjs
```script
<span ng-if="조건">아예 그리지도 않음</span>
<span ng-show="조건">그려는 두고 안보여줌</span>
```
ng-if와 ng-show의 차이점
그리지도 않거나 그려두고 숨기거나

## 구글애널리틱스와 파이어베이스
구글애널리틱스는 웹
파이어베이스는 앱

## github
create file에 폴더명/파일명으로 등록하면 자동으로 해당 폴더를 생성하고 파일이 추가


## 웹 크롤링 : Jsoup
```script
final String connUrl = "https://www.크롤링.com";

Document doc = Jsoup.connect(connUrl).post();
Elements ele = doc.select("div.first table");

for(Element el : ele.select("tr")){
	 String txt = el.select("td").text();
}
```
Jsoup 이용하여 크롤링
해당 url의 html을 Document에 담아서 찾고자하는 태그나 클래스로 내용 가져오기


## BOJ
```script
BOJ.2557
Hello World!를 출력하시오.
```
Hello World!에서 !를 빼고서는 왜 안될까 뭐가 잘못된걸까 고민하던 방금 전
근데 다른 언어보다 자바를 이용한 문제 풀이의 메모리와 시간이 높은데 왜그럴까


## 스프링
프로젝트를 옮겨서 스프링에 impory하려고 하는데 스프링에서 프로젝트를 찾지 못한다면
import하려는 프로젝트명으로 새로운 프로젝트를 생성하면 .project파일이  생성되면서 자동 import된다

## 반응형 크기
```css
모바일
@media(min-width:320px)

태블릿
@media(min-width:768px)

PC
@media(min-width:960px)
```
