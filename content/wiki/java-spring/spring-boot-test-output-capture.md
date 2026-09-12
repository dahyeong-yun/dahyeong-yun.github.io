---
title: Spring Boot OutputCaptureExtension을 활용한 로그 및 시스템 출력 검증
description: JUnit 5 환경에서 로거(Logback) Mocking 없이 System.out과 콘솔 로그를 가로채어 검증하는 OutputCaptureExtension의 동작 원리와 보안 회귀 테스트 패턴
aliases: [OutputCaptureExtension, CapturedOutput, 로그 테스트, Spring Boot 로그 테스트, 시스템 출력 캡처]
tags: [spring-boot, testing, junit5, logging, logback, security]
created: 2026-09-10
updated: 2026-09-10
status: seed
draft: true
---

# Spring Boot OutputCaptureExtension을 활용한 로그 및 시스템 출력 검증

단위 테스트나 통합 테스트를 작성할 때 비즈니스 로직의 반환값뿐만 아니라, **"특정 예외 상황에서 의도한 로그가 WARN/ERROR 레벨로 올바르게 찍혔는가?"** 혹은 **"사용자 비밀번호나 인증 토큰 같은 민감정보가 로그에 노출되지 않았는가?"**를 검증해야 하는 경우가 많다.

전통적인 방식에서는 Logback의 `Appender` 인터페이스를 구현한 커스텀 목(Mock) 객체를 만들어 로거에 부착하거나 복잡한 리플렉션을 사용해야 했다.

Spring Boot는 이를 간편하게 해결할 수 있도록 JUnit 5 확장 도구인 **`OutputCaptureExtension`**과 **`CapturedOutput`**을 제공한다[^spring-test-output].

---

## 1. 동작 원리 (어떻게 콘솔 로그를 가로채는가?)

`OutputCaptureExtension`은 JVM 수준의 표준 출력(`System.out`)과 표준 에러(`System.err`)를 프록시 스트림으로 교체(Swap)하여 메모리 버퍼에 기록한다.

```mermaid
flowchart LR
    subgraph AppLogic [애플리케이션 실행]
        LogCall["log.info(...)<br>System.out.println(...)"]
    end

    subgraph InterceptorTier [OutputCaptureExtension]
        Hook["System.setOut(CaptureStream)"]
        Buffer[("ByteArrayOutputStream<br>(메모리 버퍼)")]
    end

    subgraph Verification [JUnit 5 테스트 단언]
        CapturedOutput["CapturedOutput output<br>output.getAll()"]
        Assert["assertThat(...).contains()<br>assertThat(...).doesNotContain()"]
    end

    LogCall --> Hook
    Hook -->|복사 기록| Buffer
    Hook -->|실제 콘솔 전달| RealConsole["실제 IDE/터미널 콘솔"]
    Buffer --> CapturedOutput
    CapturedOutput --> Assert
```

1. **테스트 시작 전 (`beforeEach`)**:
   - `OutputCaptureExtension`이 원래의 `System.out`과 `System.err`를 백업해 두고, 가로채기용 스트림(`OutputCaptureStream`)을 `System.setOut()` 및 `System.setErr()`로 등록한다.
2. **테스트 실행 중**:
   - Spring Boot의 기본 로깅 프레임워크인 Logback의 `ConsoleAppender`가 `System.out`으로 로그 메시지를 쓴다.
   - 가로채기 스트림은 들어온 모든 바이트를 내부의 `ByteArrayOutputStream` 메모리 버퍼에 저장하는 동시에, 개발자가 테스트 진행 상황을 볼 수 있도록 실제 콘솔에도 그대로 흘려보낸다.
3. **테스트 파라미터 주입**:
   - 테스트 메서드의 파라미터로 선언된 `CapturedOutput output` 인터페이스에 현재까지 버퍼에 쌓인 전체 출력 문자열을 읽을 수 있는 핸들러를 주입한다.
4. **테스트 완료 후 (`afterEach`)**:
   - 백업해 두었던 원래의 `System.out`과 `System.err`를 복원하여 다른 테스트나 JVM 전역 환경을 오염시키지 않는다.

---

## 2. 실무 테스트 패턴

### 1) 기본 설정 및 에러 로그 발생 검증
`@ExtendWith(OutputCaptureExtension.class)`를 테스트 클래스 또는 메서드에 선언하고, 테스트 메서드 파라미터로 `CapturedOutput`을 받기만 하면 된다.

