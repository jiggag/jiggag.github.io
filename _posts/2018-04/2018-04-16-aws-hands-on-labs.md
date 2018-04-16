---
layout: post
published: true
title: AWS 실습 교육 - Hands On Labs
subtitle: AWS 서버 가동
tags: [aws,iam,vpc,elasticip,tomcat,apache]
---

AWS 실습 교육을 듣고 왔다. 계정을 만들고 사용자를 추가하고 권한을 부여한 뒤 서버를 만들어 화면을 띄웠다.

## AWS 계정 생성

교육 받기 전 미리 AWS에 계정을 생성해가야한다.
모든건 영문으로 보통의 회원가입과 똑같으며 다른점은 신용카드 확인이 있다는 것..
아무렇지 않게 신용카드를 등록하고 가입을 완료했다고 생각했는데 갑자기 걸려온 은행전화.
AWS이 아무래도 해외 결제를 필요로 하다보니 1달러의 가상의 금액이 결제 요청이 온다.
물론 진짜 결제는 되지 않았지만 평소에 해외결제는 1도 해보지 않았던 나에게 은행은 해외결제요청이 들어왔는데
본인이 맞는지 확인전화가 왔다. 괜히 놀랬다.

## AWS 실습 교육

#### Root Account
	- AWS 계정 생성하기를 통해 만들어진 계정
	- AWS의 모든 권한을 갖고 있는 MASTER/ADMIN 계정

#### IAM : AWS Identity and Access Management
	- Root 계정 아래에 USER/USER GROUP을 생성하여 권한 관리
	- 사용자별로 ACCESS 가능한 AWS 리소스 제어
	- USER에게 부여된 권한 + 소속된 USERGROUP의 권한
	- 추가 비용 없이 AWS 계정에 제공되는 기능으로 IAM 사용자가 사용한 다른 AWS 사용에 대해서만 요금이 부과

#### AWS 웹 관리콘솔, CLI, SDK
	- CLI나 SDK를 다운받아 개발자처럼 어렵게 사용해도 되나 AWS는 웹 콘솔을 지원한다

#### VPC : Virtual Private Cloud
	- 사용자의 AWS 계정 전용 가상 네트워크
	- 이 실습할때 혼돈의 도가니가 시작되었다
	- 강사님은 PPT만을 보여준채 빠르게 진행을 진행진행하셨으나
	- 하나의 인스턴스 안에 IP를 나눠서 로컬서버를 여러개 만든다고 모르는채 넘어갔다
	- 다시 알아봐야할 문제

#### Elastic IP
	- EC2인스턴스와 연결해서 사용 시 무료지만 EC2중지 혹은 삭제 후에도 ElasticIP를 계속 생성해두면 비용부과
	- EC2를 사용했다가 중지해가며 사용해야하는 경우 매번 새로운 IP가 할당되면 계속 도메인이나 서비스 IP주소를 변경해줘야하는데
	- Elastic IP를 이용하면 인스턴스의 IP는 계속 변경되더라도 Elastic IP를 이용해 우리는 고정된 IP를 사용할 수 있도록 해준다
	- 필수 서비스인듯

#### 아파치 웹서버
	- yum list installed | grep httpd : 설치되어있는지 확인
	- yum install -y httpd
	- AWS EC2 리눅스 서버를 시작하고 PuTTy를 통해 서버에 접속한 뒤 http 설치

#### 아파치 웹서버 방화벽 설정
	- cd /etc/httpd : 설정파일이 있는 곳으로 이동
	- firewall-cmd --permanent --add-service=http
	- firewall-cmd --permanent --add-service=https
	- firewall-cmd --reload
	- 나는 설정이 왜 안될까..

#### 아파치 서비스 시작
	- service httpd start
	- http://ipaddress : 웹서버 80포트
	- 설치한 아파치 웹서버를 가동 후 접속

#### 아파치 웹서버에 파일 배포 디렉토리 확인
	- vi /etc/httpd/conf/httpd.conf : 설정 파일 vi로 확인
	- root directory가 /www/html인것을 확인
	- root page가 index.html인것을 확인
	- chmod -R 777 html : html폴더 권한 변경
	- /www/html 안에 index.html파일을 생성 후 다시 http://ip주소로 들어가보면 index.html이 뿌려진다.	
	- 아파치 웹서버에서 보여지는 파일들의 경로를 설정파일에서 확인 후 해당 경로아래에 파일을 넣어준다

### PuTTY
	- service tomcat8 start : tomcat 시작
	- http://ipaddress:8080 : was서버 8080포트
	- 위의 아파치가 80포트에서 가동되다면 톰캣서버는 8080포트에서 가동