---
layout: post
published: true
title: 앵귤러 프론트 프로젝트 생성
subtitle: angular-seed-master.git
tags: [angularjs,frontend,project]
---

프론트와 백엔드가 구분되어 있는 프로젝트를 처음 만났을 때의 난감함을 직접 생성해보며 익숙해지고자 한다.


스프링 mvc 프로젝트로 프론트와 백엔드가 하나의 프로젝트에서 구현된 것만 접하다가 프론트는 angularjs로 백엔드는 java로 구분되어 있는 프로젝트를 접하게 되었다.
프론트를 npm start, 백엔드는 gradlew build 되어 있는 jar파일을 실행시키는 프로젝트..
먼저 angularjs 프로젝트를 생성해본다.

## angularjs-seed repository 다운

[angular-seed](http://github.com/angular/angular-seed) repository를 clone하여 프로젝트를 다운받는다.
이는 angular 1, anularjs를 이용한 프로젝트이다.

```script
$ git clone http://github.com/angular/angular-seed.git	# repository 다운로드
$ cd angular-seed
$ ren angular-seed jiggag-front-angular	# 프로젝트 폴더명 변경 : ren [원래 폴더/파일명] [수정 폴더/파일명]
$ npm install	# 프로젝트에 선언된 모듈을 npm을 통해 설치
$ npm start	# http://localhost:8000 
```

#### 위의 npm을 이용하기 위해서는 [nodejs](https://nodejs.org/en/)가 설치되어 있어야한다..

기본적인 프론트 페이지가 구현되었다.
이제 test 소스를 구분하고 관리하기 편한 폴더 구성으로 변경하고자한다.

#### 나만 편한가..?


## 프로젝트 구성 변경

```script
# 현재의 프로젝트 구성
app/
	components
	view1
	view2
	app.css
	app.js
	index.html
	index-async.html
e2e-tests/
	protractor.conf.js
	scenarios.js
.bowerrc
.gitignore
.jshintrc
.travis
bower.json
karma.conf.js
license
package.json

# 모듈 설치 경로 변경 : .bowerrc
"directory": "src/vendor"	# "app/bower-components"

# 서버 경로 변경 : package.json
"start": "http-server -a localhost -p 8000 -c-1 ./src",

# 그리고 폴더.. 변경된 나의 프로젝트 구성
src/
	app/
		view1/
			view1.html
		app.js
	assets/
		app.css
	common/
		version/
			...
	vendor/
		angular/
		angular-route/
	index.html
	index-async.html
test/
	app/
		view1/
			view1.test
	common/
		version/
	e2e-tests/
		protractor.conf.js
		scenarios.js
	karma.conf.js
.bowerrc
.gitignore
.jshintrc
.travis
bower.json
license
package.json
```

설정이 제대로만 변경되었다면 https://localhost:8000/ 호출 시 src/index.html 이 호출 될 것이고
index.html내부에 적용된 페이지가 보일 것이다.

#### 변경된 경로에 따른 유닛테스트 설정도 수정 필요..


#### [angularjs프로젝트](https://github.com/jiggag/angularjs-front-base) github
