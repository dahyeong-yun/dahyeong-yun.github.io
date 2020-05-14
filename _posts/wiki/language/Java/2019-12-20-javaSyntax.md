---
layout: article
title: "Java Syntax"
tags: java wiki syntax
aside:
  toc: true
---

## 0. 들어가며

### 0.1 대상 독자의 기대 수준

- 국비 학원 수료한 정도
- 비전공자
- Java 언어로 Hello world 정도는 할 줄암
- Java 언어로 별찍기 정도는 할 줄암



### 0.2 학습 후의 독자 분의 예상 능력치

- [ ] Java 언어 Concept에 대한 이해
  - [ ] 프로그래밍 언어 상의 맥락(은 다른 포스트에서 다룰 것)
  - [ ] Java의 버젼
- [ ] Java 문법에 대한 이해
- [ ] Java 프로그래밍에 대한 이해
- [ ] Java GUI mini 프로젝트 완성



## 1. Java

- Java는 프로그래밍 언어

- Compile 언어

- [James Gosling](https://www.linkedin.com/in/jamesgosling/)이 만든 언어

- > Write once, run everywhere!



## 2. Java Syntax

### 2.8. Generics
#### 2.8.1 제네릭은 무엇인가?
- 아래와 같이 생긴 코드를 본 적이 있을 것이다.
    ```java
    List<String> list = new ArrayList<>();
    ```

- 여기서 `<String>` 이 부분을 제네릭(Generic)이라고 한다.

#### 2.8.2 제네릭의 사용법

##### 2.8.2.1 타입 추론 <?>

- [stackoverflow](https://stackoverflow.com/questions/11392380/generics-what-does-actually-mean)

  - > `<?>` is a shorthand for `<? extends Object>`, it's also known as an *unbounded wildcard*. So you can specify any type of object in your generic.

- [ ] 타입추론이 자동으로 실행 되는 경우는 어떤 경우인지?

#### 2.8.3 제네릭을 왜 사용하는가?
#### 2.8.4 제네릭은 어떻게 동작하는가?




