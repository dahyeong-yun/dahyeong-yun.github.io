---
title: 스프링 트랜잭션의 체크 예외 롤백 정책과 언어 설계자들의 역사적 배경
description: 스프링 @Transactional이 기본적으로 체크 예외를 롤백하지 않고 커밋하는 이유와 EJB 규약, 자바 언어 설계자들의 역사적 배경 및 공식 문헌 고찰
aliases: [트랜잭션 체크 예외 롤백, Checked Exception 롤백 미적용, Application Exception, DefaultTransactionAttribute rollbackOn]
tags: [java, spring, transaction, exception, ejb, kotlin]
created: 2026-09-09
updated: 2026-09-09
status: seed
draft: true
---

스프링 프레임워크의 `@Transactional`은 메서드 실행 중 예외가 발생했을 때 **언체크 예외(`RuntimeException`)와 `Error`는 즉시 롤백(Rollback)**하지만, **체크 예외(`Exception` 계열 중 `RuntimeException` 제외)는 롤백하지 않고 커밋(Commit)**한다.

이 동작은 직관과 달라 실무에서 데이터 정합성을 깨뜨리는 치명적인 버그의 원인이 되곤 한다. 스프링의 내부 소스코드 구현과 20년 전 엔터프라이즈 자바(EJB) 설계자들의 역사적 철학, 그리고 현대 프로그래밍 언어 거장들의 평가를 살펴본다.

---

## 1. 스프링 내부 구현: 체크 예외가 롤백되지 않는 코드

스프링 AOP 트랜잭션 인터셉터인 `TransactionAspectSupport`와 트랜잭션 속성을 정의하는 `DefaultTransactionAttribute`를 보면 그 동작이 명확히 드러난다.

### ① 트랜잭션 예외 가로채기 (`TransactionAspectSupport.java`)

```java
// TransactionAspectSupport.java (핵심 템플릿 로직 정제)
protected Object invokeWithinTransaction(Method method, Class<?> targetClass, 
                                         InvocationCallback invocation) throws Throwable {
    TransactionInfo txInfo = createTransactionIfNecessary(ptm, txAttr, joinpointIdentification);

    Object retVal;
    try {
        // 실제 비즈니스 로직(타깃 메서드) 실행
        retVal = invocation.proceedWithInvocation();
    }
    catch (Throwable ex) {
        // 예외 발생 시 트랜잭션 후처리 (커밋할지 롤백할지 판단)
        completeTransactionAfterThrowing(txInfo, ex);
        throw ex; // 예외를 호출자에게 다시 던짐
    }

    commitTransactionAfterReturning(txInfo); // 정상 종료 시 커밋
    return retVal;
}

protected void completeTransactionAfterThrowing(TransactionInfo txInfo, Throwable ex) {
    // ★ rollbackOn(ex)의 반환값에 따라 롤백 여부 결정
    if (txInfo.transactionAttribute.rollbackOn(ex)) {
        txInfo.getTransactionManager().rollback(txInfo.getTransactionStatus()); // 롤백
    } else {
        txInfo.getTransactionManager().commit(txInfo.getTransactionStatus());   // ★ 커밋! (롤백 안 됨)
    }
}
```

### ② 결정적 한 줄: `DefaultTransactionAttribute.rollbackOn()`

```java
// DefaultTransactionAttribute.java
public class DefaultTransactionAttribute extends DefaultTransactionDefinition implements TransactionAttribute {

    @Override
    public boolean rollbackOn(Throwable ex) {
        // ★ 바로 이 한 줄이 체크 예외가 롤백되지 않는 이유다.
        // 오직 RuntimeException(언체크 예외)과 Error일 때만 true(롤백)를 반환한다.
        return (ex instanceof RuntimeException || ex instanceof Error);
    }
}
```

체크 예외(`IOException`, `SQLException`, 개발자가 `extends Exception`으로 선언한 예외 등)가 던져지면 `rollbackOn()`은 `false`를 반환하며, 트랜잭션 매니저는 **롤백 대신 커밋(`commit`)을 실행**한다.

---

## 2. 설계자들은 왜 이런 선택을 했는가? (EJB의 역사적 철학)

