---
title: 오프셋 페이징 vs 커서(Keyset) 페이징
description: RDBMS 페이징의 2대 축인 오프셋 방식의 Fetch & Discard 비용과 커서 방식의 B-Tree Index Seek 조기 종료 메커니즘, 실행 계획 및 트레이드오프 비교
aliases: [오프셋 페이징, 커서 페이징, 키셋 페이징, Offset Pagination, Keyset Pagination, Cursor Pagination]
tags: [database, sql, rdbms, performance, optimization, mysql, h2]
created: 2026-09-10
updated: 2026-09-10
status: seed
draft: true
---

# 오프셋 페이징 vs 커서(Keyset) 페이징

대량의 데이터를 클라이언트 화면에 나누어 제공할 때 사용하는 데이터베이스 페이징 기법은 크게 **오프셋 기반(Offset-based)**과 **커서 기반(Cursor/Keyset-based)**의 두 가지 방식으로 나뉜다.

두 방식은 단순히 SQL 문법의 차이를 넘어, **데이터베이스 스토리지 엔진의 인덱스 순회 방식, 시간 복잡도, 클라이언트 UI 요구사항(페이지 번호 점프 vs 무한 스크롤), 그리고 대규모 데이터에서의 성능 안정성**에 근본적인 차이를 만든다.

---

## 1. 동작 메커니즘과 시간 복잡도

```mermaid
flowchart TD
    subgraph OffsetWay [1. 오프셋 방식 (LIMIT 20 OFFSET 19980)]
        direction TB
        O1["B-Tree 인덱스 처음부터 탐색"] --> O2["앞선 19,980건 행을 메모리로 전부 읽음"]
        O2 --> O3["읽은 19,980건을 모두 버림 (Fetch & Discard)"]
        O3 --> O4["마지막 20건만 클라이언트에 반환"]
        style O2 fill:#ffcccc,stroke:#ff0000
        style O3 fill:#ffcccc,stroke:#ff0000
    end

    subgraph CursorWay [2. 커서 방식 (WHERE id > 19980 LIMIT 20)]
        direction TB
        C1["B-Tree 인덱스에서 19980 지점을 O(log N)으로 수직 점프 (Index Seek)"]
        C1 --> C2["해당 지점부터 필요한 20건만 순차 스캔"]
        C2 --> C3["20건 읽자마자 쿼리 즉시 조기 종료 (Early Termination)"]
        style C1 fill:#ccffcc,stroke:#00aa00
        style C3 fill:#ccffcc,stroke:#00aa00
    end
```

### 1) 오프셋 기반 페이징 (Offset-based)
* **SQL 쿼리**:
  ```sql
  SELECT id, title, user_id FROM todo 
  WHERE user_id = ? 
  ORDER BY id ASC 
  LIMIT 20 OFFSET 19980;
  ```
* **동작 원리 (Fetch & Discard)**:
  - 데이터베이스 엔진은 19,980번째 레코드의 물리적 위치를 미리 알 수 없다.
  - 따라서 인덱스를 타더라도 **처음부터 19,980개의 행을 메모리로 퍼올려 카운팅한 뒤 모두 버리고(Discard), 마지막 20개 행만 결과셋으로 반환**한다.
* **시간 복잡도**: $O(\text{offset} + \text{limit})$
  - 페이지 번호가 뒤로 갈수록(심층 페이지) 버려야 하는 행의 수가 기하급수적으로 늘어나 응답 속도가 지속적으로 느려진다.

### 2) 커서 기반 페이징 (Cursor / Keyset-based)
* **SQL 쿼리**:
  ```sql
  SELECT id, title, user_id FROM todo 
  WHERE user_id = ? AND id > ? 
  ORDER BY id ASC 
  LIMIT 20;
  ```
* **동작 원리 (B-Tree Seek & Early Termination)**:
  - 클라이언트가 이전 페이지의 마지막 항목 식별자(`id = ?`)를 커서(Cursor)로 전달한다.
  - DB 엔진은 B-Tree 인덱스를 이용해 해당 커서 위치로 $O(\log N)$만에 수직 점프(Index Seek)한 뒤, **앞선 행을 전혀 읽지 않고 정확히 요청된 20개 행만 읽은 후 즉시 실행을 종료**한다.
* **시간 복잡도**: $O(\text{limit})$
  - 데이터가 수천만 건 쌓이거나 100만 번째 페이지를 조회하더라도 첫 페이지를 읽을 때와 동일한 극도로 빠른 지연 시간을 유지한다.

---

## 2. 실행 계획 (`EXPLAIN`) 비교 분석

20,000건 데이터 환경에서 1,000번째 페이지(마지막 20건)를 조회할 때의 실행 계획 비교이다.

