---
title: "Today I Learned  190314 Thu"
tags: TIL python
---

## 1. Python Data Basic
### 4-1 Matplotlib이란
- 2003년 출시
- MATLAB과 같은 그리기를 Python에서 사용하게 하는 패키지

### 4-2 그래프 그리기 기초
- 그래프 그리기 준비하기
    - `import matplotlib.pyplot as plt`
    - 알리아스 명을 plt로 하는 것이 일반적
    - 그래프 출력 함수 `show()`
    
- 피겨와 서브플롯
    - figure : 서브 플롯을 작성하는 영역
    - subplot : 그래프를 작성하는 영역

- `add_subplot()` 메소드로 서브 플롯 배치
- `subplots()` 함수를 이용해서 서브플롯 배치하기    