스프링의 트랜잭션 추상화는 스프링 이전의 엔터프라이즈 자바 표준이었던 **EJB(Enterprise JavaBeans) CMT(Container-Managed Transactions) 규약**의 철학을 그대로 계승했다. 당시 설계자들은 예외의 성격을 둘로 엄격히 구분했다.

| 구분 | 개념 | 대표 예시 | 트랜잭션 기본 동작 |
| :--- | :--- | :--- | :--- |
| **System Exception** | **시스템 장애, 버그, 인프라 결함**<br/>(복구 불가능) | `NullPointerException`<br/>`OutOfMemoryError`<br/>`CannotGetJdbcConnectionException` | **즉시 롤백** |
| **Application Exception** | **비즈니스 도메인 업무 규칙 위반**<br/>(복구 가능) | `InsufficientBalanceException` (잔액 부족)<br/>`SeatAlreadyBookedException` (좌석 매진) | **트랜잭션 유지 (커밋)** |

### 설계자들의 의도: "체크 예외는 비즈니스 복구의 기회다"
* 당시 자바 설계자들은 체크 예외를 치명적인 시스템 오류로 보지 않고, **"호출자(클라이언트)가 `try-catch`로 잡아서 대안 흐름(Alternative Flow)을 수행할 수 있는 정상적인 업무 분기"**로 보았다.
* 예: 계좌 잔액 부족(`InsufficientBalanceException`) 체크 예외가 발생하면, 호출자는 이 예외를 잡아서 다른 카드 결제로 유도하거나 마일리지를 차감하는 등 **업무를 복구하여 정상 커밋시킬 기회**가 주어져야 한다.
* 만약 프레임워크가 체크 예외를 보자마자 트랜잭션을 강제로 롤백(SetRollbackOnly)시켜 버리면, 상위 호출자가 예외를 잡아서 복구 작업을 하려 해도 이미 트랜잭션이 파괴되어 아무것도 할 수 없게 된다.
* 따라서 **"비즈니스 복구 기회를 보장하기 위해 프레임워크가 함부로 롤백하지 않고 개발자의 명시적 제어에 맡긴다"**는 철학을 취한 것이다.

---

## 3. 언어 설계자들의 이상과 현실적 몰락 (문헌적 근거)

초기 자바(1995년) 설계자들의 이상과 달리, 대규모 소프트웨어가 발전하면서 체크 예외는 소프트웨어 공학계에서 **"실패한 언어 실험"**이라는 평가를 받게 되었다.

### ① 제임스 고슬링의 초기 자부심 (1995~2003)
* **문헌**: Artima 인터뷰, *《Failure and Exceptions: A Conversation with James Gosling》* (2003)[^gosling-interview]
* 자바의 창시자 제임스 고슬링은 C/C++에서 개발자들이 함수의 반환 에러 코드(-1, NULL 등)를 확인하지 않고 무시하여 버그가 발생하는 문제를 해결하기 위해, 컴파일러가 강제하는 체크 예외를 도입했다.
> *"C에서는 사람들이 반환 에러 코드를 그냥 무시하곤 했습니다. (...) 체크 예외는 개발자가 예외를 처리(catch)하거나 선언(throws)하도록 컴파일러가 강제합니다. 우리는 이것이 소프트웨어의 신뢰성을 대단히 높여줄 것이라 확신했습니다."*

### ② 브루스 에켈의 공식 선언: "실패한 실험"
* **문헌**: 에세이 *《Does Java need Checked Exceptions?》* (2001, 『Thinking in Java』 저자)[^bruce-eckel]
> *"Checked exceptions were an experiment. **The experiment failed.**"*  
> (체크 예외는 하나의 실험이었다. **그리고 그 실험은 실패했다.**)
* 작은 규모의 코드에서는 완벽해 보이지만, 대규모 시스템에서는 메서드 시그니처마다 수십 개의 `throws`가 연쇄 전파되고, 결국 개발자들은 컴파일 에러를 끄기 위해 예외를 삼켜버리는(`catch (Exception e) {}`) 최악의 안티패턴을 낳는다고 지적했다.

