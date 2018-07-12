---
layout: post
published: true
title: 스프링 프로젝트 import가 안될때 - import file system
subtitle: .project, .settings도 없을때
tags: [spring,project,import]
---

스프링에서 백업해둔 프로젝트 import하려는데 프로젝트 폴더에 .project도 없고 .settings도 없어서 스프링에서 프로젝트를 인식하지 못할때...

![import_project_not_found](/img/posts/2018/07/import_project_not_found.jpg)


## 가장 좋은 건 복사

.project와 .settings를 프로젝트 원본 폴더에서 복사해온다.
그러나 원본이 없으니 import를 못하고 있는 상황


## 새로 만든 프로젝트에 불러오기

new - project 생성 후 해당 프로젝트에 import - File System 그리고 import하려고 하는 프로젝트 소스폴더를 찾아서 선택선택

![new_project](/img/posts/2018/07/new_project.jpg)
![import_file_system](/img/posts/2018/07/import_file_system.jpg)
![import_file_system2](/img/posts/2018/07/import_file_system2.jpg)

