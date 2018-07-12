---
layout: post
published: true
title: 쿼츠 스케쥴러 에러를 통해 알게 된 점
subtitle: 나만 몰랐지
tags: [spring,quartz,scheduler,error]
---


## 스프링 프로젝트 진행 중 쿼츠스케쥴러에 새로운 스케줄 등록하다 에러가 발생했고 이에 알게된 점을 적어두기


```


# 오류 1 :
    
	java.lang.IllegalStateException
		Caused by: org.springframework.beans.factory.BeanCreationException
			Caused by: org.springframework.beans.BeanInstantiationException
				Caused by: org.quartz.ObjectAlreadyExistsException

	- 스케줄의 이름이 중복 발생

# 오류 2 :

	java.lang.IllegalStateException
		Caused by: org.springframework.beans.factory.BeanCreationException
			Caused by: org.springframework.beans.BeanInstantiationException
				Caused by: org.apache.ibatis.binding.BindingException

	- 정확한 이유를 알지 못하나 어딘가에 선언되지 않은 bean을 요청했을 때 발생

```
