---
title: "Today I Learned 190327 Wed"
tags: TIL database
---
## 1. Database ; 방송대

### 교재 2장 연습문제 설명

#### 객관식

##### 1. 데이터 모델링 과정
- **개념적 데이터 모델링** : 시스템에서 관리할 데이터와 데이터 간의 관계를 정의함으로써 현실 세계의 업무를 표현
- **논리적 데이터 모델링** : 개념적 데이터 모델링 단계에서 표현한 스키마를 DBMS에서 사용하는 데이터 모델에 맞게 대응 시키는 작업
- **물리적 데이터 모델링** : 논리 스키마를 바탕으로 각 데이터에 대한 형식, 제약조건 등을 부여하여 물리적으로 데이터베이스를 모델링 하는 작업

##### 2. ER 모델 ; 속성, 3번, 5번 포함
- **단순 속성** 
	- 더 이상 의미적으로 나누어 질 수 없는 속성
	- 사람이라는 개체 집합에서 키(heoght)라는 속성은 더 나누었을 때(170cm를 17이랑 0으로 나누었을 때)의미가 소실되어 버린다.
- **복합 속성**
	- 더 작은 구성 단위로 나누어 질 수 있는 속성
	- 사람이라는 개체 집합에서 주민등록번호의 경우 생일, 성별, 지역 등의 정보가 조합되어 있다.
- **단일 값 속성**
	- 특정 속성 값으로 단 하나의 값을 가지는 경우
	- 학생의 경우 하나의 학번만을 가진다.
- **다중 값 속성**
	- 속성값으로 여러 개의 값을 가지는 경우
	- 사람 개체 집합의 계좌번호의 경우 다양한 계좌가 있을 수 있다.
- **유도 속성**
	- 다른 속성 값으로부터 유도되어 결정되는 속성값
	- 나이의 경우 생일로부터 유도 가능한 유도 속성이다.
- **저장 속성**
	- 유도 속성을 위해 사용된 속성
	- 나이의 경우 생일로 부터 유도 가능한데, 이때 생일이 저장 속성
- **null 속성 **
	- 특정 개체가 가지는 속성값을 모르거나, 특정 개체에 일부 속성이 적용될 수 없는 경우 null 속성을 사용

##### 4. ER 다이어그램 기호
- 참고 : https://m.blog.naver.com/gongtong/150135598792

#### 주관식

##### 1.
##### 2.
- (a)
	- 관객과 티켓은 예매라는 관계를 가진다.
	- 이때 관객은 최소 0개에서 최대 N개까지 티켓을 예매할 수 있다.
	- 이때 티켓은 반드시 1명에게 예매가 된다.
- (b)
	- 사원은 최소 하나에서 최대 N까지의 프로젝트에 참여할 수 있다.
	- 프로젝트는 최소 0명에서 N명까지 사원이 참여한다.
	- 둘 사이에 생긴 참여 관계 집합 참여율 속성을 가진다.
- (c) 재귀적 관계 집합
	- 사원은 최소 0명에서 N명까지 사원을 관리할 수 있다.
	- 사원은 최소 0명에서 1명에게 관리한 내역을 보고 한다.
	- 이때 생기는 관리 관계 집합은 기간이라는 속성을 가진다.