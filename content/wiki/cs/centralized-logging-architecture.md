---
title: 중앙 집중식 로깅 아키텍처 (Centralized Logging Architecture)
description: 분산/다중화 서버 환경에서 흩어진 로그를 수집·저장·인덱싱하여 단일 창구에서 조회하는 파이프라인과 3대 솔루션(ELK, PLG, Datadog) 비교
aliases: [중앙 집중식 로깅, 로그 아키텍처, ELK, Loki, Datadog, centralized logging]
tags: [logging, infra, observability, elk, loki, devops]
created: 2026-09-09
updated: 2026-09-09
status: seed
draft: true
---

# 중앙 집중식 로깅 아키텍처 (Centralized Logging Architecture)

**중앙 집중식 로깅(Centralized Logging)**은 서버가 다중화(Auto-scaling)되거나 여러 마이크로서비스로 분산되어 있을 때, **각 인스턴스 디스크에 흩어지는 로그 파일들을 실시간으로 수집하여 중앙 저장소에 통합하고, 단일 웹 인터페이스에서 검색 및 시각화할 수 있도록 구축한 인프라 파이프라인**이다.

---

## 1. 왜 필요한가? (단일 머신 로깅의 한계)

1. **다중화 및 로드 밸런싱 환경**:
   - `server-1`과 `server-2`로 트래픽이 분산될 때, 사용자의 결제 1단계(인증)는 1번 서버에, 2단계(승인)는 2번 서버에 찍힌다. 개발자가 매번 개별 서버에 SSH로 접속해 로그 파일을 뒤지는 것은 불가능하다.
2. **컨테이너 환경(Docker/Kubernetes)의 휘발성**:
   - 파드(Pod)나 컨테이너가 재시작되거나 삭제되면 로컬 디스크에 남겨진 로그 파일도 함께 영구 유실된다.
3. **통합 검색 및 모니터링**:
   - [[mapped-diagnostic-context|MDC]]로 부여한 단 하나의 `Trace ID`를 검색창에 입력하여, 물리적으로 분리된 여러 서버의 로그를 시간 순으로 꿰어보아야 한다.

---

## 2. 로그 파이프라인의 3단계 구조

모든 중앙 집중식 로깅 시스템은 데이터의 흐름에 따라 3계층으로 구분된다.

```mermaid
flowchart LR
    subgraph AppTier [1. 로그 생산 계층]
        S1[Server 1 (Spring Boot)] -->|파일 쓰기| F1[(app.log)]
        S2[Server 2 (Spring Boot)] -->|파일 쓰기| F2[(app.log)]
    end

    subgraph ShipTier [2. 로그 수집/전송 계층]
        Agent1[수집 에이전트<br>(Filebeat / Promtail)] -.->|테일링| F1
        Agent2[수집 에이전트<br>(Filebeat / Promtail)] -.->|테일링| F2
    end

    subgraph StoreTier [3. 중앙 저장 & 시각화 계층]
        Engine[(중앙 로그 저장소<br>Elasticsearch / Loki)]
        UI[웹 시각화 대시보드<br>Kibana / Grafana]
        Engine --> UI
    end

    Agent1 -->|실시간 스트리밍| Engine
    Agent2 -->|실시간 스트리밍| Engine
```

1. **생산 (Producer)**: 각 애플리케이션이 파일이나 표준 출력(stdout)으로 JSON/텍스트 로그를 출력한다.
2. **수집/전송 (Shipper / Collector)**: 서버마다 상주하는 가벼운 에이전트(`Filebeat`, `Promtail`, `Fluentd`)가 로그 파일의 변경을 실시간으로 감지(Tail)하여 중앙 저장소로 전송한다.
3. **저장 및 시각화 (Storage & Visualization)**: 전송받은 로그를 인덱싱하여 저장하고, 웹 UI 검색창을 통해 검색 및 필터링을 제공한다.

---

## 3. 대표적인 3대 솔루션 비교 분석

| 비교 항목 | ELK 스택 (Elasticsearch) | PLG 스택 (Grafana + Loki) | Datadog (상용 SaaS) |
| :--- | :--- | :--- | :--- |
| **구성 요소** | Filebeat + Elasticsearch + Kibana | Promtail + Loki + Grafana | `datadog-agent` 올인원 |
| **운영 방식** | 자체 구축 (On-premise / Cloud VM) | 자체 구축 (On-premise / Cloud VM) | **클라우드 구독형 (SaaS)** |
| **인덱싱 방식** | **모든 로그 텍스트를 전문(Full-text) 인덱싱** | **라벨(메타데이터)만 인덱싱, 본문은 압축 저장** | 벤더사 클라우드에서 자동 관리 |
| **검색 속도** | **극도로 빠름** (수십억 건 1초 내 검색) | 라벨 필터링 후 검색 (약간 느림) | 매우 빠름 |
| **인프라 비용** | 높음 (막대한 메모리/RAM 및 디스크 요구) | **매우 낮음 (ELK 대비 최대 80% 절감)** | **매우 높음 (트래픽/서버당 과금)** |
| **운영 난이도** | 높음 (샤딩, 클러스터링, 노드 관리 필요) | 보통 (쿠버네티스 친화적) | **극도로 낮음 (설치 즉시 완료)** |

### 1) ELK 스택: "성능과 검색 정밀도가 최우선인 대기업/대규모 시스템"
* 모든 단어를 역색인(Inverted Index)하므로, 아무리 방대한 로그 속에서도 특정 단어나 스택 트레이스를 O(1) 수준으로 즉시 찾아낸다.
* 단, 클러스터를 유지하기 위한 하드웨어 리소스(RAM)와 인프라 엔지니어링 리소스가 많이 든다.

### 2) PLG 스택: "합리적 비용과 가벼운 운영을 원하는 모던 스타트업/MSA"
* 프로메테우스(Prometheus)와 동일한 라벨링 방식으로 동작하여, 로그 텍스트는 gzip으로 압축해 오브젝트 스토리지(S3 등)에 저렴하게 저장한다.
* Grafana 대시보드 하나에서 메트릭(CPU, 트래픽)과 로그를 한 화면에서 교차 분석(Correlation)하기에 가장 최적화되어 있다.

### 3) Datadog: "인프라 운영 인력이 없고 개발 생산성을 극대화해야 하는 환경"
* 에이전트 설치 한 번으로 APM(분산 추적) + 로그 + 서버 메트릭 + 에러 알림이 완벽하게 연동된다.
* 시스템 관리에 시간 쓸 여유가 없을 때 "돈으로 시간을 사는" 최상의 선택지이나, 대규모 트래픽 발생 시 비용 폭탄을 주의해야 한다.

---

## 관련 문서
* [[mapped-diagnostic-context]]
* [[distributed-tracing-context-propagation]]
* [[thread-per-request-model]]
