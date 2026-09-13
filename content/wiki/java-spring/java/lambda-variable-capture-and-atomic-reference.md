---
title: 자바 람다 변수 캡처링과 AtomicReference
description: 람다식에서 외부 지역 변수의 Effectively Final 제약 이유와 AtomicReference를 통한 가변 상태 전달 원리
aliases: [람다 캡처링, lambda variable capture, effectively final, AtomicReference 람다]
tags: [java, lambda, concurrency, memory]
created: 2026-09-09
updated: 2026-09-09
status: seed
draft: true
---

# 자바 람다 변수 캡처링과 AtomicReference

자바에서 람다식(Lambda Expression)을 작성하다 보면 외부 지역 변수를 수정하려 할 때 다음과 같은 컴파일 에러를 마주치게 된다:

> `Variable used in lambda expression should be final or effectively final`

이 제약이 왜 발생하며, `AtomicReference`는 이를 어떻게 우아하게 해결하는지 JVM 메모리 관점에서 살펴본다.

---

## 1. 람다 변수 캡처링(Variable Capture)의 배경

### ① 수명(Lifecycle)의 모순: 스택 vs 힙
* **메서드 지역 변수**: 메서드가 실행되는 **스택(Stack)** 메모리에 생성되며, 메서드가 끝나면(`return`) 즉시 파괴된다.
* **람다식**: 단순한 코드 블록이 아니라 **힙(Heap)에 생성되는 독립된 인스턴스**이다. 람다는 다른 스레드로 넘겨지거나 나중에 비동기로 실행될 수 있으므로, 자기를 만들어 준 메서드가 끝난 뒤에도 오랫동안 살아남는다.

만약 람다가 스택에 있는 지역 변수의 주소를 직접 참조하도록 허용한다면, **메서드가 끝나서 이미 파괴된 스택 메모리를 람다가 읽고 쓰는 치명적인 메모리 오염(Dangling Pointer)**이 발생한다.

### ② 해결책: 값 복사(Capture)와 동기화 문제
따라서 자바는 람다가 생성될 때 **스택에 있는 값을 람다 인스턴스 내부의 숨겨진 필드로 복사(Capture)**해 간다.

```java
int number = 10; // 스택에 위치

Runnable r = () -> {
    // 람다는 스택의 number를 직접 보지 않고, 
    // 자기 뱃속으로 복사해 간 10을 사용한다.
    System.out.println(number); 
};
```

그런데 만약 람다 내부에서 `number = 20;`으로 값을 바꾸거나, 바깥에서 `number = 30;`으로 바꿀 수 있다면 어떻게 될까?
* 스택에 있는 `number`와 람다 뱃속의 복사본 `number`는 **서로 다른 독립된 메모리 공간**이다.
* 둘 사이에 값 동기화가 불가능하므로, 한쪽을 고쳐도 다른 쪽이 바뀌지 않는 기괴한 버그가 발생한다.
* 그래서 자바 언어 설계자들은 혼란을 원천 차단하기 위해 **"람다가 복사해 갈 외부 지역 변수는 절대 재할당할 수 없는 `final` 또는 `effectively final`이어야 한다"**고 못 박았다.

---

## 2. 왜 `Integer` 래퍼 클래스는 안 되고 `AtomicReference`는 될까?

많은 개발자가 *"그럼 힙에 생기는 래퍼 클래스(`Integer num = 10;`)를 쓰면 되지 않나?"* 하고 생각한다. 하지만 `num = 20;`을 시도하면 똑같이 에러가 난다.

### ① `Integer`, `String`은 불변(Immutable) 객체이다
자바의 기본 래퍼 클래스는 내부 상태를 변경할 수 없다.  
`num = 20;`을 실행하는 순간 기존 `Integer(10)`이 바뀌는 것이 아니라, **새로운 `Integer(20)` 객체를 힙에 만들고 변수의 참조 주소를 갈아치우는 재할당(=)**이 일어난다. 람다는 바로 이 '재할당'을 금지하므로 사용할 수 없다.

### ② `AtomicReference`는 가변(Mutable) 사물함이다
`AtomicReference`는 변수 자체의 참조 주소는 고정(`final`)해 둔 채, **사물함 문을 열고 내부 알맹이만 쏙 바꿀 수 있는 메서드(`set()`, `get()`)**를 제공한다.

```java
// 변수 ref가 가리키는 사물함 주소는 절대 바뀌지 않음 (final 만족!)
final AtomicReference<String> ref = new AtomicReference<>();

FilterChain filterChain = (req, res) -> {
    // 사물함 주소를 바꾼 게 아니라, 사물함 안의 내용물만 교체!
    ref.set(MDC.get("requestId")); 
};

// 바깥에서도 동일한 사물함을 열어 값을 확인
String result = ref.get();
```

---

## 3. 포스트잇 vs 사물함 비유

| 구분 | 일반 변수 / 불변 래퍼 (`int`, `Integer`) | 가변 래퍼 (`AtomicReference<T>`) |
| :--- | :--- | :--- |
| **비유** | **책상 위에 붙인 포스트잇** | **둘이 함께 쓰는 사물함** |
| **람다의 동작** | 포스트잇에 적힌 글씨를 자기 수첩에 베껴 적음 (값 복사) | 사물함의 **열쇠(주소)**만 수첩에 베껴 적음 |
| **값 수정 시** | 수첩의 글씨를 고쳐봤자 책상 포스트잇은 안 바뀜 ➔ 금지(`final`) | 사물함을 열고 물건을 넣고 뺌 (`set/get`) ➔ 허용 |

---

## 4. 왜 하필 `Atomic`인가?

단순히 1칸짜리 배열(`String[] box = new String[1];`)을 써도 힙 객체이므로 값 전달은 가능하다.

그러나 `AtomicReference`를 권장하는 이유는:
1. **스레드 안전성과 메모리 가시성(Visibility)**: 내부 필드가 `volatile`로 선언되어 있어 멀티스레드 및 비동기 환경에서도 한 스레드가 변경한 값을 다른 스레드가 즉시 정확하게 읽을 수 있다.
2. **코드의 명확한 의도**: "람다나 비동기 콜백 경계를 넘어 단일 값을 안전하게 캡처하여 전달하겠다"는 설계 의도가 명확히 드러난다.

---

## 관련 문서
* [[jvm-memory-model-stack-vs-heap]]
* [[mapped-diagnostic-context]]
* [[servlet-filter-chain]]