```java
@SpringBootTest
@ExtendWith(OutputCaptureExtension.class)
class OrderServiceLoggingTest {

    @Autowired
    private OrderService orderService;

    @Test
    @DisplayName("재고 부족 예외 발생 시 WARN 레벨 로그와 주문 ID가 출력된다")
    void orderFail_logsWarnMessage(CapturedOutput output) {
        // when
        assertThatThrownBy(() -> orderService.placeOrder(999L, -1))
                .isInstanceOf(OutOfStockException.class);

        // then: 로그 메시지 출력 단언
        assertThat(output.getAll())
                .contains("WARN")
                .contains("OutOfStockException 발생: 재고가 부족합니다 (id: 999)");
    }
}
```

### 2) [[application-security-logging-and-actuator-hardening|보안 회귀 테스트]]: 민감정보 미노출 단언 (`doesNotContain`)
`OutputCaptureExtension`의 진가는 **보안 테스트**에서 발휘된다.  
개발자가 디버깅을 위해 실수로 요청 본문이나 인증 토큰을 로거에 찍도록 코드를 수정하더라도, CI 파이프라인에서 빌드가 즉시 깨지도록 안전장치를 구축할 수 있다.

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ExtendWith(OutputCaptureExtension.class)
class SecurityLoggingIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("HTTP 요청 시 JWT 토큰과 비밀번호가 로그에 남지 않는다")
    void requestLogging_excludesSensitiveData(CapturedOutput output) throws Exception {
        mockMvc.perform(post("/api/login")
                .header("Authorization", "Bearer eyJhbGciOiJIUzI1Ni...")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"user@example.com\",\"password\":\"my-secret-1234\"}"))
                .andExpect(status().isOk());

        String logs = output.getAll();

        // 1. 민감 정보가 로그 어디에도 절대 찍히지 않았음을 단언
        assertThat(logs)
                .doesNotContain("eyJhbGciOiJIUzI1Ni...")
                .doesNotContain("my-secret-1234");

        // 2. 구조화된 정상 메타데이터만 로깅되었음을 확인
        assertThat(logs)
                .contains("HTTP POST /api/login status=200");
    }
}
```

### 3) [[mapped-diagnostic-context|MDC]] `requestId` 일관성 검증
응답 헤더, 에러 응답 본문, 그리고 서버 콘솔 로그의 3곳에 동일한 `requestId`가 출력되는지 단언 검증할 수 있다.

```java
@Test
void requestId_traceConsistency(CapturedOutput output) throws Exception {
    String traceId = "client-trace-999";

    MvcResult result = mockMvc.perform(get("/users/not-found")
            .header("X-Request-Id", traceId))
            .andExpect(status().isNotFound())
            .andExpect(header().string("X-Request-Id", traceId))
            .andReturn();

    // 에러 JSON 본문 검증
    assertThat(result.getResponse().getContentAsString())
            .contains("\"requestId\":\"" + traceId + "\"");

    // 콘솔 로그의 MDC 포맷 검증
    assertThat(output.getAll())
            .contains("[requestId=" + traceId + "]");
}
```

---

## 3. 실무 주의사항 및 한계점

1. **병렬 테스트(Parallel Test Execution) 시 로그 오염**:
   - `System.out`은 JVM 전역(Process-wide) 자원이다.
   - JUnit 5의 병렬 테스트(`junit.jupiter.execution.parallel.enabled=true`) 환경에서는 **동시에 실행 중인 다른 스레드의 테스트 로그까지 동일한 `CapturedOutput` 버퍼에 섞여 들어올 수 있다.**
   - 따라서 정밀한 로그 검증 테스트는 병렬 격리(`@Isolated` 또는 `@ResourceLock`)를 부여해야 한다.
2. **파일 전용 Appender(`FileAppender`) 미캡처**:
   - `OutputCaptureExtension`은 오직 **표준 출력(`System.out` / `System.err`)으로 전달되는 콘솔 로그만 가로챈다.**
   - 로깅 설정이 파일(`rollingFileAppender`)이나 네트워크 직송(Logstash TCP Appender)으로만 전송되도록 분리되어 있다면 해당 로그는 캡처되지 않는다.
3. **대용량 로그 출력 시 메모리 부하**:
   - `output.getAll()`은 테스트 실행 동안 발생한 모든 콘솔 출력을 힙 메모리에 누적하므로, 수십만 줄의 로그를 뿜는 부하 테스트에서는 OutOfMemoryError에 유의해야 한다.

---

## 관련 문서
* [[mapped-diagnostic-context]]
* [[application-security-logging-and-actuator-hardening]]
* [[centralized-logging-architecture]]

---

## 참고 자료
[^spring-test-output]: [Spring Boot Reference - OutputCaptureExtension](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/system/OutputCaptureExtension.html)