### 오프셋 실행 계획
```sql
SELECT "ID", "TITLE" FROM "PUBLIC"."TODO"
WHERE "USER_ID" = ?1 
ORDER BY 1 
OFFSET 19980 ROWS FETCH NEXT 20 ROWS ONLY;
```
* **실행 특성**: 인덱스를 스캔하더라도 엔진 내부에서 `19980`번 카운터를 증가시키며 메모리 버퍼를 순회하는 부하가 발생한다.

### 커서 실행 계획
```sql
SELECT "ID", "TITLE" FROM "PUBLIC"."TODO"
WHERE ("USER_ID" = ?1) AND ("ID" > ?2) 
ORDER BY 1 
FETCH FIRST 20 ROWS ONLY;
```
* **실행 특성**: `("ID" > ?2)` 조건이 인덱스 레인지 스캔의 시작점(Start Key) 역할을 하여 앞선 행 스킵 비용이 0이 된다.

---

## 3. 핵심 트레이드오프 및 선택 기준

| 비교 항목 | 오프셋 페이징 (Offset) | 커서 페이징 (Cursor/Keyset) |
| :--- | :--- | :--- |
| **대용량 성능** | 심층 페이지로 갈수록 급격히 저하 ($O(\text{offset})$) | 데이터 규모 및 페이지 깊이와 무관하게 균일 ($O(\text{limit})$) |
| **페이지 점프 UI** | **완벽 지원** (1페이지에서 50페이지로 즉시 점프 가능) | **지원 불가** (오직 이전/다음, 무한 스크롤, 더보기만 가능) |
| **메타데이터 제공** | `totalElements`, `totalPages` 계산 가능 (별도 COUNT 쿼리 필요) | 전체 개수 파악 불가 (오직 `hasNext` 유무만 반환) |
| **데이터 동시성 (Drift)** | 사용자가 페이지를 넘기는 사이 데이터가 추가/삭제되면 **중복 또는 누락 발생** | 고유 식별자 기준으로 다음 행을 탐색하므로 **중복/누락 없음** |
| **구현 난이도** | 단순함 (Spring Data의 `Pageable`, `LIMIT/OFFSET`) | 커서 식별자 설계 및 복합 정렬 조건 구현 필요 |

### 어떤 방식을 선택해야 하는가?
1. **오프셋 페이징이 적합한 경우**:
   - 관리자 어드민 페이지, 사내 백오피스, 검색 결과 등 사용자가 **임의의 페이지 번호로 점프**해야 하는 경우.
   - 단일 사용자별 데이터 건수가 수백~수천 건 이내로 작아 오프셋 스캔 비용이 무시할 수 있는 수준인 도메인.
2. **커서 페이징이 필수적인 경우**:
   - SNS 타임라인, 이커머스 상품 목록, 피드 등 **무한 스크롤(Infinite Scroll)** UI.
   - 실시간으로 신규 게시글이 초당 수십 건씩 등록되어 오프셋 방식 사용 시 글 중복이 발생하는 환경.
   - 데이터 건수가 수백만 건 이상으로 대규모인 서비스의 공개 조회 API.

---

## 4. 벤치마크 실험 시 유의할 함정 (인메모리 DB의 착시)

로컬 개발 및 테스트 환경에서 **인메모리 DB(H2 등)**를 사용해 오프셋과 커서의 성능을 비교할 때, 예상과 다른 결과가 나오거나 실행마다 측정값이 크게 요동치는 현상을 겪게 된다.

### 왜 인메모리 테스트에서는 결과가 왜곡될까?
1. **디스크 I/O 부재**:
   - 실제 디스크 기반 RDBMS(MySQL InnoDB)에서는 오프셋 조회가 느린 진짜 이유가 **디스크 블록(Data Page)을 버퍼 풀로 퍼올리는 물리적 디스크 Random I/O** 때문이다.
   - 하지만 H2 인메모리 환경은 모든 데이터가 이미 힙 메모리에 상주하므로 20,000건의 메모리 순회 스킵도 불과 **0.05ms ~ 0.1ms(수십 마이크로초)** 만에 끝난다.
2. **JVM 노이즈의 간섭**:
   - 수십 마이크로초 단위의 미세한 시간대에서는 쿼리 엔진의 비용보다 **JVM JIT 컴파일러의 웜업(Warm-up) 상태, Minor GC 일시정지, `PreparedStatement` 파라미터 바인딩 객체 생성 오버헤드**가 측정값을 좌우한다.
3. **핵심 교훈**:
   - 따라서 인메모리 벤치마크에서는 단순 소요 시간 수치(ms) 자체에 매몰되지 말고, **`EXPLAIN` 실행 계획을 통해 엔진이 수행하는 스캔의 알고리즘적 구조 차이를 확인**하는 것이 올바른 검증 방법이다.

---

## 관련 문서
* [[database-primary-key-strategies]]
* [[google-sre-four-golden-signals]]
* [[centralized-logging-architecture]]
