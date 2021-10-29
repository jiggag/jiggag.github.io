---
layout: post
published: true
title : DB 연결 시간 초과
subtitle : wait_timeout 설정
tags: [mysql,db]
---

```script
Cause: com.mysql.jdbc.exceptions.jdbc4.CommunicationsException: 
The last packet successfully received from the server was 53,874,730 milliseconds ago.  
The last packet sent successfully to the server was 53,874,730 milliseconds ago. 


is longer than the server configured value of 'wait_timeout'. 
You should consider either expiring and/or testing connection validity before use in your application, 
increasing the server configured values for client timeouts, 
or using the Connector/J connection property 'autoReconnect=true' to avoid this problem.
```

MySQL 연결 요청을 오래 안했을 경우 위와 같은 오류 발생
DB요청을 53,874,730 밀리초만큼 안해서 연결이 끊어졌다는 것이다
오류 메세지에 해결방안도 몇가지 써져있으며
보통은 autoReconnet=true를 DB URL에 써서 보내는대 이게 잘 되지 않는듯하여
두번째 방안으로 MySQL 설정값 중 wait_timeout값을 변경해주었다.
기본값으로 28800이 설정되어있는데 이것은 초 단위로 8시간을 의미한다.

그러나 이 오류메세지에서 알 수 있는 DB연결은 24시간 정도 마지막 요청시간이 지났고 그래서 엄청 큰 값인 24시간은 wait_timeout에 설정해주었다.
