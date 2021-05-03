---
title: "Today I learned 190404 Thu"
tags: TIL python
---

## 공부한 것 리스트
- 파이썬 웹을 다시 복습 했다. 장고는 무지 편한데, 톰캣으로 하던 것들이 잔 오류가 많고 설정 부분에서 시간을 많이 잡아먹던 것이 사라져서 그렇게 느끼는 것 같다. Java를 배웠던 때를 생각해보면, 기본 문법 1달 반, 프로젝트 총 3달 가량, JSP,Spring 1달 반 정도 했다. 그렇게 한다면 파이썬 쟝고를 한 달 공부, 한 달 코딩해서(물론 공부와 코딩을 딱딱 분리해서 하지는 않겠지만)2달 이내 프로젝트까지 가능하다는 결론이 나온다.
- 하루 패트에서 `ctrl + 1,2,3,4,5` 누르면 헤딩 값에 따른 태그가 바로 생성된다. 실수로 암.

[TOC]
- 기초 통계
- C프로그래밍
- 자바스터디
- 프로젝트 설계
	- 파이썬 장고

## 1. Python django

##### 3.5.4 기본 테이블 생성
- `python manage.py migrate`
- 위의 명령어로 기본 테이블을 생성한다.

##### 3.5.5 지금까지 작업 확인하기
- runserver 실행방법
	```python
	# 디폴트 주소와 포트
	python manage.py runserver

	# 지정 포트와 디폴트 주소
	python manage.py runserver 8888

	# '&'를 추가하면 웹 서버프로그램이 백그라운드에서 실행. 리눅스, 맥만 가능
	python manage.py runserver 0.0.0.:8888 &
	```

- 슈퍼유저 생성
	-`python manage.py createsuperuser`
	
#### 3.6 애플리케이션 개발하기 - Model 코딩
- 작업 요약
	```shell
	>notepad models.py
	>notepad admins.py
	>python manage.py makemigrations
	>python manage.py migrate
	>python manage.py runserver
	```

##### 3.6.1 테이블 정의
```python
# models.py
```
##### 3.6.2 Admin 사이트에 테이블 반영
```python
# admin.py
```

***
## 2. C프로그래밍 ; 방송대

### 6장

#### 6.1 배열(배열의 개념)
- 배열의 정의
	- 동일한 자료형을 갖는 자료들의 리스트
	- 배열의 각 요소는 하나의 변수로 취급
	- 배열은 배열명과 첨자로 구분
- 배열의 선언 형태

##### 6.1.1 1차원 배열
1. 배열 선언
2. 배열의 초기화


##### 6.1.2 다차원 배열


#### 6.2 포인터


***
3. Python ; Data

