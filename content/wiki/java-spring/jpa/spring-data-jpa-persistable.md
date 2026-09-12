---
title: Spring Data JPA Persistable 최적화
description: 문자열이나 UUID 등 식별자를 직접 할당할 때 SimpleJpaRepository.save()의 불필요한 SELECT(findById) 쿼리를 방지하는 Persistable 구현 전략
aliases: [Persistable, Spring Data JPA Persistable, 신규 엔티티 판별, isNew]
branches: [jpa]
tags: [jpa, spring-data-jpa, java, performance]
created: 2026-09-09
updated: 2026-09-09
status: seed
draft: true
---

Spring Data JPA의 [[spring-data-jpa-interface-mechanism#핵심 3요소|SimpleJpaRepository]]는 `save()` 호출 시 식별자 값의 유무를 기준으로 신규 등록(`persist`)과 수정(`merge`)을 분기한다.

식별자를 DB에 위임하지 않고 애플리케이션에서 직접 할당(UUID, 비즈니스 코드 등)하는 경우, 기본 판별 로직의 한계로 인해 매 저장 시점마다 불필요한 DB 조회가 발생한다. 이를 방지하기 위해 `Persistable<ID>` 인터페이스를 사용한다.

---

## 1. 문제 발생 메커니즘

Spring Data JPA의 기본 엔티티 정보 추출기(`JpaEntityInformation`)는 식별자의 상태를 검사하여 신규 여부를 판단한다.

```java
// DefaultJpaEntityInformation.java (개념 요약)
public boolean isNew(T entity) {
    ID id = getId(entity);
    if (!versionAttribute.isPresent()) {
        return id == null; // 식별자가 null이어야 신규로 판별
    }
    return getVersion(entity) == null;
}
```

* **자동 생성 키 (`@GeneratedValue`)**: 엔티티 생성 시점에는 `id == null`이므로 신규 엔티티로 판별되어 곧바로 `em.persist()`가 호출된다.
* **직접 할당 키**: 엔티티 생성 시 개발자가 이미 식별자를 세팅하므로 `id != null` 상태가 된다.
  * Spring Data JPA는 이를 **기존에 저장되어 있던 엔티티**로 간주하고 `em.merge()`를 호출한다.
  * `em.merge()`는 해당 데이터가 DB에 실제로 존재하는지 확인하기 위해 **`SELECT` 쿼리(1회)를 먼저 실행한 후 `INSERT` 쿼리를 실행**한다.
  * 결과적으로 1건을 저장할 때마다 쿼리가 2번씩 나가는 심각한 리소스 낭비가 발생한다.

---

## 2. 해결 방법 1: `Persistable<ID>` 구현 (권장)

엔티티가 `org.springframework.data.domain.Persistable<ID>`를 구현하도록 설정하면, `isNew()` 판별 로직을 개발자가 직접 제어할 수 있다.

가장 흔하고 안전한 패턴은 엔티티의 생성 시간(`@CreatedDate`)을 기준으로 신규 여부를 판별하는 방식이다.

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Order implements Persistable<String> {

    @Id
    private String id; // 예: "ORD-20260909-001" (직접 생성한 비즈니스 키)

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdDate;

    public Order(String id) {
        this.id = id;
    }

    @Override
    public String getId() {
        return this.id;
    }

    @Override
    public boolean isNew() {
        // DB에 저장되기 전에는 JPA Auditing이 동작하지 않아 createdDate가 null이다.
        return this.createdDate == null;
    }
}
```

### 동작 흐름
1. `new Order("ORD-001")` 생성 시 `createdDate`는 `null`이다.
2. `repository.save(order)` 호출 시 `order.isNew()`가 `true`를 반환한다.
3. `em.merge()` 대신 `em.persist()`가 곧바로 호출된다 (불필요한 SELECT 생략).
4. 영속화 직후 JPA Auditing 메커니즘에 의해 `createdDate`에 현재 시간이 채워진다.

---

## 3. 해결 방법 2: `@Version` 활용

엔티티에 낙관적 락(Optimistic Lock)을 위한 `@Version` 필드가 정의되어 있는 경우, Spring Data JPA는 식별자 대신 버전 필드가 `null`인지 여부를 통해 신규 엔티티를 판별한다.

```java
@Entity
public class Product {

    @Id
    private String id;

    @Version
    private Long version; // 신규 엔티티일 때는 null ➔ persist() 호출
}
```

비즈니스적으로 낙관적 락이 필요한 엔티티라면 `Persistable` 인터페이스를 별도로 구현하지 않고도 `@Version` 선언만으로 불필요한 SELECT 조회를 방지할 수 있다.

---

## 4. 비교 요약

| 방식 | 신규 판별 기준 | 불필요 SELECT 방지 | 부가 요건 |
| :--- | :--- | :---: | :--- |
| **기본 동작 (미구현)** | `id == null` | ❌ (SELECT 발생) | 없음 |
| **`Persistable<ID>`** | 개발자 정의 (`createdDate == null`) | ⭕ | JPA Auditing 활성화 필요 |
| **`@Version`** | `version == null` | ⭕ | 낙관적 락 메커니즘 적용 |

---

## 관련 문서

* [[jpa-entity-id-generation-strategy|JPA 엔티티 식별자 생성 전략]]
* [[spring-data-jpa-interface-mechanism|Spring Data JPA 인터페이스 동작 원리]]
