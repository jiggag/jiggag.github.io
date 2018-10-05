---
layout: page
title: Wiki
subtitle: 직각위키
---

## 구글 애널리틱스 gtag.js 추적 설정
```script
<!-- Global Site Tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'GA_TRACKING_ID');
</script>
```


## Single Page Application Tracking
```script
gtag('config', 'GA_TRACKING_ID', {'page_path': '/page/path'});
```
싱글페이지인 경우 페이지별 추적 설정


## 구글 애널리틱스 이벤트 추적 설정
```script
gtag('event', '이벤트액션', {'event_category':'이벤트카테고리','event_label':'이벤트라벨', 'value':'이벤트값'});
```
카테고리 > 액션 > 라벨 > 값

