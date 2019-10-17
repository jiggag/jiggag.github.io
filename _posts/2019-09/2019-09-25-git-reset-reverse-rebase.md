---
layout : post
published : true
title : reset, rebase, reverse 차이점
subtitle : 직접 겪어야 배운다
tags : [git]
---

#### `reset`, `reverse`
내가 `push`하기 전에 다른 사람이 소스를 올려버렸다.
`pull`을 해야만 푸시가 된다고 해서 pull을 눌렀는데도 충돌이 나서 안되길래 그래 한번 커밋 좀 되돌리지 했던 것이 화근이 되었다.
  
내가 커밋한 것을 reverse했다. 그런데 소스가 전부 날라가버렸다. 나에게 남은 소스는 reverse된 위치의 코드이다.
하루종일 작업한 내용이 사라져버렸다.
  
지난번에 로컬 커밋 후 푸시하기 전에 `reset`을 했을때는 소스가 남아있었기에 과감하게 이번엔 reverse해봤는데 큰일났다.
아직 나는 reset과 reverse의 차이를 분명하게 모른다.
  
`reset : 내 커밋 내역을 지우고 선택한 커밋을 덮어씌운다`  
`rebase : 내 커밋의 베이스를 선택한 위치로 변경한다`  
`reverse : 내 커밋을 해당 커밋 내역 위로 올린다`  
  
#### 직접 해보기
`로컬에만 커밋하고 푸시하기전에 누군가가 푸시해버렸다.` 상황을 만들어놓고 `rebase`와 `reverse`, `reset`을 이해해보고자 한다.
  
우선 테스트용으로 잔뜩 푸시해놓았다. 그리고 이전 커밋으로 내려가 로컬에만 커밋을 했다. 그리고 푸시하려고 하니 당연히 안된다. 나의 소스 분기점으로 원격에 커밋되어있는 마지막 위치로 변경하는 `rebase`를 진행한다. 현재 나의 커밋에 `HEAD`를 두고 `rebase`하려는 커밋을 선택하여 요청하면 해당 원격 커밋 위로 나의 로컬 커밋내역들이 올라간다.
  
같은 파일을 수정했어도 충돌없이 변경되는지 확인해본다. 당연히 충돌이 발생했다. `rebase`를 계속하려면 충돌이 발생한 파일들을 수정하고 다시 `stash`에 등록하면 해결되었다.

두번째로 이번엔 같은 상황에서 `HEAD` 커밋을 `reverse` 해보았다. 그랬더니 로컬에 커밋된 나의 변경내역을 모두 원래대로 돌리는 역커밋이 새로 생성되었다. 이것으로는 깃 플로우의 문제를 해결할 수 없는 것 같다.
  
마지막으로 `reset`을 해보았다. 리셋 형태를 설정 할 수 있는데, `mixed`를 선택하여 `reset`을 선택한 커밋의 코드가 커밋전 상태로 변경되었다. 그리고 새로운 커밋을 요청하여 문제를 해결하였다.
  
실제 문제를 직접 테스트해보며 헷갈렸던 `rebase`, `reset`, `reverse`를 이해하는데 조금 도움이 된것같다.