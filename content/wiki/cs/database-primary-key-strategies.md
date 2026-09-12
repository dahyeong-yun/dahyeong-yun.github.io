---
title: 데이터베이스 기본키(PK) 전략 비교와 B-Tree 인덱스
description: Auto-Increment, UUID v4/v7, Snowflake 등 주요 DB 기본키 채번 전략의 구조와 B-Tree 인덱스 단편화(Page Split) 메커니즘 분석
aliases: [DB PK 전략, 기본키 전략, Primary Key Strategies, UUID v7, Snowflake, ULID]
tags: [database, rdbms, index, b-tree, architecture]
created: 2026-09-09
updated: 2026-09-09
status: seed
draft: true
---

# 데이터베이스 기본키(PK) 전략 비교와 B-Tree 인덱스

관계형 데이터베이스(RDBMS)에서 **기본키(Primary Key, 이하 PK)**는 레코드의 유일성을 보장하는 식별자이자, 대부분의 스토리지 엔진(MySQL InnoDB 등)에서 데이터의 물리적 저장 순서를 결정하는 **클러스터드 인덱스(Clustered Index)**의 기준이 된다. 

어떤 키 생성 전략을 채택하느냐에 따라 **쓰기 처리량(I/O), 인덱스 캐시 효율, 분산 확장성, 보안성**이 근본적으로 결정된다.

---

## 1. B-Tree 인덱스와 PK의 물리적 관계

InnoDB 등 대다수 RDBMS의 클러스터드 인덱스는 PK 값을 기준으로 리프 노드(Leaf Page, 통상 16KB)에 실제 행 데이터(Row Data)를 정렬하여 저장한다.

```mermaid
flowchart TD
    subgraph Sequential [1. 순차 증가 키 (Auto-Increment / UUID v7)]
        direction LR
        P1[Page 1: 1001 ~ 1050] --> P2[Page 2: 1051 ~ 1100]
        P2 --> P3[Page 3: 신규 데이터 Append ➜]
    end

    subgraph Random [2. 무작위 키 (UUID v4)]
        direction TB
        RP1[Page A: 3a..., 7f...] -->|임의 위치 삽입 시도| Split[페이지 용량 초과 ➜ Page Split 발생!]
        Split --> NP1[Page A (50% 데이터)]
        Split --> NP2[Page B (50% 데이터) 신규 할당]
    end
```

1. **순차 키 (Append-only Write)**:
   * 신규 레코드가 항상 맨 마지막 페이지의 끝에 추가되므로 I/O가 순차 쓰기(Sequential Write)로 동작한다.
   * 페이지 분할이 거의 발생하지 않아 디스크 단편화가 없고 버퍼 풀(Buffer Pool) 캐시 적중률이 극대화된다.
2. **무작위 키 (Random Write & Page Split)**:
   * 새 데이터가 기존에 꽉 찬 임의의 페이지 중간에 비집고 들어가야 한다.
   * 엔진은 해당 페이지를 둘로 쪼개는 **페이지 분할(Page Split)**을 수행하며, 이 과정에서 디스크 랜덤 I/O 폭증과 잠금(Lock) 경합, 50% 수준의 페이지 빈 공간(단편화)이 발생한다[^mysql-innodb-pk].

---

## 2. 5대 기본키 채번 전략 상세

### ① Auto-Increment / Identity (순차 증가 정수)
* **저장 공간**: `BIGINT` (8바이트)
* **메커니즘**: 데이터베이스 엔진 내부의 시퀀스 생성기가 `1, 2, 3...` 순으로 값을 자동 증가 발급.
* **장점**:
  * 최소 저장 공간(8B)으로 세컨더리 인덱스 크기 절감.
  * B-Tree 인덱스에 가장 이상적인 순차 삽입 성능.
* **단점**:
  * **분산/샤딩 환경 취약**: 여러 DB 인스턴스에 걸쳐 고유성을 보장하기 어려움.
  * **보안 위험**: 번호가 순차적으로 증가하므로 [[public-id-pattern|IDOR 공격]] 및 비즈니스 거래량 노출 위험(독일 탱크 문제).
  * 클라이언트 측에서 사전 채번 불가 (반드시 DB에 `INSERT`가 완료되어야 키 획득 가능).

---

### ② UUID v4 (완전 무작위 난수)
* **저장 공간**: 16바이트 (바이너리 `BINARY(16)`) / 36바이트 (문자열 `CHAR(36)`)
* **메커니즘**: 128비트 중 122비트를 완전 의사 난수(PRNG)로 채움.
* **장점**:
  * 충돌 확률이 사실상 0 (중복 확률 $2^{-122}$).
  * 분산 서버 및 클라이언트 어디서든 중앙 조율 없이 독립적으로 즉시 발급 가능.
  * 번호 추측이 불가능하여 보안성 우수.
* **단점**:
  * **B-Tree 최악의 적**: 무작위 분포로 인한 극심한 Page Split 발생. 데이터 수천만 건 도달 시 쓰기 성능이 급격히 붕괴함.
  * 인덱스 크기가 커져 버퍼 풀 메모리를 비효율적으로 점유.

---

