---
title: 애플리케이션 보안 로깅 표준과 Actuator 격리 전략
description: OWASP, 개인정보보호법 기반의 로깅 보안 원칙과 Spring Boot Actuator 취약점(Heapdump 메모리 탈취 등)을 방어하는 4중 격리 아키텍처
aliases: [보안 로깅, 로깅 보안, Security Logging, Actuator 보안, Actuator Hardening, OWASP 로깅]
tags: [security, logging, owasp, spring-boot, actuator, devops]
created: 2026-09-10
updated: 2026-09-10
status: seed
draft: true
---

# 애플리케이션 보안 로깅 표준과 Actuator 격리 전략

애플리케이션 로그는 시스템 장애 분석과 감사(Audit)를 위한 핵심 자산이지만, 동시에 **보안 취약점과 데이터 유출 사고가 가장 빈번하게 발생하는 통로**이다.

많은 조직에서 데이터베이스(DB)에는 강력한 접근 제어와 컬럼 암호화를 적용하면서도, **로그 시스템(ELK, CloudWatch, Datadog 등)이나 관리 엔드포인트(Spring Boot Actuator)는 수많은 개발자·운영자에게 무방비로 열어두는 보안 공백(Blind Spot)**을 만든다.

이 문서는 국제 보안 표준(OWASP, PCI-DSS) 및 국내 법률(개인정보보호법)에 근거한 **보안 로깅 표준**과, 운영 환경에서 **Spring Boot Actuator를 완벽히 격리하는 4중 방어선**을 정리한다.

---

## 1. 보안 로깅 표준 (OWASP & 법률 가이드라인)

```mermaid
flowchart LR
    subgraph Inbound [HTTP 인입 요청]
        Req["Request<br>(Headers, URI, Body)"]
    end

    subgraph FilterTier [화이트리스트 로깅 필터]
        Filter{"로깅 정책 검사"}
    end

    subgraph LogStorage [로그 저장소]
        SafeLog["기록 허용 (White-list)<br>• requestId (추적 키)<br>• HTTP Method & URI<br>• Status Code & Duration<br>• Exception StackTrace"]
        Drop["기록 절대 금지 (Black-list)<br>• Authorization: Bearer JWT<br>• 비밀번호 (평문/해시 불문)<br>• PII (주민번호, 카드번호)<br>• Request/Response Body 전체"]
    end

    Req --> Filter
    Filter -->|메타데이터 추출| SafeLog
    Filter -->|필터링 및 차단| Drop
```

### 1) 절대로 남기면 안 되는 정보 (Do NOT Log)
국제 웹 보안 표준인 **OWASP Logging Cheat Sheet**[^owasp-logging] 및 **개인정보보호법**[^privacy-act]에 따라 아래 항목은 어떠한 경우에도 로그에 남겨서는 안 된다.

1. **인증 및 인가 토큰**:
   - `Authorization: Bearer <JWT>`, 세션 쿠키, API 시크릿 키, OAuth Refresh Token.
   - 로그 시스템 접근 권한을 탈취한 공격자가 즉시 시스템의 모든 사용자 계정을 도용(Account Takeover)할 수 있다.
2. **비밀번호**:
   - 평문 비밀번호뿐만 아니라 단방향 해시(Bcrypt/SHA-256)된 비밀번호도 로그에 남겨서는 안 된다. (무차별 대입 공격 및 레인보우 테이블 공격 표적).
3. **개인식별정보 (PII, Personally Identifiable Information)**:
   - 주민등록번호, 외국인등록번호, 신용카드 번호(PAN)/CVC(PCI-DSS 위반)[^pci-dss], 계좌번호, 건강 정보 등.
   - 개인정보보호법 고시 『개인정보의 안전성 확보조치 기준』 제7조에 따라 평문 저장 엄격 금지 대상이다.
4. **무분별한 HTTP Request/Response Body 전체 덤프**:
   - 디버깅 편의를 위해 서블릿 필터에서 `ContentCachingRequestWrapper` 등으로 요청 본문을 그대로 로깅하는 경우가 흔하다.
   - 이는 본문에 포함된 사용자의 민감 입력값이 고스란히 노출될 뿐만 아니라, 대용량 파일 업로드 시 로그 스토리지를 순식간에 고갈시킨다.

### 2) 반드시 남겨야 할 정보 (What to Log)
장애 조사와 침해 사고 포렌식을 위해 필수로 남겨야 하는 감사 메타데이터이다.

* **고유 추적 식별자 (`requestId` / `traceId`)**: 다중 스레드 및 분산 서버 환경에서 하나의 요청 흐름을 묶어주는 유일한 키 ([[mapped-diagnostic-context|MDC]] 바인딩).
* **요청 메타데이터**: HTTP Method (`GET`, `POST`), 요청 경로 (Request URI), 쿼리 파라미터 (단, PII 제외).
* **응답 메타데이터**: HTTP 상태 코드 (`status=200`, `status=404`), 처리 소요 시간 (`duration=35ms`).
* **예외 및 에러 원인**: 발생한 예외 클래스명, 에러 메시지, 시스템 장애(500) 시의 Root Cause StackTrace.

---

## 2. Spring Boot Actuator의 치명적 위험성

Spring Boot Actuator는 [[google-sre-four-golden-signals|SRE 관측 지표(포화도, 메트릭)]] 수집에 필수적이지만, 기본 설정을 무심코 열어두면 시스템 장악으로 이어진다.

