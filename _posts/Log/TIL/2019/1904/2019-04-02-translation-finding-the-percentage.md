---
layout: post
title: "[HackerRank]Finding the percentage"
tags: [HackerRank, translation]
comments: true
---

## 문제
 N명의 학생의 기록이 주어집이다. 각 기록에는 학생의 이름과 그들의 수학, 물리, 화학 과목에서의 백분위 값이 주어집니다. marks는 실수 값(floating value)일 수 있습니다. 사용자는 N명의 학생에 대한 이름과 마커를 입력합니다. 여러분은 딕셔너리 타입을 이용해 이 기록들을 저장해야 합니다. 그렇게 하면 사용자는 학생들의 이름을 입력합니다. 결과치는 백분위의 평균값이 출력되며 오차 허용범위는 소수점 두자리 까지입니다.
 
### 입력 형식
- 처음 줄에 학생 수를 의미하는 정수 N이 주어집니다.
- 다음 줄에 이름과 백분위가 주어집니다.
- 마지막 줄에는 이전에 나온 특정한 학생의 이름이 주어집니다.

### 제약 조건
- 2 <= N <= 10
- 0 <= Marks <= 100

### 출력 형식
한 줄을 출력 : 주어진 특정 학생의 백분위의 평균을 소수점 두자이 이하 오차로 구하세요.

### 예시 입력 0
```shell
3
Krishna 67 68 69
Arjun 70 98 63
Malika 52 56 60
Malika
```

### 예시 출력0
```shell
56.00
```
### 해설
Malika의 백분위 값 52,56,60의 평균은 56이다.


### 예시 입력 1
```
2
Harsh 25 26.5 28
Anurag 26 28 30
Harsh
```

### 예시 출력 1
```
26.50
```


### 답안 작성란
```python
if __name__ == '__main__':
    n = int(input())
    student_marks = {}
    for _ in range(n):
        name, *line = input().split()
        scores = list(map(float, line))
        student_marks[name] = scores
    query_name = input()

# 이 줄 이하에 코딩하세요.
```