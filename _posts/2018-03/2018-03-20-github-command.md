---
layout: post
published: true
title: 깃허브 명령어
subtitle: commit, push, pull
tags: [github]
---

깃허브에 커밋하고 합치다가 오류발생.. 되풀이되지 않도록 기록


## cmd에서 git 명령어 사용

#### git 초기화 및 커밋

```

$ git init : 해당 경로를 git에 등록 초기화
$ git add [files] : 커밋하고자 하는 파일, 폴더를 추가
$ git commit -m "commit message"
$ git remote [alias] [url] : 해당 저장소를 별명으로 저장 후 나중에 호출
$ git push [alias] [branch] : 해당 저장소의 브랜치에 커밋하기

```

#### git 저장소의 내용 가져오기

```

$ git fetch [alias] : 브랜치 alias의 변경된 내용들을 가져온다


```
git에 추가하고 푸시하는대는 어려움이 없다.
문제는 변경된 내용을 로컬에 내려받는데 어려움이 많다..
로컬에서 변경 후 커밋한게 아니라 github에서 자체 편집 후 로컬에 내려받는데 문제가 발생했다.
git pull 한 뒤 merge하고 다시 commit하면 될 거라 생각했는데 
왜인지 아직 모르겠으나 한글이 전부 외계어가 되는 상황발생..
히스토리를 돌리는 방법도 찾지 못해 github에서 history에 들어가 예전 파일을 긁어서 다시 커밋하였다.

git을 사용하는 법을 익히는 가장 좋은 방법은 여러사람과 함께 프로젝트를 진행하는 것이라던데..
여러 브랜치가 생기고 합치는 과정에서 이런 문제들을 겪어봐야할건인데 혼자서 여러 브랜치를 생성해 봐야하나..