| 엔드포인트 | 노출 시 발생하는 실제 침해 사고 |
| :--- | :--- |
| **`/actuator/heapdump`** | **최악의 취약점.** JVM 힙 메모리 전체 덤프 파일이 다운로드된다. 분석 도구(Eclipse MAT)로 열면 **메모리에 적재되어 있던 사용자의 평문 비밀번호, 활성 JWT 세션 토큰, DB 마스터 패스워드가 100% 노출**된다. |
| **`/actuator/env`** | 애플리케이션의 모든 환경변수와 프로퍼티가 노출된다. 일부 마스킹 처리되더라도 시크릿 키 유출 위험이 높다. |
| **`/actuator/shutdown`** | 외부 공격자가 `POST` 요청 한 번으로 서버 프로세스를 즉시 강제 종료(DoS 공격)시킬 수 있다. |
| **`/actuator/threaddump`** | 현재 실행 중인 스레드의 전체 스택 트레이스를 노출하여 내부 코드 구조와 취약 지점을 노출한다. |

---

## 3. 실무 Actuator 4중 방어선 (Hardening Strategy)

운영 환경에서는 아래 4단계의 방어선을 중첩 적용하여 모니터링 기능은 유지하면서 외부 침입을 완벽히 차단한다.

```mermaid
flowchart TD
    subgraph Layer1 [1단계: 최소 노출]
        A["exposure.include = health, prometheus<br>(heapdump, env 등 원천 비활성화)"]
    end

    subgraph Layer2 [2단계: 포트 분리]
        B["server.port = 8080 (외부 사용자 트래픽)<br>management.server.port = 8081 (모니터링 전용)"]
    end

    subgraph Layer3 [3단계: VPC 사설망 방화벽 격리]
        C["8080 포트: Public ALB 공개<br>8081 포트: VPC Private Subnet 내부만 허용 (Prometheus 수집기)"]
    end

    subgraph Layer4 [4단계: Security 인증]
        D["Spring Security 강제<br>ROLE_SYSTEM_MONITOR 계정의 Basic Auth 또는 mTLS"]
    end

    Layer1 --> Layer2 --> Layer3 --> Layer4
```

### 1단계: 최소 노출 원칙 (`include` 제한)
절대로 `management.endpoints.web.exposure.include=*`를 사용하지 않는다.  
쿠버네티스 헬스체크와 프로메테우스 스크래핑에 필요한 엔드포인트만 화이트리스트로 지정한다.
```properties
# application.properties
management.endpoints.web.exposure.include=health,prometheus
management.endpoint.health.show-details=never
```

### 2단계: 서비스 포트와 관리 포트의 완전 분리
일반 사용자가 접근하는 HTTP 포트와 액추에이터 포트를 분리한다.
```properties
server.port=8080             # 일반 사용자 서비스 포트
management.server.port=8081  # 모니터링 시스템 전용 사설 포트
```

### 3단계: 네트워크 / 방화벽 격리 (가장 확실한 물리적 방어)
* **8080 포트**: 로드 밸런서(ALB)에 연결하여 외부 인터넷(0.0.0.0/0)에 공개.
* **8081 포트**: 로드 밸런서 리스너에서 완전히 배제하고, **AWS Security Group / Kubernetes NetworkPolicy를 통해 사내 VPC Private Subnet의 Prometheus 수집 Pod IP 대역만 접근을 허용**한다. 외부 인터넷에서는 8081 포트로의 연결 자체가 패킷 레벨에서 Drop된다.

### 4단계: Spring Security 기반 내부 인증
부득이하게 단일 포트를 쓰거나 동일 네트워크 내에서 통신할 경우, Spring Security를 적용하여 모니터링 전용 시스템 계정(`ROLE_SYSTEM_MONITOR`)의 인증 없이는 접근할 수 없도록 강제한다.

---

## 4. 검증 자동화: 테스트 코드로 민감정보 유출 방지

보안 로깅은 개발자의 주의에만 의존해서는 안 되며, **CI 파이프라인에서 테스트 코드로 자동 검증**되어야 한다.  
Spring Boot에서는 [[spring-boot-test-output-capture|`OutputCaptureExtension`]]을 활용하여 요청 시 민감정보가 콘솔 로그에 찍히지 않는지 회귀 테스트를 작성할 수 있다.

```java
@Test
@ExtendWith(OutputCaptureExtension.class)
void requestLogging_doesNotContainSensitiveInfo(CapturedOutput output) throws Exception {
    mockMvc.perform(get("/users/1/todos")
            .header("Authorization", "Bearer secret-jwt-token-xyz")
            .content("{\"password\": \"secret1234\"}"))
            .andExpect(status().isOk());

    // 민감 정보 배제 회귀 단언 검증
    assertThat(output.getAll())
            .doesNotContain("secret-jwt-token-xyz")
            .doesNotContain("secret1234")
            .contains("HTTP GET /users/1/todos status=200");
}
```

---

## 관련 문서
* [[mapped-diagnostic-context]]
* [[centralized-logging-architecture]]
* [[google-sre-four-golden-signals]]
* [[spring-boot-test-output-capture]]

---

## 참고 자료
[^owasp-logging]: [OWASP Cheat Sheet Series - Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
[^privacy-act]: [대한민국 개인정보보호위원회 - 개인정보의 안전성 확보조치 기준 고시 제7조](https://www.law.go.kr/행정규칙/개인정보의안전성확보조치기준)
[^pci-dss]: [PCI Security Standards Council - PCI-DSS v4.0 Requirement 3 & 10](https://www.pcisecuritystandards.org/)
