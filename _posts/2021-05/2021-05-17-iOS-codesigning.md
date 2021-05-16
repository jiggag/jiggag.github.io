---
layout : post
published : true
title : iOS 신뢰하는 인증서로 코드사이닝
subtitle : 몰라서 알아두려고 했더니 더 모르게 되었다
tags : [iOS, 키체인, 인증서, Certificates, Identifiers, Provisioning, Profile]
--- 

`키체인에 iOS Developer 인증서가 신뢰할 수 없다고 뜨는데 왜 그런거에요?`

갑자기 질문을 받았는데 말끔한 대답을 못하는게 역시나 모르는게 분명하다.
분명 그런 메세지를 나도 전에 본 적이 있었다. 그러나 정리해두지 않았는지 결국 또 잊어버렸다.

`인증서를 생성하고 등록하고 다운 받고 키체인에 던졌었는데...`

------

## 나의 키체인에는
인증서가 많이 있다.. 어떤게 진짠지 모르겠다. (정리하다가 앱 빌드가 안될까 아직 도전하지 않았다가 방금 했다!)

우선 앱 배포를 위한 인증서 `Apple Distribution`가 하나 있다.

그리고 앱 개발을 위한 `Apple Development`가 전체 플랫폼 슈퍼 인증서가 있다. (Platform을 iOS에 한정하지 않고 All로 등록했다.)

근데 이게 키체인에는 2개가 등록되어있다!!? 무슨일이지 하나를 용감하게 지워보았다 (맥북 이름이 써있는걸 지우고 xcode를 실행하니 다시 생성되었다)

