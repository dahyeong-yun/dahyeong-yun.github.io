---
layout: post
title: "Today I Learned 190312 Tue"
tags: [TIL]
comments: true
---

## 1. Python Django

### 1) Django Model
- 데이터베이스 개념
-  Java에서 MVC였던 것이, 파이썬은 MTV(Model - template - view )으로 표현. 표현만 다르고 실상은 같은 말

#### Model 생성 실습
- (쓰는 법)[https://docs.djangoproject.com/en/2.1/ref/settings/#databases]
	- `python manage.py makemigrations`
	- `ptyhon manage.py migrate`
	- `Post.objects.all()`

### 2) Django Form

## 2. Algorithm

### 방송대
- 1.5 점근선능
	- 1.5.1 개념
		- n이 무한대로 커짐에 따라 결정되는 성능을 점근성능이라 함.
		- 시간 복잡도는 입력 크기 n에 대한 함수로 표현
		- 점근 성능은 수행시간의 다항식 함수에서 최고차항만을 계수없이 취해서 단순화 시킨 형태
	- 1.5.2 표기법
		- Big O
		- Big Omega
		- Bit theta
		
### Hello
- 이진 탐색 최대 : log(n) + 1

## 3. Database

### 방송대
- 1) 데이터베이스 모델링
	- 과정
		- 필요
			- 비즈니스적 관점 : 어떠한 데이터를 저장해야 하는가?
			- 컴퓨터 프로그래머 관점 : 어떤 구조로 데이터를 저장해야 하는가
		- 과정
			- 요구사항 -> 개념적 모델링 -> 논리적 모델링 -> 물리적 모델링
- 2) ER 모델
	- 개념 : 실세계의 속성들로 이루어진 개체(entity)와 개체사이의 관계(relationship)를 정형화 시킨 모델
	- 구성 요소
		- 개체(entity)
		- 개체 집합(entity set)
		- 관계
		- 관계 집합
	- 속성
		- 단순속성
		- 복합속성
		- 단일값 속성
		- 다중값 속성
		- 유도 속성
		- 저장 속성
		- 널(null) 속성
	- 제약조건
		- 사상수(mappjng cardinality) : 1:1, N:1, N:N
		- 참가제약조건(participation constraints)
			- 전체적 참가 : 2줄
			- 부분적 참가 : 1줄
		- 키 속성
			- 키(key) : 각 개체를 구별하는데 사용되는 유일한 값을 가지는 속성의 집합
		- 특수 속성과 관계
			- 관계 집합의 속성
			- 재귀적 관계
			- 약한 개체 집합
			- 강한 개체 집합
- 3) ER 모델링