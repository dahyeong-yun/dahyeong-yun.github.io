---
title: "Today I learned 190401 Mon"
tags: TIL python
---

## 공부한 것 리스트
- 파이썬 스터디를 준비. 저번 주 했던 것을 복습하다 보니, 디테일한 것에서 모르는 것들이 꽤나 있었다. 사소한 것까지 다 외울 필요는 없지만, 자주쓰는 [format](https://pyformat.info/) 같은 것들은 잘 알아두면 좋을 듯.
- C 프로그래밍 출석 수업이 예상 범위가 꽤나 되서, 미리 공부를 좀 해야했다.
- 알고리즘은 수업들을 때는 별 것 없는 것 같은데, 막상 책을 보면 점근 성능 같은 것 계산식이 이해가 안된다. 파이썬 알고리즘 책과 HackerRank 문제를 계속 같이 풀어나가야 겠다.

[TOC]

## 1. Python ; Jump to Python

### 04-1 함수

#### 입력값과 결과값에 따른 함수의 형태

##### 입력값이 없는 함수

##### 결과값이 없는 함수

##### 입력값이 몇 개가 될지 모를 때는 어떻게 해야 할까?

##### 함수의 결과값은 언제나 하나이다
- return에 두 개를 쓰면 결과는 어떻게 나올까?
    ```python
    def sum_and_mul(a,b):
        return a+b,a*b

    result = sum_and_mul(3,4)
    # 무엇이 나오나요?
    ```

- return을 두 줄에 쓰면 결과는 어떻게 나올까?
    ```python
    def sum_and_mul(a,b):
        return a+b
        return a*b

    result = sum_and_mul(3,4)
    # 무엇이 나오나요?
    ```

- return을 중간에 쓰면 결과는 어떻게 나올까?
    ```python
    def say_name(name):
        if name=="Jeawon":
        	return
        print("My name is {myName}".format(myName=name))

    # say_name("Yangho")
    say_name("Jeawon")
    
    # 무엇이 나오나요?
    ```

##### 입력 인수에 초깃값 미리 설정하기

##### 함수 안에서 선언된 변수의 효력 범위

### 04-2 사용자의 입력과 출력

#### 사용자 입력
- ==p157 input()은 입력되는 모든 것을 문자열로 취급한다.==
- (스터디 때 공식 문서에서 함수 설명 보는 법 알려주기)

#### print 자세히 알기

### 04-3 파일 읽고 쓰기

#### 파일 생성하기

#### 파일을 쓰기 모드로 열어 출력값 적기

#### 프로그램 외부에 저장된 파일을 읽는 여러 가지 방법

#### 파일에 새로운 내용 추가하기

#### with문과 함께 사용하기

### 연습문제

#### 파일 읽고 쓰기
##### Q1
- 피보나치 수열
	- 내 답안
		```python
        
        ```

- 더 공부하기 1 : [재귀가 아닌 피보나치 수를 만들어보자 ; 백준](https://www.acmicpc.net/problem/2747)
    - 내 답안
        ```python
        num = int(input())
        output = 1
        before1 = before2 = 1

        if num == 0:
            output = 0
        elif num == 1 or num == 2 :
                output = 1
        else :
            for i in range(num-2) :
                before1 = before2 # 1 1 2
                before2 = output # 1 2 3
                output = before1 + before2 # 2 3

        print(output)
        ```
- 더 공부하기 2 : [피보나치 함수 문제 ; 백준](https://www.acmicpc.net/problem/1003)
	- 내 답안
        ```python
        # 피보나치 구하는 함수
        def fiboonacci(num):
            output = 1
            before1 = before2 = 1

            if num == 0:
                output = 0
            elif num == 1 or num == 2 :
                output = 1
            else :
                for i in range(num-2) :
                    before1 = before2 # 1 1 2
                    before2 = output # 1 2 3
                    output = before1 + before2 # 2 3

            return output

		T = int(input()) # 테스트케이스의 수

        for i in range(T):
          N = int(input())
          if N>=2 :
              a = fiboonacci(N-1)
              b = fiboonacci(N)
          elif N==1 :
            a=0
            b=1
          elif N==0:
            a=1
            b=0
          print(a,b)
        ```
#### 파일 읽고 쓰기
##### Q2


## 2. C 프로그래밍 ; 방송대 교재

### 3장
#### 3.2 연산자
##### 3.2.1 산술 연산자

### 4장 선택 제어문과 반복 제어문
#### 4.1 선택제어문
##### 4.1.1 `if`문

##### 4.1.2 `switch`문
- `enum syllable {Do, Re, Mi Fa}


## 3. Algorithm
### 2장 분할정복 알고리즘
#### 2.1 분할정복 방법의 원리
- 분할
- 정복
- 결합
#### 2.2 이진탐색
##### 2.2.1 개념과 원리
##### 2.2.2 알고리즘
##### 2.2.2 성능분석
##### 2.2.4 특징
- 이진탐색은 입력이 정렬된 리스트에 대해서만 적용

#### 2.3 합병정렬
##### 2.3.1 개념과 원리
##### 2.3.2 알고리즘
##### 2.3.3 성능분석

#### 2.4 퀵 정렬
##### 2.4.1 개념과 원리
##### 2.4.2 알고리즘
##### 2.4.3 성능분석

## 2. Pyhton Django ; Inflearn