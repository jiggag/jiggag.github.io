---
layout: post
published: true
title: java에서 json으로 파싱
subtitle: json-simple을 이용한 파싱
tags: [spring,json,parsing]
---

프론트에서 JSON으로 저장한 데이터를 STRING형태로 백엔드로 넘겨와
다시 JSON형태로 파싱하는 과정


## 애초에 JSON형태로 가져올 수는 없는 것일까??


#### 프론트 JSON -> 백엔드 STRING -> JSON으로 파싱

```script

Could not read document: Can not deserialize instance of java.lang.String out of START_ARRAY token

```

프론트에서 단순하게 JSON객체를 RequestBody로 넘겨왔더니 에러가 발생했다.
위의 에러는 프론트에서 RequestBody에 담아준 데이터의 형식이 틀렸기에 나타나는것같다.
나는 JSON객체를 STRING으로 선언하여 받아오려고 했는데
애초에 BODY에 담겨지지가 않았던 모양이다.



#### 그래서 문자열로 바꿔서 넘겨주면되려나 ..

정말 단순하게 생각했다
JSON을 문자로 바꿔주자

```script

jsonValue + ""

```

지금 생각해보니 정말 획기적인 순간이였다

물론 저렇게 하면 넘어는 간다
문자는 문자이니깐. 그러나 JSON으로 파싱은 안된다.
로그를 찍어보니
위와 같이 넘겨주는 데이터는 [Object],[Object] + "" 의 형식과 같았다


#### 프론트에서 로그 찍을 때 많이 썼던

스크립트에서 JSON객체를 콘솔에 찍어보려 사용하던 그 한 문장

console.log(JSON.stringify());

이거다

JSON객체를 정확하게 문자로 JAVA로 넘겨줄 수 있는 방법

이렇게 백엔드로 넘어온 JSON객체의 문자는 다시금 JSON으로 파싱하여 사용하고자 하는 형태로 변환할 수가 있었다.


#### JSON 파싱

```script

# pom.xml

<dependency>
	<groupId>com.googlecode.json-simple</groupId>
	<artifactId>json-simple</artifactId>
	<version>1.1</version>
</dependency>


# gradle

	compile group: 'com.googlecode.json-simple', name: 'json-simple', version: '1.1'



# JSON-SIMPLE을 이용
String jsonStr = "[{'idx':1,'val':'json-val'},{'idx':1,'val':'json-val'}]";

try {
	JSONParser jsonParser = new JSONParser();
	JSONArray array = (JSONArray) jsonParser.parsejsonStr 

	for(int i=0 ; i<array.size() ; i++){
		JSONObject tempObj = (JSONObject) array.get(i);
		System.out.println(tempObj.get("idx"));
		System.out.println(tempObj.get("val"));
	}

} catch (Exception e) {
	// TODO Auto-generated catch block
	e.printStackTrace();
}


```


#### JSON을 문자열로, 문자열을 JSONObject 혹은 JSONArray로 변환