### ③ 앤더스 헤일스버그의 C# 설계 결단
* **문헌**: Artima 인터뷰, *《The Trouble with Checked Exceptions: A Conversation with Anders Hejlsberg》* (2003, C# 및 TypeScript 창시자)[^anders-interview]
* C#을 만들 때 자바의 체크 예외를 의도적으로 배제한 이유를 다음과 같이 밝혔다.
> *"자바의 체크 예외는 대단한 아이디어처럼 보이지만, **실제로는 재앙(disaster)에 가깝습니다.** 대규모 시스템에서 체크 예외는 확장성(Scalability)과 버전 호환성을 심각하게 파괴합니다."*

### ④ 로드 존슨의 스프링 혁신 (2002)
* **문헌**: 『Expert One-on-One J2EE Design and Development』 (2002, 스프링의 모태가 된 서적) 4장[^rod-johnson]
* 로드 존슨은 자바 표준 JDBC의 `SQLException`이 체크 예외로 설계된 것을 맹렬히 비판했다. 개발자가 코드 수준에서 복구할 수 없는 SQL 문법 에러나 커넥션 장애를 체크 예외로 강제해 보일러플레이트만 양산한다는 지적이었다.
* 스프링은 모든 JDBC 체크 예외를 `DataAccessException`(**언체크 예외**)으로 래핑하여 다시 던지도록 혁신했고, 이는 스프링이 EJB를 대체하는 결정적 계기가 되었다.

### ⑤ 코틀린(Kotlin)의 결론
* **문헌**: 코틀린 공식 문서 *〈Exceptions〉*[^kotlin-docs]
> *"Kotlin does not have checked exceptions."*  
> (코틀린에는 체크 예외가 없습니다.)

---

## 4. 실무에서 발생하는 부작용과 현대적 해결책

### 부작용: 부분 커밋(Partial Commit)과 데이터 정합성 파괴
비즈니스 로직 중 일부 데이터베이스 변경을 수행한 후, 외부 I/O나 라이브러리 호출 중 `IOException`, `ParseException` 같은 자바 표준 체크 예외가 발생했다고 가정해 보자.
* 개발자는 "예외가 컨트롤러나 상위로 전파되었으니 당연히 롤백되었겠지"라고 기대한다.
* 하지만 스프링 트랜잭션 기본 규칙에 따라 **앞선 DB 작업은 그대로 커밋(Partial Commit)**된다.
* 결과적으로 비즈니스는 실패 응답(HTTP 500 등)을 냈는데, DB에는 불완전한 상태로 데이터가 저장되어 심각한 정합성 장애가 발생한다.

### 현대 실무의 권장 해결책

#### 1) `@Transactional(rollbackFor = Exception.class)` 명시
체크 예외를 포함한 모든 `Exception` 발생 시 안전하게 롤백되도록 옵션을 명시한다.
```java
@Transactional(rollbackFor = Exception.class)
public void executeOrder() {
    // 체크 예외가 발생하더라도 데이터 정합성을 지키며 롤백됨
}
```

#### 2) 비즈니스 예외도 `RuntimeException`으로 설계
과거 EJB 스타일의 `extends Exception` 관례를 버리고, 모든 커스텀 도메인 예외를 언체크 예외로 선언한다.
```java
// 현대적인 비즈니스 예외 설계 표준
public class InsufficientBalanceException extends RuntimeException {
    public InsufficientBalanceException(String message) {
        super(message);
    }
}
```

---

## 관련 문서

- [[spring-aop-proxy-creation-lifecycle|스프링 AOP 프록시 생성 시점과 판단 메커니즘]]
- [[aop-weaving-mechanisms|AOP 위빙(Weaving)의 개념과 3가지 방식]]
- [[deep-dive-into-lombok-sneaky-throws|Lombok @SneakyThrows의 원리: AST 조작부터 제네릭 타입 소거 트릭까지]]

---

## 참고 문헌

[^gosling-interview]: Bill Venners, *Failure and Exceptions: A Conversation with James Gosling, Part II*, Artima Developer, 2003.
[^bruce-eckel]: Bruce Eckel, *Does Java need Checked Exceptions?*, 2001.
[^anders-interview]: Bill Venners, *The Trouble with Checked Exceptions: A Conversation with Anders Hejlsberg, Part II*, Artima Developer, 2003.
[^rod-johnson]: Rod Johnson, *Expert One-on-One J2EE Design and Development*, Wrox, 2002.
[^kotlin-docs]: JetBrains, *Kotlin Language Documentation - Exceptions*, official kotlinlang.org.
