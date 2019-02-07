---
layout: post
published: true
title : karma에서 httpBackend 테스트
subtitle : $http, $resources 테스트를 위한 $httpBackend
tags: [karma]
---

# karma 단위 테스트
```javascript
// 1
describe("테스트 제목\r\n", function() {
	var ctrl;
	var scope;
	var httpBackend;
	
	// 2
	beforeEach(function() {
		module("모듈1", "모듈2");
		
		inject(function($rootScope, $controller, $httpBackend) {
			scope = $rootScope.$new();
			ctrl = $controller("TestCtrl", { $scope : scope });
			httpBackend = $httpBackend;
		});
	});

	// 3
	it("상세 테스트 : TestCtrl 확인\r\n", function() {
		expect(ctrl).toBeDefined();
	});

	// 4
	it("상세 테스트 : scope.getNotice 접근\r\n", function() {

		scope.userId = "userId";

		var data = {doc:{body:[{id:1,content:"내용1"},{id:2,content:"내용2"}]}};
		httpBackend.expectGET("http://localhost/getNotice?userId=" + scope.userId).respond(data);
		
		scope.getNotice(scope.userId);

		scope.$digest();
		httpBackend.flush();

		expect(scope.noticeList.length).toBe(2);
	});	
});
```

```javascript
// 5
$scope.getNotice = function(){
	var data = $resource("http://localhost/getNotice?userId=" + $scope.userId, {}, {search : {method : "get"}});
	var result = data.get();
	result.$promise.then(function(response) {
		$scope.noticeList = response.doc.body;
	});
}
```
#### # 1
karma테스트를 시작

#### # 2
각각의 it 테스트 전에 매번 실행하며
의존하고 있는 모듈들을 선언하고
해당 controller와 scope 호출하며
http, resource 테스트를 위해 httpBackend 선언

#### # 3
컨트롤러가 정의되었는지 확인

#### # 4
5번의 http 요청을 테스트하기 위해 httpBackend로 해당 URL 응답을 임의로 만들어서 보내준다
그리고 http를 호출하면 미리 보내준 data가 응답된다
이때 flush를 하지 않으면 httpBackend로 응답이 가지 않아 에러가 발생



# 에러
#### # 1
Error: Unexpected request: GET http://localhost/getMember
No more request expected in D:/workspace/test/src/js/angular-mocks/angular-mocks.js (line 9)

- httpBackend로 응답을 보내줘야하는데 이를 선언해주지 않아 발생한 에러

```javascript
var data = {doc:{body:{member:"이름"}}};
httpBackend.expectGET("http://localhost/getMember").respond(data);
```


#### # 2
Error: Unexpected request: GET http://localhost/getMember?id=123
Expected GET http://localhost/getMemberId in D:/workspace/test/src/js/angular-mocks/angular-mocks.js (line 9)

- 응답 보내준 httpBackend의 URL이 잘못되었다고 발생한 에러로 파라미터까지 정확하게 선언해줘야함

#### # 3
ReferenceError: Can't find variable: $controller in D:/workspace/test/test/app/main/contents/test.js (line 9)

- $controller가 선언되지 않았다고 발생한 에러

```
ctrl = $controller("TestCtrl", { $scope : scope });
```

#### # 4
- httpBackend를 여러개 선언하여 하나의 it에서 여러개의 http응답을 보낼 경우 에러 발생
- it 하나 당 하나의 http flush 호출

