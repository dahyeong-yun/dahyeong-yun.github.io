---
title: Static vs Singleton — 스프링은 왜 static 대신 싱글톤 빈을 사용하는가
description: 단일 인스턴스 공유라는 공통점 뒤에 숨겨진 객체지향 다형성, 스프링 AOP 프록시, 생명주기 관리의 본질적 차이
aliases: [스태틱 vs 싱글톤, static vs singleton, 싱글톤 빈 이유]
tags: [spring, java, oop, design-pattern]
created: 2026-09-09
updated: 2026-09-09
status: seed
draft: true
---

# Static vs Singleton — 스프링은 왜 static 대신 싱글톤 빈을 사용하는가

스프링 프레임워크를 처음 접하면 누구나 다음과 같은 의문을 갖게 된다:

> *"어차피 싱글톤 빈도 애플리케이션 전체에서 딱 1개 객체만 돌려쓰는데, 그럴 거면 모든 메서드와 필드를 `static`으로 만들어버리면 되지, 왜 굳이 빈(Bean) 등록이니 DI(의존성 주입)니 하면서 번거롭게 관리할까?"*

겉보기에는 "프로세스 내에 1개만 존재한다"는 점이 비슷해 보이지만, 객체지향 설계와 프레임워크의 관점에서는 완전히 다른 세계이다.

---

## 1. 본질적인 개념 비교

| 구분 | **스태틱 (Static)** | **스프링 싱글톤 빈 (Singleton Bean)** |
| :--- | :--- | :--- |
| **정체** | **객체가 아님!** 클래스(설계도)에 직접 붙어있는 고정 함수/변수 | **진짜 객체(인스턴스)!** 힙(Heap)에 딱 1개만 생성된 실체 |
| **생성 시점** | 클래스가 JVM에 로딩될 때 Method Area에 등록 | 스프링 컨테이너 기동 시점에 `new`로 인스턴스화 |
| **객체지향 다형성** | **불가능** (인터페이스 구현 불가, 오버라이딩 불가) | **완벽 지원** (인터페이스 기반 구현체 교체, 다형성) |
| **프록시 / AOP** | **적용 불가** (상속 및 동적 프록시 래핑 불가) | **완벽 지원** (`@Transactional`, `@Async` 등) |
| **생명주기 관리** | 종료 훅 및 리소스 안전 해제 메커니즘 없음 | `@PostConstruct`, `@PreDestroy`, Graceful Shutdown 지원 |

---

## 2. 왜 `static`으로 애플리케이션을 만들면 안 되는가?

### ① 부품을 '갈아끼우는 것(다형성과 DI)'이 불가능해진다
만약 서비스를 `static`으로 작성하면:
```java
public class TodoService {
    public static Todo createTodo(String title, Long userId) {
        // static 메서드는 다른 static 클래스를 직접 하드코딩해서 호출해야 함!
        return JdbcTodoRepository.save(new Todo(userId, title)); 
    }
}
```
* `TodoService`는 영원히 `JdbcTodoRepository`와 강하게 결합(Tightly Coupled)된다.
* 테스트할 때 DB 없이 빠른 `InMemoryTodoRepository`로 교체하고 싶어도 코드를 수정하지 않는 한 불가능하다.
* 반면 **싱글톤 빈**은 똑같이 1개만 사용하더라도 인터페이스(`TodoRepository`)를 바라보므로, 설정에 따라 JDBC든 InMemory든 자유롭게 갈아끼울 수 있다(DI).

### ② 스프링의 핵심 기능(프록시, 트랜잭션, AOP)이 전부 무력화된다
스프링의 `@Transactional`은 해당 클래스를 상속받은 **동적 프록시(Proxy) 객체**를 몰래 끼워 넣어 트랜잭션을 제어한다:

```
[클라이언트 호출] ➔ [스프링이 만든 Proxy 객체] ➔ [진짜 Bean 객체]
                          ├─ 트랜잭션 시작 (BEGIN)
                          ├─ 진짜 비즈니스 로직 실행
                          └─ 정상 시 COMMIT / 예외 시 ROLLBACK
```

하지만 **`static` 메서드는 상속도 안 되고 오버라이딩(재정의)도 안 된다.**  
스프링이 프록시 껍데기를 씌울 수 있는 방법이 원천적으로 없으므로, `@Transactional`, 보안 검증, 캐싱(`@Cacheable`) 등의 AOP 부가기능이 전혀 동작하지 않는다.

### ③ 리소스 생명주기(Lifecycle) 관리가 불가능하다
* **싱글톤 빈**: 서버가 뜰 때 DB 커넥션 풀을 안전하게 맺고(`@PostConstruct`), 배포나 서버 종료 시 진행 중이던 요청을 안전하게 마무리한 뒤 커넥션을 닫는다(`@PreDestroy`).
* **스태틱**: 클래스 로딩 시 한 번 뜨면 그만이며, 서버 종료 시점에 커넥션 누수 없이 리소스를 안전하게 해제하는 표준화된 라이프사이클 훅이 없다.

---

## 3. 한 줄 비유

* **스태틱**: 냉장고와 세탁기를 집 벽에 **콘크리트로 완전히 파묻어 시공한 집**.  
  (1대만 쓰긴 하지만, 제품을 바꾸거나 수리하려면 집 벽을 부숴야 함)
* **스프링 싱글톤 빈**: 표준 규격 콘센트(인터페이스)에 **1대만 꽂아두고 쓰는 가전제품**.  
  (평소엔 1대만 쓰지만, 테스트할 때나 제품을 업그레이드할 때 플러그만 쏙 뽑아서 새 걸로 교체 가능!)

---

## 4. 그렇다면 `static`은 언제 쓰는가?

`static`은 상태(State)가 없고, 다형성이나 프록시가 필요 없는 **순수 함수(Pure Function)나 유틸리티 클래스**에 적합하다:
* `Math.max(a, b)`, `Collections.sort(list)`
* SLF4J의 `MDC.put()`, `MDC.get()` (내부적으로 ThreadLocal을 호출하여 스레드별 격리를 제공하는 정적 파사드)

---

## 관련 문서
* [[jvm-memory-model-stack-vs-heap]]
* [[mapped-diagnostic-context]]
* [[threadlocal]]
* [[spring-dependency-injection]]