이렇게 각각 인증서가 뭔지도 모르는건 오히려 좋지 않으니 [참고: 애플 인증서 문서](https://help.apple.com/xcode/mac/current/#/dev97211aeac)를 확인해본다.

------

## 인증서 종류
```
- Apple Development: 앱을 개발하는 동안 사용하는 인증서

- Apple Distribution: 앱을 특정 디바이스에서 테스트나 앱 스토어에 제출을 위해 사용하는 인증서

- 3rd Party Mac Developer Installer: Mac Installer Package(서명된 앱 포함)를 서명하고 Mac 앱 스토어에 제출하는데 사용하는 인증서

- Developer ID Application: Mac 앱을 외부로 배포하기 위한 서명을 하는 인증서

- Developer ID Installer: Mac Installer Package(서명된 Mac 앱 포함)를 서명하고 배포하는데 사용하는 인증서
```
인증서 종류가 많은데 나는 `Apple Development`랑 `Apple Distribution`만 사용하고 있다.
`Developer ID Application` 이게 있기는 한데 왜 있는지.. 나는 Mac 앱을 개발한 적이 없는데 무언가 잘못하였네!

------

## 돌아보는 나의 인증서
나는 그동안 애플 개발자 센터에서 `Membership`과 `Certificates, Identifiers & Profiles`만 사용했다.

`Membership`에는 개발자 계정 1년마다 등록하는 그것에 관련한 내용으로 잘 안들어간다!

가장 어려운.. 문제의 `Certificates, Identifiers & Profiles`에는 `Certificates, Identifiers, Devices, Profiles, Keys, More` 탭이 있다.
(처음에는 다 비어있었는데 이것저것 시도하다보니 뭐가 잔뜩 생기긴 했다.)
개발자 계정 등록하고 나서 앱스토어에 한번 올려보겠다고 인증서랑 싸웠던 기억이 떠오른다.

[정말 다행스럽게도 인증서 관련해서 블로그가 많이 도와줬다 (지금도 도와준다)](https://dev-yakuza.posstree.com/ko/react-native/ios-certification/)

[참고: 인증서 서명이 왜 필요한지 ~ 등록까지](https://medium.com/jinshine-%EA%B8%B0%EC%88%A0-%EB%B8%94%EB%A1%9C%EA%B7%B8/%EC%BD%94%EB%93%9C%EC%82%AC%EC%9D%B4%EB%8B%9D-%EC%9D%B8%EC%A6%9D%EC%84%9C-%ED%94%84%EB%A1%9C%EB%B9%84%EC%A0%80%EB%8B%9D-%ED%94%84%EB%A1%9C%ED%8C%8C%EC%9D%BC%EC%9D%B4%EB%9E%80-2bd2c652d00f)

지금 `키체인 - 내 인증서`에는 `Apple Development`, `Apple Distribution`, `Developer ID Application` 이렇게 3개가 남아있다.

> 개발자가 여러개의 `Provisioning Profile`을 가질 수 있지만 `Profile`에 실제 연동한 App ID과 프로젝트의 Bundle ID가 동일해야하며 `프로젝트마다 각각 Profile을 만들어주어야 한다`라고 하는데... `왜 나는 하나 밖에 없지?`

하나 있는 `Provisioning Profile`도 애플 로그인 기능을 사용하려고 `Identifiers`에 추가하고 `Provisioning`을 다시 만든 것 같다. 근데 왜 xcode를 열어보면 `Provisioning Profile: Xcode Managed Profile`이라고 하는거지...?

Bundle ID마다 각각 만들어서 던져줘야 하는 것 아닐까?
`Provisioning Profile`을 프로젝트마다 만들어서 `*.mobileprovision` 파일을 다운받고 xcode에서 `Automatically manage signing`을 해제하고 import 해주면 된다!

`Automatically manage signing`을 체크해두었더니 `Provisioning Profile: Xcode Managed Profile`라고 뜨면서 `Identifiers`에 내가 등록한 앱이 아닌 `XC Wildcard`가 추가되었는데 아마 이것이 `Provisioning Profile: Xcode Managed Profile`가 되면서 `Provisioning Profile`을 추가 등록하지 않아도 되었던 것으로 보인다.

------

## 그래서 인증서를 신뢰하려면 어떻게 해야할까
그래서 처음 질문 받았던 내용을 정리해본다.
> 키체인에 iOS Developer 인증서가 신뢰할 수 없다고 뜨는데 왜 그런거에요?

앱을 실행하려면 애플로부터 인증을 받은 `신뢰할 수 있는 앱`인지 `앱을 실행할 수 있는 권한`을 갖고 있는지를 확인한다.
그래서 키체인에서 `인증 기관에 인증서 요청`을 통해 발급 받은 키를 이용해 `iOS Certificates`을 생성한다.
그럼 해당 인증서를 키체인에 던지면 애플로부터 앱을 실행할 수 있는 권한을 받은 것이다.

그러나 이 인증서는 애플이 나를 신뢰하는 것이지 내가 개발하려는 기기에서 이 인증서를 신뢰하는 것이 아니다.
기기에서 인증서를 사용해 앱을 개발할 수 있도록 신뢰하려면 기기를 인증서에 등록해서 사용할 수 있도록 해주어야하는데 이것이 `Provisioning Profile`다.

내가 개발하려는 App ID를 `Identifiers`에 등록하고 개발에 사용하려는 기기 정보를 `Devices`에 등록하고 해당 정보들을 조합한 `Provisioning Profile`를 만들어서 `*.mobileprovision`을 import하면 해당 앱을 개발하고 실행할 수 있는 모든 신뢰를 얻었다.

이 과정을 `코드사이닝`이라고 한다.

------

그동안 `Automatically manage signing`를 체크하고 사용해서 프로비저닝이 하나 밖에 없어도 몰랐다.
사실 이것도 이번에 알게된 내용이지만 invalid 떠있었다...

오묘한 이 상태에서 인증서랑 키를 다시 정리해보고 이해한 내용이 맞나 확인해보고 싶은데 꼬일까봐 못하겠다 😱

우선 질문으로 돌아가 대답해줘야지! 이미 지난 일이지만 그냥 혼자 설명해주면 그럼 다시 모르는거 나오겠지?