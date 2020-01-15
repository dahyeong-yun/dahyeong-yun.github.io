---
layout: article
title: "Java Syntax"
tags: java wiki syntax PL
aside:
  toc: true
---



## 0. Generics

### 0.1  제네릭은 무엇인가?

#### 0.1.1 생김새
- 아래와 같이 생긴 코드를 본 적이 있을 것이다.
    ```java
    List<String> list = new ArrayList<>();
    ```
    
- 여기서 `<String>` 이 부분을 제네릭(Generic)이라고 한다.

- 

### 0.2 제네릭의 사용법

0.2.1 선언

0.2.2 제네릭 클래스 선언

#### 0.2.9 타입 추론 <?>

- [stackoverflow](https://stackoverflow.com/questions/11392380/generics-what-does-actually-mean)

  - > `<?>` is a shorthand for `<? extends Object>`, it's also known as an *unbounded wildcard*. So you can specify any type of object in your generic.

- [ ] 타입추론이 자동으로 실행 되는 경우는 어떤 경우인지?

### 0.3 제네릭을 왜 사용하는가?



### 0.4 제네릭은 어떻게 동작하는가?



