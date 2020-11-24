---
layout: article
title: "Python for non-developer_pilot"
tags: python mylecture
aside:
  toc: true
---



## 2. 파이썬 코드를 직접 보자

### 2.1 인스타그램 태그 검색해보기

```python
from selenium import webdriver

driver = webdriver.Chrome('./chromedriver')

baseUrl = 'https://www.instagram.com/explore/tags/'
tagNm = str(input('검색할 태그를 입력해 주세요'))

searchTagUrl = baseUrl+tagNm

driver.get(searchTagUrl)
```

#### 2.1.1 여기서 나오는 개념들
> **bold**는 매우 중요한 것

- **변수**
- **연산자**
- 주석
- import
- 절대경로, 상대경로
- 내장함수



### 2.2 게시물 수는 어디에 있을까

#### 2.2.1 HTML의 구조