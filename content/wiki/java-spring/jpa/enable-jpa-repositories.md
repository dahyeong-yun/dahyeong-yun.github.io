---
title: EnableJpaRepositories
description: Spring Data JPA 리포지토리 활성화 및 스캔 설정을 담당하는 어노테이션. 스프링 부트 자동 구성과의 관계 및 수동 선언 유스케이스
aliases: [EnableJpaRepositories, @EnableJpaRepositories, JPA 리포지토리 활성화, JPA 레포지토리 설정]
tags: [java, spring, jpa, spring-data-jpa, spring-boot]
created: 2026-09-06
updated: 2026-09-06
status: seed
---

`@EnableJpaRepositories`는 Spring Data JPA 리포지토리 인터페이스를 탐색(Scan)하고 프록시 빈을 생성하도록 지시하는 설정 어노테이션이다[^ref-enable-jpa-docs].

---

## 스프링 부트에서 생략 가능한 이유

일반적인 스프링 부트 프로젝트에서는 개발자가 `@EnableJpaRepositories`를 직접 선언하지 않아도 리포지토리가 정상 동작한다.

`spring-boot-starter-data-jpa` 의존성이 포함되면 **`JpaRepositoriesAutoConfiguration`**[^ref-boot-autoconfig]이 자동으로 활성화되기 때문이다.

```java
@AutoConfiguration
@ConditionalOnClass(EnableJpaRepositories.class)
@ConditionalOnMissingBean({ JpaRepositoryFactoryBean.class, JpaRepositoryConfigExtension.class })
@Import(JpaRepositoriesRegistrar.class)
public class JpaRepositoriesAutoConfiguration {
    ...
}
```

- `@ConditionalOnMissingBean`: 개발자가 직접 리포지토리 관련 설정을 하지 않았을 때만 자동 구성이 동작한다.
- `@SpringBootApplication`이 위치한 메인 클래스의 패키지가 **기본 스캔 경로(Base Package)** 가 되어, 그 하위의 모든 `JpaRepository` 인터페이스를 자동으로 찾아 프록시 빈으로 등록한다[^ref-boot-docs].

---

## 직접 선언해야 하는 상황

스프링 부트 환경이라도 다음과 같은 상황에서는 `@EnableJpaRepositories`를 명시적으로 선언해야 한다.

### 1. 멀티 모듈 프로젝트 (패키지 경로 불일치)

Entity나 Repository 인터페이스가 `@SpringBootApplication` 메인 클래스 패키지의 **상위 또는 다른 패키지**에 분리되어 있는 경우, 기본 스캔 범위에서 누락된다.

```java
@Configuration
@EnableJpaRepositories(basePackages = "com.company.core.domain.repository")
public class JpaConfig {
}
```

### 2. 다중 데이터소스 (Multi DataSource) 분리

DB를 2개 이상 사용하는 환경에서는 어떤 리포지토리가 어떤 `EntityManagerFactory` 및 `PlatformTransactionManager`를 사용할지 명확히 매핑해야 한다.

```java
@Configuration
@EnableJpaRepositories(
    basePackages = "com.company.order.repository",
    entityManagerFactoryRef = "orderEntityManagerFactory",
    transactionManagerRef = "orderTransactionManager"
)
public class OrderJpaConfig {
}
```

### 3. 공통 커스텀 리포지토리 베이스 클래스 적용

모든 리포지토리에 기본 제공되는 `SimpleJpaRepository` 대신, 공통 메서드(예: Soft Delete 지원, 공통 감사 필드 조회 등)를 확장한 커스텀 기본 구현체를 적용할 때 사용한다.

```java
@Configuration
@EnableJpaRepositories(
    basePackages = "com.company.repository",
    repositoryBaseClass = CustomJpaRepositoryImpl.class
)
public class JpaConfig {
}
```

---

## 주요 속성 (Attributes)

| 속성명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `basePackages` / `value` | `String[]` | 리포지토리 인터페이스를 스캔할 기본 패키지 경로 문자열 |
| `basePackageClasses` | `Class<?>[]` | 지정한 클래스가 위치한 패키지를 기준으로 스캔 (타입 안정성 확보) |
| `entityManagerFactoryRef` | `String` | 사용할 `EntityManagerFactory` 빈 이름 (기본값: `entityManagerFactory`) |
| `transactionManagerRef` | `String` | 사용할 `PlatformTransactionManager` 빈 이름 (기본값: `transactionManager`) |
| `repositoryBaseClass` | `Class<?>` | 기본 CRUD 구현체 클래스 지정 (기본값: `SimpleJpaRepository.class`) |
| `repositoryFactoryBeanClass` | `Class<?>` | 프록시를 생성할 팩토리 빈 클래스 지정 (기본값: `JpaRepositoryFactoryBean.class`) |
| `includeFilters` / `excludeFilters` | `Filter[]` | 스캔 대상에 포함하거나 제외할 필터 조건 지정 |

---

## 관련 문서

- [[spring-data-jpa-interface-mechanism|Spring Data JPA 인터페이스 동작 원리]]

---

## 각주 및 출처 (References)

[^ref-enable-jpa-docs]: [Spring Data JPA Reference Documentation - Annotation based configuration](https://docs.spring.io/spring-data/jpa/reference/jpa/getting-started.html#jpa.misc.spring-data-jpa-repo-config)
[^ref-boot-autoconfig]: [Spring Boot GitHub - JpaRepositoriesAutoConfiguration.java](https://github.com/spring-projects/spring-boot/blob/main/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/data/jpa/JpaRepositoriesAutoConfiguration.java)
[^ref-boot-docs]: [Spring Boot Reference Documentation - Auto-configured Data JPA Repositories](https://docs.spring.io/spring-boot/docs/current/reference/html/data.html#data.sql.jpa-and-spring-data.repositories)
