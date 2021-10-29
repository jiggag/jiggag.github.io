---
layout : post
published : true
title : 깃허브 보안 취약점 알림 메일
subtitle : 이번 기회에 npm Docs 읽어보기
tags : [github, npm]
---

#### 깃허브에서 자꾸 메일이 날라온다
풀리퀘도 아니고 자꾸 메일이 날라온다. 비슷한 내용의 패키지명만 다른, 보안에 취약하니 버전 업 하라는 친절한 메일이다. 큰맘먹고 업데이트 하려고 `package.json` 을 열었는데 메일로 알려준 패키지는 나는 사용하지도 않았다!
  
내가 사용하고 있는 패키지 중에서 무언가가 의존하고 있는 듯 하여 이걸 어떻게 할까 하다가 그럼 아예 이 패키지를 내가 설치해버릴까? 하는 생각도 해보았다. 그러나 이건 멍청한 한순간의 지나침으로 넘겨버리고 메일 내용 `Known high severity security vulnerability detected` 를 그대로 검색해보니 `npm docs` 가 짠하고 눈에 밟히는게 아닌가.
  
이번 기회에 npm docs 읽어보며 `npm audit fix` 으로 간단하게 해결할 수 있었다. 우선 npm 버전 6이상으로 업데이트 해줘야만 사용할 수 있으며 이 명령어는 보안이 취약한 패키지들을 전부 업데이트 해준다. `npm audit` 으로 현재 취약한 패키지들을 모두 확인 할 수 있는데, 나는 무려 273개나 나왔다... 바로 `npm audit fix` 해주었다.
  
```
// npm 최신 버전으로 업데이트
npm i -g npm

// 보안 취약성 확인
npm audit

// 업데이트
npm audit fix
```
