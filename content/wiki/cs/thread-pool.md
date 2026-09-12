---
title: 스레드 풀 (Thread Pool)
description: 스레드 생성 오버헤드를 줄이고 한정된 컴퓨팅 자원을 안전하게 재사용하기 위한 작업 큐 기반 스레드 관리 모델
aliases: [스레드풀, thread pool, ThreadPoolExecutor, ExecutorService]
tags: [cs, concurrency, os]
created: 2026-09-09
updated: 2026-09-09
status: seed
draft: true
---

# 스레드 풀 (Thread Pool)

스레드 풀(Thread Pool)은 다수의 스레드를 미리 생성하여 보관해 두고, 새로운 작업이 들어올 때마다 대기 중인 스레드에 작업을 할당하여 처리한 뒤 다시 회수하여 **재사용(Reuse)**하는 동시성 제어 패턴이다.

---

## 1. 왜 필요한가? (스레드 생성 비용 문제)

운영체제(OS)에서 플랫폼 스레드(Kernel Thread)를 새로 생성하고 파괴하는 작업은 매우 무거운 연산이다.

1. **메모리 할당 비용**:
   - Java 플랫폼 스레드는 생성될 때마다 기본 약 1MB 크기의 전용 호출 스택(Call Stack) 메모리를 OS로부터 할당받는다.
2. **OS 시스템 콜(System Call) 및 컨텍스트 스위칭**:
   - 스레드 생성은 유저 모드에서 커널 모드로의 전환(System Call)을 필요로 하며, 스레드 개수가 무분별하게 늘어나면 CPU가 실제 연산 대신 스레드 간 전환(Context Switching)에 대부분의 시간을 낭비하는 쓰래싱(Thrashing)이 발생한다.
3. **리소스 고갈 방지 (자원 보호)**:
   - 트래픽이 폭증할 때 매 요청마다 스레드를 새로 만들면 시스템 메모리가 고갈되어 `OutOfMemoryError: unable to create new native thread`로 서버 전체가 다운된다. 스레드 풀은 **동시에 실행 가능한 작업자 수를 제한하여 서버를 보호**한다.

---

## 2. 기본 아키텍처 및 동작 메커니즘

스레드 풀은 전형적인 **생산자-소비자(Producer-Consumer) 패턴**과 블로킹 큐(Blocking Queue)를 기반으로 동작한다.

```mermaid
flowchart LR
    Client([클라이언트 작업 요청]) -->|submit| Queue[작업 큐 (BlockingQueue)]
    subgraph Pool [스레드 풀 (Thread Pool)]
        W1[워커 스레드 1]
        W2[워커 스레드 2]
        W3[워커 스레드 3]
    end
    Queue -->|task 할당| W1
    Queue -->|task 할당| W2
    Queue -->|task 할당| W3
    W1 -.->|작업 완료 후 대기| Pool
    W2 -.->|작업 완료 후 대기| Pool
    W3 -.->|작업 완료 후 대기| Pool
```

### 동작 순서:
1. 클라이언트(호출자)가 작업을 풀에 제출(`submit()`)한다.
2. 풀 내부의 가용 워커 스레드가 있다면 즉시 작업을 실행한다.
3. 모든 워커 스레드가 바쁘다면 작업은 **작업 큐(BlockingQueue)**에 쌓여 대기한다.
4. 스레드가 현재 작업을 끝마치면 스레드를 파괴(종료)하지 않고, 작업 큐에서 다음 대기 중인 작업을 꺼내와 실행한다.

---

## 3. 스레드(Thread) vs 스레드 로컬(ThreadLocal) vs 스레드 풀(Thread Pool)

세 개념은 이름이 유사하여 혼동하기 쉽지만 전혀 다른 역할을 수행한다.

| 개념 | 비유 | 본질 | 주된 목적 |
| :--- | :--- | :--- | :--- |
| **Thread** | 일하는 **직원 (일꾼)** | 실행 주체 | 코드를 CPU 상에서 실제로 실행 |
| **ThreadLocal** | 직원의 앞치마에 달린 **개인 주머니** | 데이터 저장소 | 스레드마다 독립적인 상태 격리 보관 |
| **Thread Pool** | 직원들이 모여 대기하는 **인력 대기실** | 자원 관리 시스템 | 스레드를 미리 뽑아두고 효율적으로 재사용 |

---

## 4. 스레드 풀을 쓰는데 ThreadLocal을 안 쓸 수 있는가?

**당연히 가능하며, 상태가 없는(Stateless) 대부분의 작업에서는 ThreadLocal을 쓰지 않는 것이 원칙이다.**

1. **상태 없는(Stateless) 연산**:
   - 10만 건의 이미지 썸네일 변환, 엑셀/PDF 다운로드 파일 생성 등.
   - 작업에 필요한 모든 데이터가 파라미터(`Runnable`/`Callable`)로 전달되므로, 스레드의 개인 주머니(`ThreadLocal`)에 아무것도 남길 필요가 없다.
2. **ThreadLocal을 함께 쓸 때의 주의점**:
   - 스레드가 재사용되는 특성 때문에, 이전 작업자가 주머니를 비우지 않으면(`remove()`) 다음 작업자가 이전 작업의 잔여 데이터를 읽어버리는 **데이터 오염 및 메모리 누수**가 발생한다.

---

## 5. Java ThreadPoolExecutor 핵심 구성 요소

```java
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    corePoolSize,      // 기본 유지 스레드 수
    maximumPoolSize,   // 최대 허용 스레드 수
    keepAliveTime,     // core 초과 스레드의 유휴 대기 시간
    TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(100), // 작업 대기 큐
    new ThreadPoolExecutor.CallerRunsPolicy() // 거부 정책 (큐 포화 시)
);
```

* **corePoolSize**: 풀에 항상 살려두는 최소 일꾼 수.
* **maximumPoolSize**: 큐까지 가득 찼을 때 일시적으로 증원할 수 있는 최대 일꾼 수.
* **RejectedExecutionHandler**: 큐도 가득 차고 최대 스레드도 모두 일하고 있을 때 새로운 작업을 어떻게 처리할지 결정하는 정책(`AbortPolicy`, `CallerRunsPolicy` 등).

---

## 관련 문서
* [[threadlocal]]
* [[thread-per-request-model]]
* [[connection-pool-exhaustion]]