### ③ UUID v7 / ULID (시간 기반 순차 식별자)
* **저장 공간**: 16바이트 (`BINARY(16)` 또는 RFC 9562 표준)
* **메커니즘**: 상위 비트에 **밀리초(ms) 단위 유닉스 타임스탬프**를 두고, 하위 비트에 난수를 배치[^rfc-9562].
  $$\text{UUID v7} = \underbrace{\text{Unix Timestamp (48-bit)}}_{\text{시간 정렬}} + \underbrace{\text{Version/Variant (6-bit)}}_{\text{메타데이터}} + \underbrace{\text{Random Data (74-bit)}}_{\text{충돌 방지}}$$
* **장점**:
  * **정렬 가능(K-Sortable)**하므로 B-Tree 인덱스 순차 삽입 보장 (Page Split 억제).
  * 분산 노드에서 중앙 조율 없이 초당 수억 개를 발급해도 충돌하지 않음.
  * 2024년 5월 IETF RFC 9562 표준으로 공식 승인되어 글로벌 생태계 표준화 완료.
* **단점**:
  * 키의 앞부분에 생성 시간 정보가 노출됨.
  * 8바이트 정수형보다는 2배의 저장 공간 차지.

---

### ④ 분산 ID 생성기 (Twitter Snowflake 계열)
* **저장 공간**: `BIGINT` (8바이트 / 64비트 정수)
* **메커니즘**: 64비트를 분할하여 `[타임스탬프 (41bit)] + [워커/노드 ID (10bit)] + [시퀀스 (12bit)]` 구조로 채번[^snowflake].
* **장점**:
  * 8바이트로 매우 가벼우면서도 시간순 정렬 및 B-Tree 최적화 지원.
  * 단일 노드당 밀리초당 최대 4,096개의 고유 ID를 분산 환경에서 채번 가능.
* **단점**:
  * ID 생성을 위한 별도의 워커 인프라나 클러스터 관리 오버헤드 존재.
  * 서버 간 시계 동기화 오차(NTP Clock Drift) 시 과거 시점으로 돌아가는 역전 현상 처리 필요.

---

### ⑤ 자연키 (Natural Key) & 복합키 (Composite Key)
* **메커니즘**: 비즈니스 도메인에 이미 존재하는 고유 식별자(이메일, 사업자번호, SKU)를 PK로 직접 지정하거나 다대다 테이블에서 두 외래키를 묶어 PK로 사용.
* **장점**: 별도의 대리키(Surrogate Key) 컬럼을 두지 않아도 되며, 조인 횟수를 줄일 수 있음.
* **단점**:
  * 비즈니스 규칙 변경 시(예: 이메일 변경 허용) PK 갱신 및 모든 참조 테이블 외래키(FK)의 연쇄 갱신 부담.
  * 개인정보 보호 규정(주민번호, 전화번호 등 PK 사용 불가).
  * 다대다 조인 매핑 테이블(예: `UserRole`, `ProductTag`) 외에는 일반 엔티티에 비권장.

---

## 3. 전략별 종합 비교 매트릭스

| 비교 항목 | Auto-Increment | UUID v4 | UUID v7 / ULID | Twitter Snowflake | 자연키 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **저장 크기** | **8 Byte** | 16 / 36 Byte | 16 Byte | **8 Byte** | 가변 (대체로 큼) |
| **B-Tree 인덱스 적합성** | **최상** (순차) | **최악** (무작위) | **우수** (시간순 정렬) | **최상** (시간순 정렬) | 보통 ~ 나쁨 |
| **분산 환경 채번** | 어려움 (중앙 의존) | 자유로움 | 자유로움 | 자유로움 (노드 관리) | 도메인 종속 |
| **클라이언트 선발급** | 불가 | **가능** | **가능** | 불가 (서버 의존) | 가능 |
| **보안성 (추측 방지)** | **취약 (순차)** | **최상** | **우수** (난수 포함) | 보통 (시간/노드 유추) | 취약 (정보 노출) |
| **실무 권장 상황** | 단일 DB, 내부 백오피스 | NoSQL, 일회성 토큰 | **신규 RDB/MSA 표준** | 대규모 샤딩 환경 | N:M 조인 매핑 테이블 |

---

## 4. 결론 및 실무 권장 가이드

1. **대부분의 모놀리스 및 단일 DB**:
   - 내부 조인 및 쓰기 성능 최적화를 위해 **`BIGINT AUTO_INCREMENT`**를 기본으로 채택하되, 외부 노출 보안 문제는 [[public-id-pattern|Public ID 패턴]]을 적용하여 이원화한다.
2. **현대적인 MSA 및 분산 DB 환경**:
   - RFC 9562 표준인 **`UUID v7`**을 기본키로 채택하면, 인덱스 쓰기 성능과 분산 생성, 보안성을 단일 키로 모두 만족시킬 수 있다.

---

## 5. 참고 문헌 및 자료
[^mysql-innodb-pk]: MySQL 8.0 Reference Manual, *Clustered and Secondary Indexes*, https://dev.mysql.com/doc/refman/8.0/en/innodb-index-types.html
[^rfc-9562]: IETF RFC 9562, *Universally Unique Identifiers (UUID)*, May 2024, https://datatracker.ietf.org/doc/rfc9562/
[^snowflake]: Twitter Archive, *Snowflake: id generation service*, https://github.com/twitter-archive/snowflake
