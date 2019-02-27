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
ng-if와 ng-show의 차이점<br/>
그리지도 않거나 그려두고 숨기거나

## 구글애널리틱스와 파이어베이스
구글애널리틱스는 웹<br/>
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


## 안드로이드 웹 크롤링
* app: build.gradle
```script
dependencies 추가
compile 'org.jsoup:jsoup:1.11.3'
```

* AndroidManifest.xml
```script
인터넷 사용 권한 추가
<uses-permission android:name="android.permission.INTERNET" />
```

* MainFunc.java
```script
get,post : 파라미터 data 여부에 따라
Document doc = Jsoup.connect(url).get();
Elements ele = doc.select("div");

for(Element el : ele.select("p")){
	크롤링 데이터
}
```

## BOJ
```script
BOJ.2557
Hello World!를 출력하시오.
```
Hello World!에서 !를 빼고서는 왜 안될까 뭐가 잘못된걸까 고민하던 방금 전<br/>
근데 다른 언어보다 자바를 이용한 문제 풀이의 메모리와 시간이 높은데 왜그럴까


## 스프링
프로젝트를 옮겨서 스프링에 import하려고 하는데 스프링에서 프로젝트를 찾지 못한다면<br/>
import하려는 프로젝트명으로 새로운 프로젝트를 생성하면 .project파일이  생성되면서 자동 import된다

## 반응형 크기
```script
모바일
@media(min-width:320px)

태블릿
@media(min-width:768px)

PC
@media(min-width:960px)
```

## 자스민 테스트
AngularJS 프론트 단위 테스트
* karma.conf.js
```script
module.exports = function(config) { 
	config.set({
	...

	// 테스트할 스크립트 경로 지정
	files: [ "src/**/*.js" ]

	...
  });
};
```

* app_test.js
```script
describe("App : module 'App' 테스트", function() {

	// 테스트 실행 전 모듈 App 호출
	beforeEach(module("App"));

	describe("모듈 App이 정의되어 있는지 확인 ", function() {
		it("모듈 App에 AppCtrl이 정의되어 있는가?", inject(function($controller, $rootScope) {
			var scope = $rootScope.$new();
		        var ctrl = $controller("AppCtrl", { $scope: scope}); 
			expect(ctrl).toBeDefined();
		}));
	});
});
```

```script
* describe 내 선언된 모든 테스트가 실행되기 전 한번 실행
beforeAll(function() {});

* describe 내 선언된 모든 it 실행 전 매번 실행하는 전처리
beforeEach(function() {});

* describe 내 선언된 모든 it 실행 후 매번 실행하는 후처리
afterEach(function() {});

it('테스트 내용 설명', function() {
	// 테스트
});
```

## MySQL
Export : Data Export > 내보내는 테이블 체크 > 해당 위치에 dump파일로 export<br/>
Import : Data Import > 해당dump 파일 선택 후 import


## git
```script
$ git --version
설치된 git의 버전 확인

$ git config --global --list
전역으로 선언된 설정목록을 확인

$ git config --global user.name
$ git config --global user.email
각각의 전역 설정(name,email) 확인

$ git config user.name
$ git config user.email
해당 저장소에만 설정된 값

$ git config --global user.name [username]
$ git config --global user.email [useremail]
[username]으로 사용자 이름 전역 설정

$ cd [tab]
cd 입력 후 tab키를 누르면 이동 가능한 하위 경로를 확인

$ cd e:
e드라이브로 이동

$ git init
해당 경로를 git저장소로 등록
```


## cordova
activity의 webview안에 url호출하면 웹으로 인식<br/><br/>

cordova loadurl(launchurl) 하면 앱뷰로 인식<br/>

config.xml의 <content>는 www폴더의 index.html를 기본으로 시작페이지



## Android + MySQL + PHP + Apache
안드로이드 스튜디오에서 MySQL 연동을 위해 DB접속을 위한 PHP를 아파치 서버에 올려두고 DB접속<br/>

기존의 아파치에 PHP파일이 열리지 않아 bitnami를 설치하여 아파치+MySQL을 새로 포트에 연결해주었고<br/>

새로 만든 아파치 경로 htdocs폴더 아래에 PHP파일을 두고 http://localhost/phptxt.php로 접속하니 해당 DB접속상태확인


## FCM
```script
"to" : "/topics/push-test" - 등록된 주제 push-test 에게 알림
"to" : "토큰명" - 해당 토큰 기기에만 알림
"condition": "'dogs' in topics && 'cats' in topics"  - 주제 dogs이면서 cat인 기기에게 알림
```

## FCM 구독 추가/제거
FirebaseMessaging.getInstance().subscribeToTopic("notice");<br/>
FirebaseMessaging.getInstance().unsubscribeFromTopic("notice");

## 푸시 메세지 형식
```script
{
"notification": {"title": "푸시 알림 타이틀", "body": "푸시 알림 내용"},
"data":{"title":"푸시 메세지 타이틀","message":"푸시 메세지 내용"},
"time_to_live" : 10,
"condition" : "'on-push' in topics && !('un-push' in topics)" 	
}
```
안드로이드에서는 포그라운드,백그라운드 상관없이 data메세지 형식으로 보내면 알림이 왔지만 ios에서는 notification으로만 온다.<br/>
두가지를 같이 작성해서 보내면 notification이 우선으로 처리되는지 안드로이드 포그라운드에서 푸시내용이 보이지 않았다.


## css : table
```script
table { 
	table-layout: fixed; 
}
 * 테이블 내에서 <td>의 크기 고정
 
table td {
	width:100%;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space:nowrap;
}
* td에 width값, overflow: hidden;, text-overflow:ellipsis; 써줘야 말줄임 적용된다.
* white-space:nowrap; 줄바꿈 방지
```


## pom.xml
```script
Description Resource Path Location Type
Unable to load annotation processor factory 'C:\workspace\ex\libs\ICERTSecu_JDK18.jar' for project ex ex
Annotation processor factory path APT Build Problem


<dependency>
	<groupId>sample</groupId>
	<artifactId>com.icert.comm.secu</artifactId>
	<version>1.0</version>
	<scope>system</scope>
	<systemPath>${project.basedir}/libs/ICERTSecu_JDK18.jar</systemPath>
</dependency>
```
project.basedir : maven 설정 - Update project


## 자바 스트림
```script
list.stream().filter(p -> p).foreach(
	system.out.print(p);
);
```

## ArrayList, LinkedList
배열 리스트<br/>
연결된 리스트

## 프로젝트
동작을 하는 프로젝트<br/>
사람들은 거짓말을 한다 - 직접 해봐라

## 빅데이터
오늘 읽은 블로그에서는 게시물을 저장하고 조회수를 업데이트하는 것 뿐만아니라
(게시물 번호, 유저 번호, 읽은 시간)과 같은 내용도 데이터를 저장하여 유저가 어떤 종류의 글을 읽는지 분류를 할 수 있고 추천글을 보여줄수 있다는 것이였다. 나는 그동안 이런 종류의 데이터를 저장한 적이 없었고 다만 어떻게 추천글을 보여주는 것일까 생각했을때 설마 그 많은 유저별 데이터를 다 저장할까 의심했지만 진짜 저장하고 있다는 사실에 더 놀라웠다. 데이터가 많아질수록 조회해오기 위한 시간이 더 길어진다. 이를 어떻게 빠르게 가져올 것이며 계속 쌓이는 수많은 데이터를 다 저장 할 수 있을까
