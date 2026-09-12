---
title: JPA (Jakarta Persistence)
description: 자바 진영의 ORM 기술 표준 명세. 패러다임의 불일치 해결과 영속성 관리 메커니즘
aliases: [JPA, Java Persistence API, Jakarta Persistence, 자바 영속성 API, ORM]
branches: [jpa]
tags: [java, jpa, orm, spring]
created: 2026-09-09
updated: 2026-09-09
status: seed
draft: true
---

**JPA(Jakarta Persistence, 구 Java Persistence API)**는 자바 진영에서 관계형 데이터베이스(RDB)를 다루는 **객체 관계 매핑(ORM, Object-Relational Mapping) 기술의 표준 명세(Specification)**이다[^ref-jakarta-spec].

코드로 동작하는 특정 라이브러리나 프레임워크가 아니라, 자바 애플리케이션에서 관계형 데이터베이스를 어떻게 객체로 다룰지 정의한 **인터페이스와 규약의 모음**이다.

---

## 1. JPA의 위상: JPA vs Hibernate vs Spring Data JPA

개발 환경에서 흔히 혼용되는 세 기술은 다음과 같이 계층 구조를 이룬다[^ref-spring-data-jpa-docs].

```
[ 애플리케이션 / 비즈니스 로직 ]
               │
               ▼
[ Spring Data JPA ]          ── Repository 인터페이스 및 공통 CRUD 추상화
               │
               ▼
[ JPA (Jakarta Persistence) ] ── 자바 표준 ORM 명세 (인터페이스 모음)
               │
               ▼
[ Hibernate ]                ── JPA 표준을 구현한 실제 ORM 엔진
               │
               ▼
[ JDBC Driver / Database ]
```

| 구분 | 성격 | 주요 역할 | 비유 |
| :--- | :--- | :--- | :--- |
| **JPA** | 표준 명세 (Interface) | 자바 ORM 표준 규격 정의 (`jakarta.persistence.*`) | 자동차 표준 규격 (핸들, 페달 위치) |
| **Hibernate** | 구현체 (Library) | JPA 스펙을 바탕으로 실제 SQL 생성 및 실행 | 표준 규격으로 만든 실제 엔진 |
| **Spring Data JPA** | 추상화 모듈 (Framework) | JPA를 더 쉽게 쓰도록 리포지토리 인터페이스 패턴 제공 | 자동 변속기 / 운전 보조 시스템 |

---

## 2. 왜 탄생했는가 (패러다임의 불일치 해결)

객체지향 프로그래밍 언어와 관계형 데이터베이스는 지향하는 목적과 데이터 구조가 근본적으로 다르다. 이를 **객체-관계 패러다임 불일치(Object-Relational Impedance Mismatch)**라고 부른다.

1. **연관관계 표현 방식**
   - **객체**: 참조(`order.getMember()`)를 통해 양방향/단방향으로 자유롭게 객체 그래프를 탐색한다.
   - **RDB**: 외래 키(FK)를 두고 `JOIN` 쿼리를 통해 테이블 간 관계를 맺는다.
2. **상속 구조**
   - **객체**: 상속과 다형성을 기본 지원한다.
   - **RDB**: 상속 개념이 없으며 슈퍼타입-서브타입 관계 테이블 모델링으로 흉내 낸다.
3. **객체 동일성(Identity)**
   - **객체**: 참조 주소값(`==`) 및 `equals()`로 동일성을 비교한다.
   - **RDB**: 기본 키(PK) 컬럼의 값으로 로우(Row)를 구분한다.

JPA는 개발자가 SQL 중심이 아닌 **객체 중심으로 도메인을 설계**할 수 있도록 둘 사이의 간극을 매핑 기술로 메워준다.

---

## 3. 핵심 메커니즘

JPA의 핵심은 단순한 SQL 자동 생성을 넘어 **영속성 컨텍스트(Persistence Context)**를 통해 엔티티의 상태와 생명주기를 메모리상에서 관리하는 데 있다.

* **1차 캐시 및 동일성 보장**: 트랜잭션 범위 내에서 조회한 엔티티를 캐싱하여 동일한 PK 조회 시 `==` 비교의 동일성을 보장한다.
* **변경 감지 (Dirty Checking)**: 엔티티를 조회한 뒤 필드 값만 변경하면, 트랜잭션 커밋 시점에 변경을 감지하여 자동으로 `UPDATE` 쿼리를 생성 및 실행한다.
* **쓰기 지연 (Transactional Write-Behind)**: `persist()`나 `remove()` 호출 시 즉시 쿼리를 DB에 날리지 않고, 쓰기 지연 SQL 저장소에 모아두었다가 트랜잭션 커밋(Flush) 시점에 한 번에 전송한다.
* **지연 로딩 (Lazy Loading)과 프록시**: 연관된 엔티티를 실제 사용하는 시점까지 조회를 미루고 프록시 객체를 넣어두어 불필요한 조인 비용을 줄인다.

---

## 4. 역사와 네임스페이스 변화

* **EJB Entity Bean의 한계**: 무겁고 침투적이었던 EJB 2.0에 반발하여 개빈 킹(Gavin King)이 Hibernate를 개발했다.
* **JPA 표준 제정**: Hibernate의 아이디어를 흡수하여 2006년 Java EE 5 스펙으로 JPA 1.0(`javax.persistence`)이 탄생했다.
* **Jakarta EE 이관**: 오라클이 자바 상표권을 보유한 상태에서 Java EE를 Eclipse Foundation으로 기증하면서 명칭이 **Jakarta Persistence**로 변경되었다.
  - Spring Boot 2.x: `javax.persistence.*` 사용
  - Spring Boot 3.x (Spring 6): `jakarta.persistence.*` 사용

---

## 관련 문서

- [[spring-data-jpa-interface-mechanism|Spring Data JPA 인터페이스 동작 원리]]
- [[enable-jpa-repositories|@EnableJpaRepositories]]
- [[jpql|JPQL (Java Persistence Query Language)]]
- [[repository-factory-bean-lifecycle|RepositoryFactoryBean 라이프사이클]]

---

## 각주 및 출처 (References)

[^ref-jakarta-spec]: [Jakarta Persistence Specification 3.1](https://jakarta.ee/specifications/persistence/3.1/)
[^ref-spring-data-jpa-docs]: [Spring Data JPA Reference Documentation - Core Concepts](https://docs.spring.io/spring-data/jpa/reference/repositories/core-concepts.html)